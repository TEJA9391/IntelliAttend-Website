# VOLUME 10: TESTING STRATEGY

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Testing Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Test Early, Test Often | Catch bugs as early as possible |
| Test金字塔 | More unit tests, fewer UI tests |
| Automation First | Automate all repeatable tests |
| Isolated Tests | Tests don't depend on each other |
| Realistic Data | Use production-like test data |

### 1.2 Test Pyramid

```
         /\
        /  \        E2E Tests (10%)
       /    \       - Critical user flows
      /------\      - Slow, expensive
     /        \     
    /  Integration \  Integration Tests (20%)
   /    Tests       \ - API integration
  /                  \ - Repository integration
 /--------------------\ - Widget integration
/                      \
/   Unit Tests (70%)    \ Unit Tests (70%)
/                        \ - Business logic
/--------------------------\ - State management
                            \ - Data models
```

---

## 2. Unit Tests

### 2.1 Model Tests

```dart
// test/Data/Models/attendance_record_test.dart
void main() {
  group('AttendanceRecord', () {
    test('should create from JSON', () {
      final json = {
        'id': 'record_123',
        'sessionId': 'session_456',
        'studentUserId': 'student_789',
        'status': 'present',
        'markedAt': '2026-07-19T09:05:00Z',
        'method': 'qr',
      };

      final record = AttendanceRecord.fromJson(json);

      expect(record.id, 'record_123');
      expect(record.sessionId, 'session_456');
      expect(record.studentUserId, 'student_789');
      expect(record.status, AttendanceStatus.present);
      expect(record.markedAt, DateTime.utc(2026, 7, 19, 9, 5, 0));
      expect(record.method, MarkingMethod.qr);
    });

    test('should serialize to JSON', () {
      final record = AttendanceRecord(
        id: 'record_123',
        sessionId: 'session_456',
        studentUserId: 'student_789',
        status: AttendanceStatus.present,
        markedAt: DateTime.utc(2026, 7, 19, 9, 5, 0),
        method: MarkingMethod.qr,
      );

      final json = record.toJson();

      expect(json['id'], 'record_123');
      expect(json['sessionId'], 'session_456');
      expect(json['status'], 'present');
    });

    test('should support copyWith', () {
      final original = AttendanceRecord(
        id: 'record_123',
        sessionId: 'session_456',
        studentUserId: 'student_789',
        status: AttendanceStatus.present,
        markedAt: DateTime.utc(2026, 7, 19, 9, 5, 0),
        method: MarkingMethod.qr,
      );

      final updated = original.copyWith(
        status: AttendanceStatus.late,
      );

      expect(updated.id, original.id);
      expect(updated.status, AttendanceStatus.late);
    });
  });
}
```

### 2.2 Controller Tests

```dart
// test/Presentation/Providers/attendance_controller_test.dart
void main() {
  late AttendanceController controller;
  late MockAttendanceRepository mockRepository;

  setUp(() {
    mockRepository = MockAttendanceRepository();
    controller = AttendanceController(
      attendanceRepository: mockRepository,
    );
  });

  tearDown(() {
    controller.dispose();
  });

  group('markAttendance', () {
    test('should mark attendance successfully', () async {
      // Arrange
      final record = AttendanceRecord(
        id: 'record_123',
        sessionId: 'session_456',
        studentUserId: 'student_789',
        status: AttendanceStatus.present,
        markedAt: DateTime.now(),
        method: MarkingMethod.qr,
      );

      when(mockRepository.markAttendance(
        sessionId: 'session_456',
        qrCodeHash: 'hash_123',
      )).thenAnswer((_) async => record);

      // Act
      await controller.markAttendance('session_456', 'hash_123');

      // Assert
      expect(controller.state.status, AttendanceStatus.marked);
      expect(controller.state.lastMarked, record);
      verify(mockRepository.markAttendance(
        sessionId: 'session_456',
        qrCodeHash: 'hash_123',
      )).called(1);
    });

    test('should handle offline scenario', () async {
      // Arrange
      when(mockRepository.markAttendance(
        sessionId: 'session_456',
        qrCodeHash: 'hash_123',
      )).thenThrow(NoConnectionException());

      // Act
      await controller.markAttendance('session_456', 'hash_123');

      // Assert
      expect(controller.state.status, AttendanceStatus.initial);
      expect(controller.state.offlineQueue.length, 1);
    });

    test('should handle error scenario', () async {
      // Arrange
      when(mockRepository.markAttendance(
        sessionId: 'session_456',
        qrCodeHash: 'hash_123',
      )).thenThrow(AttendanceValidationException('QR code expired'));

      // Act
      await controller.markAttendance('session_456', 'hash_123');

      // Assert
      expect(controller.state.status, AttendanceStatus.error);
      expect(controller.state.errorMessage, 'QR code expired');
    });
  });

  group('updateLiveCounts', () {
    test('should update attendance counts from WebSocket', () {
      // Arrange
      final summary = AttendanceSummary(
        present: 25,
        late: 3,
        absent: 5,
        total: 33,
      );

      // Act
      controller.updateLiveCounts(summary);

      // Assert
      expect(controller.state.presentCount, 25);
      expect(controller.state.lateCount, 3);
      expect(controller.state.absentCount, 5);
      expect(controller.state.totalCount, 33);
    });
  });
}
```

