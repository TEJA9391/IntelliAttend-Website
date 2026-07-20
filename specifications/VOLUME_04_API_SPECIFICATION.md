# VOLUME 04: API SPECIFICATION

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. API Overview

### 1.1 Base Configuration

| Property | Value |
|----------|-------|
| Base URL (Production) | `https://api.intelliattend.com/api/v1` |
| Base URL (Staging) | `https://staging-api.intelliattend.com/api/v1` |
| Protocol | HTTPS (TLS 1.3) |
| Content Type | `application/json` |
| Authentication | Bearer Token (JWT) |
| Rate Limit | 100 requests/minute per user |

### 1.2 Authentication Header

```
Authorization: Bearer <access_token>
X-Device-Fingerprint: <device_id>
X-Request-ID: <uuid>
X-Timestamp: <unix_timestamp>
```

### 1.3 Standard Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2026-07-19T10:30:00Z",
  "requestId": "uuid-v4"
}
```

### 1.4 Error Response

```json
{
  "success": false,
  "error": {
    "code": "ATTENDANCE_GRACE_PERIOD_EXPIRED",
    "message": "Grace period has expired for this session",
    "details": {
      "sessionId": "abc123",
      "gracePeriodMinutes": 15,
      "elapsedMinutes": 23
    }
  },
  "timestamp": "2026-07-19T10:30:00Z",
  "requestId": "uuid-v4"
}
```

---

## 2. Authentication Endpoints

### 2.1 POST /auth/login

**Description:** Authenticate user with email and password.

**Request:**
```json
{
  "email": "faculty@university.edu",
  "password": "secure_password",
  "deviceFingerprint": "device_uuid_v4",
  "fcmToken": "firebase_cloud_messaging_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
    "expiresIn": 900,
    "tokenType": "Bearer",
    "user": {
      "uid": "firebase_uid",
      "email": "faculty@university.edu",
      "displayName": "Dr. John Smith",
      "role": "faculty",
      "departmentId": "dept_cs"
    }
  }
}
```

**Error Codes:**
| Code | Status | Description |
|------|--------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Invalid email or password |
| `AUTH_ACCOUNT_DISABLED` | 403 | Account has been disabled |
| `AUTH_RATE_LIMITED` | 429 | Too many login attempts |
| `AUTH_DEVICE_BLOCKED` | 403 | Rooted/jailbroken device detected |

### 2.2 POST /auth/refresh

**Description:** Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "bmV3IHJlZnJlc2ggdG9r...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

### 2.3 POST /auth/logout

**Description:** Invalidate current session and refresh token.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 3. User Endpoints

### 3.1 GET /users/me

**Description:** Get current user profile.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "firebase_uid",
    "email": "faculty@university.edu",
    "displayName": "Dr. John Smith",
    "role": "faculty",
    "departmentId": "dept_cs",
    "profileImageUrl": "https://storage...",
    "isActive": true,
    "createdAt": "2026-01-15T08:00:00Z",
    "lastLoginAt": "2026-07-19T10:30:00Z",
    "metadata": {
      "employeeId": "EMP001",
      "designation": "Professor"
    }
  }
}
```

### 3.2 PUT /users/me

**Description:** Update current user profile.

**Request:**
```json
{
  "displayName": "Dr. John Smith Jr.",
  "profileImageUrl": "https://storage..."
}
```

### 3.3 GET /users/students

**Description:** List students (Faculty/HOD/Admin only).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| departmentId | string | - | Filter by department |
| semester | int | - | Filter by semester |
| sectionId | string | - | Filter by section |
| search | string | - | Search by name or ID |
| page | int | 1 | Page number |
| limit | int | 20 | Items per page (max 100) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "userId": "student_uid",
        "studentId": "STU001",
        "displayName": "Alice Johnson",
        "email": "alice@university.edu",
        "departmentId": "dept_cs",
        "semester": 5,
        "attendancePercentage": 85.5,
        "trustScore": 78.0,
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

## 4. Course Endpoints

### 4.1 GET /courses

**Description:** List courses.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| departmentId | string | - | Filter by department |
| semester | string | - | Filter by semester |
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course_id",
        "code": "CS101",
        "name": "Introduction to Programming",
        "departmentId": "dept_cs",
        "credits": 4,
        "semester": "1",
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### 4.2 POST /courses

**Description:** Create a new course (Admin only).

**Request:**
```json
{
  "code": "CS201",
  "name": "Data Structures",
  "departmentId": "dept_cs",
  "credits": 4,
  "semester": "3"
}
```

### 4.3 GET /courses/{id}

**Description:** Get course details.

### 4.4 PUT /courses/{id}

