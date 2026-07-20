# VOLUME 06: NAVIGATION & ROUTING ARCHITECTURE

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Navigation Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Named Routes | All routes defined as constants, no string literals |
| Route Guards | Authentication and role-based access control |
| Shell Routes | Persistent navigation scaffolds (bottom nav, app bar) |
| Deep Linking | Support for push notification navigation |
| Predictable Back | Consistent back button behavior |

---

## 2. Route Definitions

### 2.1 Route Constants

```dart
class AppRoutes {
  // Authentication
  static const String splash = '/';
  static const String login = '/login';
  static const String biometricSetup = '/biometric-setup';

  // Faculty Shell
  static const String facultyShell = '/faculty';
  static const String facultyDashboard = '/faculty/dashboard';
  static const String facultySessions = '/faculty/sessions';
  static const String facultyAttendance = '/faculty/attendance';
  static const String facultyReports = '/faculty/reports';
  static const String facultySettings = '/faculty/settings';

  // Student Shell
  static const String studentShell = '/student';
  static const String studentHome = '/student/home';
  static const String studentScan = '/student/scan';
  static const String studentHistory = '/student/history';
  static const String studentNotifications = '/student/notifications';
  static const String studentSettings = '/student/settings';

  // HOD Shell
  static const String hodShell = '/hod';
  static const String hodDashboard = '/hod/dashboard';
  static const String hodFaculty = '/hod/faculty';
  static const String hodCourses = '/hod/courses';
  static const String hodReports = '/hod/reports';
  static const String hodSettings = '/hod/settings';

  // Admin Shell
  static const String adminShell = '/admin';
  static const String adminDashboard = '/admin/dashboard';
  static const String adminUsers = '/admin/users';
  static const String adminCourses = '/admin/courses';
  static const String adminSettings = '/admin/settings';

  // Shared
  static const String sessionDetail = '/session/:id';
  static const String studentDetail = '/student/:id';
  static const String courseDetail = '/course/:id';
  static const String reportExport = '/report/export';
}
```

### 2.2 Route Table

| Route | Screen | Auth Required | Roles | Shell |
|-------|--------|---------------|-------|-------|
| `/` | SplashScreen | No | All | None |
| `/login` | LoginScreen | No | None | None |
| `/biometric-setup` | BiometricSetupScreen | Yes | All | None |
| `/faculty/dashboard` | FacultyDashboardScreen | Yes | Faculty, HOD | FacultyShell |
| `/faculty/sessions` | SessionsListScreen | Yes | Faculty, HOD | FacultyShell |
| `/faculty/attendance` | AttendanceMarkingScreen | Yes | Faculty | FacultyShell |
| `/faculty/reports` | ReportsScreen | Yes | Faculty, HOD | FacultyShell |
| `/faculty/settings` | SettingsScreen | Yes | All | FacultyShell |
| `/student/home` | StudentHomeScreen | Yes | Student | StudentShell |
| `/student/scan` | QRScannerScreen | Yes | Student | StudentShell |
| `/student/history` | AttendanceHistoryScreen | Yes | Student | StudentShell |
| `/student/notifications` | NotificationsScreen | Yes | Student | StudentShell |
| `/student/settings` | SettingsScreen | Yes | Student | StudentShell |
| `/hod/dashboard` | HODDashboardScreen | Yes | HOD | HODShell |
| `/hod/faculty` | FacultyManagementScreen | Yes | HOD | HODShell |
| `/hod/courses` | CourseManagementScreen | Yes | HOD | HODShell |
| `/hod/reports` | ReportsScreen | Yes | HOD | HODShell |
| `/hod/settings` | SettingsScreen | Yes | HOD | HODShell |
| `/admin/dashboard` | AdminDashboardScreen | Yes | Admin, SuperAdmin | AdminShell |
| `/admin/users` | UserManagementScreen | Yes | Admin, SuperAdmin | AdminShell |
| `/admin/courses` | CourseManagementScreen | Yes | Admin, SuperAdmin | AdminShell |
| `/admin/settings` | SettingsScreen | Yes | Admin, SuperAdmin | AdminShell |
| `/session/:id` | SessionDetailScreen | Yes | Faculty, HOD | None |
| `/student/:id` | StudentDetailScreen | Yes | Faculty, HOD | None |
| `/course/:id` | CourseDetailScreen | Yes | All authenticated | None |
| `/report/export` | ReportExportScreen | Yes | Faculty, HOD, Admin | None |

