# Volume 23: Reports Module Specification

## 1. Module Overview

The Reports Module provides analytics, eligibility assessment, exportable reports, and defaulter management for faculty users. It is the most complex module in the application, containing ~4,500 lines across 16 component files and serving as the primary data insight surface.

**Module boundary:** All files under `lib/Presentation/Features/Reports/` plus `ReportsService` and `EligibilityService`.

---

## 2. File Inventory

| File | Lines | Responsibility |
|------|-------|----------------|
| `reports_screen.dart` | 1,268 | Main screen shell, sliver layout, bottom sheets |
| `reports_controller.dart` | 1,065 | State management, filtering, caching, export orchestration |
| `components/overview_tab.dart` | 286 | Doughnut gauge, quick stats, course cards, day-of-week chart |
| `components/analytics_tab.dart` | 439 | Attendance overview, student line chart, weekly trend spline |
| `components/students_tab.dart` | 206 | At-risk/critical/top-performers/streak filter chips |
| `components/defaulter_tab.dart` | 288 | Defaulter alert header, filter chips, student action cards |
| `components/eligibility_tab.dart` | 225 | Eligible students, filter chips (All/Above 90%/75-90%) |
| `components/attendance_chart.dart` | 395 | Daily/Weekly/Monthly toggle with SfCartesianChart |
| `components/department_performance.dart` | 185 | Animated department performance bars |
| `components/report_kpi_card.dart` | 248 | Animated KPI card with sparkline and change indicator |
| `components/report_distribution_chart.dart` | 153 | Doughnut chart for report distribution |
| `components/recent_reports_list.dart` | 213 | Recent session reports with status badges |
| `components/export_stats_card.dart` | 147 | Grid of 4 export statistics |
| `components/actions_tab.dart` | 95 | Quick action cards (warnings, export, share) |
| `components/sessions_tab.dart` | 119 | Session history list |
| `components/report_helper_widgets.dart` | 504 | Shared widgets: badges, progress bars, student tiles |
| `services/reports_service.dart` | 228 | API fetching, caching, stats computation |
| `services/eligibility_service.dart` | 69 | 75% threshold engine, student classification |

---

## 3. Widget Hierarchy

```
ReportsScreen (StatefulWidget)
├── CustomAppBar (title: "Reports", subtitle: "Analytics, Eligibility & Insights")
│   ├── Download button → _showDownloadSheet()
│   └── Filter button → _showCoursePicker()
├── RefreshIndicator
│   └── ListenableBuilder (reports_controller)
│       └── CustomScrollView (PageStorageKey: 'reports_scroll')
│           ├── [loading] SliverFillRemaining → _buildSkeletonLoader()
│           ├── [error+noData] SliverFillRemaining → _buildNoDataErrorState()
│           ├── [empty+success] SliverFillRemaining → _buildEmptyState()
│           └── [hasData] SliverPadding → SliverList (11 sliver children)
│               ├── [0] _buildDateRangeHeader() → GestureDetector
│               │   ├── onTap → _showMonthFilterSheet()
│               │   └── GestureDetector (semester) → _showSemesterSheet()
│               ├── [2] RepaintBoundary → _buildKPICards()
│               │   └── GridView.count(2x2) → ReportKpiCard x4
│               ├── [4] RepaintBoundary → _buildChartsRow()
│               │   ├── AttendanceChart (weeklyData, weeklyTrend)
│               │   └── ReportDistributionChart (distribution)
│               ├── [6] RepaintBoundary → _buildDepartmentPerformance()
│               │   └── DepartmentPerformance (departments)
│               ├── [8] RepaintBoundary → _buildBottomRow()
│               │   └── RecentReportsList (recentReports)
│               └── [10] RepaintBoundary → _buildExportStats()
│                   └── ExportStatsCard (overview)
```

---

## 4. State Management

### 4.1 ReportsController (ChangeNotifier)

```dart
enum ReportsStatus { initial, loading, success, error }
enum MonthFilterType { today, thisWeek, thisMonth, lastMonth }
```

