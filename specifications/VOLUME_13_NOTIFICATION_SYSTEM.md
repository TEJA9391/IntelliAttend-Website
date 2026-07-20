# VOLUME 13: NOTIFICATION SYSTEM

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Notification Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Relevant | Only send notifications users care about |
| Timely | Deliver at the right moment |
| Actionable | Provide clear next steps |
| Respectful | Allow users to control notification frequency |
| Multi-Channel | Push, in-app, and email (future) |

---

## 2. Notification Types

### 2.1 Type Definitions

```dart
enum NotificationType {
  // Attendance-related
  attendanceMarked,        // "Your attendance has been marked for CS101"
  attendanceLate,          // "You were marked late for CS101"
  attendanceAbsent,        // "You were marked absent for CS101"
  attendanceOverride,      // "Your attendance was updated by Dr. Smith"
  
  // Session-related
  sessionStarted,          // "CS101 session has started"
  sessionEnding,           // "CS101 session ends in 5 minutes"
  sessionEnded,            // "CS101 session has ended"
  
  // Alert-related
  lowAttendance,           // "Warning: Your attendance is below 75%"
  criticalAttendance,      // "Critical: Your attendance is below 60%"
  
  // System
  systemMaintenance,       // "Scheduled maintenance on July 20th"
  systemUpdate,            // "New version available"
  
  // Administrative
  accountCreated,          // "Your account has been created"
  passwordChanged,         // "Your password was changed"
  roleChanged,             // "Your role has been updated"
}
```

### 2.2 Notification Templates

```dart
class NotificationTemplates {
  static Map<NotificationType, String> templates = {
    NotificationType.attendanceMarked: 
        'Your attendance has been marked for {courseCode}',
    NotificationType.attendanceLate:
        'You were marked late for {courseCode} (arrived {minutesLate} min late)',
    NotificationType.attendanceAbsent:
        'You were marked absent for {courseCode}',
    NotificationType.sessionStarted:
        '{courseCode} session has started in {room}',
    NotificationType.lowAttendance:
        'Warning: Your attendance in {courseCode} is {percentage}%',
    NotificationType.criticalAttendance:
        'Critical: Your attendance in {courseCode} is {percentage}%. Please meet with your HOD.',
  };

  static String render(NotificationType type, Map<String, String> params) {
    String template = templates[type] ?? 'Notification';
    params.forEach((key, value) {
      template = template.replaceAll('{$key}', value);
    });
    return template;
  }
}
```

---

## 3. Push Notification System

### 3.1 Firebase Cloud Messaging Configuration

```dart
class PushNotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  Future<void> initialize() async {
    // Request permission
    final settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      // Get token
      final token = await _messaging.getToken();
      await _registerToken(token);

      // Listen for token refresh
      _messaging.onTokenRefresh.listen(_registerToken);

      // Handle foreground messages
      FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

      // Handle background messages
      FirebaseMessaging.onBackgroundMessage(_handleBackgroundMessage);

      // Handle notification tap
      FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);
    }
  }

  Future<void> _registerToken(String? token) async {
    if (token == null) return;
    
    await ApiService.registerDeviceToken(token);
  }

  void _handleForegroundMessage(RemoteMessage message) {
    // Show in-app notification
    InAppNotificationService.show(
      title: message.notification?.title ?? '',
      body: message.notification?.body ?? '',
      data: message.data,
    );
  }

  @pragma('vm:entry-point')
  static Future<void> _handleBackgroundMessage(RemoteMessage message) async {
    // Process background message
    await BackgroundService.processNotification(message.data);
  }

  void _handleNotificationTap(RemoteMessage message) {
    // Navigate to relevant screen
    NotificationNavigation.handleNotificationTap(message.data);
  }
}
```

### 3.2 Topic Subscriptions

```dart
class NotificationTopics {
  static const String allStudents = 'all_students';
  static const String allFaculty = 'all_faculty';
  static const String allHods = 'all_hods';
  static const String systemAlerts = 'system_alerts';

  static Future<void> subscribeToRole(String role) async {
    switch (role) {
      case 'student':
        await FirebaseMessaging.instance.subscribeToTopic(allStudents);
        break;
      case 'faculty':
        await FirebaseMessaging.instance.subscribeToTopic(allFaculty);
        break;
      case 'hod':
        await FirebaseMessaging.instance.subscribeToTopic(allHods);
        break;
    }
  }

  static Future<void> subscribeToCourse(String courseId) async {
    await FirebaseMessaging.instance.subscribeToTopic('course_$courseId');
  }

  static Future<void> unsubscribeFromCourse(String courseId) async {
    await FirebaseMessaging.instance.unsubscribeFromTopic('course_$courseId');
  }
}
```

---

## 4. In-App Notification System

### 4.1 Notification Manager

```dart
class InAppNotificationManager {
  final List<Notification> _notifications = [];
  final StreamController<List<Notification>> _controller =
      StreamController<List<Notification>>.broadcast();

  Stream<List<Notification>> get notifications => _controller.stream;

  void add(Notification notification) {
    _notifications.insert(0, notification);
    _controller.add(_notifications);
  }

  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      _controller.add(_notifications);
    }
  }

  void markAllAsRead() {
    for (var i = 0; i < _notifications.length; i++) {
      _notifications[i] = _notifications[i].copyWith(isRead: true);
    }
    _controller.add(_notifications);
  }

  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  void clear() {
    _notifications.clear();
    _controller.add(_notifications);
  }
}
```

### 4.2 Notification Widget

```dart
class NotificationBell extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<Notification>>(
      stream: context.read<InAppNotificationManager>().notifications,
      builder: (context, snapshot) {
        final unreadCount = snapshot.data?.where((n) => !n.isRead).length ?? 0;

        return Stack(
          children: [
            IconButton(
              icon: const Icon(Icons.notifications_outlined),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => NotificationsScreen(),
                  ),
                );
              },
            ),
            if (unreadCount > 0)
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '$unreadCount',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}
```

