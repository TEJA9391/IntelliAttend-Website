# VOLUME 12: ERROR HANDLING & RESILIENCE

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Error Handling Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Fail Gracefully | Never crash the app; show meaningful errors |
| Recover Automatically | Retry transient failures |
| Log Everything | Capture errors for debugging |
| User-Friendly Messages | Show actionable messages, not stack traces |
| Defensive Programming | Validate all inputs, handle all edge cases |

---

## 2. Exception Hierarchy

### 2.1 Base Exception

```dart
abstract class AppException implements Exception {
  final String message;
  final String? code;
  final dynamic details;
  final StackTrace? stackTrace;

  AppException({
    required this.message,
    this.code,
    this.details,
    this.stackTrace,
  });

  @override
  String toString() => 'AppException: $message (${code ?? "unknown"})';
}
```

### 2.2 Network Exceptions

```dart
class NetworkException extends AppException {
  NetworkException({
    required String message,
    String? code,
    dynamic details,
  }) : super(message: message, code: code, details: details);
}

class NoConnectionException extends NetworkException {
  NoConnectionException()
      : super(
          message: 'No internet connection',
          code: 'NETWORK_NO_CONNECTION',
        );
}

class TimeoutException extends NetworkException {
  TimeoutException({String? endpoint})
      : super(
          message: 'Request timed out${endpoint != null ? ' ($endpoint)' : ''}',
          code: 'NETWORK_TIMEOUT',
          details: {'endpoint': endpoint},
        );
}

class ServerException extends NetworkException {
  final int statusCode;

  ServerException({
    required this.statusCode,
    String? message,
    dynamic details,
  }) : super(
          message: message ?? _getDefaultMessage(statusCode),
          code: 'NETWORK_SERVER_$statusCode',
          details: details,
        );

  static String _getDefaultMessage(int statusCode) {
    switch (statusCode) {
      case 400:
        return 'Bad request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Internal server error';
      default:
        return 'Server error ($statusCode)';
    }
  }
}
```

### 2.3 Authentication Exceptions

```dart
class AuthException extends AppException {
  AuthException({
    required String message,
    String? code,
    dynamic details,
  }) : super(message: message, code: code, details: details);
}

class InvalidCredentialsException extends AuthException {
  InvalidCredentialsException()
      : super(
          message: 'Invalid email or password',
          code: 'AUTH_INVALID_CREDENTIALS',
        );
}

class TokenExpiredException extends AuthException {
  TokenExpiredException()
      : super(
          message: 'Session expired. Please login again',
          code: 'AUTH_TOKEN_EXPIRED',
        );
}

class BiometricException extends AuthException {
  BiometricException({String? message})
      : super(
          message: message ?? 'Biometric authentication failed',
          code: 'AUTH_BIOMETRIC_FAILED',
        );
}
```

### 2.4 Validation Exceptions

```dart
class ValidationException extends AppException {
  final Map<String, String> errors;

  ValidationException({
    required String message,
    this.errors = const {},
  }) : super(message: message, code: 'VALIDATION_ERROR');
}

class QRValidationException extends ValidationException {
  QRValidationException({required String reason})
      : super(
          message: 'QR code validation failed: $reason',
          errors: {'qr': reason},
        );
}

class AttendanceValidationException extends ValidationException {
  AttendanceValidationException({required String reason})
      : super(
          message: 'Attendance validation failed: $reason',
          errors: {'attendance': reason},
        );
}
```

### 2.5 Cache Exceptions

```dart
class CacheException extends AppException {
  CacheException({
    required String message,
    String? code,
    dynamic details,
  }) : super(message: message, code: code, details: details);
}

class SyncException extends CacheException {
  SyncException({String? message})
      : super(
          message: message ?? 'Sync failed',
          code: 'CACHE_SYNC_FAILED',
        );
}
```

---

## 3. Error Handling Patterns

### 3.1 Result Type Pattern