### 2.3 Use Case Tests

```dart
// test/Domain/UseCases/mark_attendance_use_case_test.dart
void main() {
  late MarkAttendanceUseCase useCase;
  late MockAttendanceRepository mockRepository;
  late MockQRValidator mockQRValidator;

  setUp(() {
    mockRepository = MockAttendanceRepository();
    mockQRValidator = MockQRValidator();
    useCase = MarkAttendanceUseCase(
      attendanceRepository: mockRepository,
      qrValidator: mockQRValidator,
    );
  });

  group('MarkAttendanceUseCase', () {
    test('should mark attendance when QR is valid', () async {
      // Arrange
      final qrResult = QRValidationResult.valid(
        expiresAt: DateTime.now().add(Duration(minutes: 5)),
        nonce: 'nonce_123',
      );

      when(mockQRValidator.validate(
        qrPayload: anyNamed('qrPayload'),
        sessionSecretKey: anyNamed('sessionSecretKey'),
        currentSessionId: 'session_456',
        currentTime: anyNamed('currentTime'),
      )).thenReturn(qrResult);

      final record = AttendanceRecord(
        id: 'record_123',
        sessionId: 'session_456',
        studentUserId: 'student_789',
        status: AttendanceStatus.present,
        markedAt: DateTime.now(),
        method: MarkingMethod.qr,
      );

      when(mockRepository.markAttendance(
        sessionId: 'session_456',
        qrCodeHash: 'hash_123',
      )).thenAnswer((_) async => record);

      // Act
      final result = await useCase(MarkAttendanceParams(
        sessionId: 'session_456',
        qrPayload: 'qr_payload',
        qrCodeHash: 'hash_123',
        sessionSecretKey: 'secret_key',
      ));

      // Assert
      expect(result.isRight(), true);
      expect(result.rightOrNull?.status, AttendanceStatus.present);
    });

    test('should return error when QR is expired', () async {
      // Arrange
      final qrResult = QRValidationResult.expired();

      when(mockQRValidator.validate(
        qrPayload: anyNamed('qrPayload'),
        sessionSecretKey: anyNamed('sessionSecretKey'),
        currentSessionId: 'session_456',
        currentTime: anyNamed('currentTime'),
      )).thenReturn(qrResult);

      // Act
      final result = await useCase(MarkAttendanceParams(
        sessionId: 'session_456',
        qrPayload: 'qr_payload',
        qrCodeHash: 'hash_123',
        sessionSecretKey: 'secret_key',
      ));

      // Assert
      expect(result.isLeft(), true);
      expect(result.leftOrNull?.message, contains('expired'));
    });
  });
}
```

---

## 3. Integration Tests

### 3.1 Repository Integration Tests

```dart
// test/Data/Repositories/attendance_repository_integration_test.dart
void main() {
  late AttendanceRepositoryImpl repository;
  late MockApiClient mockApiClient;
  late MockCacheService mockCacheService;

  setUp(() {
    mockApiClient = MockApiClient();
    mockCacheService = MockCacheService();
    repository = AttendanceRepositoryImpl(
      apiClient: mockApiClient,
      cacheService: mockCacheService,
    );
  });

  group('markAttendance', () {
    test('should mark attendance and cache locally', () async {
      // Arrange
      final response = AttendanceResponse(
        recordId: 'record_123',
        status: 'present',
        markedAt: DateTime.now(),
      );

      when(mockApiClient.post(
        '/attendance/mark',
        data: anyNamed('data'),
      )).thenAnswer((_) async => Response(
        requestOptions: RequestOptions(path: '/attendance/mark'),
        data: response.toJson(),
        statusCode: 200,
      ));

      when(mockCacheService.cacheAttendanceRecord(
        record: anyNamed('record'),
      )).thenAnswer((_) async {});

      // Act
      final result = await repository.markAttendance(
        sessionId: 'session_456',
        qrCodeHash: 'hash_123',
      );

      // Assert
      expect(result.isRight(), true);
      verify(mockApiClient.post(
        '/attendance/mark',
        data: anyNamed('data'),
      )).called(1);
      verify(mockCacheService.cacheAttendanceRecord(
        record: anyNamed('record'),
      )).called(1);
    });
  });
}
```

### 3.2 Widget Integration Tests

