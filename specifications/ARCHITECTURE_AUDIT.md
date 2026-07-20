# IntelliAttend — Complete Architecture Audit

**Audit Date:** July 19, 2026
**Scope:** Full codebase analysis of IntelliAttend Faculty Mobile App (`IntelliAttend-Faculty-Mobile-App/`) and Main Shell (`lib/`)
**Auditor:** Automated Deep Analysis

---

## 1. Repository Structure

### 1.1 Monorepo Layout

```
C:\Dev\IntelliAttend\
├── lib/                              # MAIN SHELL (empty scaffold)
├── IntelliAttend-Faculty-Mobile-App/ # PRODUCTION FACULTY APP (85 Dart files, ~6000 LOC)
├── smart-campus-dashboard/           # React+TS Admin Dashboard (mock data)
├── specifications/                   # This audit document
├── .github/                          # CI/CD + CODEOWNERS
└── pubspec.yaml                      # Main shell (minimal deps)
```

### 1.2 Three Distinct Codebases

| Codebase | Status | Language | Purpose |
|----------|--------|----------|---------|
| Main Shell (`lib/`) | Empty scaffold | Dart/Flutter | Target architecture for consolidated app |
| Faculty Mobile App | Production (v14+) | Dart/Flutter | Faculty attendance management |
| Smart Campus Dashboard | Prototype | React+TS | Admin monitoring (mock data) |

### 1.3 Faculty App File Inventory

```
IntelliAttend-Faculty-Mobile-App/lib/
├── main.dart                          [273 lines]  — Bootstrap, Provider tree, SecurityOverlay
├── Theme/
│   ├── app_theme.dart                 [235 lines]  — Material 3 dark/light themes
│   └── theme_controller.dart          [26 lines]   — ValueListenable<ThemeMode>
├── Core/
│   ├── error/error_handler.dart       [240 lines]  — AppError + visual error sheets
│   ├── Models/
│   │   ├── crypto_envelope.dart       [32 lines]   — Anti-replay crypto payload
│   │   ├── device_data.dart           [67 lines]   — Hardware fingerprint model
│   │   └── websocket_event.dart       [248 lines]  — WS event parsing + typed data classes
│   ├── Network/
│   │   ├── api_client.dart            [131 lines]  — Singleton Dio + cert pinning + retry
│   │   └── Interceptors/
│   │       ├── auth_interceptor.dart  [175 lines]  — JWT token attach + 401/403 → force logout
│   │       └── security_interceptor.dart [80 lines] — Device ID headers + 403/426 handling
│   └── Services/
│       ├── force_logout_service.dart  [123 lines]  — Scorched-earth logout pipeline
│       ├── hardware_service.dart      [179 lines]  — Native bridge (root, keypair, monotonic clock)
│       ├── key_enrollment_service.dart [82 lines]  — 2-phase HW key enrollment
│       ├── qr_validation_service.dart [188 lines]  — QR v7.0 local pre-validation
│       └── security_controller.dart   [378 lines]  — Biometric lock, root detection, lifecycle
├── Data/
│   ├── Models/
│   │   ├── Attendance/attendance_models.dart [185 lines] — Session + student attendance
│   │   ├── Auth/
│   │   │   ├── auth_session_model.dart      [102 lines] — Login session tracking
│   │   │   └── registration_models.dart     [142 lines] — Registration DTOs
│   │   └── Faculty/
│   │       ├── course_topic.dart             [31 lines]  — Topic completion model
│   │       ├── override_slot.dart            [107 lines] — Substitute class model
│   │       ├── resource_model.dart           [69 lines]  — File resource model
│   │       └── scheduled_class.dart          [133 lines] — Timetable slot model
│   └── Repositories/
│       ├── attendance_repository.dart  [346 lines] — Session CRUD, QR gen, terminate
│       ├── auth_repository.dart        [156 lines] — Login, register, verify, change pw
│       ├── course_repository.dart      [128 lines] — Schedule fetch + cache
│       ├── override_repository.dart    [39 lines]  — Override fetch
│       └── resource_repository.dart    [189 lines] — Resource CRUD + presigned URLs
├── Services/
│   ├── attendance_service.dart         [29 lines]   — Live attendance ValueNotifiers
│   ├── board_readiness_notifier.dart   [31 lines]   — SmartBoard readiness tracking
│   ├── credential_service.dart         [73 lines]   — Secure storage remember-me
│   ├── eligibility_service.dart        [69 lines]   — 75% threshold calculations
│   ├── faculty_hydration_service.dart  [255 lines]  — Manifest-based sync engine
│   ├── faculty_service.dart            [529 lines]  — Profile, stats, auth flow, cache
│   ├── haptic_service.dart             [37 lines]   — Haptic feedback abstraction
│   ├── notification_service.dart       [196 lines]  — Local notifications + history
│   ├── permission_service.dart         [27 lines]   — Notification permission only
│   ├── persistence_service.dart        [144 lines]  — Hive boxes + encryption + Prefs
│   ├── reports_service.dart            [228 lines]  — Report fetch + cache + compute
│   ├── security_service.dart           [92 lines]   — Device session listing
│   ├── session_management_service.dart [48 lines]   — Session state persistence
│   ├── sync_fcm_handler.dart           [157 lines]  — FCM background handlers
│   ├── time_sync_service.dart          [287 lines]  — Virtual monotonic clock + drift
│   └── websocket_service.dart          [220 lines]  — WS connect/reconnect/heartbeat
├── engine/
│   ├── engine.dart                     [8 lines]    — Barrel export
│   ├── time_block.dart                 [2 lines]    — Re-export from shared
│   ├── time_source.dart                [15 lines]   — SystemClock wrapper
│   ├── timetable_controller.dart       [103 lines]  — 1s-tick state machine
│   ├── timetable_phase.dart            [2 lines]    — Re-export
│   └── timetable_state_machine.dart    [46 lines]   — Legacy wrapper
└── Presentation/
    ├── Widgets/        (9 files)  — Reusable UI components
    └── Features/       (13 directories, 55 files) — Screen implementations
```

