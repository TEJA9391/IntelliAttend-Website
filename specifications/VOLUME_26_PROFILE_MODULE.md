# Volume 26: Profile Module Specification

## 1. Module Overview

The Profile Module provides faculty profile display, profile photo management, digital identity cards, QR code verification, appearance settings, and navigation to security/help screens. It is a single-screen module (`ProfileScreen`) with 952 lines, supplemented by a QR scanner screen.

**Module boundary:** `ProfileScreen` (952 lines) and `QRScannerScreen`.

---

## 2. File Inventory

| File | Lines | Responsibility |
|------|-------|----------------|
| `Profile/profile_screen.dart` | 952 | Profile display, photo management, ID cards, QR, settings links |
| `Profile/qr_scanner_screen.dart` | ~150 | QR code scanner with camera |

---

## 3. Widget Hierarchy

```
ProfileScreen (StatefulWidget)
├── Scaffold (bg: AppTheme.bg)
│   ├── CustomAppBar (title: "Profile", showBackButton: false)
│   │   └── Actions: QR scanner icon button
│   └── ListView (padding: 24h, 16v, BouncingScrollPhysics)
│       │
│       ├── SECTION: Profile Header
│       │   └── Row
│       │       ├── Stack (avatar + camera badge)
│       │       │   ├── CircleAvatar (80x80, border: primary 2px)
│       │       │   │   ├── [has image] → CachedNetworkImage / FileImage
│       │       │   │   └── [no image] → default avatar URL
│       │       │   └── Camera badge (bottom-right, primary bg)
│       │       │       └── onTap → _showProfileHeaderOptions()
│       │       └── Column (name, department, designation badge)
│       │           ├── Text(p.name, 22px, w900, letterSpacing: -0.5)
│       │           ├── Text(p.department, 14px, w500)
│       │           └── Container (designation, 10px, w800, primary@0.1 bg)
│       │
│       ├── SECTION: "Registration Identity"
│       │   ├── _buildPlainRow("Faculty Name", p.name)
│       │   ├── _buildPlainRow("Designation", p.designation)
│       │   ├── _buildPlainRow("Department", p.department)
│       │   └── _buildPlainRow("Official Email", p.email)
│       │
│       ├── SECTION: "Appearance Settings"
│       │   └── _buildThemeToggle()
│       │       └── ListTile
│       │           ├── leading: dark/light mode icon (circle bg)
│       │           ├── title: "Appearance"
│       │           ├── subtitle: "Dark Theme" / "Light Theme"
│       │           └── trailing: Switch.adaptive → ThemeController.toggle()
│       │
│       ├── SECTION: "Security & Access"
│       │   ├── _buildInteractiveTile → ChangePasswordScreen
│       │   │   ├── icon: lock_reset
│       │   │   ├── title: "Change Password"
│       │   │   └── subtitle: "Update credentials"
│       │   └── _buildInteractiveTile → LoginDevicesScreen
│       │       ├── icon: devices_other_rounded
│       │       ├── title: "Login Devices"
│       │       └── subtitle: "Manage sessions"
│       │
│       ├── SECTION: "Identification"
│       │   ├── _buildInteractiveTile → _showDigitalIdCard()
│       │   │   ├── icon: badge_outlined
│       │   │   ├── title: "Digital ID Card"
│       │   │   └── subtitle: "View Virtual Faculty ID"
│       │   └── _buildInteractiveTile → _showQRCodeID()
│       │       ├── icon: qr_code_2_rounded
│       │       ├── title: "QR Code ID"
│       │       └── subtitle: "Personal verification code"
│       │
│       ├── SECTION: "Help & Support"
│       │   ├── _buildInteractiveTile → AboutAppPage
│       │   ├── _buildInteractiveTile → HelpCenterPage
│       │   └── _buildInteractiveTile → ReportIssuePage
│       │
│       └── Footer
│           ├── "INTELLIATTEND FACULTY" (12px, w900, letterSpacing: 2)
│           └── "© 2026 IntelliAttend Technologies. All Rights Reserved." (9px)
```