**State fields:**
| Field | Type | Purpose |
|-------|------|---------|
| `_status` | `ReportsStatus` | Loading lifecycle state |
| `_error` | `String?` | Error message |
| `_isExporting` | `bool` | Export in progress |
| `_selectedCourseId` | `String?` | Active course filter |
| `_isOffline` | `bool` | Offline mode flag |
| `_lastSyncTime` | `DateTime?` | Last successful sync |
| `_students` | `List<Map<String, dynamic>>` | Student roster data |
| `_sessions` | `List<Map<String, dynamic>>` | Session history data |
| `_stats` | `Map<String, dynamic>` | Computed statistics |
| `_selectedSemester` | `SemesterInfo?` | Active semester filter |
| `_monthFilter` | `MonthFilterType` | Active time range filter |
| `_filtersDirty` | `bool` | Cache invalidation flag |

**Cache fields (10 computed caches):**
| Cache | Computed From |
|-------|--------------|
| `_cachedFilteredSessions` | `_sessions` + semester + month filter |
| `_cachedSparklineData` | `filteredSessions` |
| `_cachedWeeklyTrend` | `filteredSessions` |
| `_cachedOverview` | `_stats` + `filteredSessions` |
| `_cachedWeeklyChartData` | `filteredSessions` |
| `_cachedRecentReports` | `filteredSessions` |
| `_cachedReportDistribution` | `_stats` + `_students` |
| `_cachedDepartmentPerformance` | `FacultyService.courses` |
| `_cachedAtRiskStudents` | `_students` (threshold < 75%) |
| `_cachedTopPerformers` | `_students` (top 10 by percentage) |
| `_cachedAbsentStreaks` | `_students` (streak >= 3) |

### 4.2 Cache Invalidation Pattern

```dart
void _invalidateFilters() {
  _filtersDirty = true;
  // Null all 10 cache fields
  _cachedFilteredSessions = null;
  _cachedSparklineData = null;
  _cachedWeeklyTrend = null;
  _cachedOverview = null;
  _cachedWeeklyChartData = null;
  _cachedRecentReports = null;
  _cachedReportDistribution = null;
  _cachedDepartmentPerformance = null;
  _cachedAtRiskStudents = null;
  _cachedTopPerformers = null;
  _cachedAbsentStreaks = null;
}
```

Every computed getter checks `_filtersDirty` before recomputing:
```dart
List<Map<String, dynamic>> get filteredSessions {
  if (_filtersDirty || _cachedFilteredSessions == null) {
    _cachedFilteredSessions = _computeFilteredSessions();
    _filtersDirty = false;
  }
  return _cachedFilteredSessions!;
}
```

### 4.3 SemesterInfo Model

```dart
class SemesterInfo {
  final int academicYear;
  final int semesterNumber;
  final String label;          // "Semester 1"
  final DateTime startDate;
  final DateTime endDate;

  String get id => '$academicYear|$semesterNumber';
  String get shortYear => '$academicYear-${(academicYear + 1).toString().substring(2)}';
  String get displayLabel => 'Sem $semesterNumber • $shortYear';
}
```

Semester groups are statically computed from 2023–2027, producing 8 semesters per academic year pair.

### 4.4 Filter Persistence

Filters are persisted via `PersistenceService.prefs`:
- `reports_selected_semester` → `String` (semester ID)
- `reports_month_filter` → `int` (MonthFilterType index)

Loaded in constructor, persisted on every `setSemester()` / `setMonthFilter()` call.

---

## 5. Data Flow

### 5.1 Initialization Sequence

```
1. ReportsController()
   ├── _loadPersistedFilters()     ← SharedPreferences
   ├── _init()
   │   ├── _loadLastSyncTime()     ← Hive academicBox
   │   └── FacultyService.courses.addListener(_onCoursesLoaded)
   └── [if courses already loaded] _onCoursesLoaded()
       └── setSelectedCourse(firstCourse.id)
           └── fetchReports()
```

### 5.2 fetchReports() Flow

