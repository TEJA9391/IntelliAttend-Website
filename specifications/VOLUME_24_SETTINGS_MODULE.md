# Volume 24: Settings Module Specification

## 1. Module Overview

The Settings Module in IntelliAttend Faculty is distributed across multiple screens and controllers. It encompasses backend server configuration, biometric security, theme management, account management (password, devices), and profile-related preferences. Unlike a traditional single-screen settings module, settings functionality is spread across the Settings screen, Profile screen, App Drawer, and SecurityController.

**Module boundary:** `SettingsScreen`, `ThemeController`, `AppTheme`, `SecurityController` (biometric portion), `ChangePasswordScreen`, `LoginDevicesScreen`, and relevant sections of `ProfileScreen` and `AppDrawer`.

---

## 2. File Inventory

| File | Lines | Responsibility |
|------|-------|----------------|
| `Faculty/Settings/settings_screen.dart` | 216 | Server URL, biometric lock toggle, connectivity help |
| `Theme/theme_controller.dart` | 26 | Dark/light mode toggle with SharedPreferences persistence |
| `Theme/app_theme.dart` | 235 | Brand colors, theme tokens, ThemeData builder |
| `Core/Services/security_controller.dart` | 378 | Biometric lock, root detection, scorched earth |
| `Faculty/change_password_screen.dart` | 237 | Firebase Auth password change form |
| `Faculty/login_devices_screen.dart` | 297 | Device list, session revocation, logout |
| `Profile/profile_screen.dart` | 952 | Theme toggle, security links, ID card, help links |
| `Widgets/app_drawer.dart` | 370 | Navigation drawer with theme toggle + settings link |

---

## 3. Widget Hierarchy

### 3.1 SettingsScreen

```
SettingsScreen (StatefulWidget)
├── Scaffold (bg: #0F172A)
│   ├── AppBar (title: "Settings", bg: #1E293B)
│   │   └── Back button → widget.onBackPressed
│   └── SingleChildScrollView (padding: 16)
│       ├── _buildServerSection()
│       │   └── Card (bg: #1E293B, radius: 12)
│       │       ├── "🌐 Backend Server Configuration"
│       │       ├── TextField (monospace, controller: _urlController)
│       │       │   └── onChanged → _showSaveButton = (value != currentUrl)
│       │       ├── Hint: "⚠️ IP address and port (default: 8000)"
│       │       └── Row
│       │           ├── [if modified] ElevatedButton.icon("SAVE") → ApiClient.updateBaseUrl()
│       │           └── OutlinedButton.icon("RESET") → restores current URL
│       ├── SizedBox(24)
│       ├── _buildSecuritySection()
│       │   └── Consumer<SecurityController>
│       │       └── Card (bg: #1E293B, radius: 12)
│       │           ├── "🔒 Security"
│       │           └── SwitchListTile
│       │               ├── title: "Lock app on background"
│       │               ├── subtitle: "Require fingerprint when you return"
│       │               ├── value: security.biometricLockEnabled
│       │               └── onChanged:
│       │                   ├── [enable] → security.lock() → authenticate()
│       │                   │   ├── [success] → setBiometricLockEnabled(true)
│       │                   │   └── [fail] → security.unlock() → error SnackBar
│       │                   └── [disable] → setBiometricLockEnabled(false)
│       └── _buildHelpSection()
│           └── Card (bg: #1E293B, radius: 12)
│               ├── "📖 Connectivity Help"
│               ├── Step 1: "Ensure stable internet"
│               ├── Step 2: "Find PC IP (ifconfig / ipconfig)"
│               └── Step 3: "Use format http://<IP>:8000"
```

### 3.2 ProfileScreen (Settings-related Sections)