---

## 3. Route Guards

### 3.1 Authentication Guard

```dart
class AuthGuard extends RouteGuard {
  @override
  Future<bool> canNavigate(BuildContext context, String route, Object? arguments) async {
    final authController = context.read<AuthController>();

    if (!authController.isAuthenticated) {
      // Redirect to login
      Navigator.pushReplacementNamed(context, AppRoutes.login);
      return false;
    }

    return true;
  }
}
```

### 3.2 Role-Based Guard

```dart
class RoleGuard extends RouteGuard {
  final List<UserRole> allowedRoles;

  RoleGuard(this.allowedRoles);

  @override
  Future<bool> canNavigate(BuildContext context, String route, Object? arguments) async {
    final authController = context.read<AuthController>();
    final user = authController.currentUser;

    if (user == null || !allowedRoles.contains(user.role)) {
      // Redirect to appropriate dashboard
      _redirectToDashboard(context, user?.role);
      return false;
    }

    return true;
  }

  void _redirectToDashboard(BuildContext context, UserRole? role) {
    switch (role) {
      case UserRole.student:
        Navigator.pushReplacementNamed(context, AppRoutes.studentShell);
        break;
      case UserRole.faculty:
        Navigator.pushReplacementNamed(context, AppRoutes.facultyShell);
        break;
      case UserRole.hod:
        Navigator.pushReplacementNamed(context, AppRoutes.hodShell);
        break;
      case UserRole.admin:
      case UserRole.superAdmin:
        Navigator.pushReplacementNamed(context, AppRoutes.adminShell);
        break;
      default:
        Navigator.pushReplacementNamed(context, AppRoutes.login);
    }
  }
}
```

### 3.3 Biometric Guard

```dart
class BiometricGuard extends RouteGuard {
  @override
  Future<bool> canNavigate(BuildContext context, String route, Object? arguments) async {
    final securityController = context.read<SecurityController>();

    if (securityController.isBiometricEnabled && securityController.isLocked) {
      // Prompt biometric authentication
      final authenticated = await securityController.authenticateWithBiometric();

      if (!authenticated) {
        return false;
      }
    }

    return true;
  }
}
```

---

## 4. Shell Routes

### 4.1 Faculty Shell

```dart
class FacultyShell extends StatelessWidget {
  final Widget child;

  const FacultyShell({required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('IntelliAttend'),
        actions: [
          // Notification bell
          // Profile menu
        ],
      ),
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _getSelectedIndex(context),
        onDestinationSelected: (index) => _onItemTapped(index, context),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.event_outlined),
            selectedIcon: Icon(Icons.event),
            label: 'Sessions',
          ),
          NavigationDestination(
            icon: Icon(Icons.how_to_reg_outlined),
            selectedIcon: Icon(Icons.how_to_reg),
            label: 'Attendance',
          ),
          NavigationDestination(
            icon: Icon(Icons.assessment_outlined),
            selectedIcon: Icon(Icons.assessment),
            label: 'Reports',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }

  int _getSelectedIndex(BuildContext context) {
    final path = GoRouterState.of(context).uri.path;
    if (path.contains('/dashboard')) return 0;
    if (path.contains('/sessions')) return 1;
    if (path.contains('/attendance')) return 2;
    if (path.contains('/reports')) return 3;
    if (path.contains('/settings')) return 4;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go(AppRoutes.facultyDashboard);
        break;
      case 1:
        context.go(AppRoutes.facultySessions);
        break;
      case 2:
        context.go(AppRoutes.facultyAttendance);
        break;
      case 3:
        context.go(AppRoutes.facultyReports);
        break;
      case 4:
        context.go(AppRoutes.facultySettings);
        break;
    }
  }
}
```