---

## 4. Section Specifications

### 4.1 Profile Header

**Avatar:**
- Size: 80x80 CircleAvatar
- Border: `AppTheme.primary(context)` 2px
- Shadow: `Colors.black@0.05`, blur 10, offset (0,4)
- Source: `FacultyService.profile.value.profileImage`
  - HTTP URL → `CachedNetworkImageProvider`
  - Local path → `FileImage`
  - Null → default avatar: `https://ui-avatars.com/api/?name=Faculty+User&background=2DD4BF&color=000`

**Camera Badge:**
- Position: Bottom-right of avatar stack
- Size: ~24px circle
- Background: `AppTheme.primary(context)`
- Border: `AppTheme.bg(context)` 2px
- Icon: `Icons.camera_alt` (12px, white)
- Tap → `_showProfileHeaderOptions()`

**Name/Info:**
- Name: 22px, w900, letterSpacing: -0.5
- Department: 14px, w500, textSecondary
- Designation badge: 10px, w800, primary color, primary@0.1 background, radius 4

### 4.2 Registration Identity

Four `_buildPlainRow` rows:
```
Row:
├── SizedBox(width: 120) → Label (13px, w500, textSecondary)
├── ":" separator
└── Expanded → Value (13px, w700, text)
```

| Label | Value Source |
|-------|-------------|
| Faculty Name | `p.name` |
| Designation | `p.designation` |
| Department | `p.department` |
| Official Email | `p.email` |

### 4.3 Appearance Settings

```dart
_buildThemeToggle()
└── ValueListenableBuilder<ThemeMode>(ThemeController.themeMode)
    └── ListTile
        ├── leading: Circle (primary@0.1 or amber@0.1)
        │   └── Icon (dark_mode_rounded or light_mode_rounded, 20px)
        ├── title: "Appearance" (15px, w600)
        ├── subtitle: "Dark Theme" / "Light Theme" (12px)
        └── trailing: Switch.adaptive
            ├── value: isDark
            ├── activeThumbColor: primary
            └── onChanged: ThemeController.toggle()
```

### 4.4 Security & Access

| Tile | Navigation |
|------|-----------|
| Change Password | `ChangePasswordScreen` (237 lines, Firebase Auth) |
| Login Devices | `LoginDevicesScreen` (297 lines, session management) |

### 4.5 Identification

#### Digital ID Card (`_showDigitalIdCard()`)

Full-screen `Dialog` with gradient card:
- **Size:** 360x230
- **Background:** Linear gradient (primary → `#004D40`)
- **Overlay:** Logo pattern at 5% opacity (tiled)
- **Shadow:** Two layers — black@0.4 blur 20 offset (0,12), primary@0.2 blur 30 offset (0,4)

**Card Content:**
```
├── Top row
│   ├── "INTELLIATTEND" (14px, w900, letterSpacing: 1.5, white)
│   ├── "FACULTY PORTAL" (8px, bold, letterSpacing: 1.2, white@0.6)
│   └── "OFFICIAL" badge (white@0.2 bg, verified icon)
├── Middle row
│   ├── CircleAvatar (36px radius, white@0.1 bg, border: white@0.5 2px)
│   │   └── Profile image (CachedNetworkImage or FileImage)
│   └── Column
│       ├── Name (18px, w900, white, letterSpacing: -0.5)
│       ├── Faculty ID (JetBrains Mono 14px, bold, accentTeal, letterSpacing: 1)
│       └── "designation • department" (10px, w600, white@0.7)
└── Bottom row
    ├── "STATUS" label + "ACTIVE" (12px, w900, white)
    └── Logo image (24px height, white@0.3)
```

#### QR Code ID (`_showQRCodeID()`)

