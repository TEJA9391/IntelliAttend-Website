# VOLUME 09: SECURITY ARCHITECTURE

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Security Philosophy

### 1.1 Security Principles

| Principle | Description |
|-----------|-------------|
| Defense in Depth | Multiple security layers |
| Zero Trust | Never trust, always verify |
| Least Privilege | Minimum required permissions |
| Secure by Default | Secure configurations out of the box |
| Privacy by Design | Data protection built into architecture |

### 1.2 Threat Model

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|------------|------------|
| QR Code Sharing | High | High | Device binding, time lock |
| Man-in-the-Middle | High | Low | TLS 1.3, Certificate Pinning |
| Data Breach | Critical | Low | AES-256 encryption, access control |
| Rooted Device | Medium | Medium | Root detection, biometric |
| Replay Attack | High | Medium | Nonce, one-time use |
| API Abuse | Medium | High | Rate limiting, input validation |

---

## 2. Authentication Security

### 2.1 Firebase Auth Configuration

```dart
class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Email/Password Sign In
  Future<UserCredential> signInWithEmail({
    required String email,
    required String password,
  }) async {
    // Validate email format
    if (!EmailValidator.validate(email)) {
      throw AuthException('Invalid email format');
    }

    // Check password strength
    if (password.length < 8) {
      throw AuthException('Password must be at least 8 characters');
    }

    try {
      final credential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      // Verify email is verified
      if (!credential.user!.emailVerified) {
        throw AuthException('Email not verified');
      }

      return credential;
    } on FirebaseAuthException catch (e) {
      throw AuthException(_mapFirebaseError(e.code));
    }
  }

  // Biometric Sign In
  Future<UserCredential> signInWithBiometric() async {
    final isAuthenticated = await LocalAuthentication().authenticate(
      localizedReason: 'Authenticate to continue',
      options: const AuthenticationOptions(
        stickyAuth: true,
        biometricOnly: true,
      ),
    );

    if (!isAuthenticated) {
      throw AuthException('Biometric authentication failed');
    }

    // Get stored credentials
    final credentials = await SecureStorageService.getCredentials();
    if (credentials == null) {
      throw AuthException('No stored credentials');
    }

    return signInWithEmail(
      email: credentials.email,
      password: credentials.password,
    );
  }

  String _mapFirebaseError(String code) {
    switch (code) {
      case 'user-not-found':
        return 'No user found with this email';
      case 'wrong-password':
        return 'Invalid password';
      case 'user-disabled':
        return 'Account has been disabled';
      case 'too-many-requests':
        return 'Too many attempts. Please try again later';
      default:
        return 'Authentication failed';
    }
  }
}
```

### 2.2 Token Management

```dart
class TokenService {
  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  Future<void> storeTokens({
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
  }) async {
    await _secureStorage.write(key: 'access_token', value: accessToken);
    await _secureStorage.write(key: 'refresh_token', value: refreshToken);
    await _secureStorage.write(
      key: 'token_expires_at',
      value: expiresAt.toIso8601String(),
    );
  }

  Future<String?> getAccessToken() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) return null;

    final expiresAt = await _getExpiresAt();
    if (expiresAt != null && DateTime.now().isAfter(expiresAt)) {
      // Token expired, try refresh
      return await _refreshToken();
    }

    return token;
  }

  Future<String?> _refreshToken() async {
    final refreshToken = await _secureStorage.read(key: 'refresh_token');
    if (refreshToken == null) return null;

    try {
      final response = await ApiService.refreshToken(refreshToken);
      await storeTokens(
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt,
      );
      return response.accessToken;
    } catch (e) {
      await clearTokens();
      return null;
    }
  }

  Future<void> clearTokens() async {
    await _secureStorage.delete(key: 'access_token');
    await _secureStorage.delete(key: 'refresh_token');
    await _secureStorage.delete(key: 'token_expires_at');
  }
}
```

---

## 3. Network Security

### 3.1 Certificate Pinning

```dart
class ApiClient {
  late Dio _dio;

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: EnvironmentConfig.apiBaseUrl,
      connectTimeout: Duration(seconds: 30),
      receiveTimeout: Duration(seconds: 30),
    ));

    // Certificate pinning
    (_dio.httpClientAdapter as IOHttpClientAdapter).createHttpClient = () {
      final client = HttpClient();
      client.badCertificateCallback = (cert, host, port) {
        // Verify certificate fingerprint
        final expectedFingerprint = EnvironmentConfig.certificateFingerprint;
        final actualFingerprint = sha256.convert(cert.der).toString();
        return actualFingerprint == expectedFingerprint;
      };
      return client;
    };

    // Add interceptors
    _dio.interceptors.addAll([
      AuthInterceptor(),
      LoggingInterceptor(),
      RateLimitInterceptor(),
    ]);
  }
}
```

