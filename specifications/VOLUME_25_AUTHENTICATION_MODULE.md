# Volume 25: Authentication Module Specification

## 1. Module Overview

The Auth Module manages the complete lifecycle of faculty authentication in IntelliAttend: boot-time routing, login, registration (3-step), password management, session verification, device binding, biometric lock, and forced logout handling. It integrates Firebase Auth for identity, a custom FastAPI backend for registration/session management, and hardware fingerprinting for device binding.

**Module boundary:** All files under `lib/Presentation/Features/Auth/`, `lib/Data/Repositories/auth_repository.dart`, `lib/Data/Auth/` models, `lib/Core/Network/Interceptors/auth_interceptor.dart`, `lib/Services/session_management_service.dart`, and `SecurityController` (lock/auth portion).

---

## 2. File Inventory

| File | Lines | Responsibility |
|------|-------|----------------|
| `Auth/unified_auth_gate.dart` | 199 | Boot state machine, phase routing |
| `Auth/login_screen.dart` | 341 | Email+password login form |
| `Auth/lock_screen.dart` | 88 | Biometric lock overlay |
| `Auth/compromised_device_screen.dart` | 122 | Rooted device block screen |
| `Auth/Registration/registration_screen.dart` | 157 | Step 1: Enter email, send OTP |
| `Auth/Registration/otp_screen.dart` | 270 | Step 2: 6-digit OTP input |
| `Auth/Registration/set_password_screen.dart` | 247 | Step 3: Set password + device binding |
| `Data/Repositories/auth_repository.dart` | 156 | Auth API facade (8 methods) |
| `Data/Models/Auth/registration_models.dart` | 142 | Request/response DTOs |
| `Data/Models/Auth/auth_session_model.dart` | 102 | Session/device model |
| `Core/Network/Interceptors/auth_interceptor.dart` | 175 | Token attachment + 401/403 handling |
| `Services/session_management_service.dart` | 48 | List/revoke sessions |
| `Core/Services/security_controller.dart` | 378 | Biometric auth + root detection |
| `Faculty/login_devices_screen.dart` | 297 | Device management UI |

---

## 3. Boot State Machine

### 3.1 Dual-Track Bootstrap (`main.dart`)

```
main()
├── Track A (BLOCKING, ~100ms):
│   ├── _bootstrapPersistence()
│   │   ├── Hive.initFlutter()
│   │   ├── dotenv.load()
│   │   └── SharedPreferences.getInstance()
│   └── FacultyService.loadFromCache()  ← instant dashboard from cache
│
├── Track B (NON-BLOCKING, background):
│   └── _initFirebase()
│       └── Firebase.initializeApp()
│
└── runApp(IntelliAttendApp)
    ├── Provider tree:
    │   ├── SecurityController (root ChangeNotifierProvider)
    │   ├── Provider<ApiClient>
    │   ├── ProxyProvider<ApiClient, AuthRepository>
    │   └── SecurityOverlay (wraps MaterialApp.builder)
    └── MaterialApp.home => UnifiedAuthGate
```

### 3.2 UnifiedAuthGate Phase State Machine

```dart
enum _BootPhase { initial, cacheHit, loading, dashboard, login, registration }
```

```
UnifiedAuthGate.persistenceFuture completes (~100ms)
├── [profile cached + registered] → cacheHit
│   ├── setState → DashboardScreen renders INSTANTLY
│   └── _backgroundValidate() (non-blocking):
│       ├── await firebaseReady
│       ├── [no Firebase user] → login
│       ├── loadBaseProfile() fails → stay on dashboard (cache)
│       ├── [!registered] → registration
│       └── [registered] → dashboard (confirmed)
│           ├── FacultyService.initializeListeners()
│           └── TimeSyncService.bootstrap()
│
└── [no cache] → loading (splash shown)
    └── _loadFromNetwork():
        ├── await firebaseReady
        ├── loadBaseProfile()
        │   ├── [success + registered] → dashboard
        │   ├── [success + !registered] → registration
        │   └── [error]
        │       ├── FacultyService.loadFromCache()
        │       ├── [cache hit] → dashboard + _backgroundValidate()
        │       └── [no cache] → login
```

### 3.3 Splash Screen

