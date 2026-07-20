# VOLUME 02: SYSTEM ARCHITECTURE

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Architecture Overview

### 1.1 Architectural Style

IntelliAttend employs a **layered architecture** with **clean architecture principles** on the client side and a **serverless microservices** approach on the backend. The system follows a **event-driven** pattern for real-time communication via WebSocket.

### 1.2 Architecture Principles

| Principle | Description |
|-----------|-------------|
| Separation of Concerns | Each layer has distinct responsibilities |
| Dependency Rule | Dependencies flow inward; outer layers depend on inner layers |
| Interface Segregation | Clients depend only on interfaces they use |
| Single Responsibility | Each module does one thing well |
| Open/Closed | Open for extension, closed for modification |
| Offline-First | System degrades gracefully without network |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Faculty App  │  │ Student App  │  │ HOD Dashboard│      │
│  │  (Flutter)    │  │  (Flutter)   │  │   (React)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                              │
│              FastAPI + Rate Limiting                         │
│              CORS + Authentication                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Attendance  │  │   Session  │  │Notification│            │
│  │  Service    │  │  Service   │  │  Service   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   User     │  │  Analytics │  │   Sync     │            │
│  │  Service   │  │  Service   │  │  Service   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Firestore  │  │   Redis    │  │  Firebase  │            │
│  │  (Primary)  │  │  (Cache)   │  │   Auth     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE                             │
│  Firebase Functions │ Cloud Storage │ FCM │ Crashlytics     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Client Architecture (Flutter)

### 3.1 Application Layers

```
lib/
├── main.dart                    # Entry point, Provider tree
├── App.dart                     # MaterialApp, theme, router
│
├── Core/                        # Framework-agnostic foundation
│   ├── Constants/               # Colors, strings, dimensions
│   ├── Enums/                   # AttendanceStatus, UserRole, etc.
│   ├── Extensions/              # String, DateTime, BuildContext
│   ├── Theme/                   # Material 3 theme configuration
│   ├── Utils/                   # Helpers, formatters, validators
│   └── Widgets/                 # Shared UI components
│
├── Data/                        # Data layer
│   ├── Models/                  # Plain Dart objects (PODOs)
│   │   ├── attendance_record.dart
│   │   ├── attendance_session.dart
│   │   ├── course.dart
│   │   ├── faculty_profile.dart
│   │   ├── student_profile.dart
│   │   └── user.dart
│   ├── Repositories/            # Abstract interfaces + implementations
│   │   ├── attendance_repository.dart
│   │   ├── auth_repository.dart
│   │   ├── course_repository.dart
│   │   └── session_repository.dart
│   └── Services/                # API clients, WebSocket, persistence
│       ├── api_client.dart
│       ├── websocket_service.dart
│       └── persistence_service.dart
│
├── Domain/                      # Business logic
│   ├── UseCases/                # Application-specific business rules
│   │   ├── mark_attendance_use_case.dart
│   │   ├── get_sessions_use_case.dart
│   │   └── get_analytics_use_case.dart
│   └── Validators/              # Business rule validation
│       └── attendance_validator.dart
│
└── Presentation/                # UI layer
    ├── Features/                # Feature-based organization
    │   ├── Auth/                # Login, registration, biometric
    │   ├── Attendance/          # Session list, QR scanner, marking
    │   ├── Dashboard/           # Home, analytics, summary
    │   ├── Reports/             # Report generation, export
    │   └── Settings/            # Profile, preferences, security
    ├── Navigation/              # Route definitions, guards
    └── Providers/               # State management providers
        ├── auth_provider.dart
        ├── attendance_provider.dart
        └── session_provider.dart
```

### 3.2 Dependency Flow

```
Presentation → Domain → Data → Core
     ↓           ↓       ↓      ↓
  Providers   UseCases  Repos  Utils
```

**Rule:** Presentation never imports from Data directly. Domain never imports from Presentation.

---

## 4. Backend Architecture (FastAPI + Firebase)

### 4.1 Service Decomposition

| Service | Responsibility | Data Store |
|---------|---------------|------------|
| Auth Service | User authentication, token management | Firebase Auth |
| User Service | Profile management, role-based access | Firestore |
| Attendance Service | Mark attendance, validate QR, trust score | Firestore |
| Session Service | Create/manage attendance sessions | Firestore |
| Notification Service | Push notifications, in-app messages | FCM + Firestore |
| Analytics Service | Attendance reports, statistics | Firestore + Redis |
| Sync Service | Offline queue processing, conflict resolution | Firestore + Redis |
| QR Service | Generate/validate time-locked QR codes | Redis (ephemeral) |

### 4.2 API Structure