```
fetchReports()
├── [no courseId] → use dummy data → _status = success → return
├── _status = loading → notifyListeners()
├── ReportsService.fetchReports(courseId)
│   ├── GET /api/v1/faculty/sync
│   ├── Extract rosters[courseId] → students
│   ├── Extract adhoc_sessions → sessions
│   ├── PersistenceService.academicBox.put('eligibility_students_$courseId', students)
│   ├── computeStats(students, sessions)
│   └── _saveCache(courseId, result)
│       └── PersistenceService.academicBox.put('reports_cache_$courseId', result)
├── [success] → update _students, _sessions, _stats
│   ├── EligibilityService.students.value = students
│   ├── _isOffline = false
│   └── _invalidateFilters()
├── [error] → fallback to dummy data
│   ├── _isOffline = true
│   └── _invalidateFilters()
└── notifyListeners()
```

### 5.3 Filter Application Chain

```
User changes filter (semester/month/course)
├── setSelectedCourse() / setSemester() / setMonthFilter()
├── _invalidateFilters()         ← marks all caches dirty
├── _persistFilters()            ← saves to SharedPreferences
└── notifyListeners()            ← triggers UI rebuild
    └── Each computed getter lazily recomputes on next access
```

### 5.4 Filtering Logic (filteredSessions)

Two-pass filter:

**Pass 1 — Semester filter:**
```dart
result.where((s) {
  final date = DateTime.parse(s['date']);
  return !date.isBefore(semester.startDate) && !date.isAfter(semester.endDate);
});
```

**Pass 2 — Month filter:**
| MonthFilterType | rangeStart | rangeEnd |
|----------------|------------|----------|
| `today` | DateTime(now.year, now.month, now.day) | same + 23:59:59 |
| `thisWeek` | now - weekday offset (Monday) | now 23:59:59 |
| `thisMonth` | DateTime(now.year, now.month, 1) | now 23:59:59 |
| `lastMonth` | DateTime(now.year, now.month - 1, 1) | DateTime(now.year, now.month, 0) 23:59:59 |

---

## 6. Computed Analytics

### 6.1 KPI Calculations

| KPI | Formula |
|-----|---------|
| `overall_average` | `sum(filtered_sessions.attendance_percentage) / count(filtered_sessions)` |
| `total_students` | `_stats['total_students']` (from `computeStats`) |
| `eligible_count` | Students with `attended/total >= 0.75` |
| `at_risk_count` | Students with `0.60 <= attended/total < 0.75` |
| `defaulter_count` | Students with `attended/total < 0.60` |
| `total_sessions` | `filteredSessions.length` |

### 6.2 Sparkline Data (7 points)

```dart
List<double> _computeSparklineData() {
  final sorted = filteredSessions by date ascending;
  final step = (sorted.length - 1) / 6;
  for (int i = 0; i < 7; i++) {
    final idx = (i * step).round().clamp(0, sorted.length - 1);
    points.add(sorted[idx]['attendance_percentage'] / 100.0);
  }
  return points;  // 7 normalized [0.0, 1.0] values
}
```

### 6.3 Weekly Trend

```dart
// Buckets sessions into week indices (0 = this week, 1 = last week, ..., 11 = 12 weeks ago)
final weekIndex = now.difference(sessionDate).inDays ~/ 7;
// Average attendance percentage per week bucket
trend.add({'week': 'W${weekIndex + 1}', 'value': avgPercentage});
```

### 6.4 Weekly Chart Data (Day-of-Week)

Aggregates sessions by weekday (Mon–Sun), computing:
- `present` = sum of `(attendance_percentage * total_students / 100).round()`
- `absent` = sum of `(total_students - present)`
- `percentage` = `present / total * 100`

### 6.5 At-Risk Students

```dart
// threshold: attended/total < 0.75
// is_critical: attended/total < 0.50
students.where((s) => (s['attended'] / s['total']) < 0.75)
  .map((s) => {...s, 'is_critical': (s['attended'] / s['total']) < 0.50});
```

### 6.6 Top Performers

Students sorted descending by `attended/total`, limited to top 10.

### 6.7 Absent Streaks

Students with `max_absent_streak >= 3`, sorted descending by streak length.

### 6.8 Report Distribution

```dart
[
  {'name': 'Eligible', 'value': eligible_count, 'color': Color(0xFF22C55E)},
  {'name': 'At Risk', 'value': at_risk_count, 'color': Color(0xFFFBBF24)},
  {'name': 'Defaulters', 'value': defaulter_count, 'color': Color(0xFFEF4444)},
  {'name': 'Sessions', 'value': filteredSessions.length, 'color': Color(0xFF60A5FA)},
]
```