Shown during `_BootPhase.initial` and `_BootPhase.loading`:
- Logo image (240x200, `assets/images/logo.png`)
- "IntelliAttend" title (32px, bold, letterSpacing: -1)
- "Loading..." subtitle (during loading phase only)
- Lime-green `LinearProgressIndicator` (120px wide, 6px height, rounded)

---

## 4. Login Flow

### 4.1 Login Screen Layout

```
LoginScreen (StatefulWidget)
├── Theme(data: AppTheme.getAuthTheme)
├── Scaffold
│   └── SafeArea → Center → SingleChildScrollView (24px padding)
│       ├── Logo (240x200)
│       ├── "IntelliAttend" title
│       ├── "Smart. Secure. Seamless Faculty Portal." subtitle
│       ├── [if error] Error card (errorContainer bg, error icon, message)
│       ├── TextField ("Faculty ID / Email")
│       │   ├── keyboardType: emailAddress
│       │   ├── prefixIcon: alternate_email_rounded
│       │   └── hintText: "user@mrcet.ac.in"
│       ├── TextField ("Password")
│       │   ├── obscureText: !_passwordVisible
│       │   ├── prefixIcon: lock_outline_rounded
│       │   └── suffixIcon: visibility toggle
│       ├── "Forgot Password?" TextButton (right-aligned)
│       ├── FilledButton("SIGN IN")
│       │   ├── bg: accentTeal, height: 64, radius: 20
│       │   └── [loading] → CircularProgressIndicator
│       └── "v{version} • SECURE FACULTY SYSTEM" footer
```

### 4.2 Login Validation Rules

| Rule | Error Message |
|------|--------------|
| Email empty | "Faculty ID / Email is required." |
| Email doesn't end with `@mrcet.ac.in` | "Please enter your full university email (e.g. fac01@mrcet.ac.in)." |
| Password empty | "Email and password are required." |

### 4.3 Login Action Sequence

```
_handleLogin()
├── Validate email (trimmed, lowered, @mrcet.ac.in domain)
├── Validate password (non-empty)
├── AuthRepository.signIn(email, password)
│   └── FirebaseAuth.signInWithEmailAndPassword()
├── Save email to SharedPreferences ('last_login_email')
├── FacultyService.executeAuthFlow(authRepo)
│   ├── POST /api/v1/auth/status (check registration)
│   └── POST /api/v1/auth/verify-session (bind device)
├── [flowError != null]
│   ├── authRepo.signOut()
│   └── Show error
├── [isRegistered == true]
│   ├── Refresh Firebase ID token
│   ├── Set SharedPreferences('is_logged_in', true)
│   └── Navigator.pushAndRemoveUntil → _DashboardGate → /
└── [isRegistered == false]
    └── Navigator.push → RegistrationScreen(email, fromLogin: true)
```

### 4.4 Forgot Password Flow

```
_handleForgotPassword()
├── [email empty] → "Enter your email first, then tap Forgot Password."
├── [!@mrcet.ac.in] → "Enter your full university email..."
├── FirebaseAuth.sendPasswordResetEmail(email)
├── [success] → SnackBar "Password reset link sent to your email."
└── [FirebaseAuthException] → Show error message
```

### 4.5 Email Persistence

Last successful login email is saved:
```dart
await prefs.setString('last_login_email', email);
```
Loaded on screen init via `_loadSavedEmail()`.

---

## 5. Registration Flow (3-Step)

### 5.1 Step 1: RegistrationScreen (Enter Email)

```
RegistrationScreen(preloadedEmail, fromLogin)
├── Theme(data: AppTheme.getAuthTheme)
├── Scaffold → AppBar("Faculty Registration")
└── SingleChildScrollView (28px padding)
    ├── [if error] Error banner
    ├── Hero(tag: 'app_logo') Logo (140x120)
    ├── "Identify Yourself" title
    ├── "Confirm your university ID..." subtitle
    ├── TextField("University ID")
    │   ├── [fromLogin] → readOnly: true, fillColor: teal@0.05
    │   └── hintText: "fac01@mrcet.ac.in"
    └── FilledButton("Send Verification Code")
```

**Validation:** Email must be non-empty and end with `@mrcet.ac.in`.

