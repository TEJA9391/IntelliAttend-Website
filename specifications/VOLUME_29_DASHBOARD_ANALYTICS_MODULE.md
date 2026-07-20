# VOLUME 29: DASHBOARD & ANALYTICS MODULE

**IntelliAttend — Software Requirements Specification & Technical Design Document**

| Field | Value |
|---|---|
| Volume | 29 |
| Module | Dashboard & Analytics (Faculty Dashboard + Reports/Analytics) |
| Status | Active |
| Last Updated | 2026-07-19 |
| Estimated LOC | ~6,500 (Dashboard ~3,500 + Reports/Analytics ~3,000) |

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Source File Inventory](#3-source-file-inventory)
4. [Dashboard Screen](#4-dashboard-screen)
5. [DashboardController](#5-dashboardcontroller)
6. [Dashboard Components](#6-dashboard-components)
7. [Session Control Section](#7-session-control-section)
8. [Schedule Section](#8-schedule-section)
9. [Reports Screen](#9-reports-screen)
10. [ReportsController](#10-reportscontroller)
11. [Reports Service & API](#11-reports-service--api)
12. [Overview Tab](#12-overview-tab)
13. [Analytics Tab](#13-analytics-tab)
14. [Attendance Chart](#14-attendance-chart)
15. [Students Tab](#15-students-tab)
16. [Sessions Tab](#16-sessions-tab)
17. [Eligibility Tab](#17-eligibility-tab)
18. [Defaulter Tab](#18-defaulter-tab)
19. [Actions Tab](#19-actions-tab)
20. [Report Components](#20-report-components)
21. [State Management](#21-state-management)
22. [Timetable Engine](#22-timetable-engine)
23. [WebSocket Dashboard Integration](#23-websocket-dashboard-integration)
24. [Offline Behavior](#24-offline-behavior)

---

## 1. Module Overview

The Dashboard & Analytics Module encompasses two major sub-modules:

1. **Faculty Dashboard** — The primary home screen showing session status, schedule, quick stats, and navigation to all other modules
2. **Reports & Analytics** — Comprehensive attendance analytics with charts, student breakdowns, eligibility tracking, export capabilities, and KPI visualization

### Key Responsibilities

- Display real-time session status with live countdown, present/absent counts
- Show today's schedule with timetable-aware card selection
- Provide pull-to-refresh with custom drag progress indicator
- Render 7 analytics tabs with Syncfusion charts (doughnut, line, spline, column)
- Manage 10 lazy-loaded data caches for report data
- Support CSV, PDF, and Excel export
- Track eligibility (75% threshold) and flag at-risk students
- Connect via WebSocket for live attendance updates during active sessions
- Integrate with TimetableEngine for time-aware scheduling

---

## 2. Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                     FACULTY MOBILE APP                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ DashboardScreen (IndexedStack, 5 tabs)                      │ │
│  │  ├─ [0] MainDashboardView                                  │ │
│  │  │    ├─ SliverAppBar → DashboardHeader (bell, profile)    │ │
│  │  │    ├─ SessionControlSection (live card / upcoming)       │ │
│  │  │    └─ ScheduleSection (today's classes list)             │ │
│  │  ├─ [1] CoursesScreen                                      │ │
│  │  ├─ [2] MyClassScreen                                      │ │
│  │  ├─ [3] ReportsScreen                                      │ │
│  │  │    ├─ OverviewTab (doughnut gauge, course cards)         │ │
│  │  │    ├─ AnalyticsTab (line charts, trend, summary)         │ │
│  │  │    ├─ StudentsTab (student list with attendance %)       │ │
│  │  │    ├─ SessionsTab (session list with stats)              │ │
│  │  │    ├─ EligibilityTab (75% threshold tracking)            │ │
│  │  │    ├─ DefaulterTab (at-risk student list)                │ │
│  │  │    ├─ ActionsTab (export, send warnings)                 │ │
│  │  │    ├─ AttendanceChart (daily/weekly/monthly toggle)      │ │
│  │  │    └─ ReportKPICard, ExportStatsCard, etc.               │ │
│  │  └─ [4] ProfileScreen                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────────────────────┐ │
│  │ DashboardController│  │ ReportsController                   │ │
│  │ (ChangeNotifier)   │  │ (ChangeNotifier)                    │ │
│  │  ├─ TimetableEngine│  │  ├─ 10 lazy caches                  │ │
│  │  ├─ Session state  │  │  ├─ ReportsService (API)            │ │
│  │  ├─ WS events      │  │  ├─ EligibilityService (75% rule)   │ │
│  │  └─ Board readiness│  │  └─ Export (CSV/PDF/Excel)           │ │
│  └────────────────────┘  └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Source File Inventory

### Dashboard (Faculty)

| File | Lines | Role |
|---|---|---|
| `Presentation/Features/Faculty/dashboard_screen.dart` | 390 | Main scaffold with IndexedStack (5 tabs), pull-to-refresh, profile modal |
| `Presentation/Features/Faculty/dashboard_controller.dart` | 838 | Core state — timetable, session, WS, board readiness, schedule loading |
| `Presentation/Features/Faculty/components/dashboard_header.dart` | 213 | Header — faculty name, avatar, notification bell with unread badge |
| `Presentation/Features/Faculty/components/session_control_section.dart` | 1,496 | Session card — live/upcoming/break/empty states + SwipeToStartSession |
| `Presentation/Features/Faculty/components/schedule_section.dart` | ~300 | Today's class list with subject cards |
| `Presentation/Features/Faculty/components/dashboard_sections.dart` | ~200 | Shared section widgets |
| `Presentation/Features/Faculty/components/custom_app_bar.dart` | ~100 | Custom app bar variant |

### Reports & Analytics

| File | Lines | Role |
|---|---|---|
| `Presentation/Features/Reports/reports_screen.dart` | ~200 | Tab scaffold with 7 tabs + chart sections |
| `Presentation/Features/Reports/reports_controller.dart` | 1,065 | State — 10 lazy caches, data loading, export |
| `Presentation/Features/Reports/Components/overview_tab.dart` | 286 | Doughnut gauge, quick stats grid, course cards, day chart |
| `Presentation/Features/Reports/Components/analytics_tab.dart` | 439 | Attendance overview, line charts, weekly trend, summary row |
| `Presentation/Features/Reports/Components/attendance_chart.dart` | 395 | Segmented chart (Daily/Weekly/Monthly) with filter toggle |
| `Presentation/Features/Reports/Components/students_tab.dart` | ~250 | Student list with attendance percentage and search |
| `Presentation/Features/Reports/Components/sessions_tab.dart` | ~200 | Session history list with present/absent counts |
| `Presentation/Features/Reports/Components/eligibility_tab.dart` | ~200 | 75% threshold eligibility tracking per student |
| `Presentation/Features/Reports/Components/defaulter_tab.dart` | ~150 | At-risk students with attendance below threshold |
| `Presentation/Features/Reports/Components/actions_tab.dart` | 95 | Export buttons + send warnings placeholder |
| `Presentation/Features/Reports/Components/report_kpi_card.dart` | ~80 | Reusable KPI card widget |
| `Presentation/Features/Reports/Components/report_helper_widgets.dart` | ~100 | Shared helper widgets |
| `Presentation/Features/Reports/Components/report_distribution_chart.dart` | ~100 | Distribution chart widget |
| `Presentation/Features/Reports/Components/recent_reports_list.dart` | ~100 | Recent reports list |
| `Presentation/Features/Reports/Components/export_stats_card.dart` | ~80 | Export statistics card |
| `Presentation/Features/Reports/Components/department_performance.dart` | ~100 | Department performance widget |

### Services

| File | Lines | Role |
|---|---|---|
| `Services/reports_service.dart` | 228 | API facade — all reports HTTP calls |
| `Services/eligibility_service.dart` | 69 | 75% threshold eligibility calculation |
| `Engine/engine.dart` | ~300 | TimetableEngine — time-aware schedule evaluation |

---

## 4. Dashboard Screen

### 4.1 Structure

```dart
class DashboardScreen extends StatefulWidget {
  // Root scaffold with IndexedStack navigation
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;  // Tab index
  final GlobalKey<ScaffoldState> _scaffoldKey;
}
```

### 4.2 Tab Layout

```dart
IndexedStack(
  index: _currentIndex,
  children: const [
    MainDashboardView(),    // [0] Home
    CoursesScreen(),        // [1] Courses
    MyClassScreen(),        // [2] My Class
    ReportsScreen(),        // [3] Reports
    ProfileScreen(),        // [4] Profile
  ],
)
```

Navigation: `CustomSlidingNavBar` — custom bottom navigation with sliding indicator animation.

### 4.3 Pull-to-Refresh

Custom implementation with drag progress tracking:

```dart
class _MainDashboardViewState extends State<MainDashboardView> {
  static const double _kRefreshThreshold = 80.0;
  double _dragProgress = 0.0;  // 0.0 → 1.0

  // CustomScrollView with:
  // - SliverAppBar (pinned, 72px, with DashboardHeader)
  // - SessionControlSection (sliver)
  // - ScheduleSection (sliver)
  // - 100px bottom padding

  // Refresh bar: LinearProgressIndicator in SliverAppBar.bottom
  // Shows lime-colored progress during drag, indeterminate during refresh
}
```

### 4.4 Profile Modal

Bottom sheet with faculty info:
- Profile image (network or local file)
- Name, email, employee code, department, designation, experience, rating
- 85% height modal with drag handle

---

## 5. DashboardController

Core state manager for the faculty dashboard. 838 lines. Manages schedule, session lifecycle, WebSocket events, timetable engine, and board readiness.

### 5.1 Dependencies

```dart
class DashboardController with ChangeNotifier, WidgetsBindingObserver {
  final CourseRepository _courseRepository;
  final AttendanceRepository _attendanceRepository;
  final OverrideRepository _overrideRepository;
  final TimetableController timetableEngine;  // External engine
}
```

### 5.2 State Variables

| Variable | Type | Purpose |
|---|---|---|
| `_schedule` | `List<ScheduledClass>` | Today's class schedule |
| `_tomorrowSchedule` | `List<ScheduledClass>` | Tomorrow's schedule |
| `_subjectsCache` | `Map<String, String>` | Subject code → name mapping |
| `_isLoading` | `bool` | Initial load state |
| `_displayShimmer` | `bool` | Shimmer loading indicator (>150ms threshold) |
| `_activeSessionMetadata` | `Map<String, dynamic>?` | Active session info (id, counts) |
| `_activeOtpResponse` | `SessionStartResponse?` | Current OTP response |
| `_sessionState` | `SessionState` | Session lifecycle state |
| `_sessionStateInfo` | `SessionStateInfo?` | Full state from server |
| `_presentCount` | `int` | Live present count |
| `_absentCount` | `int` | Live absent count |
| `_isRecovering` | `bool` | State recovery in progress |
| `_recoveryBuffer` | `List<WebSocketEvent>` | Buffered events during recovery |

### 5.3 Key Getters

| Getter | Returns | Description |
|---|---|---|
| `scheduledClasses` | `List<ScheduledClass>` | Today's schedule with dummy topics |
| `tomorrowSchedule` | `List<ScheduledClass>` | Tomorrow's schedule |
| `weeklySchedule` | `Map<String, List<ScheduledClass>>` | Full week schedule |
| `mainCardClass` | `ScheduledClass?` | Current/next class for dashboard card |
| `currentSlot` | `ScheduledClass?` | Currently active time slot |
| `activeSession` | `Map<String, dynamic>?` | Active session metadata |
| `activeSessionId` | `String?` | Active session ID |
| `sessionState` | `SessionState` | Current session state |
| `presentCount` / `absentCount` | `int` | Live attendance counts |
| `isLoading` | `bool` | Loading state |
| `displayShimmer` | `bool` | Shimmer threshold state |
| `isTomorrow` | `bool` | Whether showing tomorrow's view |
| `isBoardReady(slotId)` | `bool` | Board readiness check |

### 5.4 Initialization Flow

```
DashboardController constructor
  │
  ├─ Set FacultyHydrationService.onDataChanged = reloadFromCache
  ├─ Add WidgetsBindingObserver (lifecycle)
  ├─ Add timetableEngine listener (_onEngineTick)
  ├─ Set timetableEngine.onDayChanged → _init()
  ├─ Add BoardReadinessNotifier listener
  └─ _init()
       │
       ├─ Get FirebaseAuth.instance.currentUser
       ├─ If null: retry in 2s (Firebase may still be initializing)
       │
       └─ _initWithData(email)
            │
            ├─ Load today's schedule from CourseRepository
            ├─ Load tomorrow's schedule
            ├─ Load subject names cache
            ├─ Push blocks to TimetableEngine
            ├─ Recover session state from server
            └─ Connect WebSocket if active session
```

### 5.5 Session Lifecycle Methods

| Method | Description |
|---|---|
| `startSession(scheduledClass)` | POST /start_session → returns OTP response |
| `refreshOtp()` | POST /refresh_otp → new OTP |
| `clearActiveSession()` | Reset state, disconnect WS |
| `updateOtpResponse(response)` | Store OTP response |
| `fetchCurrentState()` | Lightweight state fetch for polling |
| `recoverState()` | Full state recovery from server |
| `refreshData()` | Reload all dashboard data |

### 5.6 WebSocket Event Handling

```dart
void _connectDashboardWs(String sessionId) {
  final wsService = WebSocketService();
  wsService.connectAndJoinRoom(sessionId: sessionId);

  _wsEventSub = wsService.events.listen(_handleWsEvent);
  _wsConnSub = wsService.connectionState.listen((state) { ... });
}

void _handleWsEvent(WebSocketEvent event) {
  if (_isRecovering) {
    _recoveryBuffer.add(event);  // Buffer during recovery
    return;
  }

  switch (event.type) {
    case WsEventType.sessionPreparing:
      _updateSessionState = SessionState.preparing;
      break;
    case WsEventType.sessionIgniting:
      _updateSessionState = SessionState.igniting;
      break;
    case WsEventType.attendanceOpen:
    case WsEventType.sessionActivated:
      _updateSessionState = SessionState.active;
      break;
    case WsEventType.studentVerified:
    case WsEventType.studentMarked:
      _presentCount++;
      _updateLiveCounts(event);
      break;
    case WsEventType.attendanceClosed:
      _updateSessionState = SessionState.closed;
      break;
    // ... more event types
  }
  notifyListeners();
}
```

---

## 6. Dashboard Components

### 6.1 DashboardHeader

213 lines. Contains:
- Faculty name and designation
- Profile avatar (tap → profile modal)
- Notification bell with unread badge (red circle, "9+")
- Search icon (placeholder)

```dart
class DashboardHeader extends StatelessWidget {
  final VoidCallback onProfileTap;
  // Uses ValueListenableBuilder on FacultyService.profile
  // Uses ValueListenableBuilder on NotificationService.history
}
```

### 6.2 ScheduleSection

~300 lines. Shows today's classes as a scrollable list of subject cards.

```dart
class ScheduleSection extends StatelessWidget {
  final VoidCallback onViewAll;
  final ValueChanged<ScheduledClass> onCourseTap;
  // Reads DashboardController.scheduledClasses
  // Each card: subject code, name, room, time, attendance indicator
}
```

### 6.3 DashboardSections

~200 lines. Shared section widgets used across the dashboard.

---

## 7. Session Control Section

The most complex dashboard component at 1,496 lines. Renders the main session card with 5 distinct states.

### 7.1 Card States

| State | Condition | Visual |
|---|---|---|
| **Session Active** | `activeSession != null && currentSlot != null` | Live card with countdown, present/absent counts, "View Live" button |
| **Upcoming** | `mainCardClass != null` (no active session) | Next class card with countdown badge, "Swipe to Start" |
| **Break** | `isBreak == true` | Break card with label, "No session can be started during break" |
| **Empty/End of Day** | No classes remaining | "End of Day" card with "See you tomorrow!" |
| **Shimmer** | `displayShimmer == true` | Skeleton loading cards |

### 7.2 Session Active Card

```
SessionCard
  ├─ _CountdownBadge (HH:MM:SS LEFT)
  ├─ Subject name (24px, bold)
  ├─ Location row (green pin + room)
  ├─ Attendance row (present/total with color coding)
  └─ "View Live" button → LiveMonitorScreen
```

### 7.3 Upcoming Card

```
UpcomingCard
  ├─ CountdownBadge or "UPCOMING" label
  ├─ Subject name
  ├─ Room location
  ├─ "Classes ended for today" status (if after last class)
  └─ SwipeToStartSession widget
```

### 7.4 SwipeToStartSession

A premium swipe-to-start gesture widget (~400 lines):

```dart
enum _SwipeState { idle, loading, error }

class SwipeToStartSession extends StatefulWidget {
  final Future<void> Function() onComplete;
  // Draggable handle with:
  // - Idle: teal handle, shimmer background, "SWIPE TO START SESSION" hint
  // - Loading: teal handle locked, shimmer animation, spinner
  // - Error: red handle, error message, 3s auto-reset
}
```

Gesture:
- Horizontal drag updates `_handleController` (0.0 → 1.0)
- If released ≥95% → trigger `_onSwipeComplete()`
- If released <95% → snap back with easeOutCubic animation
- Heavy haptic on completion
- Error display: 3-second hold then snap back

---

## 8. Schedule Section

~300 lines. Renders today's timetable as a scrollable list of course cards.

### 8.1 Card Layout

Each course card shows:
- Subject code badge (colored square with 3-letter abbreviation)
- Subject name (bold)
- Room number
- Time slot (start - end)
- Current class indicator (highlighted border)

### 8.2 Navigation

- "View All" → `FacultyTimetableScreen`
- Course tap → `MyClassScreen(initialSubjectCode: course.subjectCode)`

---

## 9. Reports Screen

Tab-based reports screen with 7 tabs + 2 chart sections.

### 9.1 Tab Structure

```
ReportsScreen
  └─ DefaultTabController (length: 7)
       ├─ TabBar (scrollable, teal indicator)
       │    ├─ Tab: "Overview"
       │    ├─ Tab: "Analytics"
       │    ├─ Tab: "Students"
       │    ├─ Tab: "Sessions"
       │    ├─ Tab: "Eligibility"
       │    ├─ Tab: "Defaulter"
       │    └─ Tab: "Actions"
       │
       └─ TabBarView
            ├─ OverviewTab
            ├─ AnalyticsTab + AttendanceChart
            ├─ StudentsTab
            ├─ SessionsTab
            ├─ EligibilityTab
            ├─ DefaulterTab
            └─ ActionsTab
```

### 9.2 Data Loading

ReportsController is provided at the ReportsScreen level:

```dart
ChangeNotifierProvider(
  create: (_) => ReportsController()..loadOverview(),
  child: const ReportsScreen(),
)
```

Each tab reads from `ReportsController` using `ListenableBuilder` or `Consumer`.

---

## 10. ReportsController

1,065 lines. The largest controller. Manages 10 lazy-loaded data caches for the reports module.

### 10.1 Lazy Cache Properties

| Cache | Type | API Endpoint | Tab |
|---|---|---|---|
| `_overview` | `Map<String, dynamic>?` | GET /reports/overview | Overview |
| `_weeklyTrend` | `List<Map<String, dynamic>>` | GET /reports/weekly-trend | Analytics |
| `_weeklyChartData` | `List<Map<String, dynamic>>` | GET /reports/weekly-chart | Overview |
| `_students` | `List<Map<String, dynamic>>` | GET /reports/students | Students |
| `_sessions` | `List<Map<String, dynamic>>` | GET /reports/sessions | Sessions |
| `_eligibility` | `List<Map<String, dynamic>>` | GET /reports/eligibility | Eligibility |
| `_defaulter` | `List<Map<String, dynamic>>` | GET /reports/defaulter | Defaulter |
| `_departmentPerformance` | `List<Map<String, dynamic>>` | GET /reports/department | Analytics |
| `_courseDistribution` | `List<Map<String, dynamic>>` | GET /reports/distribution | Analytics |
| `_recentExports` | `List<Map<String, dynamic>>` | GET /reports/exports | Actions |

### 10.2 Lazy Loading Pattern

```dart
class ReportsController extends ChangeNotifier {
  bool _isLoadingOverview = false;
  Map<String, dynamic>? _overview;

  bool get isLoading => _isLoadingOverview;
  Map<String, dynamic>? get overview => _overview;

  Future<void> loadOverview() async {
    if (_overview != null) return;  // Already loaded
    _isLoadingOverview = true;
    notifyListeners();

    try {
      _overview = await _reportsService.fetchOverview();
    } catch (e) {
      debugPrint("Failed to load overview: $e");
    } finally {
      _isLoadingOverview = false;
      notifyListeners();
    }
  }

  // Each tab calls its own load method on first display
  // Method returns immediately if cache is populated
}
```

### 10.3 Key Computed Properties

| Property | Computation |
|---|---|
| `overallAverage` | From overview: `overall_average` |
| `totalStudents` | From overview: `total_students` |
| `eligibleCount` | From overview: `eligible_count` |
| `atRiskCount` | From overview: `at_risk_count` |
| `totalSessions` | From overview: `total_sessions` |
| `weeklyTrend` | Cached weekly trend data |
| `weeklyChartData` | Cached daily chart data |

### 10.4 Export Methods

| Method | Format | Description |
|---|---|---|
| `exportAsFormat(context, 'csv')` | CSV | Generate and share CSV file |
| `exportAllReports(context)` | PDF | Generate comprehensive PDF report |
| `exportStudents(context)` | CSV | Student-level attendance export |
| `exportSessions(context)` | CSV | Session-level export |

---

## 11. Reports Service & API

### 11.1 ReportsService

228 lines. HTTP facade for all reports API calls.

```dart
class ReportsService {
  final ApiClient _apiClient;

  Future<Map<String, dynamic>> fetchOverview();
  Future<List<Map<String, dynamic>>> fetchWeeklyTrend();
  Future<List<Map<String, dynamic>>> fetchWeeklyChart();
  Future<List<Map<String, dynamic>>> fetchStudents({String? courseId});
  Future<List<Map<String, dynamic>>> fetchSessions({String? courseId});
  Future<List<Map<String, dynamic>>> fetchEligibility({String? courseId});
  Future<List<Map<String, dynamic>>> fetchDefaulter({String? courseId});
  Future<List<Map<String, dynamic>>> fetchDepartmentPerformance();
  Future<List<Map<String, dynamic>>> fetchCourseDistribution();
}
```

### 11.2 EligibilityService

69 lines. Client-side eligibility calculation.

```dart
class EligibilityService {
  static const double attendanceThreshold = 75.0;

  static bool isEligible(double attendancePercentage) {
    return attendancePercentage >= attendanceThreshold;
  }

  static String getEligibilityStatus(double attendancePercentage) {
    if (attendancePercentage >= 75) return 'ELIGIBLE';
    if (attendancePercentage >= 60) return 'AT_RISK';
    return 'INELIGIBLE';
  }
}
```

### 11.3 API Endpoints

| Endpoint | Method | Response |
|---|---|---|
| `/api/v1/faculty/reports/overview` | GET | `{ overall_average, total_students, eligible_count, at_risk_count, total_sessions, courses: [...] }` |
| `/api/v1/faculty/reports/weekly-trend` | GET | `[{ week: "W1", value: 82.5 }, ...]` |
| `/api/v1/faculty/reports/weekly-chart` | GET | `[{ day: "Mon", present: 45, absent: 5, percentage: 90 }, ...]` |
| `/api/v1/faculty/reports/students` | GET | `[{ name, email, attended, total, percentage }, ...]` |
| `/api/v1/faculty/reports/sessions` | GET | `[{ session_id, date, subject, present, absent, total }, ...]` |
| `/api/v1/faculty/reports/eligibility` | GET | `[{ name, email, percentage, status, sessions }, ...]` |
| `/api/v1/faculty/reports/defaulter` | GET | `[{ name, email, percentage, sessions_missed }, ...]` |

---

## 12. Overview Tab

286 lines. The first tab in Reports. Provides a high-level dashboard summary.

### 12.1 Widgets

| Widget | Description |
|---|---|
| `_buildGaugeCard` | Doughnut chart (SfCircularChart) showing overall average with inner percentage text |
| `_buildQuickStats` | 2×2 grid: Students, Sessions, At Risk, Courses |
| `_buildCourseCard` | Per-course attendance with code badge, progress bar, percentage |
| `_buildDayChart` | Column chart of attendance by day of week |

### 12.2 Doughnut Gauge

```dart
SfCircularChart(
  series: <CircularSeries>[
    DoughnutSeries<double, String>(
      dataSource: [avg, 100 - avg],
      xValueMapper: (d, i) => i == 0 ? 'Present' : 'Absent',
      yValueMapper: (d, _) => d,
      pointColorMapper: (d, i) => i == 0 ? AppTheme.accentTeal : AppTheme.surface(context),
      innerRadius: '72%',
      cornerStyle: CornerStyle.bothCurve,
    ),
  ],
)
// Center: average percentage (28px bold) + "Average" label
```

### 12.3 Quick Stats Grid

```dart
GridView.count(
  crossAxisCount: 2,
  childAspectRatio: 1.6,
  children: [
    _statCard("Students", "$count", Icons.people_rounded, Colors.blue),
    _statCard("Sessions", "$count", Icons.event_rounded, Colors.purple),
    _statCard("At Risk", "$count", Icons.warning_rounded, Colors.red),
    _statCard("Courses", "$count", Icons.school_rounded, Colors.teal),
  ],
)
```

### 12.4 Course Card

Each course card displays:
- 3-letter code badge (colored square)
- Course short name
- Session count
- Average attendance percentage (color-coded: teal ≥75%, yellow ≥60%, red <60%)
- Linear progress bar

---

## 13. Analytics Tab

439 lines. Deep analytics with multiple chart types.

### 13.1 Layout

```
AnalyticsTab
  ├─ AttendanceOverviewCard (overall average, progress bar, eligible/at-risk)
  ├─ StudentAttendanceLineChart (top 15 students by %)
  ├─ WeeklyTrendSplineChart (week-by-week trend)
  ├─ SummaryRow (Total | Eligible | At Risk | Sessions)
  └─ ExportSection (Export CSV + Export Report buttons)
```

### 13.2 Student Attendance Line Chart

```dart
SfCartesianChart(
  primaryXAxis: CategoryAxis(labelRotation: -45),
  primaryYAxis: NumericAxis(minimum: 0, maximum: 100, interval: 25),
  series: <CartesianSeries>[
    LineSeries<_StudentPoint, String>(
      color: AppTheme.accentTeal,
      width: 2.5,
      markerSettings: MarkerSettings(isVisible: true, height: 6, width: 6),
    ),
  ],
)
// Data: Top 15 students sorted by attendance percentage (descending)
// X: Short name (6 chars), Y: Attendance %
```

### 13.3 Weekly Trend Spline Chart

```dart
SfCartesianChart(
  primaryYAxis: NumericAxis(minimum: 50, maximum: 100, interval: 10),
  series: <CartesianSeries>[
    SplineAreaSeries<_WeekPoint, String>(
      color: AppTheme.accentTeal.withValues(alpha: 0.15),
      borderColor: AppTheme.accentTeal,
      borderWidth: 2.5,
      dataLabelSettings: DataLabelSettings(isVisible: true),
    ),
  ],
)
```

### 13.4 Summary Row

4-column stat row with dividers:

```
┌─────────┬─────────┬─────────┬─────────┐
│  People │  Check  │ Warning │ Calendar│
│  Total  │ Eligible│ At Risk │ Sessions│
└─────────┴─────────┴─────────┴─────────┘
```

---

## 14. Attendance Chart

395 lines. Standalone chart widget with segmented filter (Daily/Weekly/Monthly).

### 14.1 Filter Toggle

```dart
enum _Filter { daily, weekly, monthly }

// Segmented button bar with animated selection
// Each segment: teal background when selected, transparent when not
```

### 14.2 Chart Types

| Filter | Chart Type | Data Source | Y-Axis |
|---|---|---|---|
| Daily | ColumnSeries (grouped: Present + Absent) | `weeklyData` | Auto |
| Weekly | SplineAreaSeries | `weeklyTrend` | 50–100, interval 10 |
| Monthly | LineSeries | `weeklyTrend` (same data) | 50–100, interval 10 |

### 14.3 Chart Styling

- All charts use `AppTheme.accentTeal` as primary color
- Absent data uses `AppTheme.errorRed.withValues(alpha: 0.7)`
- Marker settings: 6–7px circles with theme-aware border
- Background: card with 20px border radius, theme border
- Title: "Attendance Analytics" with LIVE badge

---

## 15. Students Tab

~250 lines. Student-level attendance breakdown.

### 15.1 Features

- Searchable student list (by name or email)
- Each student row: name, email, attendance %, sessions attended/total
- Color-coded percentage (teal ≥75%, yellow ≥60%, red <60%)
- Sortable by attendance percentage
- Tap student → detailed attendance history (placeholder)

### 15.2 Data Source

```dart
controller.students  // List<Map<String, dynamic>>
// Each: { name, email, attended, total, percentage }
```

---

## 16. Sessions Tab

~200 lines. Session history with per-session statistics.

### 16.1 Session Card

Each session card shows:
- Date and time
- Subject name and code
- Room number
- Present count / total students
- Attendance percentage
- Status badge (completed, partial, etc.)

### 16.2 Data Source

```dart
controller.sessions  // List<Map<String, dynamic>>
// Each: { session_id, date, subject, present, absent, total }
```

---

## 17. Eligibility Tab

~200 lines. Tracks student eligibility against the 75% attendance threshold.

### 17.1 Threshold Logic

```dart
// EligibilityService
static const double attendanceThreshold = 75.0;

// Status mapping:
// ≥75%: ELIGIBLE (green)
// 60-74%: AT_RISK (yellow)
// <60%: INELIGIBLE (red)
```

### 17.2 Display

- Eligible students count with green badge
- At-risk students count with yellow badge
- Ineligible students count with red badge
- Per-student row: name, percentage, status badge, sessions count

---

## 18. Defaulter Tab

~150 lines. Lists students with attendance below threshold.

### 18.1 Features

- Filtered list of at-risk students (below 75%)
- Each row: name, email, attendance %, sessions missed
- Sorted by attendance percentage (lowest first)
- Color-coded severity

---

## 19. Actions Tab

95 lines. Quick actions for report management.

### 19.1 Actions

| Action | Icon | Color | Handler |
|---|---|---|---|
| Export CSV | `Icons.table_rows_rounded` | Teal | `controller.exportAsFormat(context, 'csv')` |
| Export Report | `Icons.picture_as_pdf_rounded` | Yellow | `controller.exportAllReports(context)` |
| Send Warnings | `Icons.notification_important_rounded` | Red | Placeholder (not implemented) |

---

## 20. Report Components

### 20.1 ReportKPICard

~80 lines. Reusable KPI card for displaying a single metric.

```
ReportKPICard
  ├─ Icon (color-coded circle)
  ├─ Value (large text)
  ├─ Label (small text)
  └─ Optional trend indicator (↑↓ with percentage)
```

### 20.2 ExportStatsCard

~80 lines. Shows export statistics (last export date, format, count).

### 20.3 ReportDistributionChart

~100 lines. Pie/distribution chart for course-level breakdown.

### 20.4 RecentReportsList

~100 lines. List of recently generated reports with download links.

### 20.5 DepartmentPerformance

~100 lines. Department-level attendance comparison.

---

## 21. State Management

### 21.1 DashboardController (ChangeNotifier)

| Property | Type | Consumed By |
|---|---|---|
| `scheduledClasses` | `List<ScheduledClass>` | ScheduleSection |
| `mainCardClass` | `ScheduledClass?` | SessionControlSection |
| `activeSession` | `Map<String, dynamic>?` | SessionControlSection |
| `sessionState` | `SessionState` | AttendanceCodeScreen, SessionControlSection |
| `presentCount` / `absentCount` | `int` | SessionControlSection |
| `displayShimmer` | `bool` | SessionControlSection |
| `isTomorrow` | `bool` | ScheduleSection |
| `timetableEngine` | `TimetableController` | SessionControlSection, ScheduleSection |

### 21.2 ReportsController (ChangeNotifier)

| Property | Type | Consumed By |
|---|---|---|
| `overview` | `Map<String, dynamic>?` | OverviewTab, AnalyticsTab |
| `students` | `List<Map<String, dynamic>>` | StudentsTab, AnalyticsTab |
| `sessions` | `List<Map<String, dynamic>>` | SessionsTab |
| `eligibility` | `List<Map<String, dynamic>>` | EligibilityTab |
| `defaulter` | `List<Map<String, dynamic>>` | DefaulterTab |
| `weeklyTrend` | `List<Map<String, dynamic>>` | AnalyticsTab, AttendanceChart |
| `weeklyChartData` | `List<Map<String, dynamic>>` | OverviewTab, AttendanceChart |
| `isLoading` | `bool` | All tabs |

### 21.3 NotificationService (Singleton)

| Property | Type | Consumed By |
|---|---|---|
| `history` | `ValueNotifier<List<AppNotification>>` | DashboardHeader (bell badge) |
| `unreadCountNotifier` | `ValueNotifier<int>` | DashboardHeader (badge count) |

### 21.4 FacultyService (Singleton)

| Property | Type | Consumed By |
|---|---|---|
| `profile` | `ValueNotifier<FacultyProfile?>` | DashboardHeader, ProfileModal, AppDrawer |
| `courses` | `ValueNotifier<List<Course>>` | OverviewTab, ReportsController |

---

## 22. Timetable Engine

External dependency from `intelli_attend_shared` package.

### 22.1 TimetableController

```dart
class TimetableController extends ChangeNotifier {
  TimetableSnapshot get snapshot;
  void updateBlocks(List<TimeBlock> today, List<TimeBlock> tomorrow);
  VoidCallback? onDayChanged;
}
```

### 22.2 TimetableSnapshot

```dart
class TimetableSnapshot {
  TimetablePhase phase;        // beforeFirstClass, inClass, inBreak, afterLastClass, weekend
  TimeBlock? currentBlock;     // Currently active class block
  TimeBlock? nextBlock;        // Next upcoming block
  bool get isClassActive;
  bool get isBeforeFirstClass;
  bool get isAfterLastClass;
  bool get isWeekend;
  bool get isBreak;
  String? get breakLabel;
  String? get countdownLabel;
  String? get subjectName;
  String? get subjectCode;
  String? get roomNumber;
}
```

### 22.3 Integration

```dart
// DashboardController bridges ScheduledClass → TimeBlock:
TimeBlock _classToBlock(ScheduledClass c) {
  final slot = c.toTimetableSlot(institutionTimezone: 'Asia/Kolkata');
  return TimeBlock.fromSlot(slot);
}

// Engine tick drives UI updates:
void _onEngineTick() {
  if (hasListeners) notifyListeners();
}
```

---

## 23. WebSocket Dashboard Integration

### 23.1 Session Events on Dashboard

| WS Event | Dashboard State Change |
|---|---|
| `session_preparing` | `_sessionState = preparing` |
| `session_igniting` | `_sessionState = igniting` |
| `session_activated` / `attendance_open` | `_sessionState = active` |
| `student_verified` / `student_marked` | `_presentCount++`, update student list |
| `faculty_sync` | Batch update present/absent counts + roster |
| `full_state_sync` | Full state recovery with roster |
| `attendance_closed` | `_sessionState = closed` |
| `session_archived` | Clear session state |
| `otp_failed` | Forwarded to AttendanceCodeScreen |

### 23.2 Recovery Buffer

During state recovery (`_isRecovering == true`), all WS events are buffered in `_recoveryBuffer`. After recovery completes, buffered events are flushed and processed sequentially:

```dart
void _flushRecoveryBuffer() {
  final buffer = List<WebSocketEvent>.from(_recoveryBuffer);
  _recoveryBuffer.clear();
  for (final event in buffer) {
    _handleWsEvent(event);
  }
}
```

### 23.3 Throttled Notifications

```dart
Timer? _notifyThrottle;
int _pendingNotifyCount = 0;

void _throttledNotify() {
  _pendingNotifyCount++;
  _notifyThrottle ??= Timer(const Duration(milliseconds: 100), () {
    if (hasListeners) notifyListeners();
    _pendingNotifyCount = 0;
    _notifyThrottle = null;
  });
}
```

---

## 24. Offline Behavior

### 24.1 Dashboard Offline

| Feature | Works? | Notes |
|---|---|---|
| View cached schedule | Yes | Read from Hive via CourseRepository |
| View session state | Partially | Last known state, no live updates |
| Pull-to-refresh | No | Requires server |
| Start session | No | Requires server |
| View OTP | Yes | If already displayed (local state) |
| Board readiness | Yes | Local singleton, populated by FCM |

### 24.2 Reports Offline

| Feature | Works? | Notes |
|---|---|---|
| View cached overview | Yes | If previously loaded and cached in controller |
| View cached student list | Yes | Same lazy cache pattern |
| Export | Partially | CSV/PDF generation works, but upload fails |
| Load fresh data | No | Requires server |

### 24.3 Data Hydration

```dart
// FacultyHydrationService triggers on SILENT_SYNC_PING FCM
FacultyHydrationService.onDataChanged = reloadFromCache;

// After hydration completes:
void reloadFromCache() {
  _schedule = _courseRepository.getCachedSchedule('today');
  _tomorrowSchedule = _courseRepository.getCachedSchedule('tomorrow');
  _subjectsCache = _courseRepository.getSubjectsCache();
  _pushBlocksToEngine();
  notifyListeners();
}
```