**Description:** Update course (Admin only).

---

## 5. Session Endpoints

### 5.1 GET /sessions

**Description:** List attendance sessions.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| courseId | string | - | Filter by course |
| sectionId | string | - | Filter by section |
| status | string | - | Filter by status |
| startDate | string | - | ISO date |
| endDate | string | - | ISO date |
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_id",
        "courseId": "course_id",
        "courseCode": "CS101",
        "courseName": "Introduction to Programming",
        "sectionId": "section_id",
        "sectionName": "A",
        "facultyUserId": "faculty_uid",
        "facultyName": "Dr. John Smith",
        "type": "lecture",
        "status": "active",
        "scheduledStartTime": "2026-07-19T09:00:00Z",
        "scheduledEndTime": "2026-07-19T10:00:00Z",
        "actualStartTime": "2026-07-19T09:02:00Z",
        "actualEndTime": null,
        "gracePeriodMinutes": 15,
        "attendanceStats": {
          "present": 28,
          "late": 3,
          "absent": 5,
          "total": 36
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 120,
      "totalPages": 6
    }
  }
}
```

### 5.2 POST /sessions

**Description:** Create a new attendance session (Faculty only).

**Request:**
```json
{
  "courseId": "course_id",
  "sectionId": "section_id",
  "type": "lecture",
  "roomNumber": "Room 301",
  "scheduledStartTime": "2026-07-20T09:00:00Z",
  "scheduledEndTime": "2026-07-20T10:00:00Z",
  "gracePeriodMinutes": 15,
  "qrRotationSeconds": 60
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "new_session_id",
    "status": "scheduled",
    "message": "Session created successfully"
  }
}
```

### 5.3 POST /sessions/{id}/start

**Description:** Start an attendance session (Faculty only).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "session_id",
    "status": "active",
    "actualStartTime": "2026-07-19T09:02:00Z",
    "qrCode": "base64_encoded_qr_image",
    "qrExpiresAt": "2026-07-19T09:03:00Z"
  }
}
```

### 5.4 POST /sessions/{id}/end

**Description:** End an attendance session (Faculty only).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "session_id",
    "status": "ended",
    "actualEndTime": "2026-07-19T10:05:00Z",
    "attendanceStats": {
      "present": 30,
      "late": 3,
      "absent": 3,
      "total": 36
    }
  }
}
```

### 5.5 GET /sessions/{id}/attendance

**Description:** Get attendance records for a session.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_id",
    "attendance": [
      {
        "id": "record_id",
        "studentUserId": "student_uid",
        "studentName": "Alice Johnson",
        "studentId": "STU001",
        "status": "present",
        "markedAt": "2026-07-19T09:05:00Z",
        "method": "qr",
        "trustScoreAtMarking": 85
      }
    ],
    "summary": {
      "present": 30,
      "late": 3,
      "absent": 3,
      "total": 36
    }
  }
}
```

---

## 6. Attendance Endpoints

### 6.1 POST /attendance/mark

**Description:** Mark student attendance (Student only).

**Request:**
```json
{
  "sessionId": "session_id",
  "qrCodeHash": "sha256_hash_of_qr_code",
  "deviceFingerprint": "device_uuid_v4",
  "timestamp": "2026-07-19T09:05:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recordId": "record_id",
    "status": "present",
    "markedAt": "2026-07-19T09:05:00Z",
    "trustScore": 86,
    "message": "Attendance marked successfully"
  }
}
```

**Error Codes:**
| Code | Status | Description |
|------|--------|-------------|
| `ATTENDANCE_GRACE_PERIOD_EXPIRED` | 400 | Grace period has expired |
| `ATTENDANCE_QR_EXPIRED` | 400 | QR code has expired |
| `ATTENDANCE_ALREADY_MARKED` | 409 | Attendance already marked for this session |
| `ATTENDANCE_QR_INVALID` | 400 | Invalid QR code hash |
| `ATTENDANCE_SESSION_NOT_ACTIVE` | 400 | Session is not currently active |

### 6.2 GET /attendance/student/{id}

