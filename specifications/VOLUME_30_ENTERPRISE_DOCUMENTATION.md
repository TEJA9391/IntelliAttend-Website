# VOLUME 30 — ENTERPRISE DOCUMENTATION (Faculty Mobile App)

> **Product:** IntelliAttend Faculty Mobile Application
> **App package:** `com.intelliattend.faculty`
> **Repo:** `IntelliAttend-Faculty-Mobile-App` (Flutter, branch `teja-dev`)
> **Companion docs:** VOLUME_01–29, MASTER_ARCHITECTURE.md, ARCHITECTURE_AUDIT.md
> **Scope of this volume:** End-to-end documentation of every screen, module, API, service, repository, model, controller, and runtime flow — compiled from full source analysis of the Flutter client.

---

## 1. Product Overview

IntelliAttend Faculty is the faculty-facing companion of the IntelliAttend smart-campus platform. It enables faculty members to:

- Sign in with an `@mrcet.ac.in` university email via Firebase Auth (email/password + OTP registration).
- View a personalized **Home dashboard** with today's class schedule, attendance analytics, and quick actions.
- Manage **My Class** — multiple course sections across academic years, each with roster management, student marking, and attendance workflows.
- Conduct **live attendance sessions** driven by a realtime WebSocket server + optional smart-board QR scanning.
- Browse **Courses & Resources** — syllabus, uploaded materials, student marks, and per-student profiles.
- **Message students** — one-to-one chats, group/conversation sync, presence, typing indicators, read receipts, and media attachments (images/audio/video).
- Generate **Reports** (PDF/Excel/CSV export) for analytics, attendance, results, and performance.
- Manage **Profile, Settings, Security** (biometric lock, sessions, device management) and **Support**.

### Platform facts
| Item | Value |
|---|---|
| Framework | Flutter (Dart), Material Design |
| Target OS | Android (primary), iOS configured |
| State management | Provider (`ChangeNotifier` graph) + `ValueNotifier` hot lists |
| Local storage | Hive (AES-256 encrypted boxes) + `SharedPreferences` + `flutter_secure_storage` |
| Auth | Firebase Auth (email/password) + backend session/device binding |
| Realtime | WebSocket (`wss://`) for attendance + messaging |
| Notifications | Firebase Cloud Messaging + `flutter_local_notifications` |
| Charts/Export | Syncfusion charts, PDF, Excel, CSV, printing |

---

## 2. System Architecture

### 2.1 Layered client architecture
```
┌────────────────────────────────────────────────────────────┐
│ PRESENTATION (lib/Presentation)                            │
│   Features/*/screens + widgets, AppShell (bottom nav),     │
│   Theme (ThemeController, ThemeMode.system), routing       │
├────────────────────────────────────────────────────────────┤
│ STATE (Controllers)                                       │
│   DashboardController, ClassController, ChatController,   │
│   BoardReadinessNotifier, SecurityController,             │
│   NotificationsController, SyncController (etc.)          │
├────────────────────────────────────────────────────────────┤
│ DATA (lib/Data)                                           │
│   Repositories (AuthRepository, CourseRepository,         │
│   OverrideRepository, ChatRepository, ...)                │
│   Models (serialization DTOs)                             │
├────────────────────────────────────────────────────────────┤
│ SERVICES (lib/Services)                                   │
│   FacultyService, FacultyHydrationService, HardwareService,│
│   KeyEnrollmentService, SecurityService, TimeSyncService,  │
│   WebSocketService, PermissionService, PersistenceService, │
│   NotificationService, SyncFcmHandler, SessionMgmt, ...   │
├────────────────────────────────────────────────────────────┤
│ CORE (lib/Core)                                           │
│   Network (ApiClient/Dio interceptors), Security (QR,     │
│   crypto envelope), Models, ErrorHandler, Theme           │
└────────────────────────────────────────────────────────────┘
```

### 2.2 Key runtime components
- **ApiClient** — Dio wrapper, per-env base URL, interceptor stack (see §9).
- **UnifiedAuthGate** — boot sequence: Hive init → Firebase ready → security check → route to login/registration/dashboard.
- **AppShell / DashboardController** — bottom navigation host + dashboard state.
- **SecurityController** — root security state machine (lock, biometric, compromised detection).
- **WebSocketService** — single shared socket for attendance + messaging.
- **TimeSyncService** — server-anchored monotonic clock ("Virtual Secure Clock").
- **FacultyService** — global faculty profile/roster state holder.

---

## 3. Auth Module (`lib/Presentation/Features/Auth/`)

### 3.1 Screens & flows

