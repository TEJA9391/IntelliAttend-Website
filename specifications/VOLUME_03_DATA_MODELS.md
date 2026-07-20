# VOLUME 03: DATA MODELS & SCHEMA

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Overview

This document defines all data models, their relationships, and storage schemas across Firestore (primary database), Redis (cache), and Hive (offline cache).

---

## 2. Core Domain Models

### 2.1 User

```dart
class User {
  final String uid;                    // Firebase Auth UID
  final String email;                  // University email
  final String displayName;            // Full name
  final UserRole role;                 // Student, Faculty, HOD, Admin, SuperAdmin
  final String? departmentId;          // Department reference
  final String? profileImageUrl;       // Avatar URL
  final bool isActive;                 // Account status
  final DateTime createdAt;            // Account creation timestamp
  final DateTime lastLoginAt;          // Last login timestamp
  final Map<String, dynamic> metadata; // Extensible key-value pairs
}
```

### 2.2 StudentProfile

```dart
class StudentProfile {
  final String userId;                 // Reference to User
  final String studentId;              // University roll number
  final String enrollmentNumber;       // Enrollment ID
  final String departmentId;           // Department reference
  final int semester;                  // Current semester (1-8)
  final double attendancePercentage;   // Computed attendance %
  final double trustScore;             // 0.0 - 100.0
  final List<String> enrolledCourseIds; // Active course enrollments
  final DateTime enrolledAt;           // Enrollment date
  final bool isActive;                 // Active student status
}
```

### 2.3 FacultyProfile

```dart
class FacultyProfile {
  final String userId;                 // Reference to User
  final String employeeId;             // University employee ID
  final String departmentId;           // Department reference
  final String designation;            // Professor, Associate, Assistant
  final List<String> assignedCourseIds; // Courses assigned to teach
  final List<String> assignedSectionIds; // Sections assigned
  final bool isActive;                 // Active faculty status
}
```

### 2.4 Department

```dart
class Department {
  final String id;                     // Auto-generated Firestore ID
  final String code;                   // e.g., "CS", "EE", "ME"
  final String name;                   // e.g., "Computer Science"
  final String? headUserId;            // HOD user reference
  final String? institutionId;         // Institution reference
  final bool isActive;                 // Active department status
}
```

### 2.5 Course

```dart
class Course {
  final String id;                     // Auto-generated Firestore ID
  final String code;                   // e.g., "CS101"
  final String name;                   // e.g., "Introduction to Programming"
  final String departmentId;           // Department reference
  final int credits;                   // Credit hours (1-4)
  final String semester;               // Applicable semester
  final bool isActive;                 // Active course status
}
```

### 2.6 Section

```dart
class Section {
  final String id;                     // Auto-generated Firestore ID
  final String name;                   // e.g., "A", "B", "C"
  final String departmentId;           // Department reference
  final String semester;               // Academic semester
  final int academicYear;              // e.g., 2026
  final int studentCount;              // Enrolled students count
  final bool isActive;                 // Active section status
}
```

### 2.7 AttendanceSession

```dart
class AttendanceSession {
  final String id;                     // Auto-generated Firestore ID
  final String courseId;               // Course reference
  final String sectionId;             // Section reference
  final String facultyUserId;         // Faculty who created session
  final String? roomNumber;           // Physical room
  final SessionType type;             // Lecture, Lab, Seminar, Tutorial
  final SessionStatus status;         // Scheduled, Active, Ended, Cancelled
  final DateTime scheduledStartTime;  // From timetable
  final DateTime scheduledEndTime;    // From timetable
  final DateTime? actualStartTime;    // When faculty started session
  final DateTime? actualEndTime;      // When faculty ended session
  final int gracePeriodMinutes;       // Grace period (default 15)
  final int qrRotationSeconds;       // QR rotation interval (default 60)
  final Map<String, dynamic> metadata; // Extensible
}
```

### 2.8 AttendanceRecord