```
/api/v1/
├── /auth/
│   ├── POST   /login              # Email/password login
│   ├── POST   /refresh            # Refresh access token
│   └── POST   /logout             # Invalidate session
│
├── /users/
│   ├── GET    /me                 # Current user profile
│   ├── PUT    /me                 # Update profile
│   ├── GET    /students           # List students (Faculty+)
│   └── GET    /faculty            # List faculty (HOD+)
│
├── /courses/
│   ├── GET    /                   # List courses
│   ├── POST   /                   # Create course (Admin)
│   ├── GET    /{id}               # Course details
│   └── PUT    /{id}               # Update course (Admin)
│
├── /sessions/
│   ├── GET    /                   # List sessions
│   ├── POST   /                   # Create session (Faculty)
│   ├── GET    /{id}               # Session details
│   ├── POST   /{id}/start         # Start session (Faculty)
│   ├── POST   /{id}/end           # End session (Faculty)
│   └── GET    /{id}/attendance    # Session attendance
│
├── /attendance/
│   ├── POST   /mark               # Mark attendance (Student)
│   ├── GET    /student/{id}       # Student attendance history
│   └── PUT    /{id}/override      # Override record (Faculty)
│
├── /analytics/
│   ├── GET    /dashboard          # Dashboard summary
│   ├── GET    /department/{id}    # Department analytics (HOD)
│   └── GET    /export             # Export report
│
└── /qr/
    ├── GET    /generate           # Generate QR code (Faculty)
    └── POST   /validate           # Validate QR scan (Student)
```

### 4.3 WebSocket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `session:started` | Server → All | Session details |
| `session:ended` | Server → All | Session summary |
| `attendance:marked` | Server → Faculty | Student ID, timestamp |
| `attendance:summary` | Server → Faculty | Live attendance count |
| `qr:rotated` | Server → Faculty | New QR code |
| `notification:push` | Server → Target | Notification payload |

---

## 5. Data Flow: Attendance Marking

```
Student App                 API Gateway              Backend Services
    │                           │                          │
    │  1. Scan QR               │                          │
    │──────────────────────────>│                          │
    │                           │  2. Validate QR          │
    │                           │─────────────────────────>│
    │                           │                          │
    │                           │  3. Check grace period   │
    │                           │  4. Verify device        │
    │                           │  5. Compute trust score  │
    │                           │                          │
    │                           │  6. Write attendance     │
    │                           │─────────────────────────>│
    │                           │                          │
    │  7. Confirmation          │                          │
    │<──────────────────────────│                          │
    │                           │                          │
    │                           │  8. WebSocket broadcast  │
    │                           │<─────────────────────────│
    │                           │                          │
    │                           │  9. Push notification    │
    │                           │─────────────────────────>│
```

---

## 6. Cross-Cutting Concerns

### 6.1 Logging

| Level | Usage | Destination |
|-------|-------|-------------|
| DEBUG | Development diagnostics | Console + Local file |
| INFO | Operational events | Firebase Analytics |
| WARN | Degraded functionality | Firebase Crashlytics |
| ERROR | Failures requiring attention | Crashlytics + Alerting |
| FATAL | System crashes | Crashlytics + PagerDuty |

### 6.2 Error Handling

```
Exception Hierarchy:
├── AppException (base)
│   ├── NetworkException
│   │   ├── NoConnectionException
│   │   ├── TimeoutException
│   │   └── ServerException
│   ├── AuthException
│   │   ├── InvalidCredentialsException
│   │   ├── TokenExpiredException
│   │   └── BiometricException
│   ├── ValidationException
│   │   ├── QRValidationException
│   │   ├── AttendanceValidationException
│   │   └── FormDataException
│   ├── CacheException
│   │   ├── HiveException
│   │   └── SyncException
│   └── SecurityException
│       ├── RootedException
│       ├── CertPinException
│       └── TamperedException
```

### 6.3 Security Layers

| Layer | Mechanism |
|-------|-----------|
| Transport | TLS 1.3 + Certificate Pinning |
| Authentication | Firebase Auth + Biometric |
| Authorization | Role-based access control (RBAC) |
| Data | AES-256-GCM encryption at rest |
| Input | Validation + sanitization |
| Rate Limiting | 100 requests/minute per user |
| Audit | All mutations logged with timestamp |

---

## 7. Deployment Architecture

### 7.1 Environments

| Environment | Purpose | URL Pattern |
|-------------|---------|-------------|
| Development | Local development | localhost |
| Staging | Pre-production testing | staging.intelliattend.com |
| Production | Live system | api.intelliattend.com |

### 7.2 CI/CD Pipeline

```
Code Push → GitHub Actions → Build → Test → Lint → Deploy to Staging → Manual Approval → Deploy to Production
```

---

*This document defines the target system architecture. All implementation decisions must align with this architecture.*