### 6.9 Department Performance

Derived from `FacultyService.courses.value`:
```dart
courses.map((c) => {
  'name': c['short_name'] ?? c['course'],
  'percentage': c['avg_attendance'],
  'sessions': c['session_count'],
});
```

---

## 7. Export System

### 7.1 Export Flow

```
exportAsFormat(context, format)
├── _isExporting = true → notifyListeners()
├── showDialog("Generating Report...")
├── Permission.manageExternalStorage.request() (Android)
├── getApplicationDocumentsDirectory()
├── filename: 'attendance_{courseName}_{yyyyMMdd_HHmmss}.{ext}'
├── switch(format):
│   ├── 'csv'  → _exportCSV()
│   ├── 'pdf'  → _exportPDF()
│   └── 'excel' → _exportExcel()
├── Navigator.pop() → SnackBar("Report downloaded successfully") + Open button
└── _isExporting = false → notifyListeners()
```

### 7.2 CSV Export

Multi-section CSV:
```
[IntelliAttend Attendance Report header]
[Faculty, Department, Course, Semester, Period, Generated metadata]
[Summary section: Total Students, Avg Attendance, Eligible, Defaulters, At Risk, Total Sessions]
[Student Details: ID, Name, Roll, Attended, Total, %, Status]
[Session History: Date, Attendance %, Students]
```

### 7.3 PDF Export

Uses `pdf` package with `pw.Document`:
- **Page format:** A4
- **Header:** Title + timestamp + teal divider
- **Info rows:** Faculty, Department, Course, Semester, Period
- **Summary box:** 5-column stat row (Students, Avg Att., Eligible, Defaulters, Sessions)
- **Student table:** 7 columns (ID, Name, Roll, Att, Total, %, Status)
- **Session table:** 3 columns (Date, Attendance %, Students)
- **Footer:** "IntelliAttend • Confidential"

### 7.4 Excel Export

Uses `excel` package with 3 sheets:
- **Summary sheet:** Metadata + summary statistics
- **Students sheet:** 7-column student roster
- **Sessions sheet:** 3-column session history

### 7.5 Export Header Data

```dart
String _getExportHeader() => [
  'IntelliAttend Attendance Report',
  'Faculty: ${profile.name}',
  'Department: ${profile.department}',
  'Course: $courseName',
  'Semester: $semesterDisplayLabel',
  'Period: $monthFilterLabel',
  'Generated: ${DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now())}',
].join('\n');
```

---

## 8. Bottom Sheets

### 8.1 Download Sheet (`_showDownloadSheet`)

- **Type:** `StatefulBuilder` modal bottom sheet
- **Options:** PDF, Excel, CSV (Radio group)
- **Default:** CSV
- **Actions:** Cancel, Download
- **On download:** Calls `_controller.exportAsFormat(context, selectedFormat)`

### 8.2 Semester Picker (`_showSemesterSheet`)

- **Height:** 60% of screen
- **Content:** `_SemesterPickerSheet` StatefulWidget
- **Layout:** Grouped by academic year (2023–24, 2024–25, etc.)
- **Selection:** Single select with checkmark icon
- **Clear button:** Clears selection (shows all data)
- **Apply button:** Calls `controller.setSemester(tempSelected)`

### 8.3 Month Filter (`_showMonthFilterSheet`)

- **Options:** Today, This Week, This Month, Last Month (Radio group)
- **Layout:** Vertical list with icons (today_rounded, view_week_rounded, calendar_month_rounded, history_rounded)
- **Apply button:** Calls `controller.setMonthFilter(tempFilter)`

### 8.4 Course Picker (`_showCoursePicker`)

- **Height:** 50% of screen
- **Content:** `_CoursePickerSheet` StatelessWidget
- **Data source:** `FacultyService.courses.value`
- **Selection:** Single select with checkmark, teal highlight
- **On select:** Calls `controller.setSelectedCourse(id)` and pops

---

## 9. Skeleton Loading