### 3.2 Auth Interceptor

```dart
class AuthInterceptor extends Interceptor {
  final TokenService _tokenService;

  AuthInterceptor({required TokenService tokenService})
      : _tokenService = tokenService;

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Skip auth for public endpoints
    if (_isPublicEndpoint(options.path)) {
      return handler.next(options);
    }

    // Get access token
    final token = await _tokenService.getAccessToken();
    if (token == null) {
      return handler.reject(DioException(
        requestOptions: options,
        error: 'No access token',
      ));
    }

    // Add token to headers
    options.headers['Authorization'] = 'Bearer $token';
    options.headers['X-Device-Fingerprint'] = await DeviceFingerprint.generate();
    options.headers['X-Request-ID'] = uuid.v4();
    options.headers['X-Timestamp'] = DateTime.now().millisecondsSinceEpoch.toString();

    return handler.next(options);
  }

  @override
  void onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // Token expired, try refresh
      final newToken = await _tokenService.getAccessToken();
      if (newToken != null) {
        // Retry request with new token
        err.requestOptions.headers['Authorization'] = 'Bearer $newToken';
        final response = await _dio.fetch(err.requestOptions);
        return handler.resolve(response);
      }
    }
    return handler.next(err);
  }

  bool _isPublicEndpoint(String path) {
    return path.startsWith('/auth/') || path == '/health';
  }
}
```

### 3.3 Rate Limiting

```dart
class RateLimitInterceptor extends Interceptor {
  final Map<String, List<DateTime>> _requestHistory = {};
  final int _maxRequests = 100;
  final Duration _windowDuration = Duration(minutes: 1);

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final userId = await _getUserId();
    final now = DateTime.now();

    // Clean old requests
    _requestHistory[userId]?.removeWhere(
      (time) => now.difference(time) > _windowDuration,
    );

    // Check rate limit
    final requestCount = _requestHistory[userId]?.length ?? 0;
    if (requestCount >= _maxRequests) {
      return handler.reject(DioException(
        requestOptions: options,
        response: Response(
          requestOptions: options,
          statusCode: 429,
          data: {'error': 'Rate limit exceeded'},
        ),
      ));
    }

    // Record request
    _requestHistory[userId] ??= [];
    _requestHistory[userId]!.add(now);

    return handler.next(options);
  }
}
```

---

## 4. Data Security

### 4.1 Encryption at Rest

```dart
class EncryptionService {
  static const _keyLength = 32; // AES-256
  static const _ivLength = 16;

  static Future<String> encrypt({
    required String plainText,
    required String key,
  }) async {
    final keyBytes = utf8.encode(key);
    final iv = IV.fromSecureRandom(_ivLength);
    final encrypter = Encrypter(AES(Key(keyBytes), mode: AESMode.cbc));

    final encrypted = encrypter.encrypt(plainText, iv: iv);
    return encrypted.base64;
  }

  static Future<String> decrypt({
    required String cipherText,
    required String key,
  }) async {
    final keyBytes = utf8.encode(key);
    final encrypted = Encrypted.fromBase64(cipherText);
    final encrypter = Encrypter(AES(Key(keyBytes), mode: AESMode.cbc));

    return encrypter.decrypt(encrypted);
  }
}
```

### 4.2 Secure Storage

```dart
class SecureStorageService {
  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );

  static Future<void> write({
    required String key,
    required String value,
  }) async {
    await _storage.write(key: key, value: value);
  }

  static Future<String?> read({required String key}) async {
    return await _storage.read(key: key);
  }

  static Future<void> delete({required String key}) async {
    await _storage.delete(key: key);
  }

  static Future<void> deleteAll() async {
    await _storage.deleteAll();
  }
}
```

---

## 5. Device Security

### 5.1 Root/Jailbreak Detection