**Action:**
```
_handleInitiate()
├── AuthRepository.sendOtp()
│   └── POST /api/v1/auth/register/send-otp
├── [success] → Navigator.push → OtpScreen(email)
└── [error] → "An error occurred. Please try again."
```

### 5.2 Step 2: OtpScreen (6-Digit Verification)

```
OtpScreen(email)
├── Scaffold → AppBar("Verify Email")
└── SingleChildScrollView (28px padding)
    ├── [if error] Error banner
    ├── Circle icon (mark_email_read_rounded, teal@0.1 bg)
    ├── "Enter Code" title
    ├── "We've sent a 6-digit code to {email}" subtitle
    ├── Row of 6 OTP boxes:
    │   ├── Height: 60px, radius: 16
    │   ├── JetBrains Mono 24px bold
    │   ├── Digits only (FilteringTextInputFormatter)
    │   ├── Auto-advance on input
    │   ├── Auto-submit on 6th digit
    │   └── Focus management (forward/backward)
    ├── FilledButton("Verify & Continue")
    └── "Resend code" TextButton with 60s cooldown
```

**OTP Input Behavior:**
| Event | Action |
|-------|--------|
| Digit entered (index < 5) | Focus next box |
| Digit entered (index 5) | Unfocus + auto-call `_handleVerify()` |
| Backspace (empty) | Focus previous box |
| Backspace (at index 0) | Stay |

**Resend Cooldown:** 60 seconds, displayed as "Resend code in {n}s".

**Critical Note:** OTP is NOT verified server-side at this step. It's passed to step 3 for completion.

### 5.3 Step 3: SetPasswordScreen (Set Password + Bind Device)

```
SetPasswordScreen(email, otp)
├── Scaffold → AppBar("Secure Faculty Account")
└── SingleChildScrollView (28px padding)
    ├── [if error] Error banner
    ├── Circle icon (security_rounded, teal@0.1 bg)
    ├── "Set Password" title
    ├── "Create a strong password and secure your device binding." subtitle
    ├── TextField("Create Password") — obscureText: true
    ├── TextField("Confirm Password") — obscureText: true
    ├── Security Badge:
    │   ├── Icon: phonelink_lock_rounded (32px)
    │   ├── "Hardware Binding" title
    │   ├── "This phone will be linked to your Faculty ID" subtitle
    │   └── "TRUSTED" badge (teal)
    └── FilledButton("Complete Registration")
```

**Validation:**
| Rule | Error |
|------|-------|
| Password < 6 chars | "Password must be at least 6 characters." |
| Password != Confirm | "Passwords do not match." |

**Registration Completion Sequence:**
```
_handleComplete()
├── HardwareService.getDeviceSnapshot()
├── AuthRepository.checkAuthStatus()
│   └── POST /api/v1/auth/status → AuthStatusResponse.userId
├── [no userId] → Error "Could not verify your identity"
├── Build DeviceInfoPayload(deviceId, fingerprint, brand, model, etc.)
├── AuthRepository.completeRegistration(request)
│   └── POST /api/v1/auth/register/complete
│       Body: { user_id, otp, password, device_info }
├── [status != success] → Show error
├── AuthRepository.verifySession(deviceInfo) [non-blocking]
│   └── POST /api/v1/auth/verify-session
├── PermissionService().requestAll()
├── FacultyService.loadBaseProfile()
├── SharedPreferences.setBool('is_logged_in', true)
└── Navigator.pushNamedAndRemoveUntil('/') → Dashboard
```

---

## 6. Auth Repository API

### 6.1 Interface

```dart
abstract class IAuthRepository {
  Future<AuthStatusResponse> checkAuthStatus();
  Future<void> sendOtp();
  Future<RegistrationCompleteResponse> completeRegistration(RegistrationCompleteRequest request);
  Future<VerifySessionResponse> verifySession(DeviceInfoPayload deviceInfo);
  Future<UserCredential?> signIn(String email, String password);
  Future<void> changePassword(String oldPassword, String newPassword);
  Future<void> signOut();
  User? getCurrentUser();
}
```