```
ProfileScreen (StatefulWidget)
├── Scaffold → CustomAppBar(title: "Profile")
├── ListView (padding: 24h, 16v)
│   ├── Profile Header (avatar, name, department, designation badge)
│   │
│   ├── Section: "Registration Identity"
│   │   ├── _buildPlainRow("Faculty Name", ...)
│   │   ├── _buildPlainRow("Designation", ...)
│   │   ├── _buildPlainRow("Department", ...)
│   │   └── _buildPlainRow("Official Email", ...)
│   │
│   ├── Section: "Appearance Settings" (settings-adjacent)
│   │   └── _buildThemeToggle()
│   │       └── Switch.adaptive → ThemeController.themeMode
│   │
│   ├── Section: "Security & Access"
│   │   ├── _buildInteractiveTile → ChangePasswordScreen
│   │   └── _buildInteractiveTile → LoginDevicesScreen
│   │
│   ├── Section: "Identification"
│   │   ├── _buildInteractiveTile → _showDigitalIdCard()
│   │   └── _buildInteractiveTile → _showQRCodeID()
│   │
│   ├── Section: "Help & Support"
│   │   ├── _buildInteractiveTile → AboutAppPage
│   │   ├── _buildInteractiveTile → HelpCenterPage
│   │   └── _buildInteractiveTile → ReportIssuePage
│   │
│   └── Footer: "INTELLIATTEND FACULTY" branding
```

### 3.3 AppDrawer (Settings Entry Points)

```
AppDrawer (StatefulWidget)
├── Drawer (width: 85% screen)
│   ├── Profile Header (teal bg, avatar, name, role, "VERIFIED FACULTY" badge)
│   ├── ListView
│   │   ├── ACADEMICS section
│   │   │   ├── Student Directory
│   │   │   ├── Live Attendance / Attendance Manager
│   │   │   └── Advanced Reports
│   │   ├── CONTENT section
│   │   │   ├── Resources
│   │   │   ├── Create Assignment
│   │   │   └── Submissions
│   │   ├── SECURITY & CLOUD section
│   │   │   ├── Device Management → _showDevicesDialog()
│   │   │   └── AI Faculty Assistant
│   │   ├── PREFERENCES section
│   │   │   └── App Settings → widget.onSettings() → SettingsScreen
│   │   ├── THEME section
│   │   │   └── ValueListenableBuilder<ThemeMode>
│   │   │       └── Theme toggle → ThemeController.toggle()
│   │   └── Branding footer
│   └── Sign Out button
```

---

## 4. Settings Categories

### 4.1 Backend Server Configuration

| Property | Value |
|----------|-------|
| Widget | `TextField` with monospace font |
| Controller | `TextEditingController` initialized with `ApiClient().baseUrl` |
| Save action | `ApiClient().updateBaseUrl(newUrl)` |
| Reset action | Restores `_urlController.text` to current `ApiClient().baseUrl` |
| Visibility | Save button only appears when text differs from current URL |
| Persistence | Via `ApiClient` (in-memory + likely SharedPreferences) |
| Validation | None (user enters raw URL) |
| SnackBar | "Server URL Updated" on save |

### 4.2 Biometric App Lock

| Property | Value |
|----------|-------|
| Widget | `SwitchListTile` |
| Source | `SecurityController.biometricLockEnabled` |
| Persistence | `SharedPreferences` key `biometric_lock_enabled` |
| Enable flow | 1. `security.lock()` → 2. `security.authenticate()` → 3. `setBiometricLockEnabled(true)` |
| Disable flow | `setBiometricLockEnabled(false)` → auto-unlock if locked |
| Auth failure | Revert switch, show red SnackBar "Biometric verification failed" |
| Auth success | Green SnackBar "App lock enabled" |
| Lifecycle | App locks on `paused`/`hidden` ONLY if `_biometricLockEnabled == true` |

### 4.3 Theme (Dark/Light Mode)

| Property | Value |
|----------|-------|
| Controller | `ThemeController` (static utility) |
| State | `ValueNotifier<ThemeMode> themeMode` |
| Persistence | `SharedPreferences` key `is_dark_mode` (bool) |
| Default | Light mode |
| Toggle locations | Profile screen (Switch.adaptive), App drawer (ListTile) |
| `toggle()` | Flips between `ThemeMode.dark` and `ThemeMode.light`, persists |
| `resetToDefaults()` | Removes preference, resets to `ThemeMode.light` |
| `init()` | Called at app startup, reads persisted preference |