**Total: 85 Dart files, ~6,200 lines of business logic + ~8,000 lines of UI**

---

## 2. Architecture Pattern

### 2.1 Clean Architecture Layers (Partially Implemented)

```
┌─────────────────────────────────────────┐
│  Presentation Layer                      │
│  Screens, Widgets, Controllers (Provider)│
├─────────────────────────────────────────┤
│  Service Layer                           │
│  FacultyService, AttendanceService, etc. │
├─────────────────────────────────────────┤
│  Repository Layer                        │
│  AuthRepo, AttendanceRepo, CourseRepo    │
├─────────────────────────────────────────┤
│  Network Layer                           │
│  ApiClient (Dio) + Interceptors          │
├─────────────────────────────────────────┤
│  Core / Domain                           │
│  Models, Security, Engine, Hardware      │
├─────────────────────────────────────────┤
│  Persistence Layer                       │
│  Hive (encrypted) + SharedPreferences    │
│  + FlutterSecureStorage                  │
└─────────────────────────────────────────┘
```

### 2.2 Architecture Assessment

| Principle | Rating | Evidence |
|-----------|--------|----------|
| **Separation of Concerns** | 7/10 | Clear folder structure, but services leak into each other |
| **Single Responsibility** | 5/10 | `FacultyService` (529 lines) handles auth, profile, stats, cache, sync |
| **Dependency Inversion** | 4/10 | Only `AuthRepository` has an interface (`IAuthRepository`). All others are concrete. |
| **Open/Closed** | 5/10 | Adding new features requires modifying existing files |
| **Interface Segregation** | 3/10 | No repository interfaces except AuthRepo |

---

## 3. State Management

### 3.1 Provider Usage

The app uses **Provider** as its sole state management solution. Provider tree defined in `main.dart`:

```dart
ChangeNotifierProvider<SecurityController>    // Root — security gate
MultiProvider([
  Provider<ApiClient>                          // Singleton HTTP client
  ProxyProvider<ApiClient, CourseRepository>   // Schedule data
  ProxyProvider<ApiClient, AttendanceRepository>// Session management
  ProxyProvider<ApiClient, AuthRepository>     // Authentication
  ChangeNotifierProxyProvider2<..., DashboardController> // Dashboard (LAZY)
  ProxyProvider<ApiClient, ResourceRepository> // File resources
  ChangeNotifierProxyProvider<ResourceRepository, ResourcesController> // Resources UI
])
```

### 3.2 State Management Patterns Used

| Pattern | Where | Examples |
|---------|-------|----------|
| **ValueNotifier** | Services | `FacultyService.profile`, `AttendanceService.students`, `NotificationService.history` |
| **ChangeNotifier** | Controllers | `SecurityController`, `DashboardController`, `ResourcesController`, `LiveMonitorController`, `SmartBoardController`, `ReportsController` |
| **Static singletons** | Services | `FacultyService`, `AttendanceService`, `PersistenceService`, `NotificationService`, `ForceLogoutService`, `BoardReadinessNotifier` |
| **StreamController** | Repositories | `CourseRepository.watchSchedule()`, `WebSocketService.events` |
| **static ValueNotifier** | Cross-cutting | `FacultyService.profile` (static), `EligibilityService.students` (static) |