**Description:** Get student attendance history.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| courseId | string | - | Filter by course |
| startDate | string | - | ISO date |
| endDate | string | - | ISO date |
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "student": {
      "userId": "student_uid",
      "studentId": "STU001",
      "displayName": "Alice Johnson",
      "attendancePercentage": 85.5,
      "trustScore": 78.0
    },
    "records": [
      {
        "sessionId": "session_id",
        "courseCode": "CS101",
        "courseName": "Introduction to Programming",
        "date": "2026-07-19",
        "status": "present",
        "markedAt": "2026-07-19T09:05:00Z",
        "method": "qr"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### 6.3 PUT /attendance/{id}/override

**Description:** Override an attendance record (Faculty only).

**Request:**
```json
{
  "status": "excused",
  "reason": "Student had valid medical certificate"
}
```

---

## 7. QR Code Endpoints

### 7.1 GET /qr/generate

**Description:** Generate new QR code for active session (Faculty only).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| sessionId | string | required | Session ID |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "qrCode": "base64_encoded_qr_image",
    "qrCodeHash": "sha256_hash",
    "expiresAt": "2026-07-19T09:03:00Z",
    "rotationSeconds": 60,
    "version": "7.0"
  }
}
```

### 7.2 POST /qr/validate

**Description:** Validate QR code scan (Student).

**Request:**
```json
{
  "qrCodeHash": "sha256_hash_of_scanned_qr",
  "sessionId": "session_id",
  "deviceFingerprint": "device_uuid_v4",
  "timestamp": "2026-07-19T09:05:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "sessionActive": true,
    "gracePeriodRemaining": 10,
    "message": "QR code is valid"
  }
}
```

---

## 8. Analytics Endpoints

### 8.1 GET /analytics/dashboard

**Description:** Get dashboard summary (role-based).

**Response (200) - Faculty:**
```json
{
  "success": true,
  "data": {
    "todaySessions": 3,
    "todayAttendance": 85.5,
    "weeklyTrend": [
      { "date": "2026-07-13", "percentage": 82.0 },
      { "date": "2026-07-14", "percentage": 85.5 }
    ],
    "recentSessions": [
      {
        "id": "session_id",
        "courseCode": "CS101",
        "startTime": "2026-07-19T09:00:00Z",
        "attendancePercentage": 88.9
      }
    ],
    "alerts": [
      {
        "type": "low_attendance",
        "studentName": "Bob Wilson",
        "courseCode": "CS101",
        "percentage": 65.0
      }
    ]
  }
}
```

### 8.2 GET /analytics/department/{id}

**Description:** Get department analytics (HOD only).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "departmentId": "dept_cs",
    "departmentName": "Computer Science",
    "overallAttendance": 82.5,
    "facultyPerformance": [
      {
        "facultyId": "faculty_uid",
        "name": "Dr. John Smith",
        "averageAttendance": 85.5,
        "sessionsConducted": 45
      }
    ],
    "courseWiseAttendance": [
      {
        "courseId": "course_id",
        "courseCode": "CS101",
        "courseName": "Introduction to Programming",
        "attendancePercentage": 88.9
      }
    ],
    "monthlyTrend": [
      { "month": "2026-06", "percentage": 80.0 },
      { "month": "2026-07", "percentage": 82.5 }
    ]
  }
}
```

### 8.3 GET /analytics/export

**Description:** Export attendance report.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| courseId | string | - | Filter by course |
| sectionId | string | - | Filter by section |
| startDate | string | required | ISO date |
| endDate | string | required | ISO date |
| format | string | csv | Export format (csv, pdf) |

**Response:** File download

---

## 9. Notification Endpoints

### 9.1 GET /notifications

**Description:** Get user notifications.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| isRead | boolean | - | Filter by read status |
| type | string | - | Filter by type |
| page | int | 1 | Page number |
| limit | int | 20 | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notification_id",
        "type": "attendance",
        "title": "Attendance Marked",
        "body": "Your attendance has been marked for CS101",
        "data": {
          "sessionId": "session_id",
          "courseCode": "CS101"
        },
        "isRead": false,
        "createdAt": "2026-07-19T09:05:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

### 9.2 PUT /notifications/{id}/read

**Description:** Mark notification as read.

### 9.3 PUT /notifications/read-all

**Description:** Mark all notifications as read.

---

## 10. WebSocket Protocol

### 10.1 Connection

```
wss://api.intelliattend.com/ws?token=<access_token>
```

### 10.2 Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `subscribe:session` | `{ sessionId }` | Subscribe to session updates |
| `unsubscribe:session` | `{ sessionId }` | Unsubscribe from session |
| `ping` | `{}` | Heartbeat (every 30s) |

### 10.3 Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `session:started` | Session details | Session has started |
| `session:ended` | Session summary | Session has ended |
| `attendance:marked` | Student ID, status | New attendance recorded |
| `attendance:summary` | Live counts | Updated attendance summary |
| `qr:rotated` | New QR code | QR code has rotated |
| `notification:push` | Notification | New notification |
| `pong` | `{}` | Heartbeat response |
| `error` | Error details | WebSocket error |

---

*All API endpoints must include request validation, error handling, and audit logging. Use consistent naming conventions and response structures.*