### 4.2 Student Shell

```dart
class StudentShell extends StatelessWidget {
  final Widget child;

  const StudentShell({required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('IntelliAttend'),
        actions: [
          // Notification badge
          // Profile menu
        ],
      ),
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _getSelectedIndex(context),
        onDestinationSelected: (index) => _onItemTapped(index, context),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.qr_code_scanner_outlined),
            selectedIcon: Icon(Icons.qr_code_scanner),
            label: 'Scan',
          ),
          NavigationDestination(
            icon: Icon(Icons.history_outlined),
            selectedIcon: Icon(Icons.history),
            label: 'History',
          ),
          NavigationDestination(
            icon: Icon(Icons.notifications_outlined),
            selectedIcon: Icon(Icons.notifications),
            label: 'Notifications',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
```

---

## 5. Navigation Service

### 5.1 Global Navigation Key

```dart
class NavigationService {
  static final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  static BuildContext get context => navigatorKey.currentContext!;

  // Navigation methods
  static Future<T?> pushNamed<T>(String route, {Object? arguments}) {
    return navigatorKey.currentState!.pushNamed<T>(route, arguments: arguments);
  }

  static Future<T?> pushReplacementNamed<T>(String route, {Object? arguments}) {
    return navigatorKey.currentState!.pushReplacementNamed<T>(route, arguments: arguments);
  }

  static void pop<T>([T? result]) {
    navigatorKey.currentState!.pop<T>(result);
  }

  static void popUntil(String route) {
    navigatorKey.currentState!.popUntil(ModalRoute.withName(route));
  }

  // Deep link handling
  static Future<void> handleDeepLink(String link) {
    final uri = Uri.parse(link);
    return pushNamed(uri.path, arguments: uri.queryParameters);
  }
}
```

### 5.2 Push Notification Navigation

```dart
class NotificationNavigation {
  static void handleNotificationTap(Map<String, dynamic> data) {
    final type = data['type'];
    final targetId = data['targetId'];

    switch (type) {
      case 'session_started':
        NavigationService.pushNamed(
          AppRoutes.sessionDetail,
          arguments: {'sessionId': targetId},
        );
        break;
      case 'attendance_marked':
        NavigationService.pushNamed(
          AppRoutes.studentHistory,
        );
        break;
      case 'low_attendance_alert':
        NavigationService.pushNamed(
          AppRoutes.studentDetail,
          arguments: {'studentId': targetId},
        );
        break;
    }
  }
}
```

---

## 6. Deep Linking Configuration

### 6.1 URL Patterns

| Pattern | Screen | Parameters |
|---------|--------|------------|
| `intelliattend://session/{id}` | SessionDetailScreen | sessionId |
| `intelliattend://student/{id}` | StudentDetailScreen | studentId |
| `intelliattend://course/{id}` | CourseDetailScreen | courseId |
| `intelliattend://attendance/history` | AttendanceHistoryScreen | - |
| `intelliattend://scan` | QRScannerScreen | - |

### 6.2 Firebase Dynamic Links (Web)

| Domain | Path | Screen |
|--------|------|--------|
| `intelliattend.page.link` | `/session/{id}` | SessionDetailScreen |
| `intelliattend.page.link` | `/student/{id}` | StudentDetailScreen |
| `intelliattend.page.link` | `/report/{id}` | ReportExportScreen |

---

## 7. Back Navigation Behavior

### 7.1 Back Button Rules

| Scenario | Behavior |
|----------|----------|
| On root tab | Exit app (Android) |
| On nested screen | Pop to parent |
| On modal | Close modal |
| On search | Close search, clear query |
| On scanner | Return to home tab |

### 7.2 WillPopScope

```dart
// Prevent back navigation during critical operations
WillPopScope(
  onWillPop: () async {
    if (isMarkingAttendance) {
      // Show confirmation dialog
      return await _showDiscardDialog();
    }
    return true;
  },
  child: ...,
)
```

---

*All navigation must be handled through the NavigationService. Never use `Navigator.of(context)` directly except in shell routes.*