### 3.3 State Management Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **Mixed patterns** | HIGH | ValueNotifier, ChangeNotifier, static singletons, and streams used inconsistently |
| **Static state everywhere** | HIGH | `FacultyService`, `EligibilityService`, `BoardReadinessNotifier`, `NotificationService` all use static state — makes testing and scoping impossible |
| **No Provider for services** | MEDIUM | `AttendanceService`, `NotificationService`, `ReportsService` are NOT in the Provider tree — accessed as singletons directly |
| **Lazy provider** | GOOD | `DashboardController` is correctly lazy to avoid premature initialization |
| **No dispose patterns** | HIGH | Many static ValueNotifiers are never disposed; memory leaks on hot restart |

---

## 4. Navigation Architecture

### 4.1 Navigation Method

The app uses **imperative navigation** (`Navigator.push`/`pushAndRemoveUntil`) exclusively. No declarative routing (GoRouter, AutoRoute).

### 4.2 Entry Point Flow

```
main() → IntelliAttendApp
  → MaterialApp
    → UnifiedAuthGate (decides route based on auth state)
      ├── If not authenticated → LoginScreen
      │     → If needs registration → RegistrationScreen → OTPScreen → SetPasswordScreen
      │     → If authenticated → proceed to biometric check
      ├── If biometric lock enabled → LockScreen (overlay)
      ├── If device compromised → CompromisedDeviceScreen
      └── If authenticated → DashboardScreen (with CustomSlidingNavBar)
```

### 4.3 Navigation Architecture Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **No named routes** | MEDIUM | All navigation uses anonymous `MaterialPageRoute(builder: (_) => ...)` |
| **No route guards** | HIGH | Screen-level auth checking is ad-hoc, not centralized |
| **ForceLogoutService navigator context** | HIGH | Uses a static `GlobalKey<NavigatorState>` — fragile, can fail if context is unmounted |
| **Deep linking impossible** | MEDIUM | No URL-based routing means no deep link support |
| **No route transitions** | LOW | Default platform transitions, no custom animations |

---

## 5. Networking

### 5.1 Dio Configuration

```dart
// Base
baseUrl: dotenv.env['API_BASE_URL'] ?? 'https://api-dev.balaseetharamanjaneyulu.com'
connectTimeout: 15s
receiveTimeout: 15s

// Interceptor Chain (in order)
1. RetryInterceptor        — 2 retries on timeout/connectionError, exponential backoff
2. AuthInterceptor         — Attach Firebase ID token, handle 401/403 → ForceLogout
3. SecurityInterceptor     — Attach X-Device-* headers, handle 403/426 → ForceLogout
4. LogInterceptor          — Debug mode only
```

### 5.2 Certificate Pinning

Implemented via `IOHttpClientAdapter` SHA-256 fingerprint verification:
- Fingerprints loaded from `.env` file (`PINNED_CERT_FINGERPRINTS`)
- In debug mode: bypasses if no fingerprints configured
- In release mode: rejects unmatched certificates

### 5.3 API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/auth/status` | Check auth status |
| POST | `/api/v1/auth/register/send-otp` | Send registration OTP |
| POST | `/api/v1/auth/register/complete` | Complete registration |
| POST | `/api/v1/auth/verify-session` | Device binding verification |
| GET | `/api/v1/faculty/sync` | Manifest hydration (profile, cohorts, schedule, rosters) |
| POST | `/api/v1/faculty/start_session` | Start attendance session |
| POST | `/api/v1/faculty/refresh_otp` | Rotate OTP |
| POST | `/api/v1/faculty/generate_qr` | Generate QR token |
| POST | `/api/v1/faculty/attendance/manual` | Manual attendance mark |
| POST | `/api/v1/faculty/attendance/correction` | Retrospective correction |
| POST | `/api/v1/session/terminate` | End session |
| POST | `/api/v1/session/{id}/rescue-seed` | Recovery seed |
| POST | `/api/v1/faculty/sessions/{id}/reconcile` | Count reconciliation |
| GET | `/api/v1/session/current-state` | Session recovery |
| GET | `/api/v1/session/{id}` | Session status |
| POST | `/api/v1/start-session` | Start existing session |
| GET | `/api/v1/time` | Server time sync |
| POST | `/api/v1/faculty/device/compromised` | Report compromised device |
| GET | `/api/v1/faculty/resources` | List resources |
| GET | `/api/v1/faculty/college-resources` | College shared resources |
| POST | `/api/v1/faculty/resources/upload` | Upload resource |
| DELETE | `/api/v1/faculty/resources/{id}` | Delete resource |
| GET | `/api/v1/faculty/resources/{id}/presigned-url` | Download URL |
| POST | `/api/v1/faculty/resources/{id}/push-to-session` | Push to SmartBoard |
| POST | `/api/v1/faculty/resources/{id}/push-to-section` | Push to section |

### 5.4 WebSocket