```dart
Widget _buildSkeletonLoader() {
  // Shimmer rectangles for:
  // - Date range header (44px height, radius 14)
  // - 2x2 grid of KPI cards (radius 20)
  // - Chart placeholder (320px height, radius 20)
  // - Secondary chart (260px height, radius 20)
  // - Bottom card (200px height, radius 20)
  // Colors: isDark ? white@0.06 : grey.shade200
}
```

---

## 10. Empty & Error States

### 10.1 Empty State
- Icon: `Icons.assessment_outlined` (56px, teal@0.5)
- Emoji: 📊
- Title: "No attendance reports available"
- Subtitle: "Attendance data will appear after synchronization."
- Action: Refresh button

### 10.2 Error State (no data + error)
- Icon: `Icons.cloud_off_rounded` (56px, red@0.5)
- Title: "Unable to load reports."
- Subtitle: "Please connect to the internet."
- Action: Retry button

### 10.3 Offline Banner
- Displayed when `_controller.isOffline == true`
- Yellow banner with wifi_off icon
- "Offline Mode • Showing last synced data"
- Last synced timestamp

---

## 11. Chart Specifications

### 11.1 Attendance Chart (`attendance_chart.dart`)

- **Toggle:** Daily / Weekly / Monthly (SegmentedButton-style)
- **Chart type:** SfCartesianChart
  - Daily: ColumnSeries (bar)
  - Weekly: SplineAreaSeries
  - Monthly: LineSeries
- **Axes:** CategoryAxis (X), NumericAxis (Y: 0–100)
- **Colors:** `AppTheme.accentTeal` (primary), grey (grid)

### 11.2 Report Distribution Chart

- **Type:** SfCircularChart with DoughnutSeries
- **Segments:** Eligible (green), At Risk (yellow), Defaulters (red), Sessions (blue)

### 11.3 Department Performance

- **Type:** Animated horizontal bars
- **Animation:** Staggered entrance with 100ms delay per bar
- **Data:** Department name, attendance percentage, session count

### 11.4 Report KPI Card

- **Features:** Animated entrance (fade + slide), sparkline (7 points), change indicator (+/- %)
- **Animation delay:** Staggered by `animationDelayMs` (0, 100, 200, 300)

### 11.5 Overview Doughnut Gauge

- **Type:** SfCircularChart with DoughnutSeries
- **Inner radius:** 72%
- **Center:** Attendance % + "Average" label
- **Series:** [avg, 100-avg] → teal vs surface color

### 11.6 Analytics Student Line Chart

- **Type:** SfCartesianChart with LineSeries
- **Data:** Top 15 students sorted by attendance percentage
- **X-axis:** Student short names (6 chars max), rotation -45
- **Y-axis:** 0–100, interval 25
- **Markers:** Visible, 6px, teal with card border

### 11.7 Analytics Weekly Trend Chart

- **Type:** SfCartesianChart with SplineAreaSeries
- **Data:** Weekly attendance trend
- **Y-axis:** 50–100, interval 10
- **Data labels:** Visible, bold 10px font

---

## 12. Service Layer

### 12.1 ReportsService

```dart
class ReportsService {
  final Dio _dio;  // from ApiClient singleton

  Future<Map<String, dynamic>> fetchReports(String courseId);
  Map<String, dynamic> computeStats(students, sessions);
  static Future<void> _saveCache(String courseId, Map<String, dynamic> data);
  static Map<String, dynamic>? _loadCache(String courseId);
  static String? getLastSyncTime();
}
```

**API endpoint:** `GET /api/v1/faculty/sync`
- Timeout: 15s send / 15s receive
- Response structure: `{ rosters: { [courseId]: [...] }, adhoc_sessions: [...], cohorts: [...] }`
- Roster lookup: First by `rosters[courseId]`, then by matching `cohorts[].course_code`

**Caching:**
- Key: `reports_cache_$courseId` in `PersistenceService.academicBox`
- Sync time: `reports_last_sync` in same box
- On Dio error: Falls back to cached data before throwing

### 12.2 EligibilityService

```dart
class EligibilityService {
  static const double threshold = 0.75;
  static final ValueNotifier<List<Map<String, dynamic>>> students;
  static final ValueNotifier<bool> isLoading;

  static void switchCourse(String courseId);    // Load from cache
  static List getEligibleStudents();            // attended/total >= 0.75
  static List getDefaulters();                  // attended/total < 0.75
  static Map calculate(int attended, int total); // Individual stats
  static int _classesNeeded(int attended, int total); // Classes to reach 75%
  static void stopListening();
}
```