```dart
sealed class Result<T> {
  const Result();

  bool get isSuccess => this is Success<T>;
  bool get isFailure => this is Failure<T>;

  T? get rightOrNull => switch (this) {
    Success<T> success => success.value,
    Failure<T> _ => null,
  };

  AppException? get leftOrNull => switch (this) {
    Success<T> _ => null,
    Failure<T> failure => failure.exception,
  };

  Result<T> map(T Function(T) transform) => switch (this) {
    Success<T> success => Success(transform(success.value)),
    Failure<T> failure => Failure(failure.exception),
  };

  Result<R> flatMap<R>(Result<R> Function(T) transform) => switch (this) {
    Success<T> success => transform(success.value),
    Failure<T> failure => Failure(failure.exception),
  };
}

class Success<T> extends Result<T> {
  final T value;
  const Success(this.value);
}

class Failure<T> extends Result<T> {
  final AppException exception;
  const Failure(this.exception);
}
```

### 3.2 Usage Example

```dart
class AttendanceRepository {
  Future<Result<AttendanceRecord>> markAttendance({
    required String sessionId,
    required String qrCodeHash,
  }) async {
    try {
      final response = await _apiClient.post(
        '/attendance/mark',
        data: {
          'sessionId': sessionId,
          'qrCodeHash': qrCodeHash,
        },
      );

      final record = AttendanceRecord.fromJson(response.data);
      return Success(record);
    } on ServerException catch (e) {
      return Failure(e);
    } on TimeoutException catch (e) {
      return Failure(e);
    } on NoConnectionException catch (e) {
      return Failure(e);
    } catch (e, stackTrace) {
      return Failure(AppException(
        message: 'Unexpected error: $e',
        code: 'UNKNOWN',
        details: e,
        stackTrace: stackTrace,
      ));
    }
  }
}
```

---

## 4. Retry Strategy

### 4.1 Exponential Backoff

```dart
class RetryStrategy {
  final int maxRetries;
  final Duration initialDelay;
  final Duration maxDelay;
  final double backoffFactor;

  const RetryStrategy({
    this.maxRetries = 3,
    this.initialDelay = const Duration(seconds: 1),
    this.maxDelay = const Duration(seconds: 30),
    this.backoffFactor = 2.0,
  });

  Future<T> execute<T>(Future<T> Function() operation) async {
    int attempt = 0;
    Duration delay = initialDelay;

    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (e) {
        attempt++;
        if (attempt >= maxRetries) rethrow;

        // Check if error is retryable
        if (!_isRetryable(e)) rethrow;

        // Wait before retry
        await Future.delayed(delay);

        // Increase delay
        delay = Duration(
          milliseconds: (delay.inMilliseconds * backoffFactor).toInt(),
        ).clamp(Duration.zero, maxDelay);
      }
    }

    throw AppException(message: 'Max retries exceeded');
  }

  bool _isRetryable(dynamic error) {
    if (error is TimeoutException) return true;
    if (error is ServerException && error.statusCode >= 500) return true;
    if (error is NoConnectionException) return true;
    return false;
  }
}
```

### 4.2 Circuit Breaker Pattern

```dart
class CircuitBreaker {
  int _failureCount = 0;
  DateTime? _lastFailureTime;
  CircuitBreakerState _state = CircuitBreakerState.closed;

  final int failureThreshold;
  final Duration resetTimeout;

  CircuitBreaker({
    this.failureThreshold = 5,
    this.resetTimeout = const Duration(seconds: 60),
  });

  Future<T> execute<T>(Future<T> Function() operation) async {
    if (_state == CircuitBreakerState.open) {
      if (_shouldReset()) {
        _state = CircuitBreakerState.halfOpen;
      } else {
        throw CircuitBreakerOpenException();
      }
    }

    try {
      final result = await operation();
      _onSuccess();
      return result;
    } catch (e) {
      _onFailure();
      rethrow;
    }
  }

  void _onSuccess() {
    _failureCount = 0;
    _state = CircuitBreakerState.closed;
  }

  void _onFailure() {
    _failureCount++;
    _lastFailureTime = DateTime.now();

    if (_failureCount >= failureThreshold) {
      _state = CircuitBreakerState.open;
    }
  }

  bool _shouldReset() {
    if (_lastFailureTime == null) return false;
    return DateTime.now().difference(_lastFailureTime!) > resetTimeout;
  }
}

enum CircuitBreakerState {
  closed,
  open,
  halfOpen
}
```

