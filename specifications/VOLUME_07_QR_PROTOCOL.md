# VOLUME 07: QR CODE PROTOCOL & SMART VERIFICATION

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. QR Code Overview

### 1.1 Protocol Version

| Version | Status | Description |
|---------|--------|-------------|
| v5.0 | Deprecated | Basic QR with HMAC |
| v6.0 | Deprecated | Added device fingerprinting |
| **v7.0** | **Current** | Full protocol with rotation, encryption, trust scoring |

### 1.2 Security Goals

| Goal | Mechanism |
|------|-----------|
| Prevent screenshots | Time-locked rotation (60s) |
| Prevent sharing | Device fingerprint binding |
| Prevent replay | One-time use per student per session |
| Prevent spoofing | HMAC-SHA256 signature verification |
| Prevent manipulation | Encrypted payload |

---

## 2. QR Code Structure

### 2.1 Payload Format (v7.0)

```json
{
  "v": 7,
  "sid": "session_id_hash",
  "ts": 1689765000,
  "exp": 1689765060,
  "nonce": "random_uuid",
  "sig": "hmac_sha256_signature"
}
```

### 2.2 Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `v` | int | Protocol version (7) |
| `sid` | string | Session ID hash (SHA-256, first 16 chars) |
| `ts` | int | Unix timestamp (seconds) |
| `exp` | int | Expiration timestamp (ts + 60) |
| `nonce` | string | Random UUID v4 |
| `sig` | string | HMAC-SHA256 signature |

### 2.3 Signature Generation

```
signature = HMAC-SHA256(
  key = SESSION_SECRET_KEY,
  message = "{v}.{sid}.{ts}.{exp}.{nonce}"
)
```

### 2.4 QR Code Image Generation

```dart
class QRCodeGenerator {
  static Future<Uint8List> generate({
    required String sessionId,
    required String secretKey,
    required int rotationSeconds,
  }) async {
    final payload = _createPayload(sessionId, secretKey, rotationSeconds);
    final qrImage = await _encodeQrImage(payload);
    return qrImage;
  }

  static String _createPayload(
    String sessionId,
    String secretKey,
    int rotationSeconds,
  ) {
    final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    final sidHash = _hashSessionId(sessionId);
    final exp = now + rotationSeconds;
    final nonce = _generateNonce();

    final message = "7.$sidHash.$now.$exp.$nonce";
    final signature = _hmacSha256(secretKey, message);

    return jsonEncode({
      'v': 7,
      'sid': sidHash,
      'ts': now,
      'exp': exp,
      'nonce': nonce,
      'sig': signature,
    });
  }

  static String _hashSessionId(String sessionId) {
    return sha256.convert(utf8.encode(sessionId)).toString().substring(0, 16);
  }

  static String _generateNonce() {
    return uuid.v4();
  }

  static String _hmacSha256(String key, String message) {
    final hmac = Hmac(sha256, utf8.encode(key));
    final digest = hmac.convert(utf8.encode(message));
    return digest.toString();
  }
}
```

---

## 3. QR Code Validation

### 3.1 Client-Side Pre-Validation

```dart
class QRValidationService {
  static QRValidationResult validate({
    required String qrPayload,
    required String sessionSecretKey,
    required String currentSessionId,
    required DateTime currentTime,
  }) {
    try {
      // 1. Parse payload
      final payload = jsonDecode(qrPayload);
      
      // 2. Check version
      if (payload['v'] != 7) {
        return QRValidationResult.invalid('Unsupported QR version');
      }

      // 3. Check expiration
      final expiresAt = DateTime.fromMillisecondsSinceEpoch(payload['exp'] * 1000);
      if (currentTime.isAfter(expiresAt)) {
        return QRValidationResult.expired();
      }

      // 4. Verify signature
      final message = "${payload['v']}.${payload['sid']}.${payload['ts']}.${payload['exp']}.${payload['nonce']}";
      final expectedSignature = _hmacSha256(sessionSecretKey, message);
      if (payload['sig'] != expectedSignature) {
        return QRValidationResult.invalid('Invalid signature');
      }

      // 5. Verify session ID
      final expectedSidHash = sha256.convert(utf8.encode(currentSessionId)).toString().substring(0, 16);
      if (payload['sid'] != expectedSidHash) {
        return QRValidationResult.invalid('Session mismatch');
      }

      return QRValidationResult.valid(
        expiresAt: expiresAt,
        nonce: payload['nonce'],
      );
    } catch (e) {
      return QRValidationResult.invalid('Failed to parse QR code');
    }
  }
}

class QRValidationResult {
  final QRValidationStatus status;
  final DateTime? expiresAt;
  final String? nonce;
  final String? errorMessage;

  QRValidationResult.valid({required this.expiresAt, required this.nonce})
      : status = QRValidationStatus.valid,
        errorMessage = null;

  QRValidationResult.expired()
      : status = QRValidationStatus.expired,
        expiresAt = null,
        nonce = null,
        errorMessage = 'QR code has expired';

  QRValidationResult.invalid(String message)
      : status = QRValidationStatus.invalid,
        expiresAt = null,
        nonce = null,
        errorMessage = message;
}

enum QRValidationStatus {
  valid,
  expired,
  invalid
}
```

