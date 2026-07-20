# IntelliAttend — Master Software Architecture

**Version:** 1.0.0
**Date:** July 19, 2026
**Status:** Single Source of Truth
**Scope:** Complete system architecture for all IntelliAttend applications

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [User Roles & Permissions](#2-user-roles--permissions)
3. [System Architecture](#3-system-architecture)
4. [Clean Architecture](#4-clean-architecture)
5. [Repository Pattern](#5-repository-pattern)
6. [State Management](#6-state-management)
7. [Folder Structure](#7-folder-structure)
8. [Navigation Architecture](#8-navigation-architecture)
9. [API Architecture](#9-api-architecture)
10. [WebSocket Architecture](#10-websocket-architecture)
11. [SmartBoard Architecture](#11-smartboard-architecture)
12. [Security Architecture](#12-security-architecture)
13. [Offline Architecture](#13-offline-architecture)
14. [Database Architecture](#14-database-architecture)
15. [Caching Strategy](#15-caching-strategy)
16. [Error Handling Strategy](#16-error-handling-strategy)
17. [Performance Strategy](#17-performance-strategy)
18. [Logging Strategy](#18-logging-strategy)
19. [Testing Strategy](#19-testing-strategy)
20. [Deployment Strategy](#20-deployment-strategy)

---

## 1. Product Vision

### 1.1 Vision Statement

IntelliAttend is an **authoritative physical presence validation system** for universities. It provides undeniable proof of a student's attendance in a classroom by correlating multiple independent sensors and time-sensitive tokens. The system replaces traditional paper-based or simple QR-code attendance with a multi-factor trust scoring model that is resistant to proxy attendance, location fraud, and device sharing.

### 1.2 Product Principles

1. **Authority Separation:** Mobile devices are sensor collectors. Only the Backend Server has the authority to grant attendance. No client-side decision is final.
2. **Defense-in-Depth:** No single signal (GPS, QR, Wi-Fi, BLE) is trusted in isolation. Validation relies on a weighted Trust Score computed server-side.
3. **No Hardcoding:** All thresholds (geofence radius, RSSI levels, QR rotation interval, time windows) are remotely configurable via server-side feature flags.
4. **Offline-First:** The mobile app must render from local cache within 100ms. Network operations happen in the background without blocking the UI.
5. **Zero Trust Device Model:** Every device must prove its identity via hardware fingerprint, Play Integrity token, and time synchronization on every session.

### 1.3 Platform Scope

| Platform | Technology | Status | Purpose |
|----------|-----------|--------|---------|
| Faculty Mobile App | Flutter (Dart) | Production (v14+) | Faculty attendance management |
| Student Mobile App | Flutter (Dart) | Planned | Student attendance scanning |
| SmartBoard Web App | Vanilla JS + HTML5 Canvas | Production | Classroom QR display + live grid |
| Admin Web Portal | React + TypeScript | Prototype | Campus-wide monitoring dashboard |
| Backend API | Python (FastAPI) | Production | Authoritative decision engine |
| Database | Firestore + Custom SQL | Production | Real-time sync + transactional storage |

### 1.4 Quality Targets

The application must behave like a production Android application similar in quality to:
- **Google Classroom** — for course management and resource sharing
- **Microsoft Teams** — for real-time communication and presence
- **Google Drive** — for file management and offline access
- **WhatsApp** — for messaging reliability and delivery guarantees
- **Gmail** — for notification management and search

---

## 2. User Roles & Permissions

### 2.1 Role Definitions

#### Super Admin (Platform Mode)
- **Purpose:** Platform-level administration, tenant management, global configuration
- **Primary Interface:** Web Dashboard
- **Permissions:** Full system access across all tenants
- **Responsibilities:**
  - Register and provision new colleges (tenants)
  - Assign College Admins
  - Define global security policies (QR rules, trust thresholds, geofence defaults)
  - Enable/disable features per tenant based on plan
  - Infrastructure Mode: physically provision rooms (Wi-Fi BSSID, BLE UUID, GPS clusters, SmartBoard binding)
  - Monitor system health, investigate anomalies
  - Approve/reject override requests from College Admins
  - Force re-provisioning if needed

#### College Admin
- **Purpose:** College-level administration, academic configuration, oversight
- **Primary Interface:** Web Portal (also accessible via Faculty app with admin flag)
- **Permissions:** Tenant-scoped full access
- **Responsibilities:**
  - Create departments, define courses, assign faculty to subjects
  - Map subjects to rooms and SmartBoards
  - Import student lists, assign sections, activate accounts
  - Review attendance requests, flag issues, request overrides
  - Generate and export attendance reports
  - Monitor faculty and department performance

#### HOD (Head of Department)
- **Purpose:** Department-level oversight and management
- **Primary Interface:** Faculty Mobile App (with HOD role flag) + Web Portal
- **Permissions:** Department-scoped read access + limited write
- **Responsibilities:**
  - View department-wide attendance analytics
  - Monitor all faculty under their department
  - Review and approve faculty override requests
  - View department defaulter lists and eligibility reports
  - Approve substitute class requests
  - Generate department-specific reports
  - Cannot: modify system settings, manage rooms, provision infrastructure

#### Faculty
- **Purpose:** Classroom-level attendance orchestration
- **Primary Interface:** Faculty Mobile App
- **Permissions:** Class-scoped read/write for assigned courses
- **Responsibilities:**
  - Start and manage attendance sessions
  - Pair with SmartBoard via OTP
  - Monitor live attendance grid
  - Manually mark attendance (override)
  - Issue retrospective corrections
  - Upload and share course resources
  - Send messages and notices to students
  - View course reports and analytics
  - Manage course topics

#### Student
- **Purpose:** Attendance submission and self-service
- **Primary Interface:** Student Mobile App
- **Permissions:** Self-scoped read access + attendance submission
- **Responsibilities:**
  - Scan rotating QR codes during class
  - Submit sensor proof (GPS, Wi-Fi, BLE) for attendance validation
  - View personal attendance history and eligibility status
  - Access course resources shared by faculty
  - Receive push notifications for class starts and announcements
  - View course materials and assignments

#### SmartBoard Device
- **Purpose:** Classroom display and QR code projection
- **Primary Interface:** Web Browser (Vanilla JS)
- **Permissions:** Session-scoped display + WebSocket receive
- **Responsibilities:**
  - Display rotating QR codes (every 5 seconds)
  - Show live attendance grid (seat map)
  - Receive and display OTP for faculty pairing
  - Stream real-time attendance updates to display

### 2.2 Permission Matrix

| Resource | Super Admin | College Admin | HOD | Faculty | Student |
|----------|:-----------:|:------------:|:---:|:-------:|:-------:|
| System Settings | CRUD | - | - | - | - |
| Tenant Management | CRUD | R | - | - | - |
| Room Provisioning | CRUD | R | - | - | - |
| Department Management | CRUD | CRUD | R | - | - |
| Course Management | CRUD | CRUD | R | R | R |
| Faculty Management | CRUD | CRUD | R | - | - |
| Student Management | CRUD | CRUD | R | R (own classes) | R (self) |
| Attendance Sessions | CRUD | CRUD | R (dept) | CRUD (own) | R (self) |
| Manual Override | - | Approve | Approve | Request | - |
| Reports | All | Tenant | Dept | Own courses | Self |
| Resources | CRUD | CRUD | R | CRUD (own) | R (shared) |
| SmartBoard | CRUD | CRUD | R | Pair + Use | - |
| Chat/Messaging | CRUD | CRUD | R (dept) | CRUD (own classes) | R (self) |
| Push Notifications | Global | Tenant | - | Class-scoped | Self |
| Audit Logs | Full | Tenant | Dept | - | - |

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        IntelliAttend Ecosystem                          │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Faculty     │  │   Student    │  │  SmartBoard  │  │   Admin    │ │
│  │   Mobile App  │  │   Mobile App │  │  Web App     │  │   Portal   │ │
│  │  (Flutter)    │  │  (Flutter)   │  │  (JS/HTML)   │  │  (React)   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                  │                  │                │        │
│         │  HTTPS/REST      │  HTTPS/REST      │  WSS           │  HTTPS │
│         │                  │                  │                │        │
│  ┌──────┴──────────────────┴──────────────────┴────────────────┴──────┐ │
│  │                     API Gateway / Load Balancer                     │ │
│  │                    (nginx / Cloud Run / ALB)                        │ │
│  └──────────────────────────────┬─────────────────────────────────────┘ │
│                                 │                                       │
│  ┌──────────────────────────────┴─────────────────────────────────────┐ │
│  │                     Backend Server (FastAPI)                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │ │
│  │  │ Auth     │  │ Session  │  │ Trust    │  │ Notification     │  │ │
│  │  │ Service  │  │ Manager  │  │ Engine   │  │ Service (FCM)    │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │ │
│  │  │ Resource │  │ Report   │  │ WebSocket│  │ Time Sync        │  │ │
│  │  │ Service  │  │ Service  │  │ Manager  │  │ Service (NTP)    │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │ │
│  └──────────────────────────────┬─────────────────────────────────────┘ │
│                                 │                                       │
│  ┌──────────────────────────────┴─────────────────────────────────────┐ │
│  │                     Data Layer                                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │ │
│  │  │ Firestore    │  │ SQL Database │  │ Redis                    │ │ │
│  │  │ (Real-time)  │  │ (Transactional)│ │ (Sessions + Cache)       │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Communication Channels

| Channel | Protocol | Direction | Purpose |
|---------|----------|-----------|---------|
| REST API | HTTPS/JSON | Client → Server | All state-mutation operations (CRUD) |
| WebSocket | WSS | Bidirectional | Real-time session updates, QR rotation, live grid |
| Firestore Sync | Firestore SDK | Server → Client | Real-time document listeners for seating grid |
| Push Notifications | FCM | Server → Client | Class start reminders, announcements, anomalies |
| NTP/Time Sync | HTTPS | Client ↔ Server | Virtual clock anchoring for time-sensitive tokens |

### 3.3 Phased Operation

The system operates in distinct phases. Each role wakes up only in certain phases:

| Phase | Name | Active Roles | Operations |
|-------|------|-------------|------------|
| 0 | Platform Foundation | Super Admin | System setup, role definitions, global config |
| 1 | College Onboarding | Super Admin, College Admin | Tenant creation, admin assignment |
| 2 | Infrastructure Mapping | Super Admin (Infrastructure Mode) | Room provisioning, Wi-Fi/BLE/GPS capture, SmartBoard binding |
| 3 | Academic Configuration | College Admin, Faculty | Departments, courses, faculty assignments, room mapping |
| 4 | Student Enrollment | College Admin, Student | Student import, section assignment, account activation |
| 5 | Live Attendance | Faculty, Student, SmartBoard | Session start, QR display, scan, validation, live grid |
| 6 | Exceptions | College Admin, Super Admin | Override requests, fraud investigation, data freeze/unfreeze |
| 7 | Audit & Reporting | College Admin, Super Admin, HOD | Report generation, log export, compliance verification |

**Golden Rule:** No role ever skips a phase. Trust is built layer by layer.

---

## 4. Clean Architecture

### 4.1 Layer Definitions

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                           │
│                                                                  │
│  Screens (StatefulWidget / Consumer widgets)                    │
│  Controllers (ChangeNotifier / ViewModel)                       │
│  Reusable Widgets (stateless, pure UI)                          │
│  Animations, Transitions, Haptic Feedback                       │
│                                                                  │
│  DEPENDENCY: Depends on → Domain Layer (via interfaces)         │
│  DEPENDENCY: Depends on → Application Layer (via providers)     │
├─────────────────────────────────────────────────────────────────┤
│                     APPLICATION LAYER                            │
│                                                                  │
│  Use Cases / Controllers (business logic orchestration)         │
│  State Management (Provider / ChangeNotifier)                   │
│  Input Validation (domain-level rules)                          │
│  Error Mapping (domain exceptions → UI error models)            │
│                                                                  │
│  DEPENDENCY: Depends on → Domain Layer (via interfaces)         │
│  DEPENDENCY: Depends on → Data Layer (via repository interfaces)│
├─────────────────────────────────────────────────────────────────┤
│                     DOMAIN LAYER                                 │
│                                                                  │
│  Entities (core business objects)                               │
│  Repository Interfaces (abstract contracts)                     │
│  Domain Exceptions (business rule violations)                   │
│  Domain Services (pure business logic, no I/O)                  │
│                                                                  │
│  DEPENDENCY: Depends on → NOTHING (pure Dart)                   │
├─────────────────────────────────────────────────────────────────┤
│                     DATA LAYER                                   │
│                                                                  │
│  Repository Implementations (concrete)                          │
│  Data Sources (Remote: API, Local: Hive, Cache: Prefs)         │
│  Models / DTOs (JSON serialization)                             │
│  Mappers (Model ↔ Entity transformations)                       │
│                                                                  │
│  DEPENDENCY: Depends on → Domain Layer (implements interfaces)  │
├─────────────────────────────────────────────────────────────────┤
│                     INFRASTRUCTURE LAYER                         │
│                                                                  │
│  Network (Dio + Interceptors)                                   │
│  WebSocket (dart:io WebSocket)                                  │
│  Storage (Hive + SharedPreferences + SecureStorage)             │
│  Firebase (Auth + FCM)                                          │
│  Native Bridge (MethodChannel)                                  │
│                                                                  │
│  DEPENDENCY: Depends on → Data Layer (injected into repos)      │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Dependency Rule

**Dependency flows inward only.** Outer layers depend on inner layers. Inner layers NEVER depend on outer layers.

```
Presentation → Application → Domain ← Data ← Infrastructure
```

- **Domain** depends on nothing. It defines interfaces that Data implements.
- **Data** implements Domain interfaces and depends on Infrastructure for I/O.
- **Application** orchestrates Domain logic and depends on Domain interfaces.
- **Presentation** observes Application state and renders UI.

### 4.3 Dependency Injection

**Method:** Provider (ChangeNotifierProvider, ProxyProvider, Provider)

**Root Provider Tree (defined in `main.dart`):**

```dart
ChangeNotifierProvider<SecurityController>      // Root security gate
Provider<NetworkInfo>                           // Connectivity status
Provider<ApiClient>                             // Dio HTTP client
// --- Data Layer ---
Provider<AuthRepository>                        // Implements IAuthRepository
Provider<SessionRepository>                     // Implements ISessionRepository
Provider<CourseRepository>                      // Implements ICourseRepository
Provider<ResourceRepository>                    // Implements IResourceRepository
Provider<NotificationRepository>                // Implements INotificationRepository
// --- Application Layer ---
ChangeNotifierProvider<AuthController>          // Uses IAuthRepository
ChangeNotifierProvider<DashboardController>     // Uses ISessionRepository + ICourseRepository
ChangeNotifierProvider<LiveMonitorController>   // Uses ISessionRepository + WebSocketService
ChangeNotifierProvider<ReportsController>       // Uses IReportRepository
ChangeNotifierProvider<ResourcesController>     // Uses IResourceRepository
```

**Injection Pattern:** Each feature screen uses `Provider.of<T>(context)` or `context.read<T>()` to access its dependencies. Controllers are created lazily and disposed when their provider is removed from the tree.

### 4.4 Entity vs Model Separation

| Concept | Location | Purpose |
|---------|----------|---------|
| **Entity** | `domain/entities/` | Pure business objects with no serialization. e.g., `Session`, `Student`, `AttendanceRecord` |
| **Model/DTO** | `data/models/` | JSON-serializable versions. e.g., `SessionModel`, `StudentModel`. Have `fromJson`/`toJson` |
| **Mapper** | `data/mappers/` | Functions that convert Model ↔ Entity. e.g., `SessionMapper.toEntity(model)` |

**Why:** Entities are framework-agnostic and testable. Models handle persistence concerns. Mappers keep the boundary clean.

---

## 5. Repository Pattern

### 5.1 Interface Definition

Every data source has an abstract interface in the domain layer:

```dart
// domain/repositories/i_auth_repository.dart
abstract class IAuthRepository {
  Future<AuthStatus> checkAuthStatus(String email);
  Future<SessionVerification> verifySession(DeviceInfo device);
  Future<void> sendOtp(String email);
  Future<RegistrationResult> completeRegistration(RegistrationRequest request);
  Future<UserCredential> signIn(String email, String password);
  Future<void> changePassword(String oldPassword, String newPassword);
  Future<void> signOut();
  User? getCurrentUser();
}

// domain/repositories/i_session_repository.dart
abstract class ISessionRepository {
  Future<SessionStartResult> startSession(String slotId);
  Future<SessionStartResult> refreshOtp(String sessionId);
  Future<bool> generateQr(String sessionId, String otp);
  Future<bool> markAttendance(AttendanceMarkRequest request);
  Future<bool> correctAttendance(CorrectionRequest request);
  Future<bool> terminateSession(String sessionId);
  Future<SessionState?> fetchCurrentState();
  Future<SessionStatus?> fetchSessionStatus(String sessionId);
  Stream<SessionState> watchSessionState(String sessionId);
}
```

### 5.2 Implementation Pattern

Each repository implementation follows this structure:

```dart
class AuthRepository implements IAuthRepository {
  final ApiClient _apiClient;
  final ICacheDataSource _cache;

  AuthRepository(this._apiClient, this._cache);

  @override
  Future<AuthStatus> checkAuthStatus(String email) async {
    // 1. Try cache first (if appropriate)
    // 2. Call API via _apiClient
    // 3. Map response to domain entity
    // 4. Persist to cache
    // 5. Return entity
  }
}
```

### 5.3 Data Source Abstraction

```
RemoteDataSource (API calls via Dio)
  ↓
Repository Implementation (orchestrates remote + local)
  ↓
LocalDataSource (Hive boxes via PersistenceService)
  ↓
CacheDataSource (SharedPreferences + SecureStorage)
```

### 5.4 Repository Inventory

| Repository | Domain Interface | Implementation | Data Sources |
|-----------|-----------------|---------------|--------------|
| Auth | `IAuthRepository` | `AuthRepository` | Firebase Auth + FastAPI + SharedPreferences |
| Session | `ISessionRepository` | `SessionRepository` | FastAPI + WebSocket + Hive |
| Course | `ICourseRepository` | `CourseRepository` | FastAPI + Hive (cache-first) |
| Resource | `IResourceRepository` | `ResourceRepository` | FastAPI (multipart) + Hive |
| Report | `IReportRepository` | `ReportRepository` | FastAPI + Hive (cache) |
| Notification | `INotificationRepository` | `NotificationRepository` | FCM + Hive + Local Notifications |
| Student | `IStudentRepository` | `StudentRepository` | FastAPI + Hive (roster cache) |
| Profile | `IProfileRepository` | `ProfileRepository` | FastAPI + Hive (profile cache) |

---

## 6. State Management

### 6.1 Provider Architecture

The app uses **Provider** as its sole state management solution. This is a deliberate choice for simplicity and team familiarity.

### 6.2 State Categories

| Category | Provider Type | Examples | Lifecycle |
|----------|-------------|----------|-----------|
| **App-wide state** | `ChangeNotifierProvider` (root) | `SecurityController` | Lives for entire app session |
| **Feature controllers** | `ChangeNotifierProvider` (scoped) | `DashboardController`, `ReportsController` | Created when screen mounts, disposed when unmounted |
| **Repository instances** | `ProxyProvider` / `Provider` | `AuthRepository`, `SessionRepository` | Singleton for app lifetime |
| **Reactive streams** | `ValueListenableBuilder` / `StreamBuilder` | `FacultyService.profile`, `WebSocketService.events` | Used in widgets for fine-grained rebuilds |
| **Global singletons** | Static classes (service layer) | `FacultyService`, `PersistenceService`, `HapticService` | App lifetime, but NOT recommended for new code |

### 6.3 Controller Pattern

Each feature has a dedicated controller:

```dart
class DashboardController extends ChangeNotifier {
  final ISessionRepository _sessionRepo;
  final ICourseRepository _courseRepo;

  // State
  DashboardState _state = DashboardState.initial();
  DashboardState get state => _state;

  // Actions
  Future<void> loadDashboard() async { ... }
  Future<void> startSession(String slotId) async { ... }
  void refreshSchedule() async { ... }
}
```

**Rules:**
1. Controllers NEVER import UI packages (no `flutter/material.dart` in controllers)
2. Controllers depend on repository interfaces, not implementations
3. State is immutable — use `copyWith` for mutations
4. Errors are caught and mapped to domain exceptions
5. Loading states are explicit (not implicit null checks)

### 6.4 State Flow

```
User Action → Controller Method → Repository → Data Source → Response
     ↓              ↓                ↓             ↓            ↓
Widget Event    State Update    API/Cache     Hive/Dio    Entity Response
     ↓              ↓                ↓             ↓            ↓
Rebuild UI ← Provider.notifyListeners() ← Controller state update
```

### 6.5 Anti-Patterns to Avoid

| Anti-Pattern | Why | Correct Approach |
|-------------|-----|-----------------|
| Static ValueNotifier in services | Untestable, memory leaks, no scoping | Use Provider tree + ChangeNotifierController |
| Direct `Provider.of` in initState | Misses updates, wrong context | Use `Consumer` or `context.watch` in build |
| Controllers with UI imports | Untestable, breaks separation | Extract UI logic to widget layer |
| God controllers (>300 lines) | Hard to maintain, test | Split into domain-specific controllers |
| Mutable state without copyWith | Race conditions, unpredictable rebuilds | Always create new state instances |

---

## 7. Folder Structure

### 7.1 Target Architecture for Main Shell (`lib/`)

```
lib/
├── main.dart                              # App entry, Provider tree, bootstrap
├── app.dart                               # MaterialApp configuration
│
├── core/                                  # Cross-cutting concerns (no business logic)
│   ├── constants/
│   │   ├── app_constants.dart             # Global constants (timeouts, limits)
│   │   ├── api_constants.dart             # API paths, versioning
│   │   └── cache_constants.dart           # Cache keys, TTLs
│   ├── error/
│   │   ├── app_exception.dart             # Custom exception hierarchy
│   │   ├── app_error.dart                 # UI-friendly error model
│   │   └── error_handler.dart             # Exception → AppError mapper
│   ├── network/
│   │   ├── api_client.dart                # Singleton Dio client
│   │   ├── network_info.dart              # Connectivity checker
│   │   └── interceptors/
│   │       ├── auth_interceptor.dart       # JWT token attachment + refresh
│   │       ├── security_interceptor.dart   # Device headers + 403 handling
│   │       ├── logging_interceptor.dart    # Request/response logging
│   │       └── retry_interceptor.dart      # Exponential backoff retry
│   ├── utils/
│   │   ├── formatters.dart                # Date, time, number formatters
│   │   ├── validators.dart                # Input validation rules
│   │   └── debouncer.dart                 # Debounce utility
│   └── di/
│       ├── service_locator.dart           # DI container setup
│       └── provider_setup.dart            # Provider tree configuration
│
├── domain/                                # Pure business logic (no Flutter deps)
│   ├── entities/
│   │   ├── faculty.dart                   # Faculty entity
│   │   ├── student.dart                   # Student entity
│   │   ├── course.dart                    # Course entity
│   │   ├── session.dart                   # Attendance session entity
│   │   ├── attendance_record.dart         # Single attendance record
│   │   ├── timetable_slot.dart            # Timetable slot entity
│   │   ├── resource.dart                  # File resource entity
│   │   ├── notification.dart              # Notification entity
│   │   ├── device_info.dart               # Device info entity
│   │   └── report.dart                    # Report entity
│   ├── repositories/                      # Abstract interfaces
│   │   ├── i_auth_repository.dart
│   │   ├── i_session_repository.dart
│   │   ├── i_course_repository.dart
│   │   ├── i_resource_repository.dart
│   │   ├── i_report_repository.dart
│   │   ├── i_notification_repository.dart
│   │   ├── i_student_repository.dart
│   │   └── i_profile_repository.dart
│   ├── exceptions/
│   │   ├── auth_exception.dart            # Authentication failures
│   │   ├── session_exception.dart         # Session lifecycle failures
│   │   ├── network_exception.dart         # Network/connectivity failures
│   │   ├── cache_exception.dart           # Cache corruption/failures
│   │   └── security_exception.dart        # Security violation exceptions
│   └── services/                          # Pure business logic (no I/O)
│     ├── eligibility_calculator.dart      # 75% threshold calculations
│     ├── trust_score_evaluator.dart       # Attendance trust evaluation
│     └── qr_validator.dart               # QR token format validation
│
├── data/                                  # Data layer (I/O implementations)
│   ├── models/                            # DTOs / JSON-serializable models
│   │   ├── faculty_model.dart
│   │   ├── student_model.dart
│   │   ├── session_model.dart
│   │   ├── attendance_model.dart
│   │   ├── course_model.dart
│   │   ├── resource_model.dart
│   │   ├── notification_model.dart
│   │   └── auth_models.dart
│   ├── mappers/                           # Model ↔ Entity transformations
│   │   ├── faculty_mapper.dart
│   │   ├── session_mapper.dart
│   │   ├── student_mapper.dart
│   │   └── ...
│   ├── repositories/                      # Concrete implementations
│   │   ├── auth_repository.dart
│   │   ├── session_repository.dart
│   │   ├── course_repository.dart
│   │   ├── resource_repository.dart
│   │   ├── report_repository.dart
│   │   ├── notification_repository.dart
│   │   ├── student_repository.dart
│   │   └── profile_repository.dart
│   ├── datasources/
│   │   ├── remote/
│   │   │   ├── auth_remote_source.dart
│   │   │   ├── session_remote_source.dart
│   │   │   ├── course_remote_source.dart
│   │   │   └── ...
│   │   ├── local/
│   │   │   ├── faculty_local_source.dart
│   │   │   ├── session_local_source.dart
│   │   │   ├── course_local_source.dart
│   │   │   └── ...
│   │   └── cache/
│   │       ├── auth_cache_source.dart
│   │       └── settings_cache_source.dart
│   └── synchronization/
│       ├── sync_manager.dart              # Orchestrates offline → online sync
│       ├── conflict_resolver.dart         # Server-wins merge strategy
│       └── offline_queue.dart             # Queue for pending operations
│
├── services/                              # Infrastructure services (singletons)
│   ├── persistence_service.dart           # Hive box management
│   ├── credential_service.dart            # Secure storage for credentials
│   ├── notification_service.dart          # Local notifications + history
│   ├── haptic_service.dart                # Haptic feedback abstraction
│   ├── permission_service.dart            # Runtime permission management
│   ├── faculty_service.dart               # Faculty profile + cache hydration
│   ├── faculty_hydration_service.dart     # Manifest-based sync engine
│   ├── websocket_service.dart             # WebSocket connection management
│   ├── time_sync_service.dart             # Virtual monotonic clock
│   ├── force_logout_service.dart          # Scorched-earth logout pipeline
│   ├── hardware_service.dart              # Native bridge (MethodChannel)
│   ├── key_enrollment_service.dart        # HW keypair lifecycle
│   ├── session_management_service.dart    # Active session persistence
│   ├── sync_fcm_handler.dart              # FCM background handlers
│   └── board_readiness_notifier.dart      # SmartBoard readiness tracking
│
├── engine/                                # Timetable state machine
│   ├── engine.dart                        # Barrel export
│   ├── timetable_controller.dart          # 1s-tick state evaluator
│   └── re_exports from intelli_attend_shared/
│
├── presentation/                          # UI layer
│   ├── common/                            # Shared UI components
│   │   ├── widgets/                       # Reusable widgets
│   │   │   ├── app_drawer.dart
│   │   │   ├── custom_nav_bar.dart
│   │   │   ├── skeleton_loader.dart
│   │   │   ├── error_display.dart
│   │   │   ├── empty_state.dart
│   │   │   ├── loading_overlay.dart
│   │   │   └── ...
│   │   ├── animations/                    # Reusable animations
│   │   │   ├── pulse_animation.dart
│   │   │   ├── slide_transition.dart
│   │   │   └── ...
│   │   ├── extensions/                    # BuildContext extensions
│   │   │   ├── context_extensions.dart
│   │   │   └── ...
│   │   └── theme/                         # App-wide theming
│   │       ├── app_theme.dart
│   │       ├── theme_controller.dart
│   │       └── app_colors.dart
│   ├── features/                          # Feature modules (each self-contained)
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   └── auth_controller.dart
│   │   │   ├── screens/
│   │   │   │   ├── login_screen.dart
│   │   │   │   ├── registration_screen.dart
│   │   │   │   ├── otp_screen.dart
│   │   │   │   ├── set_password_screen.dart
│   │   │   │   ├── lock_screen.dart
│   │   │   │   └── compromised_device_screen.dart
│   │   │   └── widgets/
│   │   │       └── auth_form_field.dart
│   │   ├── dashboard/
│   │   │   ├── controllers/
│   │   │   │   └── dashboard_controller.dart
│   │   │   ├── screens/
│   │   │   │   └── dashboard_screen.dart
│   │   │   └── widgets/
│   │   │       ├── schedule_section.dart
│   │   │       ├── session_control_section.dart
│   │   │       ├── dashboard_header.dart
│   │   │       └── ...
│   │   ├── live_monitor/
│   │   │   ├── controllers/
│   │   │   │   └── live_monitor_controller.dart
│   │   │   ├── screens/
│   │   │   │   ├── live_monitor_screen.dart
│   │   │   │   └── manual_attendance_screen.dart
│   │   │   └── widgets/
│   │   │       ├── seating_arrangement.dart
│   │   │       └── attendance_tile.dart
│   │   ├── reports/
│   │   │   ├── controllers/
│   │   │   │   └── reports_controller.dart
│   │   │   ├── screens/
│   │   │   │   └── reports_screen.dart
│   │   │   └── widgets/
│   │   │       ├── overview_tab.dart
│   │   │       ├── analytics_tab.dart
│   │   │       ├── eligibility_tab.dart
│   │   │       ├── defaulter_tab.dart
│   │   │       └── ...
│   │   ├── my_class/
│   │   │   ├── controllers/
│   │   │   │   └── my_class_controller.dart
│   │   │   ├── screens/
│   │   │   │   ├── my_class_screen.dart
│   │   │   │   ├── mark_attendance_screen.dart
│   │   │   │   ├── attendance_history_screen.dart
│   │   │   │   └── export_attendance_screen.dart
│   │   │   └── widgets/
│   │   │       └── student_card.dart
│   │   ├── courses/
│   │   │   ├── controllers/
│   │   │   │   └── courses_controller.dart
│   │   │   ├── screens/
│   │   │   │   └── courses_screen.dart
│   │   │   └── widgets/
│   │   │       └── course_card.dart
│   │   ├── resources/
│   │   │   ├── controllers/
│   │   │   │   └── resources_controller.dart
│   │   │   ├── screens/
│   │   │   │   └── resources_screen.dart
│   │   │   └── widgets/
│   │   │       └── resource_tile.dart
│   │   ├── notifications/
│   │   │   ├── controllers/
│   │   │   │   └── notifications_controller.dart
│   │   │   ├── screens/
│   │   │   │   ├── notifications_screen.dart
│   │   │   │   └── notification_detail_screen.dart
│   │   │   └── widgets/
│   │   │       └── notification_tile.dart
│   │   ├── profile/
│   │   │   ├── controllers/
│   │   │   │   └── profile_controller.dart
│   │   │   ├── screens/
│   │   │   │   ├── profile_screen.dart
│   │   │   │   └── qr_scanner_screen.dart
│   │   │   └── widgets/
│   │   │       └── profile_header.dart
│   │   ├── smart_board/
│   │   │   ├── controllers/
│   │   │   │   └── smart_board_controller.dart
│   │   │   ├── screens/
│   │   │   │   └── smart_board_screen.dart
│   │   │   └── widgets/
│   │   │       └── otp_display.dart
│   │   ├── settings/
│   │   │   ├── controllers/
│   │   │   │   └── settings_controller.dart
│   │   │   ├── screens/
│   │   │   │   └── settings_screen.dart
│   │   │   └── widgets/
│   │   │       └── ...
│   │   ├── support/
│   │   │   ├── screens/
│   │   │   │   ├── about_app_page.dart
│   │   │   │   ├── help_center_page.dart
│   │   │   │   ├── live_support_chat_page.dart
│   │   │   │   └── report_issue_page.dart
│   │   │   └── widgets/
│   │   │       └── ...
│   │   └── students/
│   │       ├── controllers/
│   │       │   └── student_directory_controller.dart
│   │       ├── screens/
│   │       │   └── student_directory_screen.dart
│   │       └── widgets/
│   │           └── student_card.dart
│   └── router/
│       ├── app_router.dart                # Named route definitions
│       ├── route_guards.dart              # Auth/security route guards
│       └── route_names.dart               # Route name constants
│
├── l10n/                                  # Localization
│   ├── app_en.arb                         # English strings
│   ├── app_hi.arb                         # Hindi strings
│   └── app_localizations.dart             # Generated localizations
│
└── gen/                                   # Generated code (freezed, json_serializable)
    └── ...
```

### 7.2 Module Isolation Rules

1. **Each feature module is self-contained.** It has its own controllers, screens, and widgets.
2. **Feature modules CANNOT import from other feature modules.** Cross-feature communication goes through the domain layer (repositories, entities) or via Provider callbacks.
3. **Feature modules CAN import from:** `core/`, `domain/entities`, `domain/repositories` (interfaces only), `services/` (for infrastructure services).
4. **The `data/` layer is shared.** All features use the same repository implementations.
5. **The `presentation/common/` layer is shared.** All features use the same base widgets, theme, and animations.

---

## 8. Navigation Architecture

### 8.1 Routing Strategy

**Type:** Named routes with declarative route guards

**Package:** `go_router` (recommended) or custom `Navigator 2.0`

### 8.2 Route Definitions

```dart
class RouteNames {
  static const splash = '/splash';
  static const login = '/login';
  static const register = '/register';
  static const otp = '/register/otp';
  static const setPassword = '/register/set-password';

  // Authenticated routes (inside shell)
  static const dashboard = '/dashboard';
  static const courses = '/courses';
  static const myClass = '/my-class';
  static const reports = '/reports';
  static const profile = '/profile';
  static const settings = '/settings';

  // Feature routes
  static const liveMonitor = '/live-monitor/:sessionId';
  static const attendanceCode = '/attendance-code/:sessionId';
  static const smartBoard = '/smart-board/:sessionId';
  static const manualAttendance = '/manual-attendance/:sessionId';
  static const studentProfile = '/student/:studentId';
  static const resources = '/resources';
  static const notifications = '/notifications';
  static const notificationDetail = '/notifications/:id';

  // Settings sub-routes
  static const changePassword = '/settings/change-password';
  static const loginDevices = '/settings/login-devices';
  static const deviceDetail = '/settings/devices/:deviceId';

  // Support
  static const about = '/support/about';
  static const helpCenter = '/support/help';
  static const liveChat = '/support/chat';
  static const reportIssue = '/support/report';
}
```

### 8.3 Route Guard System

```dart
class AuthGuard extends Guard {
  @override
  Future<String?> canActivate(String route, Map<String, String> params) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return RouteNames.login;

    final isRegistered = FacultyService.isRegistered.value;
    if (!isRegistered) return RouteNames.register;

    final isCompromised = SecurityController().isCompromised;
    if (isCompromised) return RouteNames.compromisedDevice;

    return null; // Allow navigation
  }
}

class BiometricGuard extends Guard {
  @override
  Future<String?> canActivate(String route, Map<String, String> params) async {
    final security = SecurityController();
    if (security.biometricLockEnabled && security.isLocked) {
      final authenticated = await security.authenticate();
      if (!authenticated) return RouteNames.lock;
    }
    return null;
  }
}
```

### 8.4 Navigation Shell

Authenticated routes use a **shell route** pattern — the bottom navigation bar persists across tabs:

```
App
├── /login                          (unauthenticated)
├── /register                       (unauthenticated)
├── ShellRoute (authenticated, with bottom nav)
│   ├── /dashboard                  (tab 1)
│   ├── /courses                    (tab 2)
│   ├── /my-class                   (tab 3)
│   ├── /reports                    (tab 4)
│   └── /profile                    (tab 5)
├── /live-monitor/:sessionId        (push, no bottom nav)
├── /settings                       (push from profile)
├── /resources                      (push from courses)
└── /notifications                  (push from dashboard)
```

### 8.5 Navigation Rules

1. **RootNavigatorKey** is used for force-logout navigation (from interceptors outside widget tree).
2. **ShellNavigatorKey** is used for tab switching within the authenticated shell.
3. **Deep linking** is supported via named routes — each route can be accessed by URL.
4. **Back button** behavior follows platform conventions (Android: back exits app from root screen, closes drawer/popup from child screens).
5. **No `pushReplacement`** for normal navigation — only for logout/login flow.

---

## 9. API Architecture

### 9.1 API Design Principles

1. **RESTful:** Standard HTTP methods (GET, POST, PUT, DELETE) with JSON payloads.
2. **Versioned:** All endpoints prefixed with `/api/v1/` (future: `/api/v2/`).
3. **Authenticated:** Every endpoint requires `Authorization: Bearer <firebase_id_token>`.
4. **Device-Bound:** Every request includes `X-Device-ID`, `X-Device-Fingerprint`, `X-App-Version` headers.
5. **Idempotent where possible:** POST endpoints use idempotency keys for critical operations (attendance marking).
6. **Error Envelope:** All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_MARKED",
    "message": "Student already marked present for this session",
    "detail": {
      "existing_marked_by": "faculty@university.edu",
      "existing_timestamp": "2026-07-19T10:30:00Z"
    }
  }
}
```

### 9.2 API Endpoint Catalog

#### Authentication
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/v1/auth/status` | Check if faculty exists + auth status | Firebase JWT |
| POST | `/api/v1/auth/register/send-otp` | Send registration OTP to email | None |
| POST | `/api/v1/auth/register/verify` | Verify registration OTP | None |
| POST | `/api/v1/auth/register/complete` | Complete registration with device binding | OTP token |
| POST | `/api/v1/auth/verify-session` | Device binding verification | Firebase JWT |
| POST | `/api/v1/auth/change-password` | Change password | Firebase JWT |

#### Session Management
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v1/faculty/sync` | Full manifest (profile, cohorts, schedule, rosters) | Firebase JWT |
| POST | `/api/v1/faculty/start_session` | Start new attendance session | Firebase JWT |
| POST | `/api/v1/faculty/refresh_otp` | Rotate OTP (every 30s) | Firebase JWT |
| POST | `/api/v1/faculty/generate_qr` | Generate QR token for students | Firebase JWT + OTP |
| POST | `/api/v1/session/terminate` | End session | Firebase JWT |
| GET | `/api/v1/session/current-state` | Get authoritative session state | Firebase JWT |
| GET | `/api/v1/session/:id` | Get specific session status | Firebase JWT |
| POST | `/api/v1/start-session` | Start existing (PREPARING → IGNITING) | Firebase JWT |
| POST | `/api/v1/session/:id/rescue-seed` | Generate recovery seed | Firebase JWT |

#### Attendance
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/v1/faculty/attendance/manual` | Manual faculty override | Firebase JWT + GPS |
| POST | `/api/v1/faculty/attendance/correction` | Retrospective correction | Firebase JWT |
| POST | `/api/v1/faculty/sessions/:id/reconcile` | Reconcile present_count | Firebase JWT |
| POST | `/api/v1/student/attendance/submit` | Student QR scan submission | Firebase JWT + Sensors |

#### Resources
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v1/faculty/resources` | List faculty resources | Firebase JWT |
| GET | `/api/v1/faculty/college-resources` | List college shared resources | Firebase JWT |
| POST | `/api/v1/faculty/resources/upload` | Upload resource (multipart) | Firebase JWT |
| DELETE | `/api/v1/faculty/resources/:id` | Delete resource | Firebase JWT |
| GET | `/api/v1/faculty/resources/:id/presigned-url` | Get download URL | Firebase JWT |
| POST | `/api/v1/faculty/resources/:id/push-to-session` | Push to SmartBoard session | Firebase JWT |
| POST | `/api/v1/faculty/resources/:id/push-to-section` | Push to section students | Firebase JWT |

#### Time Sync
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/v1/time` | Server timestamp for clock sync | None |

#### Security
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/v1/faculty/device/compromised` | Report compromised device | Device headers |

### 9.3 Request/Response Models

Every API endpoint has:
1. **Request Model** — Defines the expected request body/query params
2. **Response Model** — Defines the expected response shape
3. **Mapper** — Converts between domain entities and API models

### 9.4 API Client Configuration

```dart
class ApiClient {
  // Singleton
  factory ApiClient() => _instance;
  ApiClient._internal();

  // Configuration
  baseUrl: dotenv.env['API_BASE_URL'] // from .env file
  connectTimeout: Duration(seconds: 15)
  receiveTimeout: Duration(seconds: 15)
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }

  // Interceptor Chain (executed in order)
  interceptors: [
    RetryInterceptor(maxRetries: 2, backoff: exponential),  // Network resilience
    AuthInterceptor(),      // Attach Firebase ID token, handle 401 → refresh → retry
    SecurityInterceptor(),  // Attach X-Device-* headers, handle 403 → force logout
    LoggingInterceptor(),   // Debug mode: full request/response logs
  ]

  // Certificate Pinning
  badCertificateCallback: SHA-256 fingerprint verification
}
```

---

## 10. WebSocket Architecture

### 10.1 Connection Model

```
WSS://{api-host}/ws?session_id={sessionId}&token={firebase_token}&token_type=firebase
```

### 10.2 Event Protocol

**Incoming Events (Server → Client):**

| Event | Type String | Payload | Purpose |
|-------|------------|---------|---------|
| Attendance Update | `attendance_update` / `ATTENDANCE_UPDATED` | `{student_id, status, student_email}` | Single student status change |
| Student Marked | `student_marked` / `ATTENDANCE_MARKED` | `{student_id, trust_score}` | Student verified with trust score |
| Session Preparing | `session_preparing` / `SESSION_PREPARING` | `{session_id, otp}` | Session initializing |
| Session Igniting | `session_igniting` / `SESSION_IGNITING` | `{session_id}` | Session going live |
| Attendance Open | `attendance_open` / `SESSION_ACTIVATED` | `{session_id, state}` | Attendance window open |
| Student Verified | `student_verified` / `STUDENT_VERIFIED` | `{student_id, status}` | Student accepted |
| Student Rejected | `student_rejected` / `STUDENT_REJECTED` | `{student_id, reason}` | Student rejected |
| Manual Mark | `attendance_marked_manual` / `ATTENDANCE_MARKED_MANUAL` | `{student_id}` | Faculty manual override |
| Attendance Closed | `attendance_closed` / `ATTENDANCE_CLOSED` | `{session_id}` | Attendance window closed |
| Session Archived | `session_archived` / `SESSION_ARCHIVED` | `{session_id}` | Session completed and archived |
| Full State Sync | `full_state_sync` / `FULL_STATE_SYNC` | `{total_present, total_students, roster}` | Complete session state snapshot |
| Faculty Sync | `faculty_sync` / `FACULTY_SYNC` | `{total_present, total_students, present_students}` | Faculty-specific sync |
| Board Connected | `board_connected` / `BOARD_CONNECTED` | `{session_id}` | SmartBoard paired successfully |
| OTP Failed | `otp_failed` / `OTP_FAILED` | `{session_id, attempt_count, retries_remaining}` | SmartBoard OTP validation failed |
| Mark Ack | `mark_attendance_ack` | `{success, student_id, error}` | Server acknowledgment of mark request |
| Heartbeat | `heartbeat` / `pong` | `{}` | Keep-alive response |

**Outgoing Events (Client → Server):**

| Event | Type | Payload | Purpose |
|-------|------|---------|---------|
| Ping | `ping` | `{type: 'ping'}` | Heartbeat (every 30s) |
| Mark Attendance | `mark_attendance` | `{session_id, student_id, faculty_email}` | Faculty manual mark via WebSocket |

### 10.3 Connection Lifecycle

```
1. connectAndJoinRoom(sessionId, facultyEmail)
   → Build WSS URL with Firebase token
   → WebSocket.connect(url)
   → Set state: connecting → connected
   → Start heartbeat timer (30s)

2. Connected
   → Listen for messages
   → Parse JSON → WebSocketEvent
   → Broadcast to StreamController<WebSocketEvent>

3. Disconnected (error or done)
   → Set state: disconnected
   → Start reconnect timer (exponential: 1s → 2s → 4s → ... → 30s max)
   → On reconnect: reset delay to 1s

4. disconnect() (explicit)
   → Cancel all timers
   → Close WebSocket
   → Clear session/faculty references
   → Set state: disconnected
```

### 10.4 WebSocket Assessment

| Component | Status |
|-----------|--------|
| Auto-reconnect | Implemented (exponential backoff) |
| Heartbeat | Implemented (30s ping/pong) |
| Event parsing | Implemented (18 event types with legacy fallback) |
| Reconnection state | Broadcast via `StreamController<WsConnectionState>` |
| Message queuing on disconnect | NOT implemented — messages sent while disconnected are lost |
| Authentication refresh on reconnect | Uses cached Firebase token — may be stale after 1hr |

---

## 11. SmartBoard Architecture

### 11.1 SmartBoard Role

The SmartBoard is a **web application** (Vanilla JS + HTML5 Canvas) running on a classroom display device. It is NOT a Flutter app. Its responsibilities are:

1. Display the OTP for faculty pairing
2. Render rotating QR codes (every 5 seconds)
3. Show the live attendance grid (seat map)
4. Receive real-time updates via WebSocket

### 11.2 Pairing Flow

```
1. Faculty starts session → Backend returns OTP + session_id
2. SmartBoard displays OTP entry screen
3. Faculty enters OTP on SmartBoard (or scans QR from Faculty app)
4. SmartBoard sends OTP to backend for validation
5. Backend validates → establishes WebSocket channel
6. SmartBoard connected → emits 'board_connected' event
7. Backend starts pushing QR tokens every 5 seconds
8. SmartBoard renders animated QR codes
```

### 11.3 QR Token Protocol (v7.0)

**Format:** `IATT::{27 Base64URL chars}`

**27 Base64URL chars → 20 bytes binary:**
- Bytes 0-5: SHA-256(session_id)[:6] — session fingerprint
- Bytes 6-9: Unix timestamp (seconds) — big-endian uint32
- Bytes 10-19: HMAC-SHA256(key, bytes[0:10])[:10]

**Security Model:**
- QR signing secret held ONLY by SmartBoard and Backend
- NEVER transmitted to Faculty or Student devices
- Local HMAC verification is intentionally impossible
- Server performs authoritative HMAC + time-window + GPS check
- Client-side pre-validation (format, length, Base64URL, timestamp drift ≤7s) saves server round-trips for malformed tokens

### 11.4 SmartBoard Communication

```
┌─────────────┐     WSS      ┌─────────────┐
│  SmartBoard  │ ←──────────→ │   Backend   │
│  (JS/Web)    │              │  (FastAPI)  │
└──────┬──────┘              └──────┬──────┘
       │                            │
       │  HTTPS                     │  HTTPS
       │                            │
┌──────┴──────┐              ┌──────┴──────┐
│   Faculty   │              │   Student   │
│   Mobile    │              │   Mobile    │
└─────────────┘              └─────────────┘
```

### 11.5 SmartBoard Integration Points in Faculty App

| File | Purpose |
|------|---------|
| `smart_board_controller.dart` | Manages OTP display, pairing state, connection status |
| `smart_board_screen.dart` | UI for SmartBoard pairing (OTP entry, QR display) |
| `board_readiness_notifier.dart` | Tracks which slots have active SmartBoard connections |
| `attendance_code_screen.dart` | Displays current session OTP/QR for SmartBoard pairing |

---

## 12. Security Architecture

### 12.1 Security Layers

```
Layer 7: Application Security
  ├── Biometric Lock (local_auth, 15s timeout, bypass detection <350ms)
  ├── Root Detection (HardwareService.isRooted)
  ├── Compromised Device Detection + Scorched Earth
  └── App Lock on Background (optional, user-enabled)

Layer 6: Device Integrity
  ├── Hardware Fingerprinting (MethodChannel → Native Bridge)
  ├── Play Integrity API (attestation token)
  ├── Device Binding (server-side fingerprint comparison)
  └── Auto Time/Timezone Enforcement

Layer 5: Transport Security
  ├── HTTPS (TLS 1.3)
  ├── Certificate Pinning (SHA-256 fingerprints from .env)
  └── WebSocket over WSS

Layer 4: Authentication
  ├── Firebase Authentication (email/password)
  ├── Firebase ID Token (1hr expiry, auto-refresh)
  ├── Token Refresh on 401 (AuthInterceptor)
  └── Force Logout on Revocation/Block

Layer 3: Authorization
  ├── Role-Based Access Control (server-side)
  ├── Session Ownership Validation (server-side)
  └── Device Ownership Validation (server-side)

Layer 2: Data Security
  ├── Hive AES Encryption (all boxes encrypted at rest)
  ├── FlutterSecureStorage (credentials, encryption keys)
  ├── Encrypted SharedPreferences (Android)
  └── Keychain Access (iOS, first_unlock)

Layer 1: Anti-Fraud
  ├── QR Token Time Window (7s drift tolerance)
  ├── Virtual Monotonic Clock (immune to OS clock manipulation)
  ├── Hardware Keypair Enrollment (Android KeyStore / iOS Secure Enclave)
  ├── CryptoEnvelope (anti-replay: monotonic timestamp + HW signature)
  └── Trust Score Model (server-side multi-factor evaluation)
```

### 12.2 Authentication Pipeline

```
App Launch
  ↓
Firebase.initializeApp()
  ↓
User already signed in? → Yes → Get ID token → Proceed to Auth Gate
  ↓ No
LoginScreen → Email/Password → Firebase Auth
  ↓
AuthInterceptor attaches Bearer token to all requests
  ↓
POST /auth/status → Check backend registration
  ↓
POST /auth/verify-session → Device binding check
  ↓
SecurityController → Root check → Biometric check → Ready
  ↓
Dashboard renders
```

### 12.3 Force Logout Pipeline

```
Server returns 401/403
  ↓
AuthInterceptor.onError() or SecurityInterceptor.onError()
  ↓
Classify: security_revocation? device_mismatch? account_blocked? expired_token?
  ↓
For expired_token: attempt token refresh → retry once
  ↓
For all others (or refresh failure):
  ↓
ForceLogoutService.execute()
  ↓
1. PersistenceService.clearAllData() → wipe all Hive boxes + SharedPreferences
2. FirebaseAuth.signOut() → clear Firebase session
3. FacultyService.clear() → reset in-memory profile
4. SecurityController.resetAll() → reset lock/compromise state
5. Navigate to LoginScreen with reason message
```

### 12.4 Time Synchronization

```
Purpose: Prevent students from manipulating their phone clock to reuse expired QR tokens

Mechanism:
1. App boot: TimeSyncService.initFallbackClock() → start monotonic Stopwatch
2. Background: TimeSyncService.bootstrap() → GET /api/v1/time
   → Server returns timestamp
   → App calculates RTT: roundTrip = now - sentTime
   → Anchor: trueTime = serverTime + (roundTrip / 2)
   → Store: anchorServerTimeMs = trueTime, anchorUptimeMs = hardwareUptime
3. Runtime: syncedNowMs = anchorServerTimeMs + ticker.elapsedMilliseconds
4. On resume: compensateDrift() → correct for deep sleep (CLOCK_MONOTONIC doesn't tick during sleep)
5. Reboot detection: compare current uptime vs stored uptime
```

### 12.5 Biometric Lock

- **Default:** Unlocked (no biometric required on startup)
- **Opt-in:** User enables in Settings → requires biometric verification to enable
- **Lock trigger:** App goes to background (paused/hidden) → lock if enabled
- **Unlock:** Biometric prompt with 15s timeout
- **Bypass detection:** If biometric completes in <350ms, it's likely bypassed → reject
- **Fallback:** If biometrics unavailable (no hardware/sensor broken) → auto-unlock

### 12.6 Hardware Key Enrollment

**Phase 1 (Boot-time):**
- Generate asymmetric keypair in Android KeyStore / iOS Secure Enclave
- Persist enrolled flag in SharedPreferences
- Fire-and-forget from `main.dart` background bootstrap

**Phase 2 (Post-auth, TODO):**
- Send public key + attestation certificate to server
- Server stores and validates on subsequent requests
- Currently a no-op — public key sent with every request via SecurityInterceptor headers

---

## 13. Offline Architecture

### 13.1 Offline Strategy

**Pattern:** Cache-First with Background Sync

```
1. On app launch: Render from local Hive cache (100ms target)
2. On network available: Sync changes from server
3. On network lost: Continue with cached data, queue mutations
4. On network restored: Flush queue, resolve conflicts
```

### 13.2 Offline Capabilities Matrix

| Feature | Offline Read | Offline Write | Queue | Sync Strategy |
|---------|:-----------:|:------------:|:-----:|--------------|
| Dashboard | YES | NO | - | Cache-first, background refresh |
| Schedule | YES | NO | - | Cache-first, background refresh |
| Student Roster | YES | NO | - | Cache-first, manifest-based |
| Attendance Session | NO | NO | - | Requires server (session creation) |
| Manual Mark | NO | YES (queued) | YES | Queue → sync when online |
| Attendance Correction | NO | YES (queued) | YES | Queue → sync when online |
| Resources | NO | NO | - | Requires network |
| Notifications | YES | NO | - | FCM background delivery |
| Reports | YES | NO | - | Cache, background refresh |
| Profile | YES | NO | - | Cache-first, manifest-based |

### 13.3 Offline Queue Architecture

```
┌─────────────────────────────────────┐
│         OfflineQueue                │
│                                     │
│  ┌───────────┐  ┌───────────────┐  │
│  │ Pending   │  │ InProgress    │  │
│  │ Operations│→ │ Operations    │  │
│  └───────────┘  └───────┬───────┘  │
│                         │          │
│                    ┌────┴────┐     │
│                    │ Network │     │
│                    │ Check   │     │
│                    └────┬────┘     │
│                    ┌────┴────┐     │
│                    │ Retry   │     │
│                    │ or Fail │     │
│                    └─────────┘     │
└─────────────────────────────────────┘
```

**Queue Entry:**
```json
{
  "id": "uuid",
  "operation": "MARK_ATTENDANCE",
  "endpoint": "/api/v1/faculty/attendance/manual",
  "method": "POST",
  "body": { "student_id": "...", "session_id": "..." },
  "createdAt": "2026-07-19T10:30:00Z",
  "retryCount": 0,
  "maxRetries": 3,
  "status": "PENDING"
}
```

### 13.4 Conflict Resolution

**Strategy:** Server-Wins with User Notification

1. When online, all writes go to server first
2. Server returns authoritative state
3. Client updates local cache from server response
4. If a queued offline operation conflicts with server state, the server's state wins
5. User is notified: "Your change could not be applied because the data was modified by another user"

### 13.5 Manifest-Based Hydration

The primary data sync mechanism uses a **manifest hash** comparison:

```
1. Client stores: manifest_hash + manifest_version in academic_data Hive box
2. On sync: GET /api/v1/faculty/sync → returns full manifest (profile, cohorts, schedule, rosters, hash, version)
3. Compare: if local_hash == remote_hash → skip sync (data unchanged)
4. If different: wipe local academic data → persist new manifest
5. Result: Unchanged / Updated / FirstSync / NoNetwork / Error
```

**Optimization:** If local hash exists AND cohorts are populated → skip server call entirely.

---

## 14. Database Architecture

### 14.1 Server-Side Data Model

#### Firestore Collections (Real-time Sync)

```
institutions/{institutionId}
  ├── name, address, adminId, config
  ├── departments/{deptId}
  │   └── name, hodId
  ├── rooms/{roomId}
  │   ├── name, building, capacity
  │   ├── wifi_bssid, ble_uuid, gps_lat, gps_lng
  │   └── smartboard_id
  ├── active_sessions/{sessionId}
  │   ├── course_id, section_id, faculty_email
  │   ├── state (PREPARING/IGNITING/ACTIVE/CLOSED)
  │   ├── otp, qr_secret_key
  │   ├── start_time, end_time
  │   ├── present_count, expected_count
  │   └── attendees/{studentEmail}
  │       ├── status (PRESENT/ABSENT/ISSUE/FLAGGED)
  │       ├── recorded_at, marked_by
  │       ├── trust_score, device_fingerprint
  │       └── sensor_data (gps, wifi, ble)
  └── archived_sessions/{sessionId}
      └── (same structure as active_sessions)
```

#### SQL Database (Transactional)

```
faculty_accounts
  ├── id, email, name, department, designation
  ├── is_registered, auth_status
  ├── device_fingerprint, device_id
  ├── created_at, updated_at

student_accounts
  ├── id, email, name, roll_number
  ├── department, section, batch
  ├── is_active, device_fingerprint
  ├── created_at, updated_at

courses
  ├── id, code, name, department
  ├── semester, credits
  ├── created_at

sections
  ├── id, name, course_id
  ├── semester, year
  ├── student_count

timetable_slots
  ├── id, section_id, day_of_week
  ├── start_minutes, end_minutes
  ├── subject_code, room_number
  ├── faculty_email, slot_type
  ├── class_type, smartboard_id

attendance_records
  ├── id, session_id, student_email
  ├── status, trust_score
  ├── marked_by (faculty_email | 'system')
  ├── device_fingerprint
  ├── recorded_at
  ├── correction_reason (nullable)
  ├── correction_by (nullable)

resources
  ├── id, faculty_id, file_name
  ├── file_size, mime_type, scope
  ├── security_status, institution_id
  ├── allowed_sections, subject_code
  ├── storage_url
  ├── created_at

sessions
  ├── id, course_id, section_id
  ├── faculty_email, room_number
  ├── start_time, end_time
  ├── state, otp, qr_secret
  ├── present_count, expected_count
  ├── manifest_hash, version
  ├── created_at, archived_at
```

#### Redis (Session + Cache)

```
session:{sessionId}:state       → Current session state (JSON)
session:{sessionId}:otp         → Current OTP value
session:{sessionId}:qr_token    → Current QR token
session:{sessionId}:board_id    → Connected SmartBoard ID
session:{sessionId}:ws_channel  → WebSocket channel name
auth:{firebase_uid}:sessions    → Active session IDs
auth:{firebase_uid}:device      → Bound device fingerprint
rate:{ip}:{endpoint}            → Rate limiting counter
```

### 14.2 Client-Side Data Model (Hive)

| Box Name | Encryption | Keys | Value Types |
|----------|-----------|------|-------------|
| `faculty_profile` | AES | `profile`, `is_registered`, `stats` | Map<String, dynamic> |
| `academic_data` | AES | `cohorts`, `schedule_{day}`, `roster_{key}`, `eligibility_students_{courseId}`, `manifest_hash`, `manifest_version`, `schedule_days`, `roster_keys`, `adhoc_sessions`, `subjects_cache`, `reports_cache_{courseId}`, `reports_last_sync` | List / Map / String / int |
| `attendance` | AES | `{sessionId}_{studentId}` | Map<String, dynamic> |
| `notifications` | AES | `history` | List<Map<String, dynamic>> |
| `device_data` | AES | `device_id`, `device_fingerprint` | String |

### 14.3 Data Migration Strategy

**Current State:** NO migration strategy exists. Schema changes will corrupt data.

**Required Implementation:**

```dart
class HiveMigrationManager {
  static const _schemaVersionKey = 'schema_version';
  static const _currentSchemaVersion = 1;

  static Future<void> migrate() async {
    final currentVersion = await _getCurrentVersion();
    if (currentVersion >= _currentSchemaVersion) return;

    for (var v = currentVersion; v < _currentSchemaVersion; v++) {
      await _migrateToVersion(v + 1);
    }

    await _setCurrentVersion(_currentSchemaVersion);
  }

  static Future<void> _migrateToVersion(int version) async {
    switch (version) {
      case 1: // Initial schema
        break;
      case 2: // Add new field to profile
        // Migration logic
        break;
    }
  }
}
```

---

## 15. Caching Strategy

### 15.1 Cache Tiers

| Tier | Storage | TTL | Use Case |
|------|---------|-----|----------|
| **L1: In-Memory** | Dart variables / ValueNotifier | Session lifetime | Active screen state, current session data |
| **L2: Hive** | Encrypted local DB | Until manifest change | Profile, schedule, roster, notifications |
| **L3: SharedPreferences** | Key-value store | Until explicit delete | Settings, flags, onboarding state |
| **L4: SecureStorage** | Encrypted key-value | Until explicit delete | Credentials, encryption keys, JWT tokens |

### 15.2 Cache-First Pattern

```dart
Future<Entity> getData(String id) async {
  // L1: Check in-memory
  if (_memoryCache.containsKey(id)) return _memoryCache[id]!;

  // L2: Check Hive
  final cached = _localDataSource.get(id);
  if (cached != null) {
    _memoryCache[id] = cached;
    return cached;
  }

  // L3: Fetch from server
  final remote = await _remoteDataSource.get(id);
  if (remote != null) {
    await _localDataSource.save(id, remote);
    _memoryCache[id] = remote;
  }
  return remote!;
}
```

### 15.3 Cache Invalidation

| Trigger | Action | Scope |
|---------|--------|-------|
| Manifest hash changed | Wipe all academic data, re-persist from server | Full academic cache |
| User logout | Wipe all boxes + SharedPreferences | Everything |
| Force logout | Scorched-earth wipe | Everything |
| Resource deleted | Remove from Hive + memory | Single resource |
| Session terminated | Clear session-specific cache | Single session |
| App version upgrade | Run migration manager | Schema-dependent |

### 15.4 Image Cache

```dart
// cached_network_image configuration
CachedNetworkImage(
  imageUrl: url,
  memCacheWidth: 200,        // Limit memory usage
  memCacheHeight: 200,
  placeholder: (_, __) => SkeletonLoader(),
  errorWidget: (_, __, ___) => Icon(Icons.person),
  // Disk cache: managed by flutter_cache_manager
  // Max disk cache: 100MB
  // Max stale policy: 7 days
)
```

---

## 16. Error Handling Strategy

### 16.1 Exception Hierarchy

```dart
// Base
abstract class AppException implements Exception {
  final String message;
  final String code;
  final dynamic originalError;
}

// Domain Exceptions
class AuthException extends AppException { ... }
class SessionException extends AppException { ... }
class NetworkException extends AppException { ... }
class CacheException extends AppException { ... }
class SecurityException extends AppException { ... }
class ValidationException extends AppException { ... }
class PermissionException extends AppException { ... }
class DeviceCompromisedException extends AppException { ... }
```

### 16.2 Error Flow

```
Exception thrown in Repository/Service
  ↓
Catch in Controller
  ↓
Map to AppException (if not already)
  ↓
Set controller state: ErrorState(appException)
  ↓
Widget observes ErrorState via Provider
  ↓
ErrorHandler.sanitize(appException) → AppError (title, message, icon, action)
  ↓
Render ErrorDisplay widget (bottom sheet / inline / snackbar)
```

### 16.3 Error Display Strategies

| Error Severity | Display Method | User Action |
|---------------|---------------|-------------|
| **Critical** (compromised device, auth revoked) | Full-screen overlay | None (app locked) |
| **High** (network error, server error) | Snackbar with retry button | Tap retry |
| **Medium** (validation error, permission denied) | Inline error text | Fix input / grant permission |
| **Low** (cache read error, background sync failed) | Silent (debug print only) | None |
| **Info** (operation succeeded) | Success snackbar | None |

### 16.4 Retry Policy

| Error Type | Retry | Strategy | Max Retries |
|-----------|-------|----------|:-----------:|
| Network timeout | YES | Exponential backoff (2s, 4s) | 2 |
| Connection error | YES | Exponential backoff (2s, 4s) | 2 |
| 401 Unauthorized | YES (once) | Token refresh + retry | 1 |
| 403 Forbidden | NO | Force logout | 0 |
| 409 Conflict | NO | Show conflict message | 0 |
| 500 Server Error | YES | Exponential backoff (2s, 4s) | 2 |
| 503 Service Unavailable | YES | Exponential backoff (5s, 10s) | 3 |

---

## 17. Performance Strategy

### 17.1 Startup Performance Budget

| Phase | Target | What Happens |
|-------|--------|-------------|
| Track A (pre-UI) | ≤100ms | Hive init + encryption key + open 2 boxes + SharedPreferences + load profile from cache |
| First Frame | ≤200ms | Dashboard renders from cache |
| Track B (background) | ≤2s | Firebase init + remaining Hive boxes + notifications + time sync + key enrollment |
| Full Ready | ≤3s | Dashboard fully hydrated from server |

### 17.2 Frame Rate Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Frame rate | ≥60 FPS (16.67ms per frame) | `SchedulerBinding.instance.addTimingsCallback` |
| Jank frames | <1% of total frames | Flutter DevTools timeline |
| First meaningful paint | <500ms | Time from `runApp()` to first non-placeholder frame |
| Navigation transition | <300ms | Standard platform transition |

### 17.3 Memory Budget

| Component | Max Memory | Eviction |
|-----------|-----------|----------|
| Image cache (disk) | 100MB | LRU, 7-day stale |
| Image cache (memory) | 50MB | LRU, based on screen width |
| Hive boxes | 50MB | Manual cleanup on logout |
| WebSocket buffer | 1MB | No buffering (stream) |
| In-memory cache | 10MB | TTL-based, explicit eviction |

### 17.4 Widget Optimization

| Technique | Where | Purpose |
|-----------|-------|---------|
| `RepaintBoundary` | Complex widgets (seating grid, charts) | Isolate repaints |
| `const` constructors | All stateless widgets | Reduce rebuilds |
| `ListView.builder` | All scrollable lists | Lazy rendering |
| `AutomaticKeepAliveClientMixin` | Tab views | Preserve state across tabs |
| `shouldRebuild` | Custom `shouldNotify` in ChangeNotifier | Skip unnecessary notifications |
| `Selective rebuilds` | `ValueListenableBuilder` instead of `Consumer` | Fine-grained widget rebuilds |

### 17.5 Network Optimization

| Technique | Purpose |
|-----------|---------|
| Manifest hash comparison | Skip sync if data unchanged |
| Cache-first rendering | Show cached data immediately, refresh in background |
| Request deduplication | Don't fire duplicate requests for same data |
| Response compression | Accept gzip/br from server |
| Connection pooling | Dio reuses HTTP connections |

### 17.6 Battery Optimization

| Technique | Purpose |
|-----------|---------|
| Heartbeat interval: 30s | Not too frequent for battery |
| WebSocket reconnect backoff: max 30s | Stop hammering server |
| No background polling | Rely on FCM for push |
| Timer cancellation on background | Stop 1s timetable tick when app paused |
| Hardware snapshot cache: 30s | Avoid repeated native bridge calls |

---

## 18. Logging Strategy

### 18.1 Log Levels

| Level | Purpose | Release Mode | Example |
|-------|---------|:------------:|---------|
| `debug` | Development debugging | Strip in release | Variable values, flow traces |
| `info` | Important state changes | Keep in release | Session started, attendance marked |
| `warning` | Recoverable issues | Keep in release | Cache miss, retry attempt |
| `error` | Unrecoverable issues | Keep in release | API failure, auth exception |
| `critical` | Security events | Keep in release | Root detected, force logout triggered |

### 18.2 Log Format

```
[LEVEL] [TIMESTAMP] [TAG] [MESSAGE]
[INFO] [2026-07-19T10:30:00Z] [AuthInterceptor] Token attached for path: /api/v1/faculty/sync
[ERROR] [2026-07-19T10:30:05Z] [SessionRepository] Failed to start session: DioException [409]
[CRITICAL] [2026-07-19T10:30:10Z] [SecurityController] Root detected — scorched earth triggered
```

### 18.3 Logging Rules

1. **NEVER log:** Passwords, tokens (full value), PII (email in debug), sensor data, trust scores
2. **ALWAYS log:** Auth events, session lifecycle, security violations, API errors, force logout
3. **DEBUG only:** Request/response bodies, provider state changes, cache operations
4. **Structured logging:** Use consistent tag names per module

### 18.4 Log Destination

| Mode | Destination | Retention |
|------|------------|-----------|
| Debug | `debugPrint` (console) | Session only |
| Release | Firebase Crashlytics (breadcrumbs) | 90 days |
| Security events | Server audit log endpoint | 1 year |
| Crash reports | Firebase Crashlytics | 90 days |

### 18.5 Crash Reporting

**Current State:** NOT IMPLEMENTED

**Required Implementation:**
```dart
// In main.dart, before runApp()
FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
PlatformDispatcher.instance.onError = (error, stack) {
  FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
  return true;
};
```

---

## 19. Testing Strategy

### 19.1 Test Pyramid

```
         ╱╲
        ╱  ╲       E2E / Integration Tests (5%)
       ╱    ╲      - Full user flows
      ╱──────╲     - Device-specific tests
     ╱        ╲
    ╱          ╲    Widget Tests (25%)
   ╱            ╲   - Screen rendering
  ╱──────────────╲  - User interaction
 ╱                ╲
╱                  ╲ Unit Tests (70%)
╱────────────────────╲ - Repository logic
                      - Service logic
                      - Domain logic
                      - Model serialization
```

### 19.2 Unit Test Coverage Targets

| Module | Target Coverage | Key Tests |
|--------|:--------------:|-----------|
| Domain Entities | 100% | All entity creation, validation, equality |
| Domain Services | 100% | Eligibility calculation, trust scoring, QR validation |
| Repositories | 90% | All CRUD operations, error paths, cache fallback |
| Controllers | 85% | All state transitions, error handling, loading states |
| Models/DTOs | 100% | All fromJson/toJson round-trips, edge cases |
| Interceptors | 80% | Token attachment, 401/403 handling, retry logic |
| Services | 70% | Cache read/write, sync logic, time calculations |

### 19.3 Widget Test Coverage Targets

| Screen | Tests |
|--------|-------|
| Login Screen | Form validation, submit flow, error display |
| Dashboard | Empty state, loading state, schedule rendering |
| Reports | Tab switching, filter application, chart rendering |
| Live Monitor | Attendance grid update, manual mark flow |
| All screens | Loading state, error state, empty state, tablet layout |

### 19.4 Integration Test Flows

| Flow | Steps |
|------|-------|
| Complete Registration | Email → OTP → Password → Profile loaded |
| Start Session → Mark → End | Login → Start → Pair Board → Student scans → Manual mark → Terminate |
| Force Logout | Login → Trigger 403 → All data wiped → Login screen |
| Offline → Online | Load dashboard → Airplane mode → Start session (fail) → Online → Retry |
| App Resume | Load dashboard → Background 10min → Resume → Data refreshed |

### 19.5 Test Infrastructure

| Tool | Purpose |
|------|---------|
| `flutter_test` | Unit and widget tests |
| `mockito` / `mocktail` | Mock generation for dependencies |
| `bloc_test` / `mocktail` | State management testing |
| `integration_test` | Full flow tests on device |
| `golden_toolkit` | Screenshot comparison tests |
| `http_mock_adapter` | Dio interceptor testing |

---

## 20. Deployment Strategy

### 20.1 Versioning

**Format:** `MAJOR.MINOR.PATCH+BUILD_NUMBER`

| Change Type | Increment | Example |
|------------|-----------|---------|
| Breaking API changes | MAJOR | 2.0.0 |
| New features | MINOR | 1.1.0 |
| Bug fixes | PATCH | 1.0.1 |
| Build number | BUILD_NUMBER | 1.0.0+42 (auto-increment) |

### 20.2 CI/CD Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Push to    │     │   CI Build   │     │   Staging    │     │   Production │
│   main       │ →   │   & Test     │ →   │   Deploy     │ →   │   Release    │
│              │     │              │     │              │     │              │
│ - lint       │     │ - flutter    │     │ - internal   │     │ - Play Store │
│ - format     │     │   analyze    │     │   testing    │     │   rollout    │
│ - test       │     │ - flutter    │     │ - beta       │     │ - monitoring │
│ - build APK  │     │   test       │     │   testers    │     │ - rollback   │
│ - build AAB  │     │ - build      │     │ - crash      │     │   ready     │
│              │     │ - security   │     │   monitoring │     │              │
│              │     │   scan       │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### 20.3 Release Checklist

- [ ] All tests pass (unit, widget, integration)
- [ ] Lint analysis: 0 issues
- [ ] Code signing configured (keystore, upload key)
- [ ] ProGuard/R8 rules verified (no stripping of models)
- [ ] Firebase app registered (google-services.json present)
- [ ] Environment variables configured (.env for release)
- [ ] Certificate pinning fingerprints updated
- [ ] Version number incremented
- [ ] Changelog updated
- [ ] Play Store listing updated (screenshots, description)
- [ ] Crashlytics enabled and verified
- [ ] Analytics events verified
- [ ] Performance profiling (no jank, <2s cold start)
- [ ] Security review (no secrets in code, no debug logs in release)
- [ ] Rollback plan documented

### 20.4 Monitoring & Alerting

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| Crash rate | >1% of sessions | Investigate top crash |
| ANR rate | >0.5% of sessions | Investigate blocking operations |
| API error rate | >5% of requests | Check backend health |
| API p95 latency | >2s | Check backend performance |
| WebSocket disconnect rate | >10% of connections | Check server WebSocket capacity |
| Firebase Auth failures | >2% of attempts | Check Firebase service status |
| App startup time | >3s (p95) | Profile bootstrap sequence |

### 20.5 Rollback Strategy

1. **Play Store Rollback:** Revert to previous APK/AAB version via Play Console
2. **Backend Rollback:** Revert FastAPI deployment to previous version
3. **Database Rollback:** Point-in-time recovery (Firestore) / backup restore (SQL)
4. **Feature Flag Rollback:** Disable problematic feature via server-side config (if implemented)
5. **Client-side Kill Switch:** Server can return 426 (Upgrade Required) to force app update

---

## Appendix A: Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Mobile Framework** | Flutter | SDK 3.12+ | Cross-platform mobile |
| **Language** | Dart | 3.x | Type-safe language |
| **State Management** | Provider | ^6.0.5 | Reactive state |
| **HTTP Client** | Dio | ^5.3.3 | REST API communication |
| **WebSocket** | dart:io WebSocket | SDK | Real-time communication |
| **Local Database** | Hive | ^2.2.3 | Encrypted offline storage |
| **Secure Storage** | flutter_secure_storage | ^9.2.4 | Credentials + encryption keys |
| **Auth** | Firebase Auth | ^5.1.1 | Email/password + ID tokens |
| **Push Notifications** | Firebase Messaging | ^15.0.0 | Background + foreground push |
| **Local Notifications** | flutter_local_notifications | ^17.1.2 | In-app notification alerts |
| **Charts** | Syncfusion Flutter Charts | ^26.1.35 | Data visualization |
| **QR Scanning** | mobile_scanner | ^3.5.2 | Camera-based QR reading |
| **QR Generation** | qr_flutter | ^4.1.0 | QR code rendering |
| **Biometrics** | local_auth | ^2.1.8 | Fingerprint/face auth |
| **Connectivity** | connectivity_plus | ^6.0.3 | Network status detection |
| **File Picking** | file_picker | ^10.3.10 | File selection |
| **Image Picking** | image_picker | ^1.0.7 | Camera/gallery access |
| **PDF Generation** | pdf | ^3.12.0 | Report export |
| **Excel Generation** | excel | ^4.0.6 | Spreadsheet export |
| **File Sharing** | share_plus | ^12.0.2 | OS share sheet |
| **Device Info** | device_info_plus | ^10.1.0 | Device metadata |
| **Package Info** | package_info_plus | ^8.0.0 | App version info |
| **Permissions** | permission_handler | ^11.3.1 | Runtime permissions |
| **Timezone** | flutter_timezone + timezone | latest | Timezone handling |
| **Config** | flutter_dotenv | ^5.1.0 | Environment variables |
| **Fonts** | google_fonts | ^6.1.0 | Typography |
| **Crypto** | crypto | ^3.0.3 | SHA-256 hashing |

## Appendix B: Existing Faculty App File Inventory

The existing Faculty app (`IntelliAttend-Faculty-Mobile-App/`) contains **85 Dart files** totaling approximately **6,200 lines of business logic** and **8,000 lines of UI code**. This audit has analyzed every file. The Master Architecture defined above represents the target state. The gap analysis between current and target is documented in `ARCHITECTURE_AUDIT.md`.

---

*This document is the single source of truth for all IntelliAttend architecture decisions. All development must conform to this architecture. Deviations require explicit approval and documentation.*