```dart
class SecurityService {
  static Future<bool> isDeviceRooted() async {
    // Android root detection
    if (Platform.isAndroid) {
      return await _checkAndroidRoot();
    }
    // iOS jailbreak detection
    if (Platform.isIOS) {
      return await _checkIOSJailbreak();
    }
    return false;
  }

  static Future<bool> _checkAndroidRoot() async {
    // Check for common root indicators
    final checks = [
      _checkSuBinary(),
      _checkRootApps(),
      _check危险DangerousProps(),
      _checkRWPaths(),
    ];

    return checks.any((check) => check);
  }

  static bool _checkSuBinary() {
    // Check if su binary exists
    return File('/system/bin/su').existsSync() ||
           File('/system/xbin/su').existsSync();
  }

  static bool _checkRootApps() {
    // Check for common root apps
    final rootApps = [
      'com.topjohnwu.magisk',
      'eu.chainfire.supersu',
      'com.koushikdutta.superuser',
    ];
    // Check if any root app is installed
    return false; // Implementation depends on platform
  }

  static Future<bool> _checkIOSJailbreak() async {
    // Check for Cydia
    return await canLaunch('cydia://');
  }
}
```

### 5.2 Biometric Security

```dart
class BiometricService {
  static Future<bool> isBiometricAvailable() async {
    final localAuth = LocalAuthentication();
    return await localAuth.canCheckBiometrics;
  }

  static Future<bool> authenticate({
    String reason = 'Authenticate to continue',
  }) async {
    final localAuth = LocalAuthentication();
    try {
      return await localAuth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false,
          useErrorDialogs: true,
        ),
      );
    } on PlatformException catch (e) {
      throw BiometricException(e.message ?? 'Biometric authentication failed');
    }
  }
}
```

---

## 6. API Security

### 6.1 Input Validation

```dart
class InputValidator {
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    if (!EmailValidator.validate(value)) {
      return 'Invalid email format';
    }
    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!RegExp(r'[a-z]').hasMatch(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!RegExp(r'[0-9]').hasMatch(value)) {
      return 'Password must contain at least one number';
    }
    return null;
  }

  static String? validateStudentId(String? value) {
    if (value == null || value.isEmpty) {
      return 'Student ID is required';
    }
    if (!RegExp(r'^STU\d{6}$').hasMatch(value)) {
      return 'Invalid student ID format';
    }
    return null;
  }
}
```

### 6.2 SQL Injection Prevention

```dart
// Firestore is NoSQL, but validate all inputs
class FirestoreValidator {
  static void validateDocumentData(Map<String, dynamic> data) {
    data.forEach((key, value) {
      if (value is String) {
        // Sanitize string inputs
        if (value.contains('\$') || value.contains('{')) {
          throw ValidationException('Invalid characters in $key');
        }
      }
    });
  }
}
```

---

## 7. Audit Logging

### 7.1 Audit Event Types

```dart
enum AuditEvent {
  // Authentication
  userLogin,
  userLogout,
  loginFailed,
  passwordChanged,
  biometricEnabled,
  biometricDisabled,

  // Attendance
  attendanceMarked,
  attendanceOverride,
  attendanceDeleted,

  // Session
  sessionCreated,
  sessionStarted,
  sessionEnded,
  sessionCancelled,

  // User Management
  userCreated,
  userUpdated,
  userDeleted,
  roleChanged,

  // System
  configChanged,
  backupCreated,
  dataExported,
}
```

### 7.2 Audit Log Entry

```dart
class AuditLogEntry {
  final String id;
  final String userId;
  final AuditEvent event;
  final String resource;
  final String resourceId;
  final Map<String, dynamic>? details;
  final String? ipAddress;
  final String? userAgent;
  final DateTime timestamp;

  AuditLogEntry({
    required this.id,
    required this.userId,
    required this.event,
    required this.resource,
    required this.resourceId,
    this.details,
    this.ipAddress,
    this.userAgent,
    required this.timestamp,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'userId': userId,
    'event': event.name,
    'resource': resource,
    'resourceId': resourceId,
    'details': details,
    'ipAddress': ipAddress,
    'userAgent': userAgent,
    'timestamp': timestamp.toIso8601String(),
  };
}
```

---

## 8. Security Checklist

### 8.1 Development

- [ ] All API calls use HTTPS
- [ ] Certificate pinning implemented
- [ ] Tokens stored in secure storage
- [ ] Input validation on all fields
- [ ] No sensitive data in logs
- [ ] Root/jailbreak detection enabled
- [ ] Biometric authentication available

### 8.2 Deployment

- [ ] Environment variables secured
- [ ] Firebase Security Rules configured
- [ ] API keys rotated regularly
- [ ] Monitoring alerts configured
- [ ] Backup encryption enabled
- [ ] Access logs retained

### 8.3 Runtime

- [ ] Tokens refresh before expiry
- [ ] Session timeout enforced
- [ ] Rate limiting active
- [ ] Audit logs recording
- [ ] Anomaly detection monitoring
- [ ] Incident response plan documented

---

*Security is not a feature, it's a requirement. Every code change must be reviewed for security implications.*