# VOLUME 14: ANALYTICS & REPORTING

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Analytics Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Actionable Insights | Data should drive decisions |
| Real-Time Where Possible | Live data for active sessions |
| Privacy-First | Student data protected |
| Exportable | Reports available in multiple formats |
| Visual | Charts and graphs over raw numbers |

---

## 2. Analytics Data Model

### 2.1 Dashboard Data

```dart
class DashboardData {
  final int todaySessions;
  final double todayAttendance;
  final List<DailyTrend> weeklyTrend;
  final List<SessionSummary> recentSessions;
  final List<Alert> alerts;
  final DepartmentStats? departmentStats; // HOD only

  DashboardData({
    required this.todaySessions,
    required this.todayAttendance,
    required this.weeklyTrend,
    required this.recentSessions,
    required this.alerts,
    this.departmentStats,
  });
}

class DailyTrend {
  final DateTime date;
  final double attendancePercentage;
  final int totalSessions;
  final int totalStudents;

  DailyTrend({
    required this.date,
    required this.attendancePercentage,
    required this.totalSessions,
    required this.totalStudents,
  });
}

class SessionSummary {
  final String sessionId;
  final String courseCode;
  final String courseName;
  final DateTime startTime;
  final double attendancePercentage;
  final int presentCount;
  final int totalCount;

  SessionSummary({
    required this.sessionId,
    required this.courseCode,
    required this.courseName,
    required this.startTime,
    required this.attendancePercentage,
    required this.presentCount,
    required this.totalCount,
  });
}
```

### 2.2 Department Stats (HOD)

```dart
class DepartmentStats {
  final String departmentId;
  final String departmentName;
  final double overallAttendance;
  final List<FacultyPerformance> facultyPerformance;
  final List<CourseAttendance> courseWiseAttendance;
  final List<MonthlyTrend> monthlyTrend;

  DepartmentStats({
    required this.departmentId,
    required this.departmentName,
    required this.overallAttendance,
    required this.facultyPerformance,
    required this.courseWiseAttendance,
    required this.monthlyTrend,
  });
}

class FacultyPerformance {
  final String facultyId;
  final String name;
  final double averageAttendance;
  final int sessionsConducted;
  final int totalStudents;

  FacultyPerformance({
    required this.facultyId,
    required this.name,
    required this.averageAttendance,
    required this.sessionsConducted,
    required this.totalStudents,
  });
}

class CourseAttendance {
  final String courseId;
  final String courseCode;
  final String courseName;
  final double attendancePercentage;
  final int totalSessions;
  final int averageStudents;

  CourseAttendance({
    required this.courseId,
    required this.courseCode,
    required this.courseName,
    required this.attendancePercentage,
    required this.totalSessions,
    required this.averageStudents,
  });
}
```

### 2.3 Student Analytics

```dart
class StudentAnalytics {
  final String studentId;
  final String studentName;
  final double overallAttendance;
  final double trustScore;
  final List<CourseAttendanceDetail> courseDetails;
  final List<AttendanceTrend> attendanceTrend;
  final List<String> alerts;

  StudentAnalytics({
    required this.studentId,
    required this.studentName,
    required this.overallAttendance,
    required this.trustScore,
    required this.courseDetails,
    required this.attendanceTrend,
    required this.alerts,
  });
}

class CourseAttendanceDetail {
  final String courseId;
  final String courseCode;
  final String courseName;
  final double attendancePercentage;
  final int totalSessions;
  final int attendedSessions;
  final int lateArrivals;
  final int absences;

  CourseAttendanceDetail({
    required this.courseId,
    required this.courseCode,
    required this.courseName,
    required this.attendancePercentage,
    required this.totalSessions,
    required this.attendedSessions,
    required this.lateArrivals,
    required this.absences,
  });
}
```

---

## 3. Analytics Service

### 3.1 Analytics Repository

