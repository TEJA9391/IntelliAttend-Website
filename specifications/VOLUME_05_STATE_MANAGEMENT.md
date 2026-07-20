# VOLUME 05: STATE MANAGEMENT & PROVIDER ARCHITECTURE

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. State Management Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Single Source of Truth | Each piece of state has one owning Provider |
| Immutable State | State changes via `copyWith`, never mutation |
| Predictable Updates | State transitions are explicit and traceable |
| Minimal Rebuilds | Scoped Consumers prevent unnecessary widget rebuilds |
| Offline-First | All state updates work offline, sync when connected |

### 1.2 Provider Hierarchy

```
MultiProvider (Root)
├── SecurityController (ChangeNotifier) — Root gate
│   ├── ApiClient (Singleton) — HTTP layer
│   │
│   ├── Repositories (Interface-based)
│   │   ├── AuthRepository
│   │   ├── AttendanceRepository
│   │   ├── SessionRepository
│   │   ├── CourseRepository
│   │   ├── UserRepository
│   │   ├── NotificationRepository
│   │   ├── AnalyticsRepository
│   │   └── QRRepository
│   │
│   ├── Controllers (ChangeNotifier)
│   │   ├── AuthController
│   │   ├── AttendanceController
│   │   ├── SessionController
│   │   ├── DashboardController
│   │   ├── ReportsController
│   │   ├── NotificationController
│   │   └── SettingsController
│   │
│   └── Services (Singleton)
│       ├── WebSocketService
│       ├── PersistenceService
│       ├── NotificationService
│       └── TimeSyncService
```

---

## 2. State Classes

### 2.1 AppState (Root State)

```dart
enum AppState {
  uninitialized,    // App bootstrapping
  loading,          // Initial data load
  authenticated,    // User logged in
  unauthenticated,  // User logged out
  error             // Fatal error state
}
```

### 2.2 AuthState

```dart
class AuthState {
  final AuthStatus status;           // authenticating, authenticated, unauthenticated
  final User? user;                  // Current user (null if unauthenticated)
  final StudentProfile? studentProfile;  // Student-specific data
  final FacultyProfile? facultyProfile;  // Faculty-specific data
  final String? errorMessage;        // Error message
  final bool isLoading;              // Loading flag
  final DateTime? tokenExpiresAt;    // Token expiration
  final bool isBiometricEnabled;     // Biometric preference
  final bool isRooted;               // Device root status
}

enum AuthStatus {
  initial,
  authenticating,
  authenticated,
  unauthenticated,
  error
}
```

### 2.3 AttendanceState

```dart
class AttendanceState {
  final AttendanceStatus status;     // Current operation status
  final List<AttendanceRecord> records;  // Session attendance records
  final AttendanceRecord? lastMarked;    // Last marked record
  final int presentCount;            // Live present count
  final int lateCount;               // Live late count
  final int absentCount;             // Live absent count
  final int totalCount;              // Total students
  final String? errorMessage;        // Error message
  final bool isLoading;              // Loading flag
  final bool isSyncing;              // Offline sync in progress
  final List<OfflineAttendanceEntry> offlineQueue;  // Pending sync
}

enum AttendanceStatus {
  initial,
  marking,
  marked,
  error,
  syncing
}
```

### 2.4 SessionState

```dart
class SessionState {
  final SessionStatus status;        // Current operation status
  final List<AttendanceSession> sessions;  // Session list
  final AttendanceSession? currentSession;  // Active session
  final String? qrCode;              // Current QR code (base64)
  final String? qrCodeHash;          // Current QR hash
  final DateTime? qrExpiresAt;       // QR expiration time
  final int qrRotationSeconds;       // QR rotation interval
  final String? errorMessage;        // Error message
  final bool isLoading;              // Loading flag
  final bool isQrRotating;           // QR rotation in progress
}

enum SessionStatus {
  initial,
  loading,
  loaded,
  active,
  ended,
  error
}
```

### 2.5 DashboardState

```dart
class DashboardState {
  final DashboardStatus status;      // Current operation status
  final DashboardData? data;         // Dashboard data
  final String? errorMessage;        // Error message
  final bool isLoading;              // Loading flag
  final bool isRefreshing;           // Pull-to-refresh
  final DateTime? lastUpdated;       // Last data fetch
}

class DashboardData {
  final int todaySessions;           // Today's session count
  final double todayAttendance;      // Today's attendance %
  final List<DailyTrend> weeklyTrend;  // 7-day trend
  final List<SessionSummary> recentSessions;  // Recent sessions
  final List<Alert> alerts;          // Active alerts
  final DepartmentStats? departmentStats;  // HOD-only stats
}

enum DashboardStatus {
  initial,
  loading,
  loaded,
  refreshing,
  error
}
```