```dart
class AttendanceRecord {
  final String id;                     // Auto-generated Firestore ID
  final String sessionId;             // Session reference
  final String studentUserId;         // Student reference
  final AttendanceStatus status;      // Present, Late, Absent, Excused
  final DateTime markedAt;            // When attendance was marked
  final MarkingMethod method;         // QR, Manual, NFC, Biometric
  final String? qrCodeHash;           // Hash of scanned QR code
  final int trustScoreAtMarking;      // Student trust score at time
  final String? deviceFingerprint;    // Device identifier
  final String? overriddenBy;         // Faculty who overrode
  final String? overrideReason;       // Override justification
  final DateTime? overriddenAt;       // Override timestamp
  final Map<String, dynamic> metadata; // Extensible
}
```

### 2.9 TimetableSlot

```dart
// From intelli_attend_shared package
class TimetableSlot {
  final String id;                     // Slot identifier
  final String courseId;              // Course reference
  final String sectionId;            // Section reference
  final DayOfWeek dayOfWeek;         // Monday - Sunday
  final TimeOfDay startTime;         // Slot start time
  final TimeOfDay endTime;           // Slot end time
  final String? roomNumber;          // Assigned room
  final String? facultyUserId;       // Assigned faculty
}
```

### 2.10 Notification

```dart
class AppNotification {
  final String id;                     // Auto-generated Firestore ID
  final String userId;                // Target user
  final NotificationType type;        // Attendance, Session, System, Alert
  final String title;                 // Notification title
  final String body;                  // Notification body
  final Map<String, dynamic>? data;   // Deep link payload
  final bool isRead;                  // Read status
  final DateTime createdAt;           // Creation timestamp
  final DateTime? readAt;            // When marked as read
}
```

---

## 3. Enums

### 3.1 UserRole

```dart
enum UserRole {
  student,       // Can scan QR, view own attendance
  faculty,       // Can create sessions, mark attendance, view reports
  hod,           // Can view department analytics, manage faculty
  admin,         // Can manage users, courses, system config
  superAdmin,    // Full system access, audit capabilities
  guest          // Read-only access to specific reports
}
```

### 3.2 AttendanceStatus

```dart
enum AttendanceStatus {
  present,       // Marked within grace period
  late,          // Marked after grace period
  absent,        // Session ended without marking
  excused,       // Excused absence (faculty override)
  pending        // Session still active
}
```

### 3.3 SessionStatus

```dart
enum SessionStatus {
  scheduled,     // Created but not started
  active,        // Currently in progress
  ended,         // Session completed
  cancelled      // Session cancelled
}
```

### 3.4 SessionType

```dart
enum SessionType {
  lecture,       // Regular lecture
  lab,           // Laboratory session
  seminar,       // Seminar or workshop
  tutorial,      // Tutorial session
  examination    // Exam session
}
```

### 3.5 MarkingMethod

```dart
enum MarkingMethod {
  qr,            // QR code scan
  manual,        // Faculty manual entry
  nfc,           // NFC tag scan (future)
  biometric      // Biometric verification (future)
}
```

### 3.6 DayOfWeek

```dart
enum DayOfWeek {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
}
```

### 3.7 NotificationType

```dart
enum NotificationType {
  attendance,    // Attendance-related
  session,       // Session-related
  system,        // System announcements
  alert          // Urgent alerts (low attendance, etc.)
}
```

---

## 4. Firestore Schema

### 4.1 Collection Structure