### 3.2 Server-Side Validation

```python
class QRValidator:
    def validate(self, qr_data: dict, session_id: str, user_id: str) -> ValidationResult:
        # 1. Verify version
        if qr_data.get('v') != 7:
            return ValidationResult.invalid("Unsupported QR version")

        # 2. Check expiration
        if time.time() > qr_data['exp']:
            return ValidationResult.expired()

        # 3. Verify signature
        expected_sig = self._compute_signature(qr_data)
        if qr_data['sig'] != expected_sig:
            return ValidationResult.invalid("Invalid signature")

        # 4. Verify session ID
        expected_sid = hashlib.sha256(session_id.encode()).hexdigest()[:16]
        if qr_data['sid'] != expected_sid:
            return ValidationResult.invalid("Session mismatch")

        # 5. Check if nonce already used (prevent replay)
        if self._is_nonce_used(qr_data['nonce']):
            return ValidationResult.invalid("QR code already used")

        # 6. Mark nonce as used
        self._mark_nonce_used(qr_data['nonce'], session_id)

        return ValidationResult.valid()

    def _compute_signature(self, qr_data: dict) -> str:
        message = f"{qr_data['v']}.{qr_data['sid']}.{qr_data['ts']}.{qr_data['exp']}.{qr_data['nonce']}"
        return hmac.new(
            SESSION_SECRET_KEY.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
```

---

## 4. QR Code Rotation

### 4.1 Rotation Strategy

| Parameter | Default | Configurable |
|-----------|---------|--------------|
| Rotation interval | 60 seconds | Yes (per session) |
| QR code validity | 60 seconds | Yes (per session) |
| Grace period after expiry | 5 seconds | No |

### 4.2 Rotation Flow

```
Faculty App                    Server                    Student App
    │                           │                           │
    │  1. Start Session         │                           │
    │──────────────────────────>│                           │
    │                           │                           │
    │  2. QR Code v1            │                           │
    │<──────────────────────────│                           │
    │                           │                           │
    │  [60 seconds pass]        │                           │
    │                           │                           │
    │  3. Request new QR        │                           │
    │──────────────────────────>│                           │
    │                           │                           │
    │  4. QR Code v2            │                           │
    │<──────────────────────────│                           │
    │                           │  5. WebSocket: qr:rotated │
    │                           │─────────────────────────>│
    │                           │                           │
    │  [Student scans v1]       │                           │
    │                           │                           │
    │                           │  6. Validate v1           │
    │                           │<──────────────────────────│
    │                           │                           │
    │                           │  7. Reject (expired)      │
    │                           │─────────────────────────>│
```

### 4.3 Client-Side QR Timer

```dart
class QRTimer {
  Timer? _timer;
  int _remainingSeconds = 60;
  final int rotationSeconds;
  final VoidCallback onRotationRequired;

  QRTimer({
    required this.rotationSeconds,
    required this.onRotationRequired,
  });

  void start() {
    _remainingSeconds = rotationSeconds;
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      _remainingSeconds--;
      if (_remainingSeconds <= 0) {
        onRotationRequired();
        _remainingSeconds = rotationSeconds;
      }
    });
  }

  void stop() {
    _timer?.cancel();
    _timer = null;
  }

  int get remainingSeconds => _remainingSeconds;
  double get progress => _remainingSeconds / rotationSeconds;
}
```