### 6.2 API Endpoints

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| `checkAuthStatus` | `POST /api/v1/auth/status` | `{ token }` | `AuthStatusResponse` |
| `sendOtp` | `POST /api/v1/auth/register/send-otp` | (empty) | 200 OK |
| `completeRegistration` | `POST /api/v1/auth/register/complete` | `RegistrationCompleteRequest` | `RegistrationCompleteResponse` |
| `verifySession` | `POST /api/v1/auth/verify-session` | `{ token, role, device_info, fcm_token }` | `VerifySessionResponse` |
| `signIn` | Firebase Auth | `signInWithEmailAndPassword` | `UserCredential` |
| `changePassword` | Firebase Auth | `reauthenticateWithCredential` + `updatePassword` | void |
| `signOut` | Firebase Auth | `signOut()` | void |

### 6.3 ID Token Retrieval

```dart
Future<String> _getIdToken() async {
  final user = _auth.currentUser;
  if (user == null) throw Exception('No authenticated user');
  final token = await user.getIdToken();  // Cached (1 hour)
  if (token == null) throw Exception('Failed to get ID token');
  return token;
}
```

---

## 7. Data Models

### 7.1 AuthStatusResponse

```dart
class AuthStatusResponse {
  final String authStatus;  // 'active' | 'pending' | 'not_found'
  final String? name;
  final String? role;
  final String? userId;

  bool get isActive => authStatus == 'active';
  bool get isPending => authStatus == 'pending';
  bool get isNotFound => authStatus == 'not_found';
}
```

### 7.2 VerifySessionResponse

```dart
class VerifySessionResponse {
  final String status;      // 'authenticated' | 'device_mismatch' | 'device_missing' | 'registration_required'
  final String? authStatus;
  final String? errorCode;
  final String? message;

  bool get isAuthenticated => status == 'authenticated';
  bool get isDeviceMismatch => status == 'device_mismatch';
  bool get isDeviceMissing => status == 'device_missing';
  bool get isRegistrationRequired => status == 'registration_required';
}
```

### 7.3 RegistrationCompleteRequest

```dart
class RegistrationCompleteRequest {
  final String userId;
  final String otp;
  final String password;
  final Map<String, dynamic> deviceInfo;

  Map<String, dynamic> toJson() => {
    'user_id': userId,
    'otp': otp,
    'password': password,
    'device_info': deviceInfo,
  };
}
```

### 7.4 RegistrationCompleteResponse

```dart
class RegistrationCompleteResponse {
  final String status;  // 'success' | 'error' | 'unknown'
  final Map<String, dynamic>? profile;
  final String? error;
  final String? errorCode;
}
```

### 7.5 DeviceInfoPayload

```dart
class DeviceInfoPayload {
  final String deviceId;
  final String deviceFingerprint;
  final String brand;
  final String model;
  final String manufacturer;
  final String osVersion;
  final bool biometricsEnabled;
  final bool isRooted;  // default: false
}
```

### 7.6 AuthSession (Session Management)

```dart
class AuthSession {
  final String sessionId;
  final String deviceModel;
  final String osVersion;
  final String deviceType;
  final String lastActive;
  final bool isCurrentDevice;
  final String ipAddress;
  final String manufacturer;
  final String deviceName;
  final String location;
  final String loginTime;
  final String sessionStatus;
  final String? browserName;
  final String? browserVersion;

  String get displayName => deviceName.isNotEmpty ? deviceName : deviceModel;
  String get osDisplay => '$deviceType $osVersion';
  bool get isActive => sessionStatus == 'active';
  bool get isExpired => sessionStatus == 'expired';
}
```

---

## 8. Auth Interceptor (401/403 Handling)

### 8.1 Request Interception

```
onRequest(options)
├── Firebase.instance.currentUser
├── [user exists]
│   ├── getIdToken() (cached, ~1hr)
│   │   └── [null] → getIdToken(forceRefresh: true)
│   ├── options.headers['Authorization'] = 'Bearer $token'
│   └── Log: token length, path
├── [user null] → Log warning, proceed without header
└── [FirebaseAuthException]
    ├── code: 'user-token-expired' | 'invalid-credential'
    │   └── getIdToken(forceRefresh: true) → attach new token
    └── Other → Log error, proceed
```

### 8.2 Error Interception (401)