```
intelliattend/
├── users/{uid}
│   ├── email, displayName, role, departmentId, isActive
│   ├── createdAt, lastLoginAt, metadata
│   │
│   └── subcollections/
│       └── notifications/{notificationId}
│           ├── type, title, body, data, isRead
│           └── createdAt, readAt
│
├── departments/{departmentId}
│   ├── code, name, headUserId, institutionId, isActive
│   │
│   └── subcollections/
│       └── courses/{courseId}
│           ├── code, name, credits, semester, isActive
│           │
│           └── subcollections/
│               └── sessions/{sessionId}
│                   ├── courseId, sectionId, facultyUserId
│                   ├── type, status, scheduledStartTime, scheduledEndTime
│                   ├── actualStartTime, actualEndTime
│                   ├── gracePeriodMinutes, qrRotationSeconds
│                   │
│                   └── subcollections/
│                       └── attendance/{recordId}
│                           ├── sessionId, studentUserId, status
│                           ├── markedAt, method, qrCodeHash
│                           ├── trustScoreAtMarking, deviceFingerprint
│                           └── overriddenBy, overrideReason, overriddenAt
│
├── students/{userId}
│   ├── studentId, enrollmentNumber, departmentId, semester
│   ├── attendancePercentage, trustScore
│   ├── enrolledCourseIds, enrolledAt, isActive
│
├── faculty/{userId}
│   ├── employeeId, departmentId, designation
│   ├── assignedCourseIds, assignedSectionIds, isActive
│
├── sections/{sectionId}
│   ├── name, departmentId, semester, academicYear
│   ├── studentCount, isActive
│
├── timetable/{slotId}
│   ├── courseId, sectionId, dayOfWeek
│   ├── startTime, endTime, roomNumber, facultyUserId
│
└── audit_log/{logId}
    ├── userId, action, resource, resourceId
    ├── timestamp, ipAddress, userAgent, details
```

### 4.2 Indexes

| Collection | Fields Indexed | Purpose |
|------------|----------------|---------|
| users | role, departmentId, isActive | Role-based queries |
| sessions | courseId, sectionId, status, scheduledStartTime | Session listing |
| attendance | sessionId, studentUserId, status | Attendance queries |
| attendance | studentUserId, markedAt | Student history |
| notifications | userId, isRead, createdAt | Notification listing |
| audit_log | userId, action, timestamp | Audit queries |

---

## 5. Redis Cache Schema

### 5.1 Cache Keys

| Pattern | TTL | Purpose |
|---------|-----|---------|
| `qr:{sessionId}:{codeHash}` | 60 seconds | Active QR code validation |
| `session:{sessionId}:stats` | 30 seconds | Live attendance count |
| `user:{userId}:token` | 15 minutes | Refresh token blacklist |
| `rate_limit:{userId}` | 1 minute | API rate limiting |
| `timetable:active` | 5 minutes | Current active slots |
| `trust:{studentId}` | 1 hour | Cached trust score |

### 5.2 Data Structures

| Key Pattern | Redis Type | Fields |
|-------------|-----------|--------|
| `qr:{sessionId}:{codeHash}` | String | `{"valid": true, "expiresAt": timestamp}` |
| `session:{sessionId}:stats` | Hash | `present`, `late`, `absent`, `total` |
| `rate_limit:{userId}` | Sorted Set | Request timestamps |
| `timetable:active` | Set | Active slot IDs |

---

## 6. Hive Offline Schema

### 6.1 Box Names

| Box Name | Content | Encryption |
|----------|---------|------------|
| `auth_box` | JWT tokens, refresh tokens | Yes (AES-256) |
| `user_box` | Current user profile | Yes (AES-256) |
| `sessions_box` | Cached session list | No |
| `attendance_box` | Offline attendance queue | Yes (AES-256) |
| `settings_box` | App preferences, theme | No |
| `cache_box` | General API cache | No |

### 6.2 Offline Queue Structure

```dart
class OfflineAttendanceEntry {
  final String id;                     // UUID
  final String sessionId;             // Target session
  final String qrCodeHash;            // Scanned QR hash
  final DateTime scannedAt;           // Local timestamp
  final DeviceFingerprint device;     // Device info
  final int syncRetryCount;           // Retry attempts
  final SyncStatus status;            // Pending, Synced, Failed
}
```

---

## 7. Data Relationships

```
Department 1────* Course
Department 1────* StudentProfile
Department 1────* FacultyProfile
Department 1────* Section

Course 1────* AttendanceSession
Section 1────* AttendanceSession
FacultyProfile 1────* AttendanceSession

AttendanceSession 1────* AttendanceRecord
StudentProfile 1────* AttendanceRecord

Course 1────* TimetableSlot
Section 1────* TimetableSlot
FacultyProfile 1────* TimetableSlot

User 1────1 StudentProfile (optional)
User 1────1 FacultyProfile (optional)
User 1────* AppNotification
```

---

*All models must be immutable with `copyWith` methods. Use `equatable` for value equality. All timestamps in UTC.*