```dart
// Connection
wss://{api-host}/ws?session_id={id}&token={firebase_token}&token_type=firebase

// Events Received (18 types)
attendance_update, student_marked, session_preparing, session_igniting,
attendance_open, student_verified, student_rejected, attendance_marked_manual,
attendance_updated, attendance_closed, session_archived, full_state_sync,
faculty_sync, board_connected, session_activated, otp_failed,
mark_attendance_ack, heartbeat/pong

// Events Sent
{ type: 'ping' }              // Heartbeat every 30s
{ type: 'mark_attendance', session_id, student_id, faculty_email }

// Reconnection: exponential backoff 1s → 2s → 4s → ... → 30s max
```

### 5.5 Networking Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **No request cancellation** | MEDIUM | `ApiClient()` is recreated on each `factory` call — `_init` runs but `_baseUrl` check prevents reinit. Confusing singleton pattern. |
| **RetryInterceptor creates new Dio** | HIGH | `Dio().fetch(err.requestOptions)` creates a new Dio without interceptors — retry bypasses auth |
| **Auth token refresh race condition** | MEDIUM | Two interceptors both handle 401/403 — potential double-trigger of ForceLogout |
| **No API response wrapper** | LOW | Responses parsed ad-hoc, no consistent envelope type |
| **WebSocket URL derivation** | LOW | Replaces `https://` with `wss://` — fragile if URL format changes |
| **Hardcoded dev URL** | LOW | Default `https://api-dev.balaseetharamanjaneyulu.com` — should not be in source |

---

## 6. Authentication Flow

### 6.1 Auth Pipeline

```
1. Firebase Auth (email/password sign-in)
   ↓
2. AuthInterceptor attaches Firebase ID Token as Bearer header
   ↓
3. POST /auth/status — checks if faculty exists in backend
   ↓
4. POST /auth/verify-session — device binding (fingerprint comparison)
   ↓
5. SecurityController — biometric lock, root detection, time integrity
   ↓
6. ForceLogoutService — wipes all data on 401/403 from server
```

### 6.2 Registration Flow

```
1. Enter email → POST /auth/register/initiate (sends OTP to email)
2. Enter OTP → POST /auth/register/verify
3. Set password + device snapshot → POST /auth/register/complete
   → Backend creates Firebase Auth account
   → Backend binds device fingerprint
   → Returns profile → FacultyService.applyProfile()
```

### 6.3 Authentication Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **No refresh token** | HIGH | Uses Firebase ID token (1hr expiry). AuthInterceptor refreshes via `getIdToken(true)` but no retry queue if multiple requests are in-flight during refresh |
| **Password stored in plaintext request** | MEDIUM | `RegistrationCompleteRequest` sends password as JSON field — should be HTTPS-only (which it is, but no extra protection) |
| **Device binding is fingerprint-only** | MEDIUM | Relies on `HardwareService.getDeviceSnapshot()` — fingerprint can change on OS update |
| **No session timeout** | LOW | Firebase ID token has 1hr limit, but no app-level session timeout |
| **Remember-me stores email in secure storage** | GOOD | `CredentialService` uses `FlutterSecureStorage` with encrypted SharedPreferences |

---

## 7. Hive Caching

### 7.1 Box Structure

| Box Name | Encryption | Purpose |
|----------|-----------|---------|
| `faculty_profile` | AES (HiveAesCipher) | Faculty profile, stats, registration flag |
| `academic_data` | AES | Cohorts, schedules, rosters, eligibility, manifest hash |
| `attendance` | AES | Attendance records |
| `notifications` | AES | Notification history |
| `device_data` | AES | Device ID, fingerprint |

### 7.2 Encryption Key Management

```
1. FlutterSecureStorage reads/writes key 'hive_encryption_key'
2. If not found → Hive.generateSecureKey() → base64 → store
3. Key loaded on every app start → HiveAesCipher created
4. All boxes opened with encryptionCipher: _cipher
```

### 7.3 Two-Track Bootstrap

```
Track A (100ms, pre-Firebase):
  ├── Hive.initFlutter()
  ├── _ensureEncryptionKey()
  ├── Open faculty_profile box
  ├── Open academic_data box
  ├── SharedPreferences.getInstance()
  └── FacultyService.loadFromCache()  ← instant UI from cache

Track B (post-first-frame, background):
  ├── Firebase.initializeApp()
  ├── Open remaining boxes (attendance, notifications, device_data)
  ├── NotificationService.loadFromDisk()
  ├── TimeSyncService.initFallbackClock()
  ├── NotificationService.init()
  ├── SyncFcmHandler.init()
  ├── TimeSyncService.bootstrap()  (server time sync)
  └── KeyEnrollmentService.enroll() (HW keypair generation)
```

