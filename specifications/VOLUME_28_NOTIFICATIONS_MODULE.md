# VOLUME 28: NOTIFICATIONS MODULE

**IntelliAttend — Software Requirements Specification & Technical Design Document**

| Field | Value |
|---|---|
| Volume | 28 |
| Module | Notifications (FCM, Local, In-App History) |
| Status | Active |
| Last Updated | 2026-07-19 |
| Estimated LOC | ~1,250 |

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Source File Inventory](#3-source-file-inventory)
4. [NotificationService](#4-notificationservice)
5. [AppNotification Model](#5-appnotification-model)
6. [SyncFcmHandler](#6-syncfcm-handler)
7. [FCM Message Types](#7-fcm-message-types)
8. [FCM Token Lifecycle](#8-fcm-token-lifecycle)
9. [Initialization & Bootstrap](#9-initialization--bootstrap)
10. [System Notification Display](#10-system-notification-display)
11. [In-App Notification History](#11-in-app-notification-history)
12. [Notification UI](#12-notification-ui)
13. [BoardReadinessNotifier Integration](#13-boardreadinessnotifier-integration)
14. [Security & Permission Gating](#14-security--permission-gating)
15. [Persistence](#15-persistence)
16. [Notification Channels & Configuration](#16-notification-channels--configuration)
17. [State Management](#17-state-management)
18. [Error Handling & Edge Cases](#18-error-handling--edge-cases)
19. [Offline Behavior](#19-offline-behavior)
20. [Known Gaps & Future Work](#20-known-gaps--future-work)

---

## 1. Module Overview

The Notifications Module provides a **dual-layer notification system**: OS-level system notifications (via FCM + flutter_local_notifications) for real-time session alerts, and an in-app notification history (persisted in encrypted Hive) for browsable notification records.

### Key Responsibilities

- Receive Firebase Cloud Messages (foreground + background) for session lifecycle events
- Display heads-up system notifications for class preparing, board recovery, and late start alerts
- Maintain an in-app notification history with read/unread states
- Manage the FCM token lifecycle (acquire, cache, upload, refresh)
- Feed board readiness state to `BoardReadinessNotifier` for dashboard integration
- Trigger silent data synchronization when server invalidates local cache
- Provide notification permission gating via `SecurityController`

### Design Principles

- **Dual-path delivery**: FCM for server-pushed events, flutter_local_notifications for OS display
- **Encrypted persistence**: All notification history stored in AES-encrypted Hive
- **Reactive UI**: `ValueNotifier`-based state for zero-boilerplate UI updates
- **Silent sync**: Data invalidation FCMs trigger background hydration without user-visible notifications
- **Zero-touch init**: Notification setup is fully automatic during app bootstrap

---

## 2. Architecture Summary

```
┌──────────────────────────────────────────────────────────────────┐
│                    FIREBASE CLOUD MESSAGING                       │
│  Server pushes: SESSION_PREPARING, BOARD_RECOVERED,              │
│                 SESSION_LATE_START, SILENT_SYNC_PING             │
└──────────────────────────┬───────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
     Background Handler          Foreground Listener
     (@pragma vm:entry-point)    (onMessage stream)
              │                         │
              └────────────┬────────────┘
                           │
              ┌────────────┴────────────────────────┐
              │                                     │
     SyncFcmHandler                        NotificationService
     (FCM routing)                         (OS display + in-app)
              │                                     │
    ┌─────────┼──────────┐               ┌─────────┼──────────┐
    │         │          │               │         │          │
  System   BoardReadiness  Silent      flutter_   ValueNotifier  Hive
  Notif    Notifier        Sync        local_     history        'notifications'
  (OS)     (singleton)     (Hydration)  notif      (reactive)    (encrypted)
    │         │                         (OS display)
    │    DashboardController
    │    (UI rebuild on board ready)
    │
  FacultyHydrationService
  (sync local cache from server)
```

---

## 3. Source File Inventory

| File | Lines | Role |
|---|---|---|
| `Services/notification_service.dart` | 196 | Core singleton — in-app history + OS display + persistence |
| `Services/sync_fcm_handler.dart` | 157 | FCM handler — foreground/background message routing + token lifecycle |
| `Services/board_readiness_notifier.dart` | 31 | Global singleton tracking slot board readiness (fed by FCM) |
| `Presentation/Features/Notifications/notifications_screen.dart` | 233 | Notification list screen UI |
| `Presentation/Features/Notifications/notification_detail_screen.dart` | 99 | Single notification detail view |
| `Presentation/Features/Faculty/Components/dashboard_header.dart` | 213 | Dashboard header with notification bell + unread badge |
| `Services/permission_service.dart` | 27 | Notification permission check/request wrapper |
| `Services/persistence_service.dart` | 144 | Hive box management — opens encrypted `notifications` box |
| `main.dart` | 273 | Bootstrap orchestration — two-track notification init |

---

## 4. NotificationService

Singleton service managing both in-app notification history and OS-level system notifications.

### 4.1 Class Definition

```dart
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin;
}
```

### 4.2 Public API

| Method | Returns | Description |
|---|---|---|
| `init()` | `Future<void>` | Initialize `FlutterLocalNotificationsPlugin` with Android/iOS settings |
| `loadFromDisk()` | `Future<void>` | Read persisted notification history from Hive, update state |
| `addNotification({title, body, category})` | `Future<void>` | Create notification, prepend to history, show system notif, save to disk |
| `markAllAsRead()` | `void` | Set all notifications as read, update count, save |
| `markAsRead(String id)` | `void` | Set single notification as read, update count, save |
| `clearAll()` | `void` | Empty history, update count, save to disk |
| `clearAllLocally()` | `void` | Empty history, update count (NO disk save) |
| `showSystemNotification({id, title, body, payload})` | `Future<void>` | Display OS-level heads-up notification |
| `showNotification({id, title, body, payload})` | `Future<void>` | Compatibility wrapper → delegates to `showSystemNotification()` |

### 4.3 Static State

| Property | Type | Description |
|---|---|---|
| `history` | `ValueNotifier<List<AppNotification>>` | Reactive notification list |
| `unreadCount` | `int` (getter) | Computed: `history.value.where((n) => !n.isRead).length` |
| `unreadCountNotifier` | `ValueNotifier<int>` | Reactive unread count for badge display |

### 4.4 Initialization Detail

```dart
Future<void> init() async {
  // Android settings
  const androidSettings = AndroidInitializationSettings('@mipmap/launcher_icon');

  // iOS settings
  const iosSettings = DarwinInitializationSettings(
    requestAlertPermission: true,
    requestBadgePermission: true,
    requestSoundPermission: true,
  );

  await _notificationsPlugin.initialize(
    const InitializationSettings(android: androidSettings, iOS: iosSettings),
    onDidReceiveNotificationResponse: (details) {
      // Currently empty — prepared for future deep-linking
      // Payload format: "session_preparing:$sessionId" or "session_late_start:$sessionId"
    },
  );
}
```

### 4.5 addNotification Flow

```
addNotification(title, body, category)
  │
  ├─ Create AppNotification(
  │    id: DateTime.now().millisecondsSinceEpoch.toString(),
  │    title: title,
  │    body: body,
  │    timestamp: DateTime.now(),
  │    category: category,
  │    isRead: false
  │  )
  │
  ├─ Prepend to history.value
  ├─ _updateUnreadCount() → unreadCountNotifier.value = count
  ├─ _saveToDisk() → Hive 'notifications' box
  └─ showSystemNotification(id: 0, title, body)
```

---

## 5. AppNotification Model

### 5.1 Definition

```dart
class AppNotification {
  final String id;                  // millisecondsSinceEpoch as string
  final String title;
  final String body;
  final DateTime timestamp;
  final NotificationCategory category;
  bool isRead;                      // Mutable — toggled by markAsRead
}
```

### 5.2 Categories

```dart
enum NotificationCategory { attendance, system, assignment, security }
```

| Category | Icon | Color | Typical Content |
|---|---|---|---|
| `attendance` | `Icons.person_search_rounded` | Blue | Session preparing, board connected, late start |
| `system` | `Icons.info_rounded` | `AppTheme.primary` | General system messages |
| `assignment` | `Icons.assignment_turned_in_rounded` | Orange | Assignment-related (placeholder) |
| `security` | `Icons.security_rounded` | Red | Security alerts, compromised device |

### 5.3 Serialization

```dart
Map<String, dynamic> toJson() => {
  'id': id,
  'title': title,
  'body': body,
  'timestamp': timestamp.toIso8601String(),
  'category': category.name,
  'isRead': isRead,
};

factory AppNotification.fromJson(Map<String, dynamic> json) => AppNotification(
  id: json['id']?.toString() ?? '',
  title: json['title']?.toString() ?? '',
  body: json['body']?.toString() ?? '',
  timestamp: DateTime.tryParse(json['timestamp']?.toString() ?? '') ?? DateTime.now(),
  category: NotificationCategory.values.firstWhere(
    (e) => e.name == json['category'],
    orElse: () => NotificationCategory.system,
  ),
  isRead: json['isRead'] == true,
);
```

---

## 6. SyncFcmHandler

Static-only class managing the complete FCM lifecycle. No instances — all methods are static.

### 6.1 Public API

| Method | Description |
|---|---|
| `static Future<void> init()` | One-time initialization — registers handlers, gets/uploads FCM token |

### 6.2 Initialization Sequence

```
SyncFcmHandler.init()
  │
  ├─ Guard: if _initialized return (singleton guard)
  ├─ _initialized = true
  │
  ├─ FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler)
  │    └─ Registers top-level function for background FCM processing
  │
  ├─ FirebaseMessaging.onMessage.listen((message) { ... })
  │    └─ Foreground message handler (same logic as background)
  │
  ├─ FirebaseMessaging.instance.getToken()
  │    └─ Returns FCM token (or null)
  │
  ├─ _uploadFcmToken(token)
  │    ├─ Cache in SharedPreferences as 'fcm_token'
  │    └─ POST /api/v1/faculty/device/fcm-token (if user authenticated)
  │
  └─ messaging.onTokenRefresh.listen(_uploadFcmToken)
       └─ Auto-upload on token rotation
```

### 6.3 Token Upload

```dart
static Future<void> _uploadFcmToken(String token) async {
  // 1. Cache locally
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('fcm_token', token);

  // 2. Upload to server (if authenticated)
  final user = FirebaseAuth.instance.currentUser;
  if (user != null) {
    await ApiClient().dio.post(
      '/api/v1/faculty/device/fcm-token',
      data: {'fcm_token': token},
    );
  }
}
```

---

## 7. FCM Message Types

### 7.1 Message Routing

Both foreground and background handlers process identical message types with the same logic:

| FCM `type` field | Notification ID | Title | Body Pattern | Side Effect |
|---|---|---|---|---|
| `SILENT_SYNC_PING` + `action: INVALIDATE_LOCAL_DB` | None | — | — | `FacultyHydrationService().syncIfNeeded()` |
| `SESSION_PREPARING` | 8888 | "Class Preparing" | `"{subject_name} is about to start at {start_time}"` | `BoardReadinessNotifier.markReady(slotId)` |
| `BOARD_RECOVERED` | 8888 | "Board Reconnected" | `"{subject_name} board is ready — swipe to start"` | `BoardReadinessNotifier.markReady(slotId)` |
| `SESSION_LATE_START` | 8889 | "Attendance Not Taken" | `"{subject_name} is ending at {end_time} — no attendance recorded yet"` | None |

### 7.2 Notification Payload Format

```dart
// SESSION_PREPARING and BOARD_RECOVERED
payload: 'session_preparing:$sessionId'

// SESSION_LATE_START
payload: 'session_late_start:$sessionId'
```

### 7.3 FCM Data Fields

| Field | Type | Used By |
|---|---|---|
| `type` | `String` | All — determines routing |
| `action` | `String` | `SILENT_SYNC_PING` — sub-type discriminator |
| `session_id` | `String` | All — session identifier |
| `slot_id` | `String` | `SESSION_PREPARING`, `BOARD_RECOVERED` — board readiness key |
| `subject_name` | `String` | All — display name |
| `start_time` | `String` | `SESSION_PREPARING` — class start time |
| `end_time` | `String` | `SESSION_LATE_START` — class end time |

### 7.4 Silent Sync Flow

```
Server: SILENT_SYNC_PING + INVALIDATE_LOCAL_DB
  │
  ├─ (Background) FacultyHydrationService().syncIfNeeded()
  │    ├─ Check if hydration needed (last sync timestamp)
  │    ├─ Fetch fresh data from server
  │    ├─ Write to Hive boxes
  │    └─ Fire onDataChanged callback
  │         └─ DashboardController.reloadFromCache()
  │              └─ UI rebuilds with fresh data
  │
  └─ (Foreground) Same flow, no notification shown
```

---

## 8. FCM Token Lifecycle

### 8.1 Token Acquisition

```
SyncFcmHandler.init()
  └─ FirebaseMessaging.instance.getToken()
       │
       ├─ Returns token string (e.g., "dKx9...:APA91b...")
       │
       └─ _uploadFcmToken(token)
            ├─ SharedPreferences.setString('fcm_token', token)
            └─ POST /api/v1/faculty/device/fcm-token { fcm_token: token }
```

### 8.2 Token Refresh

```
FirebaseMessaging.instance.onTokenRefresh
  └─ _uploadFcmToken(newToken)
       ├─ Update SharedPreferences cache
       └─ Re-upload to server
```

### 8.3 Token Usage

- **Login**: `AuthRepository.verifySession()` reads `fcm_token` from SharedPreferences and attaches to the verify-session API call
- **Server-side**: Server stores FCM token per faculty device for targeted push delivery
- **Token rotation**: Automatic via `onTokenRefresh` listener

---

## 9. Initialization & Bootstrap

The notification system uses a **two-track deferred bootstrap** pattern:

### 9.1 Track A — Fast Bootstrap (~100ms)

```dart
// main.dart — runs on main isolate
Future<void> main() async {
  // ... Flutter binding setup ...

  // Track A: Essential boxes only
  await PersistenceService().initEssentialBoxes();
  // Opens: faculty_profile, academic_data Hive boxes + SharedPreferences
  // Does NOT open notifications box, does NOT init Firebase

  runApp(const IntelliAttendApp());
  // Dashboard renders immediately from cache
}
```

### 9.2 Track B — Background Bootstrap (after first frame)

```dart
Future<void> _bootstrapBackground() async {
  // 1. Firebase init
  await Firebase.initializeApp();

  // 2. Open remaining Hive boxes (including 'notifications')
  await PersistenceService().initRemainingBoxes();
  // Inside initRemainingBoxes():
  //   - Opens 'notifications' encrypted Hive box
  //   - Calls NotificationService().loadFromDisk()
  //     ├─ NotificationService().init() — init flutter_local_notifications
  //     └─ Read persisted AppNotification list from Hive

  // 3. Explicitly init NotificationService (idempotent)
  await NotificationService().init();

  // 4. Init FCM handler (registers background handler + foreground listener)
  await SyncFcmHandler.init();
}
```

### 9.3 Permission Request

```dart
// dashboard_screen.dart — initState()
void initState() {
  super.initState();
  WidgetsBinding.instance.addPostFrameCallback((_) {
    FirebaseMessaging.instance.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
  });
}
```

---

## 10. System Notification Display

### 10.1 flutter_local_notifications Integration

```dart
Future<void> showSystemNotification({
  int id = 0,
  required String title,
  required String body,
  String? payload,
}) async {
  const details = NotificationDetails(
    android: AndroidNotificationDetails(
      'intelliattend_channel',
      'Class Reminders',
      channelDescription: 'Notifications for class starts and announcements',
      importance: Importance.max,
      priority: Priority.high,
      ticker: 'ticker',
    ),
    iOS: DarwinNotificationDetails(),
  );

  await _notificationsPlugin.show(id, title, body, details, payload: payload);
}
```

### 10.2 Notification Display Triggers

| Trigger | Source | Method |
|---|---|---|
| `addNotification()` called | Any caller | `showSystemNotification()` as side effect |
| FCM `SESSION_PREPARING` | Server push | `showSystemNotification(id: 8888, ...)` |
| FCM `BOARD_RECOVERED` | Server push | `showSystemNotification(id: 8888, ...)` |
| FCM `SESSION_LATE_START` | Server push | `showSystemNotification(id: 8889, ...)` |

### 10.3 Notification ID Strategy

| ID | Scope | Behavior |
|---|---|---|
| `0` | Default | Each new call replaces the previous notification |
| `8888` | Session preparing/board recovered | Each new call replaces the previous session notification |
| `8889` | Late start warning | Persists independently |
| Dynamic (ms timestamp) | In-app history only | Unique per notification |

---

## 11. In-App Notification History

### 11.1 Data Flow

```
NotificationService.addNotification()
  │
  ├─ Create AppNotification (id = msSinceEpoch)
  ├─ Prepend to history.value (ValueNotifier)
  ├─ Update unreadCountNotifier.value
  ├─ Persist to Hive 'notifications' box
  └─ Show OS notification via flutter_local_notifications
```

### 11.2 Read/Unread State

| Action | Effect |
|---|---|
| `markAsRead(id)` | Sets `isRead = true` on matching notification, updates count, saves |
| `markAllAsRead()` | Sets `isRead = true` on all notifications, updates count, saves |
| New notification | Created with `isRead = false` |

### 11.3 Persistence Format

```
Hive Box: 'notifications' (encrypted with HiveAesCipher)
Key:      'history'
Value:    JSON array of AppNotification objects

Example:
[
  {
    "id": "1721374200000",
    "title": "Class Preparing",
    "body": "CS101 is about to start at 10:00 AM",
    "timestamp": "2026-07-19T10:00:00.000",
    "category": "attendance",
    "isRead": false
  }
]
```

---

## 12. Notification UI

### 12.1 Notification Bell (Dashboard Header)

Location: `dashboard_header.dart` — right-aligned in the dashboard app bar

```
NotificationBell
  ├─ Icon: Icons.notifications_none_rounded (circular container)
  ├─ Unread Badge: Positioned top-right
  │    ├─ If count > 0: Red circle with count text
  │    ├─ If count > 9: Shows "9+"
  │    └─ If count == 0: Hidden
  └─ OnTap: Navigator.push → NotificationsScreen
```

Updates reactively via `ValueListenableBuilder<List<AppNotification>>` on `NotificationService.history`.

### 12.2 Notifications List Screen

Location: `notifications_screen.dart` (233 lines)

```
NotificationsScreen (StatelessWidget)
  └─ Scaffold
       ├─ AppBar
       │    ├─ Title: "Notifications"
       │    └─ Action: "Read All" button (hidden when list empty)
       │
       └─ Body: ValueListenableBuilder<List<AppNotification>>
            │
            ├─ If empty:
            │    └─ Centered: Large icon + "No notifications yet"
            │
            └─ If not empty: ListView.builder
                 │
                 ├─ Each tile:
                 │    ├─ Category icon (color-coded circle)
                 │    ├─ Title (bold if unread, normal if read)
                 │    ├─ Body text (gray, max 2 lines)
                 │    ├─ Relative timestamp ("2m ago", "1h ago")
                 │    └─ Blue unread dot (if !isRead)
                 │
                 └─ Bottom: "Clear All Notifications" button
```

**Tile tap behavior**: Calls `service.markAsRead(notification.id)` — marks as read, does NOT navigate to detail screen.

### 12.3 Notification Detail Screen

Location: `notification_detail_screen.dart` (99 lines)

```
NotificationDetailScreen (StatelessWidget)
  └─ Scaffold
       ├─ AppBar: notification.title
       └─ Body: Padding
            ├─ Title text (22px, bold)
            ├─ Body card (16px, padded container)
            └─ Timestamp row (clock icon + formatted time)
```

**Note**: This screen exists but is **not currently navigated to** from `NotificationsScreen`. Tapping a notification only marks it as read. The detail screen is prepared for future use.

### 12.4 Category Icon Mapping

| Category | Icon | Color |
|---|---|---|
| `attendance` | `Icons.person_search_rounded` | `Color(0xFF3B82F6)` (Blue) |
| `assignment` | `Icons.assignment_turned_in_rounded` | `Color(0xFFF97316)` (Orange) |
| `security` | `Icons.security_rounded` | `Color(0xFFEF4444)` (Red) |
| `system` | `Icons.info_rounded` | `AppTheme.primary` |

---

## 13. BoardReadinessNotifier Integration

### 13.1 Data Flow

```
FCM Message (SESSION_PREPARING / BOARD_RECOVERED)
  │
  └─ SyncFcmHandler
       └─ BoardReadinessNotifier.instance.markReady(slotId)
            │
            └─ notifyListeners()
                 │
                 └─ DashboardController._onBoardReadinessChanged()
                      │
                      └─ notifyListeners() → UI rebuild
```

### 13.2 BoardReadinessNotifier API

```dart
class BoardReadinessNotifier extends ChangeNotifier {
  static final BoardReadinessNotifier instance = BoardReadinessNotifier._();
  final Set<String> _readySlots = {};

  bool isReady(String slotId);        // Check if slot has board
  void markReady(String slotId);      // Mark slot as board-ready
  void clearReady(String slotId);     // Clear readiness for slot
  void clearAll();                    // Clear all readiness
}
```

### 13.3 DashboardController Integration

```dart
// In DashboardController constructor:
BoardReadinessNotifier.instance.addListener(_onBoardReadinessChanged);

// Public API exposed to UI:
bool isBoardReady(String slotId) => BoardReadinessNotifier.instance.isReady(slotId);
void clearBoardReadiness(String slotId) => BoardReadinessNotifier.instance.clearReady(slotId);
```

---

## 14. Security & Permission Gating

### 14.1 PermissionService

```dart
class PermissionService {
  static Future<bool> hasNotificationPermission() async {
    final status = await Permission.notification.status;
    return status.isGranted;
  }

  static Future<bool> requestNotificationPermission() async {
    final status = await Permission.notification.request();
    return status.isGranted;
  }
}
```

### 14.2 SecurityController Integration

```dart
// security_controller.dart
bool _notificationsOk = false;

Future<void> _checkNotificationPermission() async {
  _notificationsOk = await PermissionService.hasNotificationPermission();
  notifyListeners();
}

bool get notificationsOk => _notificationsOk;
```

The `SecurityController` treats notification permission as one of several security pillars (alongside biometrics, device binding, etc.). A denied notification permission triggers a security warning in the security status dashboard.

---

## 15. Persistence

### 15.1 Storage Mechanism

| Aspect | Value |
|---|---|
| Storage engine | Hive (NoSQL key-value) |
| Box name | `'notifications'` |
| Encryption | `HiveAesCipher` (AES-256) |
| Key storage | `FlutterSecureStorage` (Android: EncryptedSharedPreferences, iOS: Keychain) |
| Serialization | JSON (`AppNotification.toJson()` / `fromJson()`) |
| Key | Single key `'history'` storing the full list |

### 15.2 Save Triggers

| Operation | Saves to Disk? |
|---|---|
| `addNotification()` | Yes |
| `markAsRead(id)` | Yes |
| `markAllAsRead()` | Yes |
| `clearAll()` | Yes |
| `clearAllLocally()` | No |
| `loadFromDisk()` | No (read-only) |

### 15.3 PersistenceService Integration

```dart
// persistence_service.dart
Future<void> initRemainingBoxes() async {
  // ... other boxes ...
  notificationsBox = await Hive.openBox(
    'notifications',
    encryptionCipher: HiveAesCipher(secureKey),
  );
  NotificationService().loadFromDisk();  // Read persisted history
}
```

### 15.4 Clear on Logout

```dart
// persistence_service.dart
Future<void> clearAllData() async {
  await notificationsBox?.clear();           // Wipe Hive
  NotificationService().clearAllLocally();   // Wipe in-memory
}
```

---

## 16. Notification Channels & Configuration

### 16.1 Android Configuration

```
Channel ID:      'intelliattend_channel'
Channel Name:    'Class Reminders'
Description:     'Notifications for class starts and announcements'
Importance:      Importance.max (heads-up notification)
Priority:        Priority.high
Ticker:          'ticker'
Icon:            '@mipmap/launcher_icon'
```

### 16.2 iOS Configuration

```
DarwinInitializationSettings:
  requestAlertPermission: true
  requestBadgePermission: true
  requestSoundPermission: true

DarwinNotificationDetails:  (default — no custom sound/badge)
```

### 16.3 Dependencies

```yaml
# pubspec.yaml
flutter_local_notifications: ^17.1.2
firebase_messaging: ^15.0.0
permission_handler: ^11.0.0
```

---

## 17. State Management

### 17.1 NotificationService (Singleton)

| Property | Type | Scope |
|---|---|---|
| `history` | `ValueNotifier<List<AppNotification>>` | Static — shared across app |
| `unreadCountNotifier` | `ValueNotifier<int>` | Static — shared across app |
| `unreadCount` | `int` (computed getter) | Derived from history |
| `_notificationsPlugin` | `FlutterLocalNotificationsPlugin` | Instance — OS notification display |

### 17.2 ValueNotifier Consumers

| Consumer | Listens To | Reaction |
|---|---|---|
| `DashboardHeader` (bell icon) | `NotificationService.history` | Update badge count |
| `NotificationsScreen` (list) | `NotificationService.history` | Rebuild notification tiles |

### 17.3 BoardReadinessNotifier (Global Singleton)

| Property | Type |
|---|---|
| `_readySlots` | `Set<String>` |
| `instance` | Static final singleton |

Consumers:
- `DashboardController` — listens via `addListener()`, calls `isBoardReady(slotId)` and `clearBoardReadiness(slotId)`

---

## 18. Error Handling & Edge Cases

### 18.1 FCM Token Upload Failure

```
SyncFcmHandler._uploadFcmToken(token)
  └─ try/catch: catch (e) { debugPrint("FCM Token upload error: $e"); }
  └─ Non-fatal — token is cached locally, will retry on next app launch
```

### 18.2 Notification Init Failure

- `FlutterLocalNotificationsPlugin.initialize()` failure is non-fatal
- In-app history still functions (ValueNotifier + Hive)
- OS notifications silently fail (no crash)

### 18.3 Hive Box Not Open

- `NotificationService._saveToDisk()` wraps in try/catch
- `loadFromDisk()` handles empty/missing box gracefully

### 18.4 Duplicate FCM Messages

- Both foreground and background handlers process the same message type
- Since only one handler runs at a time (app in foreground = foreground handler; background = background handler), duplicates are avoided at the OS level

### 18.5 Background Handler Isolate

- `_firebaseMessagingBackgroundHandler` is a top-level function with `@pragma('vm:entry-point')`
- Runs in a separate isolate — cannot access Flutter widgets or UI state
- Uses `FacultyHydrationService` (Hive-safe) and `NotificationService` (plugin-based)
- Uses `BoardReadinessNotifier` singleton (process-level shared)

---

## 19. Offline Behavior

### 19.1 What Works Offline

| Feature | Works? | Notes |
|---|---|---|
| View notification history | Yes | Read from Hive cache |
| Mark as read | Yes | Updates in-memory + queue for disk save |
| Clear all | Yes | Updates in-memory + queue for disk save |
| Display OS notification | Yes | If triggered locally (not from FCM) |
| Receive FCM messages | No | Requires network |
| Upload FCM token | No | Requires network |
| Silent data sync | No | Requires network |

### 19.2 Offline Recovery

- FCM messages missed while offline are delivered when connectivity is restored (FCM handles re-delivery for background/terminated apps)
- In-app notification history is always available from encrypted Hive cache
- FCM token is cached in SharedPreferences — uploaded on next successful server contact

---

## 20. Known Gaps & Future Work

| Gap | Current State | Planned Enhancement |
|---|---|---|
| Notification tap deep-linking | `onDidReceiveNotificationResponse` is empty | Implement payload-based navigation (e.g., open session screen from `session_preparing:$id`) |
| Notification detail screen | Exists but not navigated to | Wire `NotificationsScreen` tile tap to push `NotificationDetailScreen` |
| OS badge count | Not managed (badge is visual only) | Set native badge count via `FlutterLocalNotificationsPlugin` or Firebase Messaging |
| Push to students | "Send Warnings" UI placeholder in Reports | Implement `NotificationService.addNotification()` for student-targeted push |
| Notification categories filtering | All shown in one list | Add category filter chips (attendance, system, security) |
| Notification scheduling | No scheduled notifications | Add time-based class reminders via `flutter_local_notifications` scheduling |
| Notification grouping | No grouping | Group by session or category using Android notification grouping |
| `AttendanceService` import | Imports `NotificationService` but unused | Either use it or remove the dead import |