### 2.6 NotificationState

```dart
class NotificationState {
  final NotificationStatus status;   // Current operation status
  final List<AppNotification> notifications;  // Notification list
  final int unreadCount;             // Unread count
  final String? errorMessage;        // Error message
  final bool isLoading;              // Loading flag
  final bool hasMore;                // Pagination flag
}

enum NotificationStatus {
  initial,
  loading,
  loaded,
  error
}
```

---

## 3. Provider Implementations

### 3.1 SecurityController (Root Gate)

```dart
class SecurityController extends ChangeNotifier {
  AppState _state = AppState.uninitialized;
  bool _isRooted = false;
  bool _isBiometricEnabled = false;
  DateTime? _lastActivity;
  Timer? _sessionTimer;

  // Getters
  AppState get state => _state;
  bool get isRooted => _isRooted;
  bool get isBiometricEnabled => _isBiometricEnabled;

  // Methods
  Future<void> initialize();           // Check root, biometric, restore session
  void startSessionTimer();            // Start inactivity timer
  void resetSessionTimer();            // Reset on user activity
  void lockApp();                      // Force biometric lock
  void logout();                       // Scorched-earth logout
  void _onSessionExpired();            // Auto-lock after timeout
}
```

### 3.2 AuthController

```dart
class AuthController extends ChangeNotifier {
  AuthState _state = AuthState.initial();
  final AuthRepository _authRepository;
  final PersistenceService _persistenceService;

  // Getters
  AuthState get state => _state;
  bool get isAuthenticated => _state.status == AuthStatus.authenticated;
  User? get currentUser => _state.user;

  // Methods
  Future<void> login(String email, String password);  // Email/password login
  Future<void> loginWithBiometric();                   // Biometric login
  Future<void> refreshToken();                         // Refresh JWT
  Future<void> logout();                               // Logout
  Future<void> restoreSession();                       // Restore from cache
  void updateProfile(User updatedUser);                // Update local state
}
```

### 3.3 AttendanceController

```dart
class AttendanceController extends ChangeNotifier {
  AttendanceState _state = AttendanceState.initial();
  final AttendanceRepository _attendanceRepository;
  final QRRepository _qrRepository;

  // Getters
  AttendanceState get state => _state;
  List<AttendanceRecord> get records => _state.records;
  int get presentCount => _state.presentCount;
  int get lateCount => _state.lateCount;
  int get absentCount => _state.absentCount;
  int get totalCount => _state.totalCount;
  double get attendancePercentage => _state.totalCount > 0
      ? (_state.presentCount + _state.lateCount) / _state.totalCount * 100
      : 0;

  // Methods
  Future<void> markAttendance(String sessionId, String qrCodeHash);
  Future<void> loadSessionAttendance(String sessionId);
  Future<void> overrideAttendance(String recordId, AttendanceStatus status, String reason);
  Future<void> syncOfflineQueue();                    // Sync pending offline entries
  void addOfflineEntry(OfflineAttendanceEntry entry); // Add to offline queue
  void updateLiveCounts(AttendanceSummary summary);   // WebSocket update
}
```

### 3.4 SessionController

```dart
class SessionController extends ChangeNotifier {
  SessionState _state = SessionState.initial();
  final SessionRepository _sessionRepository;
  final QRRepository _qrRepository;
  final WebSocketService _webSocketService;

  // Getters
  SessionState get state => _state;
  List<AttendanceSession> get sessions => _state.sessions;
  AttendanceSession? get currentSession => _state.currentSession;
  String? get currentQrCode => _state.qrCode;
  bool get isQrValid => _state.qrExpiresAt?.isAfter(DateTime.now()) ?? false;

  // Methods
  Future<void> loadSessions({String? courseId, String? status});
  Future<void> createSession(CreateSessionRequest request);
  Future<void> startSession(String sessionId);
  Future<void> endSession(String sessionId);
  Future<void> refreshQrCode(String sessionId);
  void startQrRotation(String sessionId, int intervalSeconds);
  void stopQrRotation();
  void handleWebSocketEvent(WSEvent event);
}
```

### 3.5 DashboardController

```dart
class DashboardController extends ChangeNotifier {
  DashboardState _state = DashboardState.initial();
  final AnalyticsRepository _analyticsRepository;

  // Getters
  DashboardState get state => _state;
  DashboardData? get data => _state.data;
  bool get isStale => _state.lastUpdated != null
      ? DateTime.now().difference(_state.lastUpdated!) > Duration(minutes: 5)
      : true;

  // Methods
  Future<void> loadDashboard();
  Future<void> refreshDashboard();
  Future<void> loadDepartmentStats(String departmentId);
  void clearCache();
}
```