Full-screen `Dialog`:
- Circle icon (qr_code_2_rounded, 32px, primary@0.1 bg)
- "Verification ID" title (20px, w900)
- "Scan this code to verify your identity" subtitle (13px)
- QR code: `QrImageView(data: p.email, size: 200, auto version)
  - White background card (radius 24, shadow blur 20)
  - Eye/module style: square, color `#131B2E`
- Faculty ID: JetBrains Mono 20px, bold, primary, letterSpacing: 2
- "DISMISS" TextButton

---

## 5. Photo Management

### 5.1 Profile Header Options

Triggered by camera badge tap:

```
_showProfileHeaderOptions()
└── showModalBottomSheet (surface bg, radius: 32 top)
    ├── Handle bar (36x4, textSecondary@0.2)
    ├── "Change Photo" option:
    │   ├── Circle icon (add_a_photo_outlined, 32px, primary@0.1 bg)
    │   └── "Change Photo" label (16px, bold)
    └── Disclaimer text (12px, textSecondary@0.6, centered):
        "This photo is used solely for your in-app display..."
```

### 5.2 Image Picker

```
_showImagePicker()
└── showModalBottomSheet (surface bg, radius: 32 top)
    └── Row (spaceEvenly)
        ├── Camera option:
        │   ├── Circle icon (camera_alt_outlined, 32px, primary@0.1 bg)
        │   └── "Camera" label
        └── Gallery option:
            ├── Circle icon (photo_library_outlined, 32px, primary@0.1 bg)
            └── "From Device" label
```

### 5.3 Image Pick Action

```dart
Future<void> _pickImage(ImageSource source) async {
  final picker = ImagePicker();
  final XFile? image = await picker.pickImage(source: source, imageQuality: 85);
  if (image == null) return;
  await FacultyService.updateProfileImage(image.path);
  // Show SnackBar "Profile photo updated"
}
```

**Quality:** 85% (compressed)
**Storage:** Local path via `FacultyService.updateProfileImage()`

### 5.4 Full Image View

```
_showFullImage(context, url)
└── Dialog (transparent bg)
    └── ClipRRect (radius: 20)
        ├── [HTTP] → CachedNetworkImage (placeholder: CircularProgressIndicator)
        └── [local] → Image.file(File(url))
```

---

## 6. QR Scanner

```dart
_openQRScanner()
└── Navigator.push → QRScannerScreen
    └── Returns Map<String, String> { 'value': '...', 'format': '...' }
```

**On result:**
```dart
ScaffoldMessenger.showSnackBar(
  SnackBar(
    content: Text("Scanned ($format): $value"),
    backgroundColor: AppTheme.accentTeal,
    duration: 4 seconds,
    action: SnackBarAction("COPY", white, onPressed: Clipboard.setData),
  ),
);
```

---

## 7. Navigation Targets

| Section | Tile | Destination |
|---------|------|-------------|
| Security & Access | Change Password | `ChangePasswordScreen` |
| Security & Access | Login Devices | `LoginDevicesScreen` |
| Identification | Digital ID Card | Dialog (inline) |
| Identification | QR Code ID | Dialog (inline) |
| Help & Support | About IntelliAttend | `AboutAppPage` |
| Help & Support | Help Center | `HelpCenterPage` |
| Help & Support | Report an Issue | `ReportIssuePage` |
| QR Scanner | AppBar action | `QRScannerScreen` |

---

## 8. Shared Widget Patterns

### 8.1 _buildPlainRow

```dart
Widget _buildPlainRow(String label, String value) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 10),
    child: Row(
      children: [
        SizedBox(width: 120, child: Text(label, ...)),
        Text(":", ...),
        Expanded(child: Text(value, ...)),
      ],
    ),
  );
}
```

### 8.2 _buildInteractiveTile