| Screen | File | Purpose |
|---|---|---|
| UnifiedAuthGate | `unified_auth_gate.dart` | Boot gate: Hive + Firebase init, splash, decision tree → login/registration/dashboard |
| LoginScreen | `login_screen.dart` | Email/password login, forgot-password, `@mrcet.ac.in` enforcement, remember-email |
| RegistrationScreen | `Registration/registration_screen.dart` | Step 1: email + OTP send |
| OtpScreen | `Registration/otp_screen.dart` | Step 2: 6-digit OTP boxes, auto-advance, resend cooldown |
| SetPasswordScreen | `Registration/set_password_screen.dart` | Step 3: set password, complete registration, bind device |
| LockScreen | `lock_screen.dart` | Biometric unlock overlay (tap to authenticate) |
| CompromisedDeviceScreen | `compromised_device_screen.dart` | Terminal "security policy violation" screen (blocks back, exits app) |

### 3.2 Auth decision tree
```
UnifiedAuthGate boot:
  Firebase ready? ──no──▶ splash (wait)
        │yes
  FacultyService.isRegistered? ──no──▶ RegistrationScreen (or LoginScreen)
        │yes
  SecurityController.state == ready? ──no──▶ LockScreen (biometric)
        │yes
  Dashboard (AppShell)
```

### 3.3 Registration flow
1. **RegistrationScreen** validates `@mrcet.ac.in` → `POST /api/v1/auth/register/send-otp` (via `AuthRepository.sendOtp`).
2. **OtpScreen** collects 6 digits (client-side only — no server verify), forwards to SetPasswordScreen.
3. **SetPasswordScreen._handleComplete():**
   - Validate password ≥ 6 chars + match.
   - `HardwareService.getDeviceSnapshot()` → `DeviceInfoPayload`.
   - `checkAuthStatus()` → userId (from `POST /api/v1/auth/status`).
   - `completeRegistration(RegistrationCompleteRequest(userId, otp, password, deviceInfo))` → `POST /api/v1/auth/register/complete`.
   - On success: `verifySession()` (non-blocking), `PermissionService().requestAll()`, `FacultyService.loadBaseProfile()`, `is_logged_in = true`, navigate to `/`.

### 3.4 Login flow
1. Validate email non-empty + `@mrcet.ac.in` suffix.
2. `AuthRepository.signIn(email, password)` → `FirebaseAuth.signInWithEmailAndPassword`.
3. Save `last_login_email`.
4. `FacultyService.executeAuthFlow(authRepo)` — hydration + backend validation.
5. `flowError != null` → `authRepo.signOut()` + inline error.
6. `FacultyService.isRegistered.value` → dashboard; else → RegistrationScreen.

### 3.5 Repository: `lib/Data/Repositories/auth_repository.dart`
`IAuthRepository` interface + `AuthRepository(ApiClient)` holding `FirebaseAuth.instance`.

| Method | Endpoint / Action |
|---|---|
| `checkAuthStatus()` | `POST /api/v1/auth/status` `{token}` → `AuthStatusResponse` |
| `sendOtp()` | `POST /api/v1/auth/register/send-otp` |
| `completeRegistration(req)` | `POST /api/v1/auth/register/complete` |
| `verifySession(deviceInfo)` | `POST /api/v1/auth/verify-session` (adds `fcm_token` if cached) |
| `signIn(email, password)` | Firebase `signInWithEmailAndPassword` |
| `signOut()` | Firebase `signOut()` |
| `changePassword(old, new)` | reauth + `updatePassword` |
| `getCurrentUser()` | Firebase currentUser |

### 3.6 Auth models (`lib/Data/Models/Auth/`)
- **AuthStatusResponse** — `auth_status`, `name`, `role`, `user_id`; getters `isActive`/`isPending`/`isNotFound`.
- **VerifySessionResponse** — `status`, `auth_status`, `error_code`, `message`; getters `isAuthenticated`/`isDeviceMismatch`/`isDeviceMissing`/`isRegistrationRequired`.
- **RegistrationCompleteRequest** — `user_id`, `otp`, `password`, `device_info`.
- **RegistrationCompleteResponse** — `status`, `profile`, `error`, `errorCode`; handles FastAPI-style `detail`.
- **DeviceInfoPayload** — device snapshot (snake_case JSON).
- **AuthSession** (`auth_session_model.dart`) — session DTO for session-management screens; aliases `session_id`/`jti`, `is_current_device`/`is_current`, `location`/`city`, etc.

---

## 4. App Shell & Navigation

### 4.1 Structure
- `MaterialApp(home: UnifiedAuthGate())` — **no named routes registered**; `pushNamedAndRemoveUntil('/', ...)` / `'/login'` referenced by LoginScreen/_DashboardGate (latent risk flagged — widget-based gate is the actual path).
- **AppShell** hosts bottom navigation with the primary tabs (Home, My Class, Courses, Messaging, Reports/Profile).