### 7.4 Caching Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **No cache invalidation strategy** | HIGH | `FacultyHydrationService` uses manifest hash comparison, but `ReportsService`, `CourseRepository` have ad-hoc TTL-less caching |
| **Static box references** | MEDIUM | `PersistenceService.facultyBox` is a `static late Box` — throws if accessed before initialization |
| **No migration strategy** | HIGH | No Hive box versioning or migration — schema changes will corrupt data |
| **Generic cache helpers** | LOW | `cachePut`/`cacheGet` on `academicBox` — untyped, no schema enforcement |
| **Encryption key in SecureStorage** | GOOD | Key never exposed in plaintext, encrypted at rest |

---

## 8. Firebase Integration

### 8.1 Firebase Services Used

| Service | Usage |
|---------|-------|
| **Firebase Auth** | Email/password sign-in, ID token generation, token refresh |
| **Firebase Messaging (FCM)** | Push notifications, background message handling |
| **Firebase Core** | Initialization |

### 8.2 What Firebase is NOT Used For

- **Firestore** — Explicitly NOT used. Backend is FastAPI + custom database
- **Analytics** — Not integrated
- **Crashlytics** — Not integrated
- **Remote Config** — Not integrated

### 8.3 Firebase Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **No Crashlytics** | HIGH | Zero crash reporting in production |
| **No Analytics** | HIGH | No user behavior tracking, no funnel analysis |
| **FCM token not refreshed** | MEDIUM | `SyncFcmHandler` stores FCM token in SharedPreferences, but no listener for token refresh |
| **Firebase init can fail silently** | MEDIUM | `isFirebaseInitialized` flag gates auth, but app continues without push notifications |

---

## 9. Security

### 9.1 Security Layers

| Layer | Implementation | Status |
|-------|---------------|--------|
| **Transport** | HTTPS + Certificate Pinning (SHA-256) | Implemented |
| **Authentication** | Firebase Auth + JWT Bearer token | Implemented |
| **Device Binding** | Hardware fingerprint comparison on server | Implemented |
| **Root Detection** | `HardwareService.isRooted()` → `SecurityController` | Implemented |
| **Biometric Lock** | `local_auth` with 15s timeout + bypass detection (<350ms) | Implemented |
| **Time Integrity** | Virtual monotonic clock + auto-time check | Implemented |
| **Hardware Keypair** | Android KeyStore / iOS Secure Enclave enrollment | Phase 1 only (local) |
| **Anti-Replay** | CryptoEnvelope with monotonic timestamp | Implemented |
| **Force Logout** | Server-driven session termination → scorched-earth wipe | Implemented |
| **Encrypted Storage** | Hive AES encryption + FlutterSecureStorage | Implemented |

### 9.2 Security Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **HW key enrollment Phase 2 incomplete** | HIGH | `KeyEnrollmentService.synchronizeWithServer()` is a no-op — public key never sent to server |
| **No rate limiting on client** | MEDIUM | Auth endpoints have no client-side rate limiting beyond Firebase's `too-many-requests` |
| **Timezone hardcoded to India** | MEDIUM | `_isIndiaTimezone()` checks `offsetMin == 330` — won't work for international deployment |
| **Scorched earth can fail silently** | MEDIUM | `executeScorchedEarth()` wraps everything in try-catch — if server report fails, local wipe still happens but server is unaware |
| **No input validation** | LOW | Models accept server data without validation — `fromJson` trusts all fields |
| **Debug logs leak sensitive data** | LOW | `AuthInterceptor` logs token length, device ID, email — should be stripped in release |

---

## 10. SmartBoard Integration

### 10.1 SmartBoard Communication Model

```
Faculty App → starts session → Backend returns OTP
Faculty App → OTP displayed on SmartBoard (manual entry or QR scan)
SmartBoard → connects to Backend via WebSocket
Backend → pushes rotating QR tokens to SmartBoard every 5s
SmartBoard → displays QR for students to scan
```

### 10.2 SmartBoard Components

| File | Purpose |
|------|---------|
| `smart_board_controller.dart` | State for SmartBoard pairing (OTP, connection status) |
| `smart_board_screen.dart` | UI for displaying QR code / entering OTP |
| `board_readiness_notifier.dart` | Tracks which slots have active SmartBoard connections |

### 10.3 SmartBoard Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **SmartBoard is a web app, not Flutter** | INFO | The SmartBoard is a separate Vanilla JS web application — this audit covers only the Faculty App's interaction with it |
| **No automatic pairing** | MEDIUM | Faculty must manually enter OTP on SmartBoard — no QR scan from phone to board |
| **Board readiness is fire-and-forget** | LOW | `BoardReadinessNotifier` tracks readiness but doesn't handle board disconnect mid-session |

---

## 11. Engine (Timetable State Machine)

### 11.1 Timetable Architecture