---

## 5. Device Fingerprinting

### 5.1 Fingerprint Components

| Component | Weight | Description |
|-----------|--------|-------------|
| Device ID | 25% | Android device ID |
| Hardware ID | 25% | Hardware serial number |
| App Instance ID | 25% | Firebase installation ID |
| User Agent | 25% | Device manufacturer + model |

### 5.2 Fingerprint Generation

```dart
class DeviceFingerprint {
  static Future<String> generate() async {
    final deviceInfo = await DeviceInfoPlugin().androidInfo;
    final firebaseId = await FirebaseMessaging.instance.getToken();
    
    final components = [
      deviceInfo.id,           // Android device ID
      deviceInfo.serialNumber, // Hardware serial
      firebaseId,              // Firebase instance ID
      '${deviceInfo.manufacturer} ${deviceInfo.model}', // User agent
    ];

    final combined = components.join('|');
    return sha256.convert(utf8.encode(combined)).toString();
  }
}
```

### 5.3 Fingerprint Validation

```python
class FingerprintValidator:
    def validate(self, submitted_fingerprint: str, enrolled_fingerprint: str) -> bool:
        # Exact match
        if submitted_fingerprint == enrolled_fingerprint:
            return True

        # Fuzzy match (allow 15% deviation for hardware changes)
        similarity = self._compute_similarity(submitted_fingerprint, enrolled_fingerprint)
        return similarity >= 0.85
```

---

## 6. Trust Score System

### 6.1 Trust Score Algorithm

```dart
class TrustScoreCalculator {
  static double calculate({
    required List<AttendanceRecord> history,
    required int totalSessions,
  }) {
    if (totalSessions == 0) return 50.0;

    double score = 50.0; // Base score

    // Attendance ratio (40% weight)
    final attended = history.where((r) => 
      r.status == AttendanceStatus.present || 
      r.status == AttendanceStatus.late
    ).length;
    final attendanceRatio = attended / totalSessions;
    score += (attendanceRatio - 0.5) * 40; // -20 to +20

    // Punctuality ratio (20% weight)
    final onTime = history.where((r) => 
      r.status == AttendanceStatus.present
    ).length;
    final punctualityRatio = totalSessions > 0 ? onTime / totalSessions : 0;
    score += (punctualityRatio - 0.5) * 20; // -10 to +10

    // Streak bonus (20% weight)
    final streak = _calculateStreak(history);
    score += min(streak * 2, 10); // 0 to +10

    // Consistency penalty (20% weight)
    final absences = history.where((r) => 
      r.status == AttendanceStatus.absent
    ).length;
    final absenceRate = absences / totalSessions;
    score -= absenceRate * 20; // 0 to -20

    return score.clamp(0.0, 100.0);
  }

  static int _calculateStreak(List<AttendanceRecord> history) {
    int streak = 0;
    for (final record in history.reversed) {
      if (record.status == AttendanceStatus.present) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
}
```

### 6.2 Trust Score Levels

| Range | Level | Color | Implications |
|-------|-------|-------|--------------|
| 90-100 | Excellent | Green | No restrictions |
| 75-89 | Good | Blue | No restrictions |
| 60-74 | Fair | Yellow | Warning notification |
| 40-59 | Poor | Orange | HOD alert, reduced grace period |
| 0-39 | Critical | Red | Mandatory meeting, parent notification |

---

## 7. Security Measures

### 7.1 Anti-Cheating Mechanisms

| Mechanism | Description |
|-----------|-------------|
| Time Lock | QR codes expire after 60 seconds |
| Device Binding | QR tied to specific device fingerprint |
| One-Time Use | Nonce prevents replay attacks |
| Location Check | Optional GPS verification (future) |
| Biometric | Face/fingerprint verification (future) |

### 7.2 Detection Methods

| Method | Description |
|--------|-------------|
| Screenshot Detection | Analyze QR code for static images |
| Screen Sharing Detection | Monitor for casting indicators |
| Multiple Device Detection | Flag same user on different devices |
| Speed Detection | Flag impossible travel times |
| Anomaly Detection | ML-based pattern recognition (future) |

---

*All QR codes must be validated both client-side (pre-validation) and server-side (final validation). Never trust client-side validation alone.*