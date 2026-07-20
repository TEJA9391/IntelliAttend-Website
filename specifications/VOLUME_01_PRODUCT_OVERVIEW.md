# VOLUME 01: PRODUCT OVERVIEW

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Product Vision

IntelliAttend is a production-grade, enterprise-level attendance management system designed for universities and large educational institutions. It replaces traditional manual attendance tracking with a multi-modal, biometrically-secured, real-time system that supports thousands of concurrent users across multiple campuses.

### 1.1 Core Value Proposition

- **Real-time visibility** into attendance across all lectures, labs, and seminars
- **Multi-modal verification** (QR, biometric, NFC) ensuring 99.5%+ attendance accuracy
- **Zero-trust security** with certificate pinning, AES-256 encryption, and biometric gates
- **Offline-first architecture** ensuring functionality without network connectivity
- **Actionable analytics** for administrators and faculty to identify at-risk students

---

## 2. Product Scope

### 2.1 In Scope (Current Development)

| Module | Description | Priority |
|--------|-------------|----------|
| Faculty Mobile App | Attendance marking, session management, real-time monitoring | P0 — MVP |
| Student Mobile App | QR scanning, attendance viewing, notifications | P0 — MVP |
| HOD Dashboard | Department analytics, faculty oversight, reports | P1 |
| Admin Dashboard | System configuration, user management, audit logs | P1 |
| Shared Library | Cross-platform models, validators, QR protocol | P0 — MVP |

### 2.2 Out of Scope (Future Phases)

| Module | Target Phase |
|--------|-------------|
| Smart Board Integration (physical hardware) | Phase 2 |
| Parent Portal | Phase 3 |
| Payroll Integration | Phase 3 |
| Multi-Campus Federation | Phase 4 |

---

## 3. User Roles and Personas

### 3.1 Role Definitions

| Role | Description | Primary Interface |
|------|-------------|-------------------|
| **Student** | Enrolled learner who scans QR codes to mark attendance | Student Mobile App |
| **Faculty** | Teaching staff who create sessions, mark attendance, view reports | Faculty Mobile App |
| **HOD** | Head of Department who oversees faculty and department analytics | HOD Web Dashboard |
| **Admin** | System administrator managing users, courses, and configuration | Admin Web Dashboard |
| **Super Admin** | Platform owner with full system access and audit capabilities | Admin Web Dashboard |
| **Guest** | Limited auditor with read-only access to specific reports | Guest Web Dashboard |

### 3.2 User Counts (Projected)

| Role | Year 1 | Year 2 | Year 3 |
|------|--------|--------|--------|
| Students | 5,000 | 15,000 | 50,000 |
| Faculty | 200 | 500 | 1,500 |
| HODs | 15 | 30 | 60 |
| Admins | 5 | 10 | 15 |
| Super Admins | 2 | 2 | 2 |

---

## 4. Core Functional Requirements

### 4.1 Attendance Marking

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ATT-001 | Students mark attendance by scanning time-locked QR codes | P0 |
| FR-ATT-002 | QR codes rotate every 60 seconds with HMAC-SHA256 signatures | P0 |
| FR-ATT-003 | Faculty can mark attendance manually for students without devices | P0 |
| FR-ATT-004 | Attendance is validated offline and synced when connectivity returns | P0 |
| FR-ATT-005 | System supports both "scan-to-mark" and "mark-on-behalf" modes | P1 |
| FR-ATT-006 | Trust score (0-100) is computed per student based on attendance history | P1 |

### 4.2 Session Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SES-001 | Faculty can start/end attendance sessions for scheduled lectures | P0 |
| FR-SES-002 | Sessions auto-start based on timetable with configurable buffer times | P1 |
| FR-SES-003 | Sessions support grace periods (configurable, default 15 min) | P0 |
| FR-SES-004 | Faculty can override timetable for ad-hoc sessions | P1 |
| FR-SES-005 | Sessions emit real-time WebSocket events for live monitoring | P0 |

### 4.3 Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NOT-001 | Push notifications for session start, attendance marked, alerts | P0 |
| FR-NOT-002 | In-app notification center with read/unread status | P1 |
| FR-NOT-003 | Configurable notification preferences per user role | P2 |

### 4.4 Analytics and Reporting

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RPT-001 | Faculty dashboard with per-session attendance percentages | P0 |
| FR-RPT-002 | HOD dashboard with department-wide analytics | P1 |
| FR-RPT-003 | Export attendance reports to PDF and CSV | P1 |
| FR-RPT-004 | Student-facing attendance summary with predicted risk | P1 |
| FR-RPT-005 | Historical trend analysis with configurable date ranges | P2 |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target |
|--------|--------|
| App cold start time | < 2 seconds |
| QR scan to confirmation | < 1.5 seconds |
| API response time (p95) | < 300ms |
| WebSocket message delivery | < 500ms |
| Concurrent users supported | 10,000+ |
| Offline cache duration | 7 days |

### 5.2 Security

| Requirement | Standard |
|-------------|----------|
| Data encryption at rest | AES-256-GCM |
| Data encryption in transit | TLS 1.3 + Certificate Pinning |
| Authentication | Firebase Auth + Biometric |
| Session management | Short-lived JWT (15 min) + Refresh Token (30 days) |
| API security | Rate limiting (100 req/min), Input validation, CORS |
| Compliance | GDPR, FERPA (student data protection) |