```
onError(401)
├── _extractDetail(err) → message/detail/error from response body
│
├── [security revocation: "revoked" | "terminated" | "session has been revoked"]
│   └── ForceLogoutService.execute(sessionRevoked) → return
│
├── [hardware/device mismatch: "hardware" | "device" in detail]
│   └── ForceLogoutService.execute(deviceMismatch) → return
│
├── [other 401 — likely expired token]
│   ├── getIdToken(forceRefresh: true)
│   ├── Update Authorization header
│   ├── _dio.fetch(err.requestOptions) → retry
│   ├── [retry success] → handler.resolve(response)
│   └── [retry fail] → ForceLogoutService.execute(sessionRevoked)
```

### 8.3 Error Interception (403)

```
onError(403)
├── _extractDetail(err)
│
├── [ACCOUNT_SUSPENDED | BLOCKED | "suspend" in detail]
│   └── ForceLogoutService.execute(accountBlocked) → return
│
├── [DEVICE_MISMATCH | PROXY | "hardware" in detail]
│   └── ForceLogoutService.execute(deviceMismatch) → return
│
└── Other 403 → handler.next(err) (pass through)
```

### 8.4 ForceLogout Reasons

```dart
enum ForceLogoutReason {
  sessionRevoked,    // Server revoked session
  deviceMismatch,    // Hardware/proxy violation
  accountBlocked,    // Account suspended/blocked
}
```

---

## 9. Session Management

### 9.1 SessionManagementService

```dart
class SessionManagementService {
  Future<List<AuthSession>> getActiveSessions();
    // GET /api/v1/auth/sessions

  Future<bool> revokeSession(String sessionId);
    // DELETE /api/v1/auth/sessions/{sessionId}

  Future<void> revokeAllOtherSessions();
    // Fetches all, revokes non-current sequentially
}
```

### 9.2 Device Identification

Device info is collected via `HardwareService.getDeviceSnapshot()`:
- `deviceId`: Unique device identifier
- `fingerprint`: SHA-256 hash of hardware attributes
- `brand`, `model`, `manufacturer`, `osVersion`
- `isRooted`: Root/jailbreak detection

---

## 10. Lock Screen

```dart
// lock_screen.dart (88 lines)
LockScreen
├── Watches SecurityController.isLocked
├── [locked]
│   ├── Shows fingerprint icon + "Tap to Unlock" text
│   ├── onTap → security.authenticate()
│   │   ├── [authenticating] → CircularProgressIndicator
│   │   ├── [success] → dismiss
│   │   ├── [timed out] → "Timed out. Tap to try again."
│   │   └── [failed] → "Authentication failed. Tap to try again."
│   └── AbsorbPointer blocks all taps behind overlay
└── [unlocked] → SizedBox.shrink() (invisible)
```

---

## 11. Compromised Device Screen

```dart
// compromised_device_screen.dart (122 lines)
CompromisedDeviceScreen
├── PopScope(canPop: false) → prevents back navigation
├── Full-screen centered layout:
│   ├── Shield icon (red, 80px)
│   ├── "Device Compromised" title
│   ├── violationReason text
│   ├── "This device has been flagged..." description
│   └── "EXIT APP" button → SystemNavigator.pop()
```

**Triggered by:** SecurityController detecting root at boot or during audit.

---

## 12. SharedPreferences Keys

| Key | Type | Owner | Default |
|-----|------|-------|---------|
| `is_logged_in` | `bool` | LoginScreen / SetPasswordScreen | `false` |
| `last_login_email` | `String` | LoginScreen | null |
| `fcm_token` | `String` | FCM service | null |
| `biometric_lock_enabled` | `bool` | SecurityController | `false` |
| `security_pillar_*` | `bool` | SecurityController | varies |

---

## 13. Navigation Map

```
App Start
├── UnifiedAuthGate
│   ├── [cacheHit] → DashboardScreen (instant)
│   ├── [login] → LoginScreen
│   │   ├── [success + registered] → / (Dashboard via _DashboardGate)
│   │   └── [success + !registered] → RegistrationScreen
│   │       └── Step 1 → OtpScreen → SetPasswordScreen → / (Dashboard)
│   ├── [registration] → RegistrationScreen (from cache, email preloaded)
│   └── [compromised] → CompromisedDeviceScreen (via SecurityOverlay)
│
Post-Login Overlays (via SecurityOverlay):
├── [isLocked] → LockScreen (AbsorbPointer blocks all)
└── [isCompromised] → CompromisedDeviceScreen
```