### 4.4 Change Password

| Property | Value |
|----------|-------|
| Screen | `ChangePasswordScreen` (StatefulWidget, 237 lines) |
| Fields | Current Password, New Password, Confirm Password |
| Validators | Current: required; New: required, min 6 chars; Confirm: must match |
| Password visibility | Toggle per field (`_oldPasswordVisible`, etc.) |
| API | `AuthRepository.changePassword(oldPassword, newPassword)` via Firebase Auth |
| Error handling | `FirebaseAuthException` codes: `wrong-password`, `weak-password`, generic |
| Success | Green SnackBar "Password changed successfully!" + `Navigator.pop()` |
| Loading | Button shows `CircularProgressIndicator` |

### 4.5 Login Devices

| Property | Value |
|----------|-------|
| Screen | `LoginDevicesScreen` (StatefulWidget, 297 lines) |
| Data sources | `HardwareService.getDeviceSnapshot()` (local), `SessionManagementService().getActiveSessions()` (server) |
| Current device | Highlighted with teal border + "CURRENT DEVICE" badge |
| Other devices | Listed with device name, IP address, chevron |
| Revoke | Confirmation dialog → `SessionManagementService().revokeSession(sessionId)` |
| Logout this device | Confirmation dialog → `AuthRepository.signOut()` + clear FacultyService + redirect to LoginScreen |
| Detail navigation | `DeviceDetailScreen` for both current and remote devices |
| Pull to refresh | `RefreshIndicator` on the ListView |

### 4.6 Connectivity Help

| Property | Value |
|----------|-------|
| Widget | Static 3-step guide |
| Step 1 | "Ensure your phone has a stable internet connection." |
| Step 2 | "Find PC IP (ifconfig / ipconfig)." |
| Step 3 | "Use format http://<IP>:8000" |
| Step indicator | Blue square (24x24) with white number |

---

## 5. Navigation Paths

```
Dashboard Screen
├── AppBar Hamburger → AppDrawer
│   ├── "App Settings" → SettingsScreen
│   └── Theme toggle → ThemeController.toggle()
└── Bottom Nav → Profile tab → ProfileScreen
    ├── "Change Password" → ChangePasswordScreen
    ├── "Login Devices" → LoginDevicesScreen
    ├── Theme toggle → ThemeController.toggle()
    ├── "About IntelliAttend" → AboutAppPage
    ├── "Help Center" → HelpCenterPage
    └── "Report an Issue" → ReportIssuePage
```

**SettingsScreen constructor:**
```dart
SettingsScreen({required VoidCallback onBackPressed})
```
Called from `DashboardScreen._showSettings()` via `Navigator.push`.

---

## 6. SecurityController Settings Integration

### 6.1 Biometric Lock State Machine

```
App Start
├── _loadBiometricPreference() → reads 'biometric_lock_enabled'
├── _performInitialSecurityCheck()
│   ├── HardwareService.getDeviceSnapshot()
│   ├── [rooted] → _isCompromised = true → executeScorchedEarth()
│   └── [clean] → _checkPermissionsSilently()
└── State: ready (unlocked)

Background (paused/hidden)
├── [biometricLockEnabled] → lock()
└── [!biometricLockEnabled] → no action

Resume (resumed)
├── HardwareService.clearCache()
├── _performInitialSecurityCheck()
├── TimeSyncService.compensateDrift()
└── performSecurityAudit()

Settings Toggle ON
├── lock() → authenticate()
│   ├── [biometrics available] → LocalAuthentication.authenticate()
│   │   ├── [success + elapsed > 350ms] → unlock + FacultyService.onAppResume()
│   │   ├── [success + elapsed < 350ms] → bypass detected → stay locked
│   │   └── [fail/timeout 15s] → stay locked
│   ├── [biometrics unavailable] → auto-unlock (bypass)
│   └── setBiometricLockEnabled(true)
└── [auth fail] → unlock() → show error

Settings Toggle OFF
├── setBiometricLockEnabled(false)
├── [isLocked] → unlock()
└── persist preference
```