### 4.2 Known navigation facts
- Dashboard reached via widget-based `_DashboardGate` after login.
- LockScreen shown as full-screen overlay over the absorbed navigator (modal barrier style).
- CompromisedDeviceScreen uses `PopScope(canPop: false)` + `SystemNavigator.pop()`.

---

## 5. Home Dashboard Module (`lib/Presentation/Features/dashboard/` + controllers)

### 5.1 Controller
`DashboardController extends ChangeNotifier` — owns home state:
- Today's schedule / class list for the day.
- Attendance analytics aggregates (overall %, today's stats).
- Quick actions state; loading/error states per section.

### 5.2 Screens
- **DashboardScreen** — greeting + profile header, stat cards, today's class timeline, quick action grid.
- **Home components** — schedule tiles, class cards with cohort/year/section labels, attendance widgets.
- Loads from `GET /api/v1/faculty/sync` payload via `FacultyService`/`FacultyHydrationService`, with Hive-backed caching for offline.

### 5.3 Notifications controller
- `NotificationsController` — unread count + history via `NotificationService` (`ValueNotifier<List<AppNotification>>`).

---

## 6. My Class Module (`lib/Presentation/Features/my_class/`)

### 6.1 Overview
Displays all course sections for the faculty member, grouped by cohort (year × department section). Supports horizontal page swipe between classes + a chip row for quick switching.

### 6.2 Screens
| File | Purpose |
|---|---|
| `my_class_screen.dart` | Main class screen — cohort carousel/pages, chip row, overview card, roster list |
| `class_roster_screen.dart` | Roster of students with attendance state |
| `student_card_widgets.dart` | Student row widgets (avatar, name, roll, state) |
| `my_class_screen_helpers.dart` | Cohort/date helper logic |

### 6.3 Key UI behaviors (from recent implementation)
- **Chip row** (`_buildChipRow`): horizontal `ListView` of 40px chips labeled `"{_yearText} {_deptSectionText}"` (e.g. "4th Year AIML-A"), active chip teal-highlighted, tap → `animateToPage` (300ms). Auto-scrolls to selected chip via `GlobalKey`s + `Scrollable.ensureVisible(alignment: 0.5)`.
- **Carousel/page view**: one page per cohort; page cached in `Map<int, Widget> _classPageCache` (`_cachedClassPage` via `putIfAbsent`) to eliminate rebuild lag; cache cleared on roster/cohort load **and on theme brightness change** (fixed stale-theme bug).
- **Overview card** ("CLASS TEACHER"): uses `_yearText(cohort)` + `_deptSectionText(cohort)`; mini-stat shows `_sectionLetter` with label "Section".
- **Header helpers**:
  - `_yearText` — parses `year_of_study`/`year`/`section_name` patterns (`CSE_AIML_4A` → "4th Year") via regex `(?:^|[_\- ])(\d{1,2})([A-Za-z])\s*$`.
  - `_deptSectionText` — `_deptShortCode` (skips "and/of/the"; "Artificial Intelligence and Machine Learning" → "AIML") + `_sectionLetter` (from `section_name`/`section_id`).
  - `_ordinal` — 1→"1st" … 4→"4th".

### 6.4 Data flow
- `_loadCohorts()` — fetch cohorts/sections for the faculty member (from sync payload / API), regenerate chip keys.
- `_loadRoster()` — fetch class roster per cohort; clear page cache; scroll chips to selected.
- Backend real data example (device logs): `section_id: "CSE-AIML-A_2026"`, `section_name: "CSE_AIML_4A"`, `course_code: "R22A6201"`, `course_name: "Cyber Security Essentials"`, `semester: "I-Sem"`, `academic_year: "2026-27"`.

---

## 7. Courses & Resources Module

### 7.1 Courses
- **CoursesScreen** (`courses_screen.dart`) — lists courses for the faculty member with course code/name, section, semester.
- **CourseRepository** (`lib/Data/Repositories/course_repository.dart`) — fetches course + resource data; backed by `GET /api/v1/faculty/sync` and per-course endpoints; Hive caching via `PersistenceService`.

### 7.2 Resources
- **ResourcesScreen / ResourcesController** (`resources_screen.dart`, `ResourcesController`) — materials per course (docs, links), upload/download, offline cache. `ResourcesController` is lazily instantiated (after unlock) in the provider graph.
- Files: `resources_screen.dart`, resource tile/widget files.

### 7.3 Class/Student profile
- **ClassStudentProfileScreen** (`class_student_profile_screen.dart`) — per-student detail: profile, marks, attendance history, messaging shortcut.

---

## 8. Attendance Module

### 8.1 Components
| File | Purpose |
|---|---|
| `mark_attendance_screen.dart` | Manual attendance marking UI for a session/class |
| `attendance_session_screen.dart` | Live session screen (WebSocket-driven status, counters) |
| `attendance_records_screen.dart` | Historical attendance records & filters |
| `attendance_history_screen.dart` | Per-student attendance history |

### 8.2 Mark attendance flow
1. Select session/class → scan QR or manual mark.
2. **QR path:** `SecurityController.verifyIntegrityOnScan()` → `QrSecurityController.validate()` (local pre-validation: `IATT` prefix, v7 token decode, ≤7000ms drift) → server validates HMAC/GPS → WebSocket `mark_attendance` ack → UI state update via `AttendanceUpdateData` events.
3. **Manual path:** tap student → send mark via WebSocket (`sendMarkAttendance`) → `AttendanceMarkAckData` response.
4. State updates propagate through `WebSocketService.events` → controllers refresh roster state (`total_present`/`total_students` via `FacultySyncData`/`FullStateSyncData`).

### 8.3 Realtime event types (attendance domain)
`attendanceUpdate, studentMarked, sessionPreparing, sessionIgniting, attendanceOpen, studentVerified, studentRejected, attendanceMarkedManual, attendanceUpdated, attendanceClosed, sessionArchived, fullStateSync, facultySync, boardConnected, sessionActivated, otpVerified, otpFailed, markAttendanceAck`.

### 8.4 Offline attendance
- `offline_attendance` Hive box + queue → synced when connectivity returns (`FacultyHydrationService.syncIfNeeded()` on app resume / FCM `SILENT_SYNC_PING`).

---

## 9. API Layer (`lib/Core/Network/api_client.dart`)

### 9.1 Configuration
- **Base URL:** `.env` `API_BASE_URL` → `https://api.intelliattend.app`; fallback `https://api-dev.balaseetharamanjaneyulu.com`.
  - ⚠️ Race: `ApiClient._init` can bind the dev URL before `dotenv.load()` finishes (first-frame ordering); `updateBaseUrl` (Settings screen) mitigates manually.
- **Dio:** 15s connect + 15s receive timeouts.
- **Interceptor order:** `RetryInterceptor` → `AuthInterceptor` → `SecurityInterceptor` → `LogInterceptor` (non-release only).
- **Cert pinning:** allowlist from `.env` `PINNED_CERT_FINGERPRINTS`; empty in shipped env → "soft pinning" (release: callback rejects unknown certs, OS validation still applies; debug: all accepted).
- **Headers:** `AuthInterceptor` attaches Firebase ID token; `SecurityInterceptor` attaches device-identity headers (`X-Device-ID`, fingerprint) and handles 401/403 keyword-based revocation.

### 9.2 Endpoint inventory (client-side)
| Method | Path | Caller |
|---|---|---|
| POST | `/api/v1/auth/status` | AuthRepository.checkAuthStatus |
| POST | `/api/v1/auth/register/send-otp` | AuthRepository.sendOtp |
| POST | `/api/v1/auth/register/complete` | AuthRepository.completeRegistration |
| POST | `/api/v1/auth/verify-session` | AuthRepository.verifySession |
| GET | `/api/v1/auth/sessions` | SessionManagementService.getActiveSessions |
| DELETE | `/api/v1/auth/sessions/{sessionId}` | SessionManagementService.revokeSession |
| GET | `/api/v1/time` | TimeSyncService.bootstrap |
| GET | `/api/v1/faculty/sync` | FacultyService, FacultyHydrationService, CourseRepository, OverrideRepository, reports_service, timetable |
| POST | `/api/v1/faculty/device/compromised` | SecurityController.executeScorchedEarth |
| POST | `/api/v1/faculty/device/fcm-token` | SyncFcmHandler._uploadFcmToken |
| POST | `/api/v1/faculty/enrollment` | KeyEnrollmentService.synchronizeWithServer (TODO) |
| WS | `/ws?session_id={id}&token={fbToken}&token_type=firebase` | WebSocketService |

*(Full API reference incl. attendance/messaging/courses/reports endpoints: see VOLUME_04 + backend service docs.)*

---

## 10. Messaging Module

### 10.1 Overview
Real-time chat between faculty and students. Backed by WebSocket (`wss://`) + REST fetch, with Hive persistence (`messaging`, `chat_messages` boxes).

### 10.2 Components
- **ChatRepository / ChatController** — conversation list + messages state.
- **ChatScreen / ConversationScreen** — message bubbles, input bar, attachments (image/audio/video), reply-to, emoji picker.
- **Recording** via `record` package; playback via `audioplayers`; video via `video_player`.
- **Deep links:** conversation push handled via payload from FCM/local notifications.

### 10.3 WebSocket messaging events
`messageNew, messageAck, messageRead, messageDelivered, messageEdited, messageDeleted, messagePinned, typing, presenceUpdate, callEvent, conversationSync`.

### 10.4 Send/control payloads (WebSocketService)
| Method | Message type | Key payload |
|---|---|---|
| `sendChatMessage` | `chat_message` | conversation_id, message_id, local_id, text, message_type, attachments, reply_to_message_id, sender_id |
| `sendTyping` | `typing` | conversation_id, is_typing, sender_id |
| `sendReadReceipt` | `message_read` | conversation_id, message_ids, reader_id |
| `sendPresence` | `presence_update` | sender_id, is_online |
| `sendCallSignal` | `call_event` | conversation_id, call_id, action, sender_id, payload? |

---

## 11. Reports, Profile, Settings, Support

### 11.1 Reports Module
- Screens: analytics, attendance reports, results/performance, export.
- **Export:** PDF (`pdf` + `printing`), Excel (`excel`), CSV (`csv`); charts via Syncfusion.
- **Reports service** pulls from `/api/v1/faculty/sync` + domain endpoints; full detail in VOLUME_23.

### 11.2 Profile Module
- Profile screen (avatar, department, contact), edit profile, change password, active sessions (`SessionManagementService`), device management.
- Department example: "Artificial Intelligence and Machine Learning" → short code "AIML".

### 11.3 Settings Module
- Theme mode (light/dark/system) via `ThemeController` (persisted), notifications toggle, security (biometric lock), API base URL override (`updateBaseUrl`), data reset (`clearAllData`), about/version. Full detail in VOLUME_24.

### 11.4 Support Module
- Help/FAQ, contact support, report an issue (surfaces into admin/reporting channels).

---

## 12. Security Architecture (`lib/Core/Security/` + `lib/Core/Services/security_controller.dart`)

### 12.1 SecurityController state machine
`SecurityState { checking, permissionsMissing, authenticating, ready, compromised }`
- App starts **unlocked**; locks only when biometric lock is enabled.
- **Lifecycle:** on `pause/hidden/inactive` → lock if biometric enabled (skips during auth/camera); on `resumed` → clear hardware cache, re-check permissions, compensate time drift, security audit.
- **Permission pillars:** only **notification** permission is required (`arePermissionsOk`).

### 12.2 Biometric authentication
`authenticate()` via `local_auth` (`AuthenticationOptions(stickyAuth: true, biometricOnly: false, useErrorDialogs: true)`, 15s timeout). **Bypass detection:** successful auth < 350ms treated as bypass → stays locked.

### 12.3 Root/compromise detection
- `_performInitialSecurityCheck()`: `isRooted` → `_isCompromised = true`, reason `SEC_ROOT_DETECTED`, `executeScorchedEarth()`.
- `verifyIntegrityOnScan()`: re-checks before QR attendance (reason `SEC_ROOT_DETECTED_SCAN`).
- India-timezone check: `DateTime.now().timeZoneOffset.inMinutes == 330`.

### 12.4 Scorched-earth logout (`executeScorchedEarth(reason)`)
1. Collect monotonic uptime + deviceId; if keypair exists → sign `'$reason:$monotonic'`.
2. `POST /api/v1/faculty/device/compromised` with body `{email, device_id, reason, monotonic_timestamp_ms, nonce_or_pill_id, signature}` + `X-Device-ID` header.
3. Firebase sign-out → `HardwareService.deleteKeyPair()` → `KeyEnrollmentService.revoke()`.
All wrapped in swallow-error try/catch.

### 12.5 QR protocol (`QrSecurityController` / v7 tokens)
- Prefix `IATT`; v7 token = 33 chars `IATT::...`; Base64URL → exactly 20 bytes → `sidHashHex` (bytes 0–5) + big-endian timestamp.
- Drift > 7000ms → `TOKEN_EXPIRED`; invalid format → `INVALID_QR_FORMAT`.
- Local pre-validation only; HMAC/GPS are server-authoritative. Full protocol: VOLUME_07.

### 12.6 CryptoEnvelope (`crypto_envelope.dart`)
Tamper-evident payload `{signature, public_key, monotonic_timestamp}`; `signingPayload = '$monotonicTimestamp|$publicKey'`.

### 12.7 Hardware binding
- `HardwareService` — device snapshot (fingerprint, monotonic time, keypair), screen-lock state.
- `KeyEnrollmentService` — keypair generation + server enrollment (`POST /api/v1/faculty/enrollment`, TODO).
- `credential_service.dart` — secure-storage remember-me/auto-login flags (currently unused by main flow).

### 12.8 Virtual secure clock (`time_sync_service.dart`)
`CurrentAppTime = ServerTime + (CurrentUptime − UptimeAtAnchor)` — monotonic, immune to OS wall-clock changes; `GET /api/v1/time` handshake; reboot detection; drift compensation (3-attempt monotonic reads); persists `t3_synced_drift_ms`.

---

## 13. Persistence & Database (`lib/Services/persistence_service.dart`)

### 13.1 Hive boxes (all AES-256 via `HiveAesCipher`)
| Box | Contents |
|---|---|
| `faculty_profile` | Profile + hydrated faculty state |
| `academic_data` | Cohorts, courses, subjects cache, timetable, roster cache |
| `attendance` | Attendance records + session state |
| `notifications` | In-app notification history (`history` key) |
| `device_data` | Device snapshot (device_id, device_fingerprint) |
| `messaging` | Messaging metadata/conversation index |
| `offline_attendance` | Queued offline attendance marks |
| `chat_messages` | Chat message history |

### 13.2 Initialization
- `initMinimal()`: `Hive.initFlutter()` → encryption key (secure storage `hive_encryption_key`, base64 `Hive.generateSecureKey()`) → open `faculty_profile`, `academic_data` + `SharedPreferences`.
- `initRemainingBoxes()`: open `attendance`, `notifications`, `device_data`, `messaging`; then `NotificationService().loadFromDisk()`.
- `clearAllData()`: clears boxes, prefs, `backend_jwt`, notifications; `FacultyService.resetToDefaults()`; `ThemeController.resetToDefaults()`.

### 13.3 Secure storage keys
`hive_encryption_key`, `backend_jwt` (written, not consumed — app is Firebase-token-driven), `remember_me_enabled`, `saved_email`, `auto_login_enabled`.

### 13.4 SharedPreferences keys
`last_login_email`, `is_logged_in`, `fcm_token`, `security_pillar_<name>`, `_time_sync_uptime_anchor`, `t3_synced_drift_ms`.

---

## 14. Services Catalog (`lib/Services/`)

| Service | Responsibility |
|---|---|
| `FacultyService` | Global profile/roster state, `load()`, `loadBaseProfile()`, `executeAuthFlow()`, `onAppResume()`, `resetToDefaults()` |
| `FacultyHydrationService` | Manifest/cohort/schedule/roster hydration + `syncIfNeeded()` (SILENT_SYNC_PING, resume) |
| `HardwareService` | Device snapshot, monotonic time, keypair, screen-lock, cache clear |
| `KeyEnrollmentService` | Keypair enrollment/revocation (server sync TODO) |
| `SecurityService` | Device identity + active-devices UI state (`ValueNotifier<List<DeviceInfo>>`) |
| `SessionManagementService` | List/revoke auth sessions |
| `PersistenceService` | Hive/secure-storage/prefs access + cache helpers |
| `PermissionService` | Notification permission (only required pillar) |
| `NotificationService` | Local notifications + in-app history, `onPayloadTap` deep links |
| `TimeSyncService` | Virtual secure clock |
| `WebSocketService` | Realtime socket (attendance + messaging), heartbeat, reconnect backoff |
| `SyncFcmHandler` | FCM foreground/background + token upload |

---

## 15. Realtime WebSocket Details (`lib/Services/websocket_service.dart`)

- **Connect:** `connectAndJoinRoom({sessionId, facultyEmail})` — no-op if already connected to same session; messaging-only via `connectMessaging()`.
- **URL:** `baseUrl.replaceFirst('https://', 'wss://')` + `/ws?session_id=...&token=<firebaseIdToken>&token_type=firebase`.
- **Heartbeat:** `{type: 'ping'}` every 30s; ignore raw `pong`.
- **Reconnect:** exponential backoff 1s → clamp max 30s.
- **Event decode:** `WebSocketEvent.fromJson` accepts `type` or `event`; maps legacy UPPER_SNAKE aliases; typed decoders (AttendanceUpdateData, StudentMarkedData, FacultySyncData, FullStateSyncData, AttendanceMarkAckData, BoardConnectedData, OtpFailedData).
- **Connection states:** `disconnected, connecting, connected, reconnecting`.

---

## 16. Sequence Diagrams

### 16.1 Login → Dashboard
```
[LoginScreen] → AuthRepository.signIn(email, pw) → FirebaseAuth
        ↓ token
FacultyService.executeAuthFlow(authRepo)
   ├─ POST /api/v1/faculty/sync (with Firebase token)
   ├─ hydrate profile + cohorts + schedule → Hive
   └─ SecurityController.performSecurityAudit()
isRegistered == true → _DashboardGate → pushNamedAndRemoveUntil('/')
```

### 16.2 QR attendance marking
```
[MarkAttendanceScreen] → SecurityController.verifyIntegrityOnScan()
   → QrSecurityController.validate(IATT + v7 token, ≤7s drift)
   → (server validates HMAC/GPS) → WebSocketService.connectAndJoinRoom(sessionId)
   → sendMarkAttendance({sessionId, studentId, facultyEmail})
   ← AttendanceMarkAckData {success, student_id}
   → class controller updates total_present (FacultySyncData)
```

### 16.3 Biometric lock cycle
```
[App backgrounded] → SecurityController.didChangeAppLifecycleState(paused)
   biometricLockEnabled && !cameraActive && !authenticating → isLocked = true
[App foreground] → resumed → HardwareService.clearCache() → security check
   → TimeSyncService.compensateDrift() → performSecurityAudit()
[LockScreen tap] → security.authenticate() (local_auth, 15s, <350ms = bypass)
   success → unlock → FacultyService.onAppResume() → syncIfNeeded()
```

### 16.4 Offline → sync catch-up
```
[Offline mark queued] → offline_attendance box
[Connectivity / resume / FCM SILENT_SYNC_PING] → FacultyHydrationService.syncIfNeeded()
   → POST /api/v1/faculty/sync → reconcile → clear local queue
```

---

## 17. Data Flow Summary

1. **Read path:** Screens → `context.read<Controller>()` → Repository → `ApiClient` (interceptors) → backend OR Hive cache (offline) → model DTOs → `ChangeNotifier.notifyListeners()` → UI.
2. **Realtime path:** Backend → WebSocket → `WebSocketService.events` → controllers (chat/class/attendance) → `notifyListeners` → UI.
3. **Push path:** FCM → `SyncFcmHandler` → notification + optional `onPayloadTap` deep link → target screen.
4. **Persist path:** Mutations write Hive boxes immediately; server sync reconciles later (optimistic UI).

---

## 18. Error Handling

- **`ErrorHandler`** (`lib/Core/ErrorHandling/error_handler.dart`) — `showVisualError(context, e)` used across auth and data screens.
- **Dio interceptor** handles 401/403 keyword-based session revocation → forced logout sequence (wipe → Firebase sign-out → clear profile → SecurityController reset → LoginScreen with `initialError`), guarded against duplicate concurrent execution.
- **Repository pattern:** DioExceptions parsed (`e.response!.data`) for structured FastAPI `detail` maps; network failures mapped to friendly `'Network error: ...'` strings.
- **Swallow-error policies:** hardware/security paths (scorched earth, credential service, time sync persistence) intentionally swallow + `debugPrint`.
- **Timeouts:** 15s connect/receive (ApiClient); 5s (TimeSyncService bootstrap); 15s (biometric auth).

---

## 19. Performance

- **Page caching:** My Class uses `Map<int, Widget>` page cache + `putIfAbsent` (eliminates scroll jank); cache invalidated on data/theme changes.
- **Lazy controllers:** Dashboard/Resources controllers instantiated lazily after biometric unlock (avoid pre-unlock work).
- **Roster updates:** realtime events update only delta state (present counters), not full list rebuilds where possible.
- **Hive over SQLite:** low-latency local reads; notifications history in-memory `ValueNotifier`.
- **Reconnect backoff** prevents socket-storm; heartbeat keeps NAT alive.
- Detailed guidance: VOLUME_11.

---

## 20. Security Posture

- Layered onion: Firebase ID token + device-identity headers + hardware-signed reports + server revocation + virtual secure clock.
- Local QR pre-validation (format/time only); server-authoritative HMAC/GPS.
- AES-256 Hive encryption at rest; secure storage for keys/tokens.
- Root detection + biometric + scorched-earth logout.
- FCM token rotated & re-uploaded on refresh.
- Known soft spots (flagged): base-URL race, soft cert pinning, OTP not server-verified client-side, unnamed-route dependency. Full: VOLUME_09 + ARCHITECTURE_AUDIT.md.

---

## 21. Dependencies (`pubspec.yaml`)

| Category | Packages |
|---|---|
| State/DI | `provider`, `intl` |
| Network | `dio`, `web_socket_channel`, `http` |
| Storage | `hive`, `hive_flutter`, `shared_preferences`, `flutter_secure_storage` |
| Auth | `firebase_core`, `firebase_auth`, `firebase_messaging`, `local_auth` |
| Media | `record`, `audioplayers`, `video_player`, `emoji_picker_flutter`, `image_picker`, `file_picker` |
| UI | `google_fonts`, `cached_network_image`, `shimmer`, `syncfusion_flutter_charts`, `mobile_scanner` |
| Export | `pdf`, `printing`, `excel`, `csv` |
| Services | `package_info_plus`, `device_info_plus`, `permission_handler`, `flutter_timezone`, `connectivity_plus` |
| Config | `flutter_dotenv` |
| Internal | `intelli_attend_shared` (git: `github.com:IntelliAttend/IntelliAttend-Shared.git`, ref `school-main`) — shared QR/envelope/protocol types |

---

## 22. Folder Structure

```
IntelliAttend-Faculty-Mobile-App/
├─ lib/
│  ├─ main.dart
│  ├─ Core/
│  │  ├─ Network/        api_client.dart, interceptors
│  │  ├─ Security/       qr_*, crypto_envelope
│  │  ├─ Models/         device_data, websocket_event, etc.
│  │  ├─ ErrorHandling/  error_handler.dart
│  │  └─ Theme/          app_theme.dart, theme_controller.dart
│  ├─ Data/
│  │  ├─ Repositories/   auth, course, override, chat, ...
│  │  └─ Models/         Auth/*, domain DTOs
│  ├─ Services/          faculty*, hardware, security, session,
│  │                     persistence, permission, notification,
│  │                     time_sync, websocket, sync_fcm_handler
│  ├─ State/             controllers, board_readiness_notifier
│  └─ Presentation/
│     ├─ AppShell/       app_shell.dart
│     ├─ Features/       Auth/, dashboard/, my_class/, courses/,
│     │                  attendance/, messaging/, reports/,
│     │                  profile/, settings/, support/
│     ├─ SharedWidgets/  common widgets
│     └─ Theme/          theme helpers
├─ assets/               fonts, images, .env templates
├─ android/ ios/ web/ windows/ linux/ macos/
├─ test/
├─ pubspec.yaml
└─ .env                 (API_BASE_URL, PINNED_CERT_FINGERPRINTS, ...)
```

---

## 23. File-by-File Index (high-signal files)

| File | Responsibility |
|---|---|
| `lib/main.dart` | App bootstrap, firebase init, provider graph, theme, sync handlers |
| `lib/Core/Network/api_client.dart` | Dio, base URL, interceptor stack |
| `lib/Core/Services/security_controller.dart` | Security state machine, scorched earth |
| `lib/Core/Services/qr_security_controller.dart` | QR v7 validation |
| `lib/Core/Models/websocket_event.dart` | WS envelope + typed decoders |
| `lib/Core/Models/device_data.dart` | Device snapshot DTO |
| `lib/Data/Repositories/auth_repository.dart` | Auth API + Firebase wrapper |
| `lib/Services/faculty_service.dart` | Global faculty/profile state |
| `lib/Services/faculty_hydration_service.dart` | Sync/hydration engine |
| `lib/Services/websocket_service.dart` | Realtime socket |
| `lib/Services/time_sync_service.dart` | Virtual secure clock |
| `lib/Services/persistence_service.dart` | Hive/secure storage/prefs |
| `lib/Services/sync_fcm_handler.dart` | FCM foreground/background + token |
| `lib/Presentation/Features/Auth/` | Gate, login, registration (3 steps), lock, compromised |
| `lib/Presentation/Features/my_class/my_class_screen.dart` | Class pages, chips, overview card, cache |
| `lib/Presentation/Features/attendance/mark_attendance_screen.dart` | Manual marking |
| `lib/Presentation/Features/attendance/attendance_session_screen.dart` | Live session |
| `lib/Presentation/Features/messaging/` | Chat screens + controllers |
| `lib/Presentation/Features/reports/` | Reports + export |
| `lib/Presentation/Features/settings/` | Settings, theme, security, API override |
| `lib/Presentation/Features/profile/` | Profile, sessions, devices |

---

## 24. Known Gaps & Recommendations

1. **Base URL race** — deterministically await `dotenv.load()` before `ApiClient._init`, or re-init on first frame.
2. **Named routes** `'/'` / `'/login'` referenced but not registered — consolidate onto `onGenerateRoute` or widget gates only.
3. **OTP client verification** — verify OTP via server before proceeding, or at least add client sanity check.
4. **`backend_jwt`** unused — either consume it for device-bound API auth or remove.
5. **Cert pinning** — ship real `PINNED_CERT_FINGERPRINTS` for release hardening.
6. **`POST /api/v1/faculty/enrollment`** — complete KeyEnrollmentService server sync (currently TODO).
7. **CredentialService** remember-me/auto-login unused — wire into login or remove.
8. **Scorched-earth on iOS** — `SystemNavigator.pop()` unsupported; use a native exit strategy.
9. **Offline queue** — verify reconciliation idempotency for duplicate marks.

---

*Compiled from live source analysis of the Flutter client. Cross-reference VOLUME_01–29 and MASTER_ARCHITECTURE.md for backend/database/admin/web specifics.*
