# VOLUME 15: DEPLOYMENT & DEVOPS

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Deployment Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Infrastructure as Code | All infrastructure defined in code |
| Continuous Deployment | Automated deployment pipeline |
| Zero Downtime | Rolling updates without service interruption |
| Rollback Ready | Ability to revert to previous version |
| Environment Parity | Dev, staging, production as similar as possible |

---

## 2. Environment Configuration

### 2.1 Environment Matrix

| Environment | Purpose | URL | Database |
|-------------|---------|-----|----------|
| Development | Local development | localhost | Firebase Emulator |
| Staging | Pre-production testing | staging-api.intelliattend.com | Staging Firestore |
| Production | Live system | api.intelliattend.com | Production Firestore |

### 2.2 Environment Variables

```yaml
# Firebase Configuration
FIREBASE_PROJECT_ID: intelliattend-prod
FIREBASE_API_KEY: ${FIREBASE_API_KEY}
FIREBASE_AUTH_DOMAIN: intelliattend-prod.firebaseapp.com
FIREBASE_STORAGE_BUCKET: intelliattend-prod.appspot.com
FIREBASE_MESSAGING_SENDER_ID: ${FIREBASE_MESSAGING_SENDER_ID}
FIREBASE_APP_ID: ${FIREBASE_APP_ID}

# API Configuration
API_BASE_URL: https://api.intelliattend.com/api/v1
API_TIMEOUT: 30000
API_RETRY_COUNT: 3

# Security
CERTIFICATE_PINNED_SHA256: ${CERTIFICATE_PINNED_SHA256}
JWT_SECRET_KEY: ${JWT_SECRET_KEY}
SESSION_SECRET_KEY: ${SESSION_SECRET_KEY}

# Redis
REDIS_HOST: ${REDIS_HOST}
REDIS_PORT: 6379
REDIS_PASSWORD: ${REDIS_PASSWORD}

# Monitoring
SENTRY_DSN: ${SENTRY_DSN}
CRASHLYTICS_ENABLED: true
ANALYTICS_ENABLED: true
```

---

## 3. CI/CD Pipeline

### 3.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  FLUTTER_VERSION: '3.29.x'

jobs:
  # Stage 1: Code Quality
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
      
      - name: Install dependencies
        run: flutter pub get
      
      - name: Run analyzer
        run: flutter analyze --fatal-infos
      
      - name: Check formatting
        run: dart format --set-exit-if-changed .

  # Stage 2: Unit Tests
  test:
    runs-on: ubuntu-latest
    needs: analyze
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
      
      - name: Install dependencies
        run: flutter pub get
      
      - name: Run tests
        run: flutter test --coverage
      
      - name: Check coverage
        run: |
          COVERAGE=$(lcov --summary coverage/lcov.info 2>&1 | grep "lines" | awk '{print $2}')
          if [ $(echo "$COVERAGE < 80" | bc) -eq 1 ]; then
            echo "Coverage is below 80% threshold"
            exit 1
          fi

  # Stage 3: Build
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
      
      - name: Build APK
        run: flutter build apk --release
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release.apk
          path: build/app/outputs/flutter-apk/app-release.apk

  # Stage 4: Deploy to Staging
  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - uses: actions/checkout@v3
      
      - name: Download APK
        uses: actions/download-artifact@v3
        with:
          name: app-release.apk
      
      - name: Deploy to Firebase App Distribution
        uses: wzieba/Firebase-Distribution-Github-Action@v1
        with:
          appId: ${{ secrets.FIREBASE_APP_ID_STAGING }}
          serviceCredentialsFileContent: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          file: app-release.apk
          groups: testers

  # Stage 5: Deploy to Production
  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Download APK
        uses: actions/download-artifact@v3
        with:
          name: app-release.apk
      
      - name: Deploy to Firebase App Distribution
        uses: wzieba/Firebase-Distribution-Github-Action@v1
        with:
          appId: ${{ secrets.FIREBASE_APP_ID_PRODUCTION }}
          serviceCredentialsFileContent: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          file: app-release.apk
          groups: production-testers