### 6.2 Bypass Detection

If biometric authentication completes in under 350ms, it's flagged as a bypass attempt:
```dart
if (stopwatch.elapsedMilliseconds < 350) {
  _bypassDetected = true;  // Stays locked
}
```

### 6.3 Scorched Earth Protocol

Triggered on root detection:
1. Sign device compromisation to server (`POST /api/v1/faculty/device/compromised`)
2. `FirebaseAuth.instance.signOut()`
3. `HardwareService.deleteKeyPair()`
4. `KeyEnrollmentService.revoke()`

---

## 7. Device Management Dialog

**Trigger:** App Drawer → "Device Management"

```
_showDevicesDialog()
├── AlertDialog (surface bg, radius: 28)
│   ├── Title: "Active Sessions" with security icon
│   ├── Content: ValueListenableBuilder<List<DeviceInfo>>
│   │   └── ListView of devices:
│   │       ├── [current] → teal icon, "CURRENT" badge
│   │       └── [other] → grey icon, "REVOKE" TextButton
│   │           └── SecurityService().logoutDevice(device.id)
│   └── Action: "DONE" TextButton
```

---

## 8. AppTheme Token System

### 8.1 Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `bg(context)` | White / near-white | `#0F172A` | Scaffold background |
| `card(context)` | White | `#1E293B` | Card backgrounds |
| `surface(context)` | `#F8FAFC` | `#1E293B` | Input fills, secondary surfaces |
| `text(context)` | `#1E293B` | White | Primary text |
| `textSecondary(context)` | `#64748B` | `#94A3B8` | Secondary text |
| `border(context)` | `#E2E8F0` | `rgba(255,255,255,0.05)` | Borders, dividers |
| `primary(context)` | `#2DD4BF` | `#2DD4BF` | Primary brand |
| `accentTeal` | `#2DD4BF` | `#2DD4BF` | Accent color (static) |
| `errorRed` | `#EF4444` | `#EF4444` | Error states (static) |
| `highlightLime` | `#84CC16` | `#84CC16` | Highlights (static) |

### 8.2 ThemeData Generation

```dart
static ThemeData getTheme(Brightness brightness) {
  final isDark = brightness == Brightness.dark;
  return ThemeData(
    brightness: brightness,
    scaffoldBackgroundColor: isDark ? const Color(0xFF0F172A) : Colors.white,
    colorScheme: ColorScheme.fromSeed(
      seedColor: accentTeal,
      brightness: brightness,
    ),
    // ... additional theme configuration
  );
}
```

### 8.3 Static Color Accessors

```dart
static Color bg(BuildContext context) => Theme.of(context).scaffoldBackgroundColor;
static Color card(BuildContext context) => isDark ? const Color(0xFF1E293B) : Colors.white;
static Color surface(BuildContext context) => isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC);
static Color text(BuildContext context) => isDark ? Colors.white : const Color(0xFF1E293B);
static Color textSecondary(BuildContext context) => isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
static Color border(BuildContext context) => isDark ? Colors.white.withValues(alpha: 0.05) : const Color(0xFFE2E8F0);
static Color primary(BuildContext context) => accentTeal;
```

---

## 9. SharedPreferences Keys

| Key | Type | Owner | Default |
|-----|------|-------|---------|
| `is_dark_mode` | `bool` | `ThemeController` | `false` |
| `biometric_lock_enabled` | `bool` | `SecurityController` | `false` |
| `is_logged_in` | `bool` | `LoginDevicesScreen` | `false` |
| `security_pillar_*` | `bool` | `SecurityController` | `false` |
| `reports_selected_semester` | `String` | `ReportsController` | null |
| `reports_month_filter` | `int` | `ReportsController` | null |

---

## 10. ChangePasswordScreen Specifications

### 10.1 Form Layout