```dart
class AnalyticsRepository {
  final ApiClient _apiClient;
  final CacheService _cacheService;

  AnalyticsRepository({
    required ApiClient apiClient,
    required CacheService cacheService,
  })  : _apiClient = apiClient,
        _cacheService = cacheService;

  Future<DashboardData> getDashboardData() async {
    try {
      final response = await _apiClient.get('/analytics/dashboard');
      final data = DashboardData.fromJson(response.data['data']);
      
      // Cache for offline use
      await _cacheService.cacheDashboard(data);
      
      return data;
    } catch (e) {
      // Return cached data if available
      final cached = await _cacheService.getCachedDashboard();
      if (cached != null) return cached;
      rethrow;
    }
  }

  Future<DepartmentStats> getDepartmentStats(String departmentId) async {
    final response = await _apiClient.get('/analytics/department/$departmentId');
    return DepartmentStats.fromJson(response.data['data']);
  }

  Future<StudentAnalytics> getStudentAnalytics(String studentId) async {
    final response = await _apiClient.get('/analytics/student/$studentId');
    return StudentAnalytics.fromJson(response.data['data']);
  }

  Future<List<DailyTrend>> getAttendanceTrend({
    required String courseId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final response = await _apiClient.get(
      '/analytics/trend',
      queryParameters: {
        'courseId': courseId,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
      },
    );
    return (response.data['data'] as List)
        .map((e) => DailyTrend.fromJson(e))
        .toList();
  }
}
```

---

## 4. Report Generation

### 4.1 Report Types

```dart
enum ReportType {
  sessionReport,        // Single session attendance
  courseReport,         // Course-wise attendance
  studentReport,        // Individual student report
  departmentReport,     // Department-wide report
  monthlyReport,        // Monthly summary
  customReport,         // User-defined parameters
}
```

### 4.2 Report Generator

```dart
class ReportGenerator {
  static Future<Uint8List> generatePDF({
    required ReportType type,
    required Map<String, dynamic> parameters,
  }) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        header: (context) => _buildHeader(type),
        footer: (context) => _buildFooter(context),
        build: (context) => [
          _buildReportContent(type, parameters),
        ],
      ),
    );

    return pdf.save();
  }

  static pw.Widget _buildHeader(ReportType type) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Text(
          'IntelliAttend Report',
          style: pw.TextStyle(
            fontSize: 24,
            fontWeight: pw.FontWeight.bold,
          ),
        ),
        pw.SizedBox(height: 8),
        pw.Text(
          _getReportTitle(type),
          style: pw.TextStyle(fontSize: 18),
        ),
        pw.Divider(),
      ],
    );
  }

  static String _getReportTitle(ReportType type) {
    switch (type) {
      case ReportType.sessionReport:
        return 'Session Attendance Report';
      case ReportType.courseReport:
        return 'Course Attendance Report';
      case ReportType.studentReport:
        return 'Student Attendance Report';
      case ReportType.departmentReport:
        return 'Department Attendance Report';
      case ReportType.monthlyReport:
        return 'Monthly Attendance Report';
      case ReportType.customReport:
        return 'Custom Attendance Report';
    }
  }
}
```

### 4.3 CSV Export

```dart
class CSVExporter {
  static String generateAttendanceCSV(List<AttendanceRecord> records) {
    final csv = StringBuffer();
    
    // Header
    csv.writeln('Student ID,Student Name,Course,Date,Status,Time,Method');
    
    // Data rows
    for (final record in records) {
      csv.writeln([
        record.studentId,
        record.studentName,
        record.courseCode,
        record.markedAt.toIso8601String(),
        record.status.name,
        record.markedAt.toLocal().toString().substring(11, 16),
        record.method.name,
      ].join(','));
    }
    
    return csv.toString();
  }
}
```

---

## 5. Real-Time Analytics

### 5.1 Live Dashboard Updates

```dart
class LiveAnalyticsService {
  final WebSocketService _webSocketService;
  final StreamController<AttendanceSummary> _controller =
      StreamController<AttendanceSummary>.broadcast();

  Stream<AttendanceSummary> get liveUpdates => _controller.stream;

  void initialize() {
    _webSocketService.onEvent.listen((event) {
      if (event.type == 'attendance:summary') {
        final summary = AttendanceSummary.fromJson(event.data);
        _controller.add(summary);
      }
    });
  }

  void dispose() {
    _controller.close();
  }
}
```

### 5.2 Chart Data