```dart
// test/Presentation/Features/Attendance/attendance_marking_screen_test.dart
void main() {
  late MockAttendanceController mockController;
  late MockSessionController mockSessionController;

  setUp(() {
    mockController = MockAttendanceController();
    mockSessionController = MockSessionController();
  });

  testWidgets('should display attendance summary', (tester) async {
    // Arrange
    when(mockController.state).thenReturn(AttendanceState(
      status: AttendanceStatus.marked,
      presentCount: 25,
      lateCount: 3,
      absentCount: 5,
      totalCount: 33,
    ));

    when(mockSessionController.currentSession).thenReturn(AttendanceSession(
      id: 'session_456',
      courseId: 'course_123',
      courseCode: 'CS101',
      courseName: 'Introduction to Programming',
      status: SessionStatus.active,
    ));

    // Act
    await tester.pumpWidget(
      MaterialApp(
        home: MultiProvider(
          providers: [
            ChangeNotifierProvider<AttendanceController>.value(
              value: mockController,
            ),
            ChangeNotifierProvider<SessionController>.value(
              value: mockSessionController,
            ),
          ],
          child: AttendanceMarkingScreen(),
        ),
      ),
    );

    // Assert
    expect(find.text('CS101'), findsOneWidget);
    expect(find.text('25'), findsOneWidget); // Present count
    expect(find.text('3'), findsOneWidget);  // Late count
    expect(find.text('5'), findsOneWidget);  // Absent count
  });
}
```

---

## 4. E2E Tests

### 4.1 Critical User Flows

```dart
// test/E2E/attendance_marking_flow_test.dart
void main() {
  group('Attendance Marking Flow', () {
    testWidgets('complete flow: login → scan QR → mark attendance', (tester) async {
      // Arrange
      await tester.pumpWidget(IntelliAttendApp());
      await tester.pumpAndSettle();

      // Act - Login
      await tester.enterText(
        find.byKey(Key('email_field')),
        'student@university.edu',
      );
      await tester.enterText(
        find.byKey(Key('password_field')),
        'password123',
      );
      await tester.tap(find.byKey(Key('login_button')));
      await tester.pumpAndSettle();

      // Assert - Home screen
      expect(find.text('Home'), findsOneWidget);

      // Act - Navigate to scan
      await tester.tap(find.byKey(Key('scan_tab')));
      await tester.pumpAndSettle();

      // Assert - Scanner screen
      expect(find.byType(QRScannerWidget), findsOneWidget);

      // Act - Simulate QR scan
      await tester.tap(find.byKey(Key('simulate_scan_button')));
      await tester.pumpAndSettle();

      // Assert - Attendance marked
      expect(find.text('Attendance Marked'), findsOneWidget);
      expect(find.text('Present'), findsOneWidget);
    });
  });
}
```

---

## 5. Test Configuration

### 5.1 Coverage Targets

| Module | Target Coverage |
|--------|-----------------|
| Data/Models | 100% |
| Domain/UseCases | 95% |
| Data/Repositories | 90% |
| Presentation/Providers | 85% |
| Presentation/Features | 70% |
| Core/Utils | 90% |
| **Overall** | **80%** |

### 5.2 Test Commands

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run specific test file
flutter test test/Data/Models/attendance_record_test.dart

# Run tests matching pattern
flutter test --name "markAttendance"

# Generate coverage report
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

### 5.3 CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.29.x'
      
      - name: Install dependencies
        run: flutter pub get
      
      - name: Run analyzer
        run: flutter analyze
      
      - name: Run tests
        run: flutter test
      
      - name: Run tests with coverage
        run: flutter test --coverage
      
      - name: Check coverage threshold
        run: |
          COVERAGE=$(lcov --summary coverage/lcov.info 2>&1 | grep "lines" | awk '{print $2}')
          if [ $(echo "$COVERAGE < 80" | bc) -eq 1 ]; then
            echo "Coverage is below 80% threshold"
            exit 1
          fi
```

---

## 6. Mocking Strategy

### 6.1 Mock Generation

```dart
// Use mockito for mock generation
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

@GenerateMocks([
  ApiClient,
  PersistenceService,
  WebSocketService,
  AttendanceRepository,
  SessionRepository,
])
import 'mocks.mocks.dart';
```

### 6.2 Test Fixtures

```dart
// test/fixtures/test_data.dart
class TestData {
  static AttendanceRecord get attendanceRecord => AttendanceRecord(
    id: 'record_123',
    sessionId: 'session_456',
    studentUserId: 'student_789',
    status: AttendanceStatus.present,
    markedAt: DateTime.utc(2026, 7, 19, 9, 5, 0),
    method: MarkingMethod.qr,
  );

  static User get user => User(
    uid: 'uid_123',
    email: 'test@university.edu',
    displayName: 'Test User',
    role: UserRole.student,
    isActive: true,
    createdAt: DateTime.utc(2026, 1, 1),
  );

  static AttendanceSession get session => AttendanceSession(
    id: 'session_123',
    courseId: 'course_456',
    sectionId: 'section_789',
    facultyUserId: 'faculty_012',
    type: SessionType.lecture,
    status: SessionStatus.active,
    scheduledStartTime: DateTime.utc(2026, 7, 19, 9, 0, 0),
    scheduledEndTime: DateTime.utc(2026, 7, 19, 10, 0, 0),
  );
}
```

---

*All tests must be independent, deterministic, and fast. Use test doubles (mocks, fakes, stubs) appropriately. Never use real network calls in tests.*