```
SingleChildScrollView (padding: 24)
└── Form (_formKey)
    ├── Description: "Update your credentials to keep your account secure."
    ├── [if error] Error banner (red bg, error icon, message)
    ├── _buildPasswordField("Current Password")
    │   └── TextFormField (obscure: !_oldPasswordVisible)
    │       └── validator: required
    ├── _buildPasswordField("New Password")
    │   └── TextFormField (obscure: !_newPasswordVisible)
    │       └── validator: required, min 6 chars
    ├── _buildPasswordField("Confirm New Password")
    │   └── TextFormField (obscure: !_confirmPasswordVisible)
    │       └── validator: must match new password
    └── ElevatedButton("UPDATE PASSWORD", height: 56, bg: primary)
```

### 10.2 Password Field Widget

```dart
_buildPasswordField({
  required String label,
  required TextEditingController controller,
  required bool isVisible,
  required VoidCallback onToggleVisibility,
  String? Function(String?)? validator,
})
```

- **Input decoration:** Filled, surface color, no border, radius 12
- **Suffix icon:** Eye toggle (`visibility_rounded` / `visibility_off_rounded`)
- **Label:** Above field, 14px, semi-bold

### 10.3 Error Handling

| Firebase Code | User Message |
|---------------|-------------|
| `wrong-password` | "Current password is incorrect." |
| `weak-password` | "The new password is too weak." |
| Other | `e.message` or "An error occurred. Please try again." |
| Non-Firebase | "An unexpected error occurred." |

---

## 11. LoginDevicesScreen Specifications

### 11.1 Data Loading

```dart
Future<void> _loadAll() async {
  _localDevice = await HardwareService.getDeviceSnapshot(forceRefresh: true);
  _serverSessions = await SessionManagementService().getActiveSessions();
}
```

### 11.2 Device Card Layout

```
Container (margin: bottom 12, padding: 16, radius: 16)
├── [current] → Border: teal@0.3, width 1.5
├── [other] → Border: default
├── Row
│   ├── Container (android icon, green@0.1 bg, radius 12)
│   ├── Column (name + IP/subtitle)
│   │   └── [current] → "CURRENT DEVICE" badge (teal@0.1 bg)
│   └── Chevron icon
```

### 11.3 Session Revocation Flow

```
_revokeSession(session)
├── showDialog("Log Out Device?", "End the session on $name?")
│   ├── CANCEL → return
│   └── LOG OUT (red) → proceed
├── SessionManagementService().revokeSession(session.sessionId)
├── [success] → SnackBar "Logged out from $name" → _loadAll()
└── [fail] → SnackBar "Failed to log out device"
```

### 11.4 Logout This Device Flow

```
_handleLogoutThisDevice()
├── showDialog("Log Out This Device?", "You will be signed out from this device.")
│   ├── CANCEL → return
│   └── LOG OUT (red) → proceed
├── AuthRepository.signOut()
├── FacultyService.clear()
├── SharedPreferences.setBool('is_logged_in', false)
└── Navigator.pushAndRemoveUntil → LoginScreen
```

---

## 12. ProfileScreen Settings Sections

### 12.1 Appearance Settings

```dart
Widget _buildThemeToggle() {
  return Switch.adaptive(
    value: ThemeController.themeMode.value == ThemeMode.dark,
    onChanged: (_) => ThemeController.toggle(),
    activeColor: AppTheme.accentTeal,
  );
}
```

### 12.2 Security & Access Tiles

| Tile | Icon | Screen |
|------|------|--------|
| Change Password | `Icons.lock_reset` | `ChangePasswordScreen` |
| Login Devices | `Icons.devices_other_rounded` | `LoginDevicesScreen` |

### 12.3 Identification Tiles

| Tile | Icon | Action |
|------|------|--------|
| Digital ID Card | `Icons.badge_outlined` | `_showDigitalIdCard()` |
| QR Code ID | `Icons.qr_code_2_rounded` | `_showQRCodeID()` |

### 12.4 Help & Support Tiles