### 5.3 Reliability

| Metric | Target |
|--------|--------|
| System uptime | 99.9% (8.76 hours downtime/year) |
| Data durability | 99.999999999% (Firestore SLA) |
| Recovery time objective (RTO) | < 1 hour |
| Recovery point objective (RPO) | < 5 minutes |
| Offline availability | 100% (local cache) |

### 5.4 Scalability

| Dimension | Target |
|-----------|--------|
| User growth | 10x over 3 years |
| Data growth | 1TB attendance records over 5 years |
| Geographic | Multi-campus support from Year 2 |

---

## 6. Technology Stack

### 6.1 Client Layer

| Technology | Purpose |
|------------|---------|
| Flutter 3.29.x | Cross-platform mobile framework |
| Dart 3.x | Programming language |
| Material Design 3 | UI component library |
| Provider 6.1.2 | State management |
| Dio 5.8.0 | HTTP client |
| Firebase Auth | Authentication |
| Firebase Messaging | Push notifications |
| Hive 2.2.3 | Local storage |
| flutter_secure_storage | Key storage |

### 6.2 Server Layer

| Technology | Purpose |
|------------|---------|
| Python 3.11+ | Runtime |
| FastAPI 0.115+ | API framework |
| Firebase Admin SDK | Server-side Firebase integration |
| Redis | Caching and rate limiting |
| Celery | Background task queue |

### 6.3 Data Layer

| Technology | Purpose |
|------------|---------|
| Firestore (Cloud Firestore) | Primary database (NoSQL) |
| Firebase Auth | User identity store |
| Redis | Session cache, rate limits |
| Hive (client-side) | Offline cache |
| Cloud Storage | File uploads (reports, photos) |

### 6.4 Infrastructure

| Technology | Purpose |
|------------|---------|
| Firebase Hosting | Web dashboard hosting |
| Firebase Functions | Serverless compute |
| Firebase App Distribution | Beta app distribution |
| GitHub Actions | CI/CD pipeline |
| Firebase Crashlytics | Crash reporting |
| Firebase Analytics | User analytics |

---

## 7. Business Rules

### 7.1 Attendance Rules

| Rule | Description |
|------|-------------|
| BR-001 | A student is marked "Present" only when a valid QR scan is received within the grace period |
| BR-002 | Late arrival (after grace period) is marked "Late" with time differential logged |
| BR-003 | Absence is auto-assigned when session ends without student scan |
| BR-004 | Faculty can override any attendance record with justification |
| BR-005 | Attendance records are immutable after session closure (append-only) |
| BR-006 | Trust score decreases with each absence; increases with consecutive attendance |
| BR-007 | Below 75% attendance triggers automatic alert to HOD and student |

### 7.2 Security Rules

| Rule | Description |
|------|-------------|
| BR-101 | QR codes are valid for exactly 60 seconds; expired codes are rejected |
| BR-102 | Same QR code cannot be used twice by different students |
| BR-103 | Device fingerprint must match enrollment record |
| BR-104 | Rooted/jailbroken devices are blocked from marking attendance |
| BR-105 | Biometric authentication required before each attendance session |

---

## 8. Assumptions and Constraints

### 8.1 Assumptions

1. Students possess smartphones with cameras and internet connectivity (WiFi or mobile data)
2. University provides QR code displays (projectors, screens, or printed codes)
3. Firebase project is provisioned and configured for the target institution
4. Backend API (FastAPI) is deployed and accessible from student devices
5. Timetable data is available in the system before attendance sessions begin

### 8.2 Constraints

1. **Platform:** Android-first (iOS in future phase)
2. **Budget:** Firebase free tier sufficient for pilot (5,000 users)
3. **Compliance:** Must comply with FERPA for student educational records
4. **Integration:** No legacy system integration in Phase 1
5. **Offline:** Must function fully offline for up to 7 days

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Attendance marking accuracy | > 99.5% | System vs. manual reconciliation |
| Student adoption rate | > 90% of enrolled students | Active users / Total enrolled |
| Faculty satisfaction | > 4.0/5.0 | Quarterly survey |
| System uptime | > 99.9% | Monitoring dashboard |
| QR scan success rate | > 98% on first attempt | Scan events / Total attempts |
| Offline sync success | > 99% within 1 hour | Sync events / Pending syncs |
| Average app load time | < 2 seconds | Crashlytics performance |

---

## 10. Release Plan

| Phase | Scope | Target Date |
|-------|-------|-------------|
| Phase 0 — Foundation | Shared library, core models, QR protocol | Q3 2026 |
| Phase 1 — MVP | Faculty app + Student app (QR marking) | Q4 2026 |
| Phase 2 — HOD Dashboard | Department analytics, faculty oversight | Q1 2027 |
| Phase 3 — Admin Dashboard | System config, user management, audit | Q2 2027 |
| Phase 4 — Smart Board | Physical hardware integration | Q3 2027 |
| Phase 5 — Parent Portal | Parent-facing attendance views | Q4 2027 |
| Phase 6 — Multi-Campus | Federation across campuses | Q1 2028 |
| Phase 7 — AI Analytics | Predictive analytics, anomaly detection | Q2 2028 |

---

*This document is the single source of truth for IntelliAttend product scope and requirements. All subsequent volumes reference this document.*