### 3.6 NotificationController

```dart
class NotificationController extends ChangeNotifier {
  NotificationState _state = NotificationState.initial();
  final NotificationRepository _notificationRepository;

  // Getters
  NotificationState get state => _state;
  List<AppNotification> get notifications => _state.notifications;
  int get unreadCount => _state.unreadCount;
  bool get hasUnread => _state.unreadCount > 0;

  // Methods
  Future<void> loadNotifications({bool? isRead, String? type});
  Future<void> loadMore();                              // Pagination
  Future<void> markAsRead(String notificationId);
  Future<void> markAllAsRead();
  void addNotification(AppNotification notification);   // WebSocket push
}
```

---

## 4. State Transitions

### 4.1 Authentication Flow

```
uninitialized
    │
    ▼ initialize()
loading
    │
    ├─ [success] ──▶ authenticated
    │
    ├─ [no token] ──▶ unauthenticated
    │
    └─ [error] ──▶ error
                       │
                       ▼ retry()
                    loading
```

### 4.2 Attendance Marking Flow

```
initial
    │
    ▼ markAttendance()
marking
    │
    ├─ [success] ──▶ marked
    │
    ├─ [offline] ──▶ initial (added to queue)
    │
    └─ [error] ──▶ error
                       │
                       ▼ retry()
                    marking
```

### 4.3 Session Lifecycle

```
initial
    │
    ▼ loadSessions()
loading
    │
    ├─ [success] ──▶ loaded
    │
    └─ [error] ──▶ error
                       │
                       ▼ retry()
                    loading

loaded
    │
    ▼ startSession()
active
    │
    ├─ [WebSocket: session:ended] ──▶ ended
    │
    └─ [manual end] ──▶ ended
                           │
                           ▼ loadSessions()
                        loading
```

---

## 5. Provider Consumption Patterns

### 5.1 Correct Pattern (Scoped)

```dart
// ✅ Only rebuilds when authState changes
Consumer<AuthController>(
  builder: (context, authController, child) {
    return Text('Welcome, ${authController.currentUser?.displayName}');
  },
)
```

### 5.2 Correct Pattern (Selector)

```dart
// ✅ Only rebuilds when attendancePercentage changes
Selector<AttendanceController, double>(
  selector: (_, controller) => controller.attendancePercentage,
  builder: (context, percentage, child) {
    return Text('Attendance: ${percentage.toStringAsFixed(1)}%');
  },
)
```

### 5.3 Anti-Pattern (Avoid)

```dart
// ❌ Rebuilds entire widget tree on any state change
final authState = context.watch<AuthController>().state;
final attendanceState = context.watch<AttendanceController>().state;
final sessionState = context.watch<SessionController>().state;
```

### 5.4 Method Access Pattern

```dart
// ✅ Access methods without listening to state changes
final attendanceController = context.read<AttendanceController>();
await attendanceController.markAttendance(sessionId, qrHash);
```

---

## 6. Offline State Management

### 6.1 Offline Queue

```dart
class OfflineQueue {
  final Hive box;
  final List<OfflineAttendanceEntry> _pendingEntries;

  // Methods
  Future<void> addEntry(OfflineAttendanceEntry entry);
  Future<List<OfflineAttendanceEntry>> getPendingEntries();
  Future<void> removeEntry(String entryId);
  Future<void> updateRetryCount(String entryId);
  Future<void> clear();
}
```

### 6.2 Sync Strategy

1. **Check connectivity** before API call
2. **If online:** Execute API call, update state
3. **If offline:** Add to queue, show "pending sync" indicator
4. **On reconnection:** Auto-sync queue with exponential backoff
5. **Conflict resolution:** Server timestamp wins, client notified

### 6.3 State Persistence

| State | Persistence | Sync |
|-------|-------------|------|
| AuthState | Hive (encrypted) | On login |
| AttendanceState | Hive (encrypted) | On sync |
| SessionState | Hive (plain) | On load |
| DashboardState | Hive (plain) | On refresh |
| NotificationState | Hive (plain) | On load |
| SettingsState | SharedPreferences | Immediate |

---

## 7. Testing Strategy

### 7.1 Unit Tests

- Test state transitions for each controller
- Test business logic in use cases
- Test repository implementations with mock APIs

### 7.2 Widget Tests

- Test Provider consumption patterns
- Test state-dependent UI rendering
- Test user interactions triggering state changes

### 7.3 Integration Tests

- Test complete flows (login → start session → mark attendance)
- Test offline → online sync scenarios
- Test WebSocket event handling

---

*All state classes must be immutable. Use `equatable` for value equality. Implement `copyWith` for all state classes.*