**Classes needed formula:**
```dart
final needed = (0.75 * total - attended) / (1 - 0.75);
return needed > 0 ? needed.ceil() : 0;
```

---

## 13. Tab Views

The Reports module uses two distinct tab architectures:

### 13.1 Main Reports Tab (Overview/Analytics/Students/Defaulters/Eligibility/Sessions/Actions)

Each tab is a standalone `StatelessWidget` (or `StatefulWidget` for filter state) receiving `ReportsController`:

| Tab | Filter Chips | Key Features |
|-----|-------------|--------------|
| Overview | None | Doughnut gauge, quick stats, course cards, day-of-week chart |
| Analytics | None | Attendance overview, student line chart, weekly trend, summary row, export buttons |
| Students | All At Risk / Critical / Top Performers / Streak | Student cards with badges, percentage, progress bar |
| Defaulters | All / Critical (<60%) / At Risk (60–75%) | Alert header, avg deficit, student cards with Warn/Call Parent/Meeting actions |
| Eligibility | All / Above 90% / 75–90% | Student cards with eligible status |
| Sessions | None | Session list with course code, section, date, progress bar |
| Actions | None | Quick action cards: send warnings, export CSV/PDF, share report |

### 13.2 Student Tab Filter Behavior

```dart
// StudentsTab
switch (_filterIndex) {
  case 0: atRisk                    // all students < 75%
  case 1: atRisk.where(is_critical) // students < 50%
  case 2: topPerformers             // top 10 by percentage
  case 3: absentStreaks             // streak >= 3
}

// DefaulterTab
switch (_filterIndex) {
  case 0: allDefaulters             // all < 75%
  case 1: critical (< 60%)          // red zone
  case 2: at risk (60–75%)          // yellow zone
}
```

---

## 14. Animation Specifications

| Element | Animation | Duration | Curve |
|---------|-----------|----------|-------|
| KPI Cards | Fade + Slide up | 400ms | easeOut |
| KPI Card stagger | Per-card delay | 0/100/200/300ms | — |
| Department bars | Width from 0 to value | 800ms | easeOut |
| Bar stagger | Per-bar delay | index * 100ms | — |
| Skeleton shimmer | Color animation | 1500ms loop | easeInOut |
| Report KPI sparkline | Data points fade | 300ms | linear |
| Chart entrance | SfCharts default | 500ms | easeOut |

---

## 15. Offline Behavior

```
fetchReports() error path:
├── ReportsService catches DioException
│   └── Checks _loadCache(courseId) → returns cached if available
├── ReportsController catches any error
│   ├── Falls back to _dummyStudents + _dummySessions
│   ├── _isOffline = true
│   └── _status = success (shows data, not error)
└── UI shows offline banner with last sync timestamp
```

**Dummy data (10 students):**
```dart
[
  {'id': 'STU001', 'name': 'Aarav Sharma', 'roll_number': '2023CS001', 'attended': 12, 'total': 15},
  {'id': 'STU002', 'name': 'Priya Patel', 'roll_number': '2023CS002', 'attended': 14, 'total': 15},
  // ... 8 more
]
```

**Dummy sessions (5 sessions):**
```dart
[
  {'date': '2026-07-14', 'attendance_percentage': 85.0, 'total_students': 10},
  {'date': '2026-07-13', 'attendance_percentage': 78.5, 'total_students': 10},
  // ... 3 more
]
```

---

## 16. Permissions

| Platform | Permission | When |
|----------|-----------|------|
| Android | `manageExternalStorage` | Before export (PDF/Excel/CSV) |

Request pattern:
```dart
if (Platform.isAndroid) {
  final status = await Permission.manageExternalStorage.status;
  if (!status.isGranted) {
    await Permission.manageExternalStorage.request();
  }
}
```

---

## 17. Performance Considerations

### 17.1 RepaintBoundary Usage

Every major chart/card section is wrapped in `RepaintBoundary`:
- KPI cards (index 2)
- Charts row (index 4)
- Department performance (index 6)
- Bottom row / Recent reports (index 8)
- Export stats (index 10)