---

## 14. API Contract Summary

### POST /api/v1/auth/status
**Request:** `{ "token": "<firebase_id_token>" }`
**Response:** `{ "auth_status": "active"|"pending"|"not_found", "name": "...", "role": "faculty", "user_id": "..." }`

### POST /api/v1/auth/register/send-otp
**Request:** (empty — token via interceptor)
**Response:** `200 OK`

### POST /api/v1/auth/register/complete
**Request:** `{ "user_id": "...", "otp": "123456", "password": "...", "device_info": { ... } }`
**Response:** `{ "status": "success"|"error", "profile": {...}, "error": "...", "error_code": "..." }`

### POST /api/v1/auth/verify-session
**Request:** `{ "token": "...", "role": "faculty", "device_info": {...}, "fcm_token": "..." }`
**Response:** `{ "status": "authenticated"|"device_mismatch"|"device_missing"|"registration_required", ... }`

### GET /api/v1/auth/sessions
**Response:** `{ "sessions": [AuthSession, ...] }`

### DELETE /api/v1/auth/sessions/{sessionId}
**Response:** `{ "success": true }`

---

## 15. Edge Cases

| Case | Behavior |
|------|----------|
| Firebase init fails (Track B) | `firebaseReady` future never completes, stuck on loading splash |
| No internet at login | Firebase Auth handles offline (if previously cached), otherwise error |
| Email not @mrcet.ac.in | Client-side validation, blocked before API call |
| OTP expired | Server returns error on `completeRegistration`, shown to user |
| Device already registered | `verifySession` returns `device_mismatch` → ForceLogout |
| Root detected at boot | Scorched earth → sign out + delete keys + CompromisedDeviceScreen |
| Root detected on resume | Scorched earth + ForceLogout |
| Token expired during request | Interceptor refreshes + retries transparently |
| Concurrent login attempts | Firebase handles race; `_isLoading` flag prevents double-submit |
| Biometric auth times out (15s) | Returns false, stays locked |
| Biometric bypass (< 350ms) | Flagged as bypass, stays locked |

---

## 16. Security Features

1. **Domain restriction:** All emails must end with `@mrcet.ac.in`
2. **Device binding:** Hardware fingerprint sent with registration + session verification
3. **Root detection:** `HardwareService.getDeviceSnapshot().isRooted` checked at boot + resume
4. **Scorched earth:** On root detection — server report, sign out, key deletion, enrollment revocation
5. **Bypass detection:** Biometric auth < 350ms flagged as bypass
6. **Token auto-refresh:** Interceptor transparently refreshes expired tokens
7. **Force logout:** 401/403 responses trigger `ForceLogoutService` with specific reasons
8. **No password storage:** Passwords only exist in Firebase Auth, never cached locally
9. **Session revocation:** Individual or all-other sessions can be revoked remotely

---

## 17. Known Tech Debt

1. **OTP not verified client-side:** Step 2 (OTP screen) passes OTP to step 3 without server verification — wasted network call if OTP is wrong.
2. **`_DashboardGate` is dead code:** `LoginScreen` navigates via `_DashboardGate` which re-checks `isRegistered` — redundant since `FacultyService.executeAuthFlow` already validated.
3. **Hardcoded domain:** `@mrcet.ac.in` is hardcoded in login + registration screens — not configurable.
4. **No rate limiting client-side:** Login attempts have no exponential backoff or lockout.
5. **`AuthRepository` lacks caching:** Each `checkAuthStatus()` makes a network call.
6. **`LockScreen` is only 88 lines** — minimal implementation, no animation, no retry count.
7. **`CompromisedDeviceScreen` calls `SystemNavigator.pop()`** — may not work on all platforms.
8. **Session model (`AuthSession`)** has 15 fields — many may be null from server.
9. **No biometric re-enrollment:** If user adds/removes fingerprints in OS settings, app doesn't detect.
10. **`sendOtp` has no email in request body:** Server presumably uses Firebase token to identify user.