---

## 5. Notification Preferences

### 5.1 Preference Model

```dart
class NotificationPreferences {
  final bool pushEnabled;
  final bool inAppEnabled;
  final Map<NotificationType, bool> typePreferences;

  NotificationPreferences({
    this.pushEnabled = true,
    this.inAppEnabled = true,
    this.typePreferences = const {},
  });

  bool isTypeEnabled(NotificationType type) {
    if (!pushEnabled && !inAppEnabled) return false;
    return typePreferences[type] ?? true;
  }

  NotificationPreferences copyWith({
    bool? pushEnabled,
    bool? inAppEnabled,
    Map<NotificationType, bool>? typePreferences,
  }) {
    return NotificationPreferences(
      pushEnabled: pushEnabled ?? this.pushEnabled,
      inAppEnabled: inAppEnabled ?? this.inAppEnabled,
      typePreferences: typePreferences ?? this.typePreferences,
    );
  }
}
```

### 5.2 Preferences Screen

```dart
class NotificationPreferencesScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notification Preferences')),
      body: Consumer<NotificationController>(
        builder: (context, controller, child) {
          return ListView(
            children: [
              SwitchListTile(
                title: const Text('Push Notifications'),
                subtitle: const Text('Receive notifications on your device'),
                value: controller.preferences.pushEnabled,
                onChanged: (value) {
                  controller.updatePreferences(
                    controller.preferences.copyWith(pushEnabled: value),
                  );
                },
              ),
              SwitchListTile(
                title: const Text('In-App Notifications'),
                subtitle: const Text('Show notifications in the app'),
                value: controller.preferences.inAppEnabled,
                onChanged: (value) {
                  controller.updatePreferences(
                    controller.preferences.copyWith(inAppEnabled: value),
                  );
                },
              ),
              const Divider(),
              const Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'Notification Types',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              ...NotificationType.values.map((type) {
                return SwitchListTile(
                  title: Text(_getTypeName(type)),
                  subtitle: Text(_getTypeDescription(type)),
                  value: controller.preferences.isTypeEnabled(type),
                  onChanged: (value) {
                    final newPrefs = Map<NotificationType, bool>.from(
                      controller.preferences.typePreferences,
                    );
                    newPrefs[type] = value;
                    controller.updatePreferences(
                      controller.preferences.copyWith(typePreferences: newPrefs),
                    );
                  },
                );
              }),
            ],
          );
        },
      ),
    );
  }

  String _getTypeName(NotificationType type) {
    switch (type) {
      case NotificationType.attendanceMarked:
        return 'Attendance Marked';
      case NotificationType.lowAttendance:
        return 'Low Attendance Alert';
      // ... other cases
    }
  }

  String _getTypeDescription(NotificationType type) {
    switch (type) {
      case NotificationType.attendanceMarked:
        return 'When your attendance is marked';
      case NotificationType.lowAttendance:
        return 'When attendance falls below 75%';
      // ... other cases
    }
  }
}
```

---

## 6. Notification Scheduling

### 6.1 Scheduled Notifications

```dart
class NotificationScheduler {
  static Future<void> scheduleSessionReminder({
    required AttendanceSession session,
    required Duration beforeSession,
  }) async {
    final scheduledTime = session.scheduledStartTime.subtract(beforeSession);

    await FlutterLocalNotificationPlugin().zonedSchedule(
      session.id.hashCode,
      'Upcoming Session',
      '${session.courseCode} starts in ${beforeSession.inMinutes} minutes',
      tz.TZDateTime.from(scheduledTime, tz.local),
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'session_reminders',
          'Session Reminders',
          importance: Importance.high,
          priority: Priority.high,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
    );
  }

  static Future<void> scheduleAttendanceReminder({
    required String courseId,
    required String courseCode,
    required TimeOfDay reminderTime,
  }) async {
    await FlutterLocalNotificationPlugin().zonedSchedule(
      courseId.hashCode,
      'Attendance Reminder',
      'Don\'t forget to mark your attendance for $courseCode',
      _nextInstanceOfTime(reminderTime),
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'attendance_reminders',
          'Attendance Reminders',
          importance: Importance.defaultImportance,
          priority: Priority.defaultPriority,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      matchDateTimeComponents: DateTimeComponents.time,
    );
  }

  static tz.TZDateTime _nextInstanceOfTime(TimeOfDay time) {
    final now = tz.TZDateTime.now(tz.local);
    var scheduledDate = tz.TZDateTime(
      tz.local,
      now.year,
      now.month,
      now.day,
      time.hour,
      time.minute,
    );
    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }
    return scheduledDate;
  }
}
```

---

## 7. Notification Analytics

### 7.1 Tracking Events

```dart
class NotificationAnalytics {
  static void trackNotificationReceived({
    required String notificationId,
    required NotificationType type,
    required String channel,
  }) {
    AnalyticsService.trackEvent('notification_received', {
      'notification_id': notificationId,
      'type': type.name,
      'channel': channel,
    });
  }

  static void trackNotificationOpened({
    required String notificationId,
    required NotificationType type,
  }) {
    AnalyticsService.trackEvent('notification_opened', {
      'notification_id': notificationId,
      'type': type.name,
    });
  }

  static void trackNotificationDismissed({
    required String notificationId,
    required NotificationType type,
  }) {
    AnalyticsService.trackEvent('notification_dismissed', {
      'notification_id': notificationId,
      'type': type.name,
    });
  }
}
```

---

*Notifications are a privilege, not a right. Respect user preferences and only send notifications that provide value.*