```dart
class ChartDataService {
  static List<ChartSeries> prepareAttendancePieChart(AttendanceSummary summary) {
    return [
      ChartSeries(
        label: 'Present',
        value: summary.present.toDouble(),
        color: Colors.green,
      ),
      ChartSeries(
        label: 'Late',
        value: summary.late.toDouble(),
        color: Colors.orange,
      ),
      ChartSeries(
        label: 'Absent',
        value: summary.absent.toDouble(),
        color: Colors.red,
      ),
    ];
  }

  static List<ChartSeries> prepareTrendLineChart(List<DailyTrend> trends) {
    return trends.map((trend) {
      return ChartSeries(
        label: DateFormat('MMM d').format(trend.date),
        value: trend.attendancePercentage,
        color: Colors.blue,
      );
    }).toList();
  }

  static List<ChartSeries> prepareCourseBarChart(List<CourseAttendance> courses) {
    return courses.map((course) {
      return ChartSeries(
        label: course.courseCode,
        value: course.attendancePercentage,
        color: _getColorForPercentage(course.attendancePercentage),
      );
    }).toList();
  }

  static Color _getColorForPercentage(double percentage) {
    if (percentage >= 80) return Colors.green;
    if (percentage >= 60) return Colors.orange;
    return Colors.red;
  }
}
```

---

## 6. Alert System

### 6.1 Alert Rules

```dart
class AlertRules {
  static List<AlertRule> rules = [
    AlertRule(
      id: 'low_attendance',
      name: 'Low Attendance',
      condition: (student, course) => course.attendancePercentage < 75,
      severity: AlertSeverity.warning,
      notifyStudent: true,
      notifyFaculty: false,
      notifyHod: false,
    ),
    AlertRule(
      id: 'critical_attendance',
      name: 'Critical Attendance',
      condition: (student, course) => course.attendancePercentage < 60,
      severity: AlertSeverity.critical,
      notifyStudent: true,
      notifyFaculty: true,
      notifyHod: true,
    ),
    AlertRule(
      id: 'consecutive_absences',
      name: 'Consecutive Absences',
      condition: (student, course) => course.consecutiveAbsences >= 3,
      severity: AlertSeverity.warning,
      notifyStudent: true,
      notifyFaculty: true,
      notifyHod: false,
    ),
  ];
}
```

### 6.2 Alert Manager

```dart
class AlertManager {
  final AlertRepository _repository;

  AlertManager({required AlertRepository repository})
      : _repository = repository;

  Future<void> checkAndGenerateAlerts() async {
    // Get all active students
    final students = await _repository.getActiveStudents();

    for (final student in students) {
      final courses = await _repository.getStudentCourses(student.id);

      for (final course in courses) {
        for (final rule in AlertRules.rules) {
          if (rule.condition(student, course)) {
            await _generateAlert(
              student: student,
              course: course,
              rule: rule,
            );
          }
        }
      }
    }
  }

  Future<void> _generateAlert({
    required Student student,
    required Course course,
    required AlertRule rule,
  }) async {
    final alert = Alert(
      id: uuid.v4(),
      studentId: student.id,
      courseId: course.id,
      ruleId: rule.id,
      message: rule.name,
      severity: rule.severity,
      createdAt: DateTime.now(),
    );

    await _repository.saveAlert(alert);

    // Send notifications
    if (rule.notifyStudent) {
      await NotificationService.sendAlert(student.id, alert);
    }
    if (rule.notifyFaculty) {
      await NotificationService.sendAlert(course.facultyId, alert);
    }
    if (rule.notifyHod) {
      await NotificationService.sendAlertToHod(course.departmentId, alert);
    }
  }
}
```

---

## 7. Analytics UI Components

### 7.1 Dashboard Cards

```dart
class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String? subtitle;
  final IconData icon;
  final Color? color;

  const StatCard({
    super.key,
    required this.title,
    required this.value,
    this.subtitle,
    required this.icon,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color ?? Theme.of(context).primaryColor),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                subtitle!,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
```

### 7.2 Attendance Chart

```dart
class AttendanceChart extends StatelessWidget {
  final List<ChartSeries> data;
  final String title;

  const AttendanceChart({
    super.key,
    required this.data,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: PieChart(
                data: data.map((series) {
                  return PieSeries(
                    value: series.value,
                    color: series.color,
                    label: series.label,
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

*Analytics should tell a story. Present data in context with clear insights and actionable recommendations.*