```dart
Widget _buildInteractiveTile(IconData icon, String title, String subtitle, {VoidCallback? onTap}) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 24),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Row([
        Icon(icon, primary, 24),
        SizedBox(width: 16),
        Expanded(Column([Text(title), Text(subtitle, primary)])),
        Icon(Icons.chevron_right, textSecondary@0.3),
      ]),
    ),
  );
}
```

### 8.3 _buildSettingsTile

```dart
Widget _buildSettingsTile(IconData icon, String title, String value) {
  // Read-only row: icon + title on left, value on right (primary color)
}
```

### 8.4 _buildIdentityCard / _buildIdentityCompact

```dart
// Card format: icon + label + value in a row/column layout
// Used for identity display cards
```

---

## 9. Data Dependencies

| Source | Data | Usage |
|--------|------|-------|
| `FacultyService.profile` | `FacultyProfile?` (ValueNotifier) | All profile data |
| `FacultyService.profile.value.name` | String | Display name |
| `FacultyService.profile.value.email` | String | Email, QR data, faculty ID |
| `FacultyService.profile.value.department` | String | Department |
| `FacultyService.profile.value.designation` | String | Designation badge |
| `FacultyService.profile.value.profileImage` | String? | Avatar, ID card |
| `ThemeController.themeMode` | ValueNotifier<ThemeMode> | Theme toggle state |
| `FacultyService.updateProfileImage(path)` | Future<void> | Save photo |
| `FacultyService.load()` | Future<void> | Refresh profile |

---

## 10. Styling Specifications

### 10.1 Section Headers

```dart
Text("Section Name",
  style: TextStyle(
    color: AppTheme.textSecondary(context).withValues(alpha: 0.5),
    fontWeight: FontWeight.bold,
    fontSize: 13,
    letterSpacing: 1.2,
  ),
)
```

### 10.2 Digital ID Card Gradient

```dart
LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [AppTheme.primary(context), Color(0xFF004D40)],
)
```

### 10.3 QR Code Styling

```dart
QrImageView(
  data: p.email,
  version: QrVersions.auto,
  size: 200.0,
  eyeStyle: QrEyeStyle(eyeShape: QrEyeShape.square, color: Color(0xFF131B2E)),
  dataModuleStyle: QrDataModuleStyle(dataModuleShape: QrDataModuleShape.square, color: Color(0xFF131B2E)),
)
```

---

## 11. Edge Cases

| Case | Behavior |
|------|----------|
| `FacultyService.profile.value` is null | QR/ID dialogs return early without rendering |
| Profile image is null | Falls back to ui-avatars.com default |
| Profile image is local file | Uses `FileImage(File(path))` |
| Profile image URL fails | `CachedNetworkImage` shows error icon |
| QR scanner returns null | No SnackBar shown |
| Image picker cancelled | No action taken |
| `FacultyService.updateProfileImage` fails | SnackBar still shown (no error handling) |
| No internet for profile load | Profile shows cached data from Hive |

---

## 12. Known Tech Debt

1. **952 lines in one file:** ProfileScreen contains ID card dialogs, QR dialogs, image picker logic, and 7 section builders — should be decomposed.
2. **No error handling on photo update:** `FacultyService.updateProfileImage()` result not checked.
3. **No loading state for profile:** Screen immediately renders from cache; no shimmer/skeleton while `FacultyService.load()` completes.
4. **QR code encodes raw email:** No encryption or signing — anyone with the email can generate the same QR.
5. **Digital ID card is static:** "ACTIVE" status is hardcoded, not from server.
6. **`_buildSettingsTile` defined but only used in one place** — should be inlined or removed.
7. **`_buildIdentityCard` and `_buildIdentityCompact` defined but not used** in the current screen layout.
8. **Disclaimer text** about photo not updating institutional records is buried in a bottom sheet — should be more prominent.
9. **No profile edit capability:** Faculty cannot update name, department, or designation from the app.
10. **Camera permission not requested before image pick** — relies on `ImagePicker` to handle it.