```
TimeSource → provides InstitutionalTime (day, minutes, seconds)
TimetableEvaluator → evaluates blocks against current time
TimetableController → 1-second tick → evaluates → notifies UI
TimetableSnapshot → immutable state: phase, subject, countdown, etc.
```

### 11.2 Phases

```
IDLE          → No class scheduled now
PREPARING     → Class starts in 10 minutes (countdown)
CURRENT       → Class is ongoing
BREAK         → Between classes
UPCOMING_TODAY → Next class today
UPCOMING_TOMORROW → No more today, next is tomorrow
END_OF_DAY    → All classes done
```

### 11.3 Engine Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **Legacy wrapper exists** | LOW | `TimetableStateMachine` wraps `TimetableEvaluator` — should be removed |
| **1-second timer always running** | LOW | `Timer.periodic(1s)` even when app is backgrounded — `WidgetsBindingObserver` re-evaluates on resume but timer still ticks |
| **Dependency on shared package** | INFO | `intelli_attend_shared` provides core types — external Git dependency |

---

## 12. Presentation Layer

### 12.1 Widget Inventory

**Reusable Widgets (9):**
- `AppDrawer` — Navigation drawer
- `CustomSlidingNavBar` — Custom bottom navigation bar
- `DynamicPulseDot` — Animated status indicator
- `FingerprintScanOverlay` — Biometric scan animation
- `OnboardingTooltip` — Feature discovery tooltip
- `PremiumClockBadge` — Time display badge
- `RollingDigit` — Animated number transition
- `SkeletonLoader` — Loading skeleton placeholder
- `SliderButton` — Slide-to-confirm gesture

**Feature Screens (55):**

| Module | Screens | Key Complexity |
|--------|---------|---------------|
| Auth | 7 | Login, registration (3-step), lock, compromised device, auth gate |
| Faculty | 16 | Dashboard, live monitor, smart board, timetable, settings, devices |
| Reports | 16 | Main screen + 14 tab components (overview, analytics, eligibility, defaulters, etc.) |
| My Class | 7 | Class overview, mark attendance, history, export, messaging |
| Resources | 2 | File management with upload/download/preview |
| Notifications | 2 | Notification list + detail |
| Profile | 2 | Profile view + QR scanner |
| Courses | 1 | Course listing |
| Students | 1 | Student directory |
| Analytics | 1 | Live + historical charts |
| Assignments | 2 | Create + submissions |
| Support | 4 | About, help, chat, report issue |

### 12.2 Presentation Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **Reports has 16 files** | HIGH | `reports_screen.dart` (1268 lines) + `reports_controller.dart` (1065 lines) + 14 components — this single module is larger than many entire apps |
| **No screen-level state management** | MEDIUM | Screens directly call `Provider.of` and static singletons — no per-screen controllers |
| **No widget testability** | HIGH | No interfaces, no dependency injection for services — widgets cannot be unit tested in isolation |
| **Mixed naming conventions** | LOW | `Features/Faculty/Components/` vs `Features/Reports/Components/` — inconsistent capitalization |
| **No responsive layout system** | MEDIUM | No `LayoutBuilder` or breakpoint system — tablet/landscape behavior undefined |

---

## 13. Offline Behavior

### 13.1 Offline Capabilities

| Feature | Offline Support | Mechanism |
|---------|----------------|-----------|
| Dashboard | YES | Cache-first via `FacultyService.loadFromCache()` |
| Schedule | YES | `CourseRepository` emits cached schedule before server refresh |
| Student Roster | YES | `FacultyHydrationService` persists rosters to Hive |
| Attendance Session | PARTIAL | Cannot start new session offline (requires server) |
| Manual Mark | NO | Requires API call to server |
| Reports | YES | `ReportsService` has cache fallback |
| Resources | NO | All operations require network |
| Notifications | YES | History persisted to Hive |

### 13.2 Offline Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **No offline queue** | HIGH | No mechanism to queue operations (manual mark, resource upload) for later sync |
| **No connectivity listener** | MEDIUM | `connectivity_plus` is a dependency but not used for automatic sync triggers |
| **Cache staleness undefined** | MEDIUM | No TTL on cached data — user may see stale schedule/roster indefinitely |
| **No conflict resolution** | HIGH | If offline changes conflict with server, no merge strategy exists |

---

## 14. Error Handling

### 14.1 Error Pipeline

```
Exception thrown in Repository/Service
  ↓
ErrorHandler.sanitize(error) — maps to AppError (title, message, icon)
  ↓
ErrorHandler.showVisualError(context, error) — shows bottom sheet
```

### 14.2 Error Types Handled