---

## 5. Error UI Patterns

### 5.1 Error Widget

```dart
class ErrorWidget extends StatelessWidget {
  final AppException exception;
  final VoidCallback? onRetry;

  const ErrorWidget({
    super.key,
    required this.exception,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              _getIcon(),
              size: 64,
              color: Theme.of(context).colorScheme.error,
            ),
            const SizedBox(height: 16),
            Text(
              _getTitle(),
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              exception.message,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ],
        ),
      ),
    );
  }

  IconData _getIcon() {
    return switch (exception) {
      NoConnectionException() => Icons.cloud_off,
      TimeoutException() => Icons.timer_off,
      ServerException() => Icons.error_outline,
      AuthException() => Icons.lock_outline,
      _ => Icons.warning_amber,
    };
  }

  String _getTitle() {
    return switch (exception) {
      NoConnectionException() => 'No Internet Connection',
      TimeoutException() => 'Request Timed Out',
      ServerException() => 'Server Error',
      AuthException() => 'Authentication Error',
      _ => 'Something Went Wrong',
    };
  }
}
```

### 5.2 SnackBar Error Display

```dart
class ErrorSnackBar {
  static void show(BuildContext context, AppException exception) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(exception.message),
        backgroundColor: Theme.of(context).colorScheme.error,
        action: exception is NetworkException
            ? SnackBarAction(
                label: 'Retry',
                onPressed: () {
                  // Retry logic
                },
              )
            : null,
        duration: const Duration(seconds: 4),
      ),
    );
  }
}
```

---

## 6. Global Error Handling

### 6.1 Flutter Error Handler

```dart
class ErrorHandler {
  static void initialize() {
    // Catch Flutter errors
    FlutterError.onError = (details) {
      FlutterError.presentError(details);
      CrashlyticsService.recordError(
        details.exception,
        details.stack,
        reason: 'Flutter error',
      );
    };

    // Catch async errors
    WidgetsBinding.instance.platformDispatcher.onError = (error, stack) {
      CrashlyticsService.recordError(
        error,
        stack,
        reason: 'Platform dispatcher error',
      );
      return true;
    };
  }
}
```

### 6.2 Dio Error Handler

```dart
class DioErrorHandler extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final exception = _mapDioException(err);
    
    // Log error
    LoggingService.error(
      'API Error: ${err.requestOptions.path}',
      error: exception,
    );

    // Record to crashlytics
    CrashlyticsService.recordError(
      exception,
      err.stackTrace,
      reason: 'Dio error',
    );

    handler.next(DioException(
      requestOptions: err.requestOptions,
      error: exception,
    ));
  }

  AppException _mapDioException(DioException err) {
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException(endpoint: err.requestOptions.path);
      case DioExceptionType.connectionError:
        return NoConnectionException();
      case DioExceptionType.badResponse:
        return ServerException(
          statusCode: err.response?.statusCode ?? 500,
          details: err.response?.data,
        );
      default:
        return NetworkException(message: err.message ?? 'Unknown network error');
    }
  }
}
```

---

## 7. Resilience Patterns

### 7.1 Graceful Degradation

```dart
class AttendanceService {
  Future<DashboardData> getDashboardData() async {
    try {
      // Try to get fresh data
      return await _fetchFromApi();
    } catch (e) {
      // Fallback to cached data
      final cached = await _getCachedData();
      if (cached != null) {
        // Show cached data with indicator
        return cached.copyWith(isStale: true);
      }
      // If no cache, show error
      rethrow;
    }
  }
}
```

### 7.2 Timeout Handling

```dart
class TimeoutWrapper {
  static Future<T> withTimeout<T>(
    Future<T> operation, {
    Duration timeout = const Duration(seconds: 30),
    String? operationName,
  }) async {
    try {
      return await operation.timeout(timeout);
    } on TimeoutException {
      throw TimeoutException(endpoint: operationName);
    }
  }
}
```

---

*Errors are not exceptional—they are expected. Handle every possible failure path. Never let the app crash without recovery options.*