| Tile | Icon | Screen |
|------|------|--------|
| About IntelliAttend | `Icons.info_outline_rounded` | `AboutAppPage` |
| Help Center | `Icons.help_outline_rounded` | `HelpCenterPage` |
| Report an Issue | `Icons.mail_outline_rounded` | `ReportIssuePage` |

---

## 13. Styling Specifications

### 13.1 SettingsScreen Colors (Hardcoded Dark Theme)

| Element | Color | Notes |
|---------|-------|-------|
| Scaffold bg | `#0F172A` | Deep navy |
| Card bg | `#1E293B` | Slightly lighter navy |
| TextField bg | `#0F172A` | Same as scaffold |
| TextField enabled border | `#475569` | Slate |
| TextField focused border | `#3B82F6` | Blue |
| Save button bg | `#10B981` | Green |
| RESET button border | `#475569` | Slate |
| Warning text | `#FBBF24` | Yellow |
| Step number bg | `#3B82F6` | Blue |
| Title text | White | |
| Subtitle text | `#94A3B8` | Slate |

**Note:** SettingsScreen uses hardcoded dark colors rather than `AppTheme` tokens. This is intentional for developer/admin use.

### 13.2 AppDrawer Colors

| Element | Source |
|---------|--------|
| Drawer bg | `AppTheme.surface(context)` |
| Profile header bg | `AppTheme.accentTeal` |
| Menu item icon bg | `iconColor.withValues(alpha: 0.05)` |
| Menu item title | `AppTheme.text(context)`, 15px bold |
| Menu item subtitle | `AppTheme.textSecondary(context)`, 12px |
| Section label | `AppTheme.slate500(context).withValues(alpha: 0.6)`, 11px |
| Divider | `AppTheme.border(context)`, indent 24 |
| Sign Out | `AppTheme.errorRed` |

---

## 14. Edge Cases

| Case | Behavior |
|------|----------|
| No biometric hardware | `authenticate()` auto-unlocks and returns true |
| Biometric auth timeout (15s) | Returns false, stays locked |
| Bypass detection (< 350ms) | `_bypassDetected = true`, stays locked, no retry |
| Empty server URL | No validation — save allows empty string |
| Invalid URL format | No validation — user responsible for format |
| Concurrent password change | Firebase handles race condition |
| Revoking own session via dialog | Not possible — current device not shown as revocable |
| All sessions revoked | Empty state (no devices shown beyond current) |
| SharedPreferences write fails | Caught silently, setting not persisted |
| App killed while locked | `is_logged_in` persists, biometric lock re-checked on next launch |
| Root detected at startup | Scorched earth: sign out + delete keys + report to server |

---

## 15. Performance Considerations

1. **Theme toggle is instant:** `ThemeController.toggle()` updates `ValueNotifier`, all `ValueListenableBuilder`s rebuild.
2. **SecurityController lifecycle:** Uses `WidgetsBindingObserver` — no polling, event-driven.
3. **Device list lazy load:** `LoginDevicesScreen._loadAll()` called on `initState`, refreshed via pull-to-refresh.
4. **Settings screen is stateless beyond URL field:** No complex state management, pure `StatefulWidget`.

---

## 16. Known Tech Debt

1. **SettingsScreen uses hardcoded dark colors** (`#0F172A`, `#1E293B`) instead of `AppTheme` tokens — breaks in light mode.
2. **No settings_controller.dart** — SettingsScreen manages its own state inline.
3. **Theme toggle duplicated** in both ProfileScreen and AppDrawer — should be a shared widget.
4. **No notification preferences screen** — notifications are always-on with no user toggle.
5. **No language/locale settings** — hardcoded to English.
6. **No data/storage management** — no cache clear, no data export.
7. **Server URL has no validation** — user can enter invalid formats.
8. **ChangePasswordScreen** has no password strength indicator.
9. **LoginDevicesScreen** device detail navigation exists but `DeviceDetailScreen` is not documented here.
10. **SecurityController** is a 378-line god class mixing biometric lock, root detection, permission checking, and scorched earth protocol.