```

### 3.2 Backend Deployment (FastAPI)

```yaml
# .github/workflows/backend.yml
name: Backend Deployment

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest
      
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: intelliattend-api
          region: us-central1
          image: gcr.io/${{ secrets.GCP_PROJECT_ID }}/intelliattend-api
```

---

## 4. Firebase Configuration

### 4.1 Firebase Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Faculty can read their sessions
    match /sessions/{sessionId} {
      allow read: if request.auth != null && 
        (resource.data.facultyUserId == request.auth.uid ||
         request.auth.token.role in ['admin', 'superAdmin']);
      allow write: if request.auth != null && 
        request.auth.token.role in ['faculty', 'admin', 'superAdmin'];
    }

    // Attendance records
    match /attendance/{recordId} {
      allow read: if request.auth != null && 
        (resource.data.studentUserId == request.auth.uid ||
         request.auth.token.role in ['faculty', 'hod', 'admin', 'superAdmin']);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.token.role in ['faculty', 'admin', 'superAdmin'];
    }
  }
}
```

### 4.2 Firebase Hosting

```json
{
  "hosting": {
    "public": "build/web",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

---

## 5. Monitoring & Alerting

### 5.1 Monitoring Stack

| Tool | Purpose |
|------|---------|
| Firebase Crashlytics | Crash reporting |
| Firebase Analytics | User analytics |
| Sentry | Error tracking |
| Prometheus | Metrics collection |
| Grafana | Metrics visualization |
| PagerDuty | Incident management |

### 5.2 Key Metrics

| Metric | Threshold | Alert |
|--------|-----------|-------|
| API Response Time (p95) | > 500ms | Warning |
| API Response Time (p99) | > 1s | Critical |
| Error Rate | > 1% | Warning |
| Error Rate | > 5% | Critical |
| Crash Rate | > 0.1% | Warning |
| Crash Rate | > 1% | Critical |
| Memory Usage | > 80% | Warning |
| CPU Usage | > 80% | Warning |

### 5.3 Alert Configuration

```yaml
# alerts.yml
alerts:
  - name: High API Latency
    condition: api_response_time_p95 > 500ms
    duration: 5m
    severity: warning
    notify: [slack, email]

  - name: Critical API Latency
    condition: api_response_time_p99 > 1000ms
    duration: 2m
    severity: critical
    notify: [slack, email, pagerduty]

  - name: High Error Rate
    condition: error_rate > 5%
    duration: 5m
    severity: critical
    notify: [slack, email, pagerduty]

  - name: High Crash Rate
    condition: crash_rate > 1%
    duration: 10m
    severity: critical
    notify: [slack, email, pagerduty]
```

---

## 6. Rollback Strategy

### 6.1 App Rollback

```bash
# Firebase App Distribution rollback
firebase appdistribution:distribute rollback \
  --app <app-id> \
  --version <previous-version>
```

### 6.2 Backend Rollback

```bash
# Cloud Run rollback
gcloud run services update intelliattend-api \
  --image gcr.io/<project-id>/intelliattend-api:<previous-tag> \
  --region us-central1
```

### 6.3 Database Rollback

```bash
# Firestore backup restore
gcloud firestore import gs://<bucket>/backup/<timestamp> \
  --collection-group=sessions
```

---

## 7. Backup Strategy

### 7.1 Backup Schedule

| Data | Frequency | Retention | Method |
|------|-----------|-----------|--------|
| Firestore | Daily | 30 days | Automated export |
| User Data | Weekly | 90 days | Encrypted backup |
| Configuration | On change | Forever | Git version control |
| Logs | Daily | 30 days | Cloud Logging |

### 7.2 Backup Commands

```bash
# Export Firestore
gcloud firestore export gs://<bucket>/backups/$(date +%Y%m%d)

# Import Firestore
gcloud firestore import gs://<bucket>/backups/20260719/
```

---

## 8. Security Checklist

### 8.1 Pre-Deployment

- [ ] All secrets stored in Firebase/Secret Manager
- [ ] No hardcoded credentials in code
- [ ] API keys rotated regularly
- [ ] Security rules tested
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Certificate pinning enabled

### 8.2 Post-Deployment

- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Backup verification
- [ ] Performance baseline established
- [ ] Security scan completed

---

*Deployment should be boring. Automate everything, test everything, and have a rollback plan.*