| Error Source | Handling |
|-------------|----------|
| `FirebaseAuthException` | Maps specific codes (user-not-found, wrong-password, too-many-requests, etc.) |
| `FirebaseException` | Maps permission-denied, unavailable |
| `DioException` | Maps timeout, connection error, 403 |
| Generic exceptions | Sanitized to generic error message |

### 14.3 Error Handling Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **No retry UX** | MEDIUM | Error bottom sheet has "Try Again" button that only dismisses the sheet — no actual retry logic |
| **No error boundary** | HIGH | No `ErrorWidget.builder` override — unhandled exceptions show red screen |
| **Silent failures** | HIGH | Many catch blocks swallow errors with `debugPrint` only (e.g., `executeScorchedEarth`, `TimeSyncService`) |
| **Inconsistent error propagation** | MEDIUM | Some repositories throw exceptions, others return null, others return error maps |

---

## 15. Performance

### 15.1 Startup Optimization

The app implements a **dual-track bootstrap** for fast startup:

- **Track A (~100ms):** Hive + SharedPreferences only → dashboard renders from cache
- **Track B (background):** Firebase, remaining Hive boxes, notifications, time sync, key enrollment

### 15.2 Performance Assessment

| Issue | Severity | Details |
|-------|----------|---------|
| **No lazy list rendering** | MEDIUM | Large lists (students, reports) use `ListView.builder` but no pagination |
| **Image caching** | LOW | `cached_network_image` dependency exists but usage varies by screen |
| **No `RepaintBoundary`** | MEDIUM | Only `SecurityOverlay` uses `RepaintBoundary` — other complex widgets don't |
| **HardwareService caches 30s** | GOOD | Device snapshot cached for 30s to avoid repeated native bridge calls |
| **FacultyHydrationService cache-first** | GOOD | Skips server call if manifest hash matches and cohorts exist |
| **No frame rate monitoring** | LOW | No `SchedulerBinding.instance.addTimingsCallback` for jank detection |

---

## 16. Current Limitations

### 16.1 Functional Limitations

| Limitation | Impact |
|-----------|--------|
| **Faculty-only app** | Student app, HOD app, Admin app not implemented |
| **No offline queue** | Operations lost if network fails during critical actions |
| **No deep linking** | Cannot share links to specific screens |
| **No multi-language** | English only — hardcoded strings throughout |
| **No dark/light auto-switch** | Manual toggle only — no system theme following |
| **No tablet optimization** | Phone-only layout — no responsive breakpoints |
| **No landscape support** | `portraitUp` + `portraitDown` only via `SystemChrome.setPreferredOrientations` |

### 16.2 Technical Limitations

| Limitation | Impact |
|-----------|--------|
| **No crash reporting** | Zero visibility into production crashes |
| **No analytics** | No user behavior data |
| **No feature flags** | Cannot toggle features remotely |
| **No A/B testing** | No experimentation framework |
| **No CI/CD pipeline** | Only PR check (blocks protected paths) — no build/test/deploy |
| **No code generation** | All serialization is manual `fromJson`/`toJson` — no `json_serializable` or `freezed` |

---

## 17. Technical Debt

### 17.1 Critical Debt

| Item | Severity | Effort | Description |
|------|----------|--------|-------------|
| `FacultyService` god class | CRITICAL | HIGH | 529 lines handling auth, profile, stats, cache, sync — needs decomposition |
| `reports_screen.dart` + `reports_controller.dart` | CRITICAL | HIGH | 2,333 combined lines — needs extraction into sub-modules |
| No repository interfaces | HIGH | MEDIUM | Only `IAuthRepository` exists — no testability for other repos |
| Static singletons everywhere | HIGH | HIGH | `FacultyService`, `AttendanceService`, `EligibilityService`, `BoardReadinessNotifier` — untestable, unscopeable |
| No migration strategy | HIGH | MEDIUM | Hive box schema changes will corrupt user data |
| RetryInterceptor creates new Dio | HIGH | LOW | Bypasses interceptors on retry — security headers lost |

### 17.2 Moderate Debt

| Item | Severity | Effort | Description |
|------|----------|--------|-------------|
| Duplicate error handling in interceptors | MEDIUM | LOW | Both `AuthInterceptor` and `SecurityInterceptor` handle 401/403 |
| `_parseLegacyTime` duplicated 3x | MEDIUM | LOW | In `OverrideSlot`, `ScheduledClass`, `CourseRepository` |
| `ApiClient` singleton confusion | MEDIUM | LOW | Factory constructor calls `_init` every time but `_baseUrl.isNotEmpty` guard prevents re-init |
| No `@immutable` on models | LOW | LOW | All model classes are immutable in practice but not annotated |
| Mixed `debugPrint` and `print` | LOW | LOW | Should standardize on `debugPrint` only |

### 17.3 Minor Debt

| Item | Description |
|------|-------------|
| `.env` file not in `.gitignore` | `.env` should be excluded from version control |
| `PullDownOnlyPhysics` in theme file | Utility physics class doesn't belong in `app_theme.dart` |
| `SystemClockTimeSource` marked legacy | Still present, should be removed |
| Default counter test is broken | `test/widget_test.dart` references `MyApp` which doesn't exist |
| No asset registration | `assets/fonts/` and `assets/images/` have `.gitkeep` only |

---

## 18. Dependency Analysis

### 18.1 External Dependencies

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `intelli_attend_shared` | git (school-main) | Core types (TimetableSlot, TimeSource, etc.) | HIGH — external Git dependency, no version pinning |
| `dio` | ^5.3.3 | HTTP client | LOW — mature package |
| `provider` | ^6.0.5 | State management | LOW — mature package |
| `hive` / `hive_flutter` | ^2.2.3 | Local database | MEDIUM — no TypeAdapters used, all dynamic |
| `firebase_auth` | ^5.1.1 | Authentication | LOW — official Firebase package |
| `firebase_messaging` | ^15.0.0 | Push notifications | LOW — official Firebase package |
| `local_auth` | ^2.1.8 | Biometric auth | LOW — official Flutter package |
| `mobile_scanner` | ^3.5.2 | QR scanning | MEDIUM — camera permissions, performance varies |
| `syncfusion_flutter_charts` | ^26.1.35 | Charts | MEDIUM — large package, licensing concerns for enterprise |
| `flutter_secure_storage` | ^9.2.4 | Encrypted storage | LOW |
| `crypto` | ^3.0.3 | SHA-256 hashing | LOW |
| `connectivity_plus` | ^6.0.3 | Network status | LOW — dependency exists but barely used |

### 18.2 Missing Dependencies

| Package | Purpose |
|---------|---------|
| `json_serializable` | Auto-generated serialization |
| `freezed` | Immutable model classes |
| `go_router` or `auto_route` | Declarative routing |
| `dio_smart_retry` | Better retry logic |
| `flutter_bloc` or `riverpod` | More robust state management |
| `mockito` or `mocktail` | Test mocking |
| `dio_http2_adapter` | HTTP/2 support |

---

## 19. Summary Scores

| Category | Score | Key Finding |
|----------|-------|-------------|
| **Architecture** | 6/10 | Clean Architecture intent is clear but inconsistently enforced |
| **State Management** | 4/10 | Mixed patterns, static singletons, no testability |
| **Security** | 8/10 | Exceptionally thorough for a university app — root detection, HW keys, time sync, cert pinning |
| **Networking** | 7/10 | Well-structured Dio setup, but retry interceptor flaw and auth race conditions |
| **Caching** | 7/10 | Two-track bootstrap is excellent, but no migration strategy |
| **Error Handling** | 5/10 | Good error sanitization, but silent failures and no retry UX |
| **Testing** | 1/10 | Zero tests (default counter test is broken) |
| **Performance** | 7/10 | Dual-track startup is fast, but no lazy loading or pagination |
| **Offline Support** | 5/10 | Cache-first is good, but no queue or conflict resolution |
| **Code Quality** | 5/10 | Good naming, but god classes and duplicated logic |
| **Documentation** | 4/10 | Good inline docs, but out-of-date README references PostgreSQL |
| **CI/CD** | 2/10 | Only PR path protection — no build, test, or deploy pipeline |

**Overall: 5.2/10 — Solid foundation with strong security, but needs significant refactoring for production scale.**

---

## 20. Recommendations Priority Matrix

### P0 — Must Fix Before Production

1. **Add Crashlytics + Analytics** — Zero visibility into crashes
2. **Fix RetryInterceptor** — Creates new Dio without interceptors
3. **Add ErrorWidget.builder** — Unhandled exceptions show red screen
4. **Add Hive migration strategy** — Schema changes corrupt data

### P1 — High Priority

5. **Decompose FacultyService** — Split into ProfileService, AuthService, SyncService
6. **Add repository interfaces** — For testability
7. **Replace static singletons** — Move to Provider tree
8. **Add offline queue** — For manual attendance marks
9. **Add pagination** — For large student/roster lists

### P2 — Medium Priority

10. **Implement declarative routing** — Named routes, deep linking
11. **Add responsive layout** — Tablet/landscape support
12. **Add code generation** — `json_serializable` + `freezed` for models
13. **Complete HW key enrollment Phase 2** — Server-side key registration
14. **Add unit tests** — Minimum 80% coverage on repositories and services

### P3 — Low Priority

15. **Multi-language support**
16. **System theme following**
17. **Custom route transitions**
18. **Asset registration**
19. **Remove legacy wrappers** (`TimetableStateMachine`, `PullDownOnlyPhysics` in theme)