### 17.2 KeyedSubtree for Filter Changes

```dart
KeyedSubtree(
  key: ValueKey('${_controller.monthFilter.index}_${_controller.selectedSemester?.id ?? 'all'}'),
  child: _buildChartsRow(),
)
```

Forces complete chart rebuild when filters change rather than incremental update.

### 17.3 PageStorageKey for Scroll Position

```dart
CustomScrollView(
  key: const PageStorageKey<String>('reports_scroll'),
  // Preserves scroll position across tab switches
)
```

### 17.4 Lazy Cache Computation

All 10 computed caches are lazily evaluated on first access after invalidation, not eagerly recomputed on `_invalidateFilters()`.

---

## 18. API Contract

### 18.1 GET /api/v1/faculty/sync

**Request:** No body (auth via interceptor)

**Response (200):**
```json
{
  "rosters": {
    "<course_id>": [
      {
        "id": "STU001",
        "name": "Student Name",
        "roll_number": "2023CS001",
        "attended": 12,
        "total": 15,
        "student_id": "STU001"
      }
    ]
  },
  "adhoc_sessions": [
    {
      "date": "2026-07-14",
      "attendance_percentage": 85.0,
      "total_students": 30
    }
  ],
  "cohorts": [
    {
      "id": "cohort_123",
      "course_code": "CS101",
      "subject_code": "CS101"
    }
  ]
}
```

**Error responses:**
| Status | Body | Fallback |
|--------|------|----------|
| 408 timeout | `{ "error": "..." }` | Cache → dummy data |
| 500 | `{ "detail": "..." }` | Cache → dummy data |
| No connection | DioException | Cache → dummy data |

---

## 19. Edge Cases

| Case | Behavior |
|------|----------|
| No courses loaded | Uses dummy data, status = success |
| Empty students + sessions | Shows empty state with refresh button |
| All sessions filtered out | KPI cards show 0, charts empty |
| Semester span entire year | Works (July 1 – June 30) |
| `max_absent_streak` null | Excluded from streak list |
| Export with no students | Generates report with 0 rows |
| Export with no internet | Generates from cached/loaded data |
| Multiple rapid filter changes | Cache invalidation ensures consistency |
| Course change mid-load | Old requests complete but data replaced |
| `total = 0` in student data | Division by zero avoided: `total > 0 ? attended/total : 0.0` |

---

## 20. Dependencies

| Package | Usage |
|---------|-------|
| `syncfusion_flutter_charts` | SfCartesianChart, SfCircularChart (doughnut, line, spline area, column) |
| `pdf` | PDF generation for export |
| `excel` | Excel generation for export |
| `open_filex` | Open exported file with system viewer |
| `permission_handler` | Android storage permission |
| `path_provider` | Application documents directory |
| `intl` | DateFormat for export headers |
| `google_fonts` | Inter font throughout |
| `dio` | HTTP client (via ApiClient singleton) |

---

## 21. Known Tech Debt

1. **`reports_screen.dart` (1,268 lines):** Contains 3 private bottom sheet widgets (`_SemesterPickerSheet`, `_MonthFilterSheet`, `_CoursePickerSheet`) that should be extracted to separate files.
2. **`reports_controller.dart` (1,065 lines):** God controller managing filtering, caching, export (3 formats), and stats computation. Should be split into `ReportsFilterController`, `ReportsExportController`, `ReportsAnalyticsController`.
3. **`report_helper_widgets.dart` (504 lines):** Shared helper file used across multiple tabs — some widgets like `report_helper_widgets.dart` contain a retrospective correction dialog that belongs elsewhere.
4. **Dummy data hard-coded:** 10 dummy students and 5 dummy sessions are statically defined in the controller rather than being test fixtures.
5. **`FacultyService.courses.value` direct access:** Multiple components directly read from `FacultyService.courses.value` instead of going through the controller.
6. **`EligibilityService` is static:** Uses static `ValueNotifier` fields, making testing and lifecycle management difficult.
7. **Export permission not awaited properly:** `Permission.manageExternalStorage.request()` result is not checked after calling.
8. **No export cancellation:** Once export starts, there's no way to cancel a long-running PDF/Excel generation.
