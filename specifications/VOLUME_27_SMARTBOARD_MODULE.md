# VOLUME 27: SMARTBOARD MODULE

**IntelliAttend — Software Requirements Specification & Technical Design Document**

| Field | Value |
|---|---|
| Volume | 27 |
| Module | SmartBoard (OTP Display & Board Linking) |
| Status | Active |
| Last Updated | 2026-07-19 |
| Estimated LOC | ~2,800 (Faculty) + ~350 (Dashboard) |

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Source File Inventory](#3-source-file-inventory)
4. [Session Start Flow](#4-session-start-flow)
5. [OTP Lifecycle](#5-otp-lifecycle)
6. [SmartBoard Screen — AttendanceCodeScreen](#6-smartboard-screen--attendancecodescreen)
7. [SmartBoard Screen — SmartBoardScreen (Standalone)](#7-smartboard-screen--smartboardscreen-standalone)
8. [SmartBoardController](#8-smartboardcontroller)
9. [Rolling Digit Animation](#9-rolling-digit-animation)
10. [WebSocket Integration](#10-websocket-integration)
11. [Board Readiness & FCM Integration](#11-board-readiness--fcm-integration)
12. [Session State Machine](#12-session-state-machine)
13. [OTP Security Model](#13-otp-security-model)
14. [React Dashboard — SmartBoardDisplay](#14-react-dashboard--smartboarddisplay)
15. [API Contract](#15-api-contract)
16. [State Management](#16-state-management)
17. [Error Handling](#17-error-handling)
18. [Offline Behavior](#18-offline-behavior)

---

## 1. Module Overview

The SmartBoard Module manages the **OTP-based linking** between a faculty member's mobile device and the classroom's SmartBoard hardware. It is the critical first step in the attendance session lifecycle: the faculty generates a time-limited OTP on their phone, the SmartBoard (or student-facing display) reads that OTP to verify the session, and once verified the session transitions to `ACTIVE` and attendance collection begins.

### Key Responsibilities

- Generate and display a 6-character OTP (format `XXX-XXX`) with a 30-second countdown
- Provide manual OTP refresh/rotate when the code expires
- Transition the session through `PREPARING → IGNITING → ACTIVE → CLOSED` states
- Receive board-connected and OTP-failed events via WebSocket
- Navigate to LiveMonitorScreen upon successful board linking
- Display OTP on the SmartBoard web dashboard (React prototype)

### Design Principles

- **Zero-trust verification**: The board must present the correct OTP to prove physical presence
- **Faculty-initiated**: Only the faculty member can start and rotate OTPs
- **Graceful expiry**: Expired OTPs show clear visual state and require explicit refresh
- **Attempt-limited**: Maximum 5 OTP verification attempts per session before lockout
- **Offline-resilient**: OTP can be displayed offline; board verification requires connectivity

---

## 2. Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                   FACULTY MOBILE APP                     │
│                                                          │
│  ┌──────────────────────┐    ┌────────────────────────┐ │
│  │  SessionControlSection│───▶│ AttendanceCodeScreen    │ │
│  │  (Swipe to Start)     │    │ (Primary OTP Display)   │ │
│  └──────────────────────┘    │  ┌──────────────────┐   │ │
│                              │  │ RollingDigitGroup │   │ │
│                              │  │ (Slot Machine)    │   │ │
│                              │  └──────────────────┘   │ │
│                              │  ┌──────────────────┐   │ │
│                              │  │ Countdown Ring    │   │ │
│                              │  │ (Animated)        │   │ │
│                              │  └──────────────────┘   │ │
│                              └───────────┬──────────────┘ │
│                                          │                │
│  ┌──────────────────────┐    ┌───────────▼──────────────┐ │
│  │  SmartBoardScreen     │    │ WebSocketService          │ │
│  │  (Standalone OTP)     │◀──│ (Singleton)               │ │
│  │  Dark theme variant   │    │  • connectAndJoinRoom()   │ │
│  └──────────────────────┘    │  • events stream           │ │
│                              │  • connectionState stream  │ │
│                              └───────────────────────────┘ │
│                                          │                │
│  ┌──────────────────────┐    ┌───────────▼──────────────┐ │
│  │  SmartBoardController │    │ AttendanceRepository      │ │
│  │  (State + Timer)      │───│  • startSession()         │ │
│  └──────────────────────┘    │  • refreshOtp()            │ │
│                              └───────────────────────────┘ │
│                                          │                │
│  ┌──────────────────────┐    ┌───────────▼──────────────┐ │
│  │  BoardReadinessNotifier│◀──│ SyncFcmHandler            │ │
│  │  (Global singleton)    │   │  • SESSION_PREPARING      │ │
│  │  Set<slotId>           │   │  • BOARD_RECOVERED        │ │
│  └──────────────────────┘    │  • SESSION_LATE_START      │ │
│                              └───────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         │ WebSocket / HTTP
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                      │
│  POST /api/v1/faculty/start_session  → OTP + sessionId   │
│  POST /api/v1/faculty/refresh_otp    → new OTP            │
│  WS   /ws?session_id=...&token=...   → real-time events   │
└─────────────────────────────────────────────────────────┘
                         │
                         │ WebSocket
                         ▼
┌─────────────────────────────────────────────────────────┐
│              SMARTBOARD / WEB DASHBOARD                   │
│  SmartBoardDisplay.tsx (React prototype)                  │
│  • Receives OTP via WebSocket                             │
│  • Displays countdown ring                                │
│  • Shows verified/invalid states                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Source File Inventory

| File | Lines | Role |
|---|---|---|
| `Presentation/Features/Faculty/attendance_code_screen.dart` | 1,014 | Primary OTP display — premium UI with rolling digits, countdown ring, WS integration, activation polling |
| `Presentation/Features/Faculty/smart_board/smart_board_screen.dart` | 228 | Standalone dark-theme OTP display — simplified variant for SmartBoard-specific use |
| `Presentation/Features/Faculty/smart_board/smart_board_controller.dart` | 72 | State + timer for standalone SmartBoardScreen |
| `Presentation/Widgets/rolling_digit.dart` | 299 | Slot-machine-style rolling digit animation widget |
| `Presentation/Features/Faculty/Components/session_control_section.dart` | 1,496 | Dashboard card with swipe-to-start gesture → navigates to AttendanceCodeScreen |
| `Core/Models/websocket_event.dart` | 248 | WS event type enum + typed data classes (BoardConnectedData, OtpFailedData, etc.) |
| `Services/websocket_service.dart` | 220 | WS singleton — connect, heartbeat, reconnect with exponential backoff |
| `Services/board_readiness_notifier.dart` | 31 | Global singleton tracking which timetable slots have board readiness |
| `Services/sync_fcm_handler.dart` | 157 | FCM handler — SESSION_PREPARING, BOARD_RECOVERED, SESSION_LATE_START |
| `Data/Repositories/attendance_repository.dart` | 346 | API facade — startSession(), refreshOtp(), generateQr() |
| `Data/Models/Attendance/attendance_models.dart` | 185 | SessionState enum, SessionStartResponse, StudentAttendance |

---

## 4. Session Start Flow

### 4.1 Entry Point

The session starts when the faculty swipes the `SwipeToStartSession` widget on the Dashboard:

```
Dashboard → SessionControlSection → SwipeToStartSession → onComplete()
  └─▶ Navigator.push → AttendanceCodeScreen(scheduledClass: ...)
```

### 4.2 OTP Fetch Sequence

```
AttendanceCodeScreen.initState()
  │
  ├─ If code provided (from SmartBoardScreen): use it directly, start timer
  │
  └─ If no code: _fetchOtpFromServer()
       │
       ├─ DashboardController.startSession(scheduledClass)
       │    │
       │    └─ AttendanceRepository.startSession(scheduledClass)
       │         │
       │         ├─ POST /api/v1/faculty/start_session
       │         │   Body: { course_id, section_id, slot_id, room_number }
       │         │   Auth: Firebase JWT (Authorization header)
       │         │
       │         └─ Returns: SessionStartResponse
       │              {
       │                session_id: "abc123",
       │                otp: "X7K-M9P",
       │                seconds_remaining: 30,
       │                state: "IGNITING",
       │                version: 1,
       │                websocket_url: "wss://..."
       │              }
       │
       ├─ Set _currentCode = response.otp
       ├─ Set _secondsLeft = min(response.secondsRemaining, 30)
       ├─ Fire OTP reveal haptics (6 taps at staggered intervals)
       ├─ Start countdown timer
       └─ _afterCodeReady()
            │
            ├─ _setupWsListener(sessionId) → connects WebSocket
            └─ _startPollingForActivation(sessionId, version)
```

### 4.3 Error States

| Error Condition | Visual State | Recovery |
|---|---|---|
| No `scheduledClass` | `"!!!!!!"` displayed | Close and retry |
| Server returns null | `"!!!!!!"` displayed | Close and retry |
| Network failure | `"!!!!!!"` displayed | SnackBar + close |
| OTP fetch timeout (10s) | `"!!!!!!"` displayed | Close and retry |

---

## 5. OTP Lifecycle

### 5.1 OTP Format

- **6 alphanumeric characters** formatted as `XXX-XXX` (3 chars, dash, 3 chars)
- Displayed via `RollingDigitGroup` which renders each digit as a slot-machine roller
- Font: JetBrains Mono, 64px, weight 800, letter-spacing 4

### 5.2 OTP Timing

| Parameter | Value | Notes |
|---|---|---|
| Default TTL | 30 seconds | Configurable by server (clamped 10–300) |
| Countdown precision | 1-second ticks | `Timer.periodic(Duration(seconds: 1), ...)` |
| Urgency threshold | ≤10 seconds | Ring color changes to `AppTheme.errorRed` |
| Expiry display | `"!!!!!!"` | All slots show static `!` character |
| Manual refresh only | Yes | Timer stops at 0; no auto-rotate |

### 5.3 OTP Refresh Flow

```
Faculty taps "Refresh Code" / "Rotate Code"
  │
  ├─ If no sessionId yet (first fetch):
  │    └─ _fetchOtpFromServer() → POST /start_session
  │
  └─ If sessionId exists:
       │
       ├─ _autoRefreshOtp(sessionId)
       │    │
       │    └─ AttendanceRepository.refreshOtp(sessionId)
       │         │
       │         ├─ POST /api/v1/faculty/refresh_otp
       │         │   Body: { session_id: "abc123" }
       │         │
       │         └─ Returns: SessionStartResponse (new OTP, new secondsRemaining)
       │
       ├─ Set new _currentCode, _secondsLeft
       ├─ Increment _refreshCount
       ├─ Trigger OTP change animation (scale 1.0 → 1.02 → 1.0)
       ├─ Light haptic feedback
       └─ Show "Attendance code refreshed" SnackBar
```

### 5.4 SmartBoardController Refresh (Standalone Variant)

```dart
Future<void> rotateCodeManually() async {
  if (_isRotating) return;   // Guard against double-tap
  _isRotating = true;
  notifyListeners();

  try {
    final response = await _repository.refreshOtp(sessionId);
    if (response != null) {
      _otp = response.otp;
      _secondsLeft = response.secondsRemaining;
      _initialDuration = response.secondsRemaining;
      _startTimer();
    }
  } catch (e) {
    debugPrint("SMARTBOARD: Failed to refresh OTP: $e");
  } finally {
    _isRotating = false;
    notifyListeners();
  }
}
```

---

## 6. SmartBoard Screen — AttendanceCodeScreen

The **primary** OTP display screen. Full-featured, themed to match the app design, includes WebSocket integration and live monitor navigation.

### 6.1 Class Definition

```dart
class AttendanceCodeScreen extends StatefulWidget {
  final String courseName;
  final String room;
  final String? code;            // Pre-populated OTP (from SmartBoardScreen)
  final String? sessionId;       // Pre-existing session ID
  final int? initialSeconds;     // Pre-existing countdown
  final ScheduledClass? scheduledClass;  // For fresh session start
}
```

### 6.2 Visual Layout (Top to Bottom)

1. **App Bar** — Close button + "Link to SmartBoard" title + connection status indicator + "Live" chip
2. **OTP Card** — Container with border/shadow, contains:
   - "ONE-TIME PASSWORD" label with lock icon (teal color)
   - `RollingDigitGroup` showing the 6-char OTP with dash separator
   - Status subtitle badge (IntelliAttend Smart Board / Code expired / Fetching)
3. **Status Banner** — Conditional:
   - Green: "SmartBoard Connected Successfully" (after `sessionState == active`)
   - Orange: "Wrong OTP · X attempts remaining" (after `otpFailed` WS event)
   - Hidden: when no status to show
4. **Countdown Ring** — `CircularProgressIndicator` with:
   - Background ring (subtle gray)
   - Progress ring (teal → red at ≤10s)
   - Glow effect (pulsing opacity 0.1–0.25)
   - Inner text: `"XXs"` in JetBrains Mono + "REMAINING" label
5. **Auto-Refresh Info** — Subtle row: "Code auto-refreshes in XXs"
6. **Bottom Action** — Full-width "Refresh Code" / "Rotate Code" button (disabled while active)

### 6.3 Connection Status Indicator

```dart
Widget _buildConnectionStatus() {
  final Color statusColor = _otpVerified
      ? Color(0xFF16A34A)           // Green — board connected
      : _otpAttemptCount > 0
          ? Colors.orange            // Orange — verifying
          : AppTheme.accentTeal;     // Teal — waiting

  final String statusText = _otpVerified
      ? "Board Connected"
      : _otpAttemptCount > 0
          ? "Verifying..."
          : "Waiting for SmartBoard";

  // Renders: 8px circle dot + text, animated color transition
}
```

### 6.4 OTP Expiry Handling

```dart
void _handleOtpExpiration() {
  setState(() {
    _currentCode = "!!!!!!";    // All slots show static "!"
    _secondsLeft = 0;
    _rotateEnabled = true;      // Enable refresh button
  });
  HapticFeedback.heavyImpact();
  ScaffoldMessenger.showSnackBar(
    SnackBar(
      content: Text("OTP expired. Tap Rotate to get a new code."),
      backgroundColor: Colors.orangeAccent,
      behavior: SnackBarBehavior.floating,
    ),
  );
}
```

### 6.5 Activation Polling

After the OTP is displayed and WS is connected, the screen polls for session activation:

```dart
void _startPollingForActivation(String sessionId, int startVersion) {
  _activationPollTimer = Timer.periodic(Duration(seconds: 3), (_) async {
    final data = await _dashboardController?.fetchCurrentState();
    final state = data['state']?.toString() ?? '';
    final version = data['version'] as int? ?? 0;

    if (state == 'ACTIVE' && version > _currentVersion) {
      _activationPollTimer?.cancel();
      _navigateToLiveMonitor(sessionId);
    }
  });
}
```

### 6.6 Navigation to Live Monitor

Upon successful board linking:

```
_navigateToLiveMonitor(sessionId)
  │
  ├─ Delay 1200ms (animation settle)
  ├─ Cancel countdown timer
  ├─ Stop progress animation
  │
  └─ Navigator.pushReplacement → LiveMonitorScreen
       Provider: LiveMonitorController(attendanceRepository, sessionId)
       Props: courseName, courseId, sectionId, onSessionEnded callback
```

### 6.7 OTP Reveal Haptics

When a new OTP is received, a choreographed haptic sequence plays:

```dart
void _fireOtpRevealHaptics() {
  const delays = [0, 100, 200, 320, 420, 520];
  // First 5 taps: mediumImpact
  // Last tap: heavyImpact
  // Total duration: ~520ms
}
```

---

## 7. SmartBoard Screen — SmartBoardScreen (Standalone)

A **simplified, dark-theme** variant designed for direct display on SmartBoard hardware or as a lightweight alternative.

### 7.1 Class Definition

```dart
class SmartBoardScreen extends StatelessWidget {
  final String courseName;
  final String room;
  final String sessionId;
  final String initialOtp;
  final int initialSeconds;
}
```

### 7.2 Visual Design

| Element | Style |
|---|---|
| Background | `Color(0xFF0D1117)` — near-black |
| OTP Card gradient | `[Color(0xFF1A2A7B), AppTheme.primary]` (normal) / `[redAccent, blue]` (warning) / `[gray800, gray900]` (expired) |
| OTP text | 52px, white, weight 900, letter-spacing 4 |
| Countdown ring | 120×120, strokeWidth 6, color follows urgency |
| Refresh button | Only enabled when expired; white-on-transparent |
| App bar | Close button + "SmartBoard Link" title + "Live View" chip |

### 7.3 Key Differences from AttendanceCodeScreen

| Feature | AttendanceCodeScreen | SmartBoardScreen |
|---|---|---|
| Theme | App theme (light/dark adaptive) | Always dark |
| OTP display | RollingDigitGroup (animated) | Static Text (no animation) |
| WS integration | Full (events, polling) | None |
| Activation polling | Yes (3s interval) | No |
| Navigation to Live | pushReplacement | pushReplacement |
| Haptics | Full choreographed sequence | None |
| Connection status | Dynamic indicator | None |
| Attempt tracking | Yes (5 attempts) | No |
| Provider | ChangeNotifierProvider | ChangeNotifierProvider |

### 7.4 Widget Tree

```
SmartBoardScreen (StatelessWidget)
  └─ ChangeNotifierProvider<SmartBoardController>
       └─ Consumer<SmartBoardController>
            └─ Scaffold (bg: 0xFF0D1117)
                 └─ SafeArea
                      ├─ _buildAppBar (close + title + "Live View" chip)
                      └─ SingleChildScrollView
                           ├─ _buildHeader (courseName + "Room: XX")
                           ├─ _buildOtpCard (gradient card + OTP text)
                           ├─ _buildCountdown (circular progress + seconds)
                           ├─ _buildInstructions (helper text)
                           └─ _buildRotateButton (enabled only when expired)
```

---

## 8. SmartBoardController

Minimal state controller for the standalone `SmartBoardScreen`.

### 8.1 State

```dart
class SmartBoardController extends ChangeNotifier {
  final String sessionId;
  final AttendanceRepository _repository;

  String _otp = '';              // Current OTP code
  int _secondsLeft = 0;         // Countdown remaining
  Timer? _timer;                 // 1-second periodic timer
  bool _isRotating = false;      // Guard against concurrent refresh
  int _initialDuration = 30;     // For circular progress ratio
}
```

### 8.2 Lifecycle

```
Constructor(sessionId, initialOtp, initialSeconds, repository)
  │
  ├─ _otp = initialOtp
  ├─ _secondsLeft = initialSeconds
  ├─ _initialDuration = max(initialSeconds, 30)
  └─ _startTimer()

_startTimer()
  ├─ Cancel existing timer
  └─ Timer.periodic(1s) → decrement _secondsLeft, notifyListeners()
     └─ When reaches 0: cancel timer, log "OTP expired. Manual refresh required."

rotateCodeManually()
  ├─ Guard: if _isRotating return
  ├─ _isRotating = true
  ├─ POST /refresh_tp → new OTP + new secondsRemaining
  ├─ Update _otp, _secondsLeft, _initialDuration
  ├─ Restart timer
  └─ finally: _isRotating = false

dispose()
  └─ _timer?.cancel()
```

---

## 9. Rolling Digit Animation

The `RollingDigitGroup` and `RollingDigit` widgets provide a slot-machine-style reveal animation for the OTP.

### 9.1 RollingDigitGroup

```dart
class RollingDigitGroup extends StatelessWidget {
  final String? code;    // e.g. "X7K-M9P"
  final TextStyle? style;
}
```

Renders as: `[RollingDigit × 3] — [RollingDigit × 3]`

- Dash separator styled in JetBrains Mono, 48px, 80% opacity
- Each group is a `Row` of 3 `RollingDigit` widgets

### 9.2 RollingDigit

Each digit slot has:

| Property | Value | Notes |
|---|---|---|
| Strip digits | 10 (0–9) rendered twice (20 items) | For seamless loop |
| Digit height | `fontSize × 1.4` | Generous clip bounds |
| Digit width | `fontSize × 0.85` | Tight horizontal fit |
| Direction | Per-slot random (`+1` or `-1`) | Deterministic via `Random(slotIndex * 8675309 + 17)` |
| Phase offset | Per-slot random (0–stripHeight) | Prevents synchronized appearance |
| Spin cycle | 3200–3800ms per full 0–9 cycle | Randomized per slot |
| Lock animation | 1100ms `easeOutCubic` | Smooth deceleration with extra revolution |
| Lock delay | Staggered per digit: `[0, 100, 200]` and `[320, 420, 520]` ms | Digits lock sequentially |

### 9.3 Animation States

```
State 1: Spinning (no code)
  └─ _spinController.repeat() — continuous vertical scroll

State 2: Locking (code received)
  ├─ Stop spin controller
  ├─ Calculate adjusted end position (+1 extra revolution for deceleration)
  ├─ _lockController.forward() — animate from current to target
  └─ On complete: _isLocked = true, _currentOffset = target

State 3: Locked (displaying)
  └─ Static offset = digit × digitHeight

State 4: Static char (error "!")
  └─ No animation, no clip, plain Text widget
```

### 9.4 Performance

- Each `RollingDigit` is wrapped in `RepaintBoundary` to isolate repaints
- `ClipRect` prevents visual overflow during scroll
- `AnimatedBuilder` used instead of `AnimatedWidget` for minimal rebuilds

---

## 10. WebSocket Integration

### 10.1 Connection Setup

```dart
void _setupWsListener(String sessionId) {
  final wsService = WebSocketService();
  wsService.connectAndJoinRoom(sessionId: sessionId);

  // Subscribe to connection state changes
  _wsConnSub = wsService.connectionState.listen((state) { ... });

  // Subscribe to events
  _wsEventSub = wsService.events.listen((event) { ... });
}
```

### 10.2 WebSocket URL Construction

```
wss://{apiBaseUrl}/ws?session_id={sessionId}&token={firebaseToken}&token_type=firebase
```

- Protocol: `wss://` (derived from `https://` API base URL)
- Auth: Firebase ID token passed as query parameter
- Room: `session_id` parameter for server-side room assignment

### 10.3 Events Handled by OTP Screen

| Event | Handler | Action |
|---|---|---|
| `otpFailed` | `_wsEventSub` | Increment `_otpAttemptCount`; if ≥5: set `_otpExhausted = true`, clear active session |
| `sessionActivated` | `_wsEventSub` (via DashboardController) | Set `_otpVerified = true`, navigate to LiveMonitor |
| `boardConnected` | `_wsEventSub` | Log board connection |
| `connectionState.disconnected` | `_wsConnSub` | Log disconnection (no auto-reconnect handling in screen) |

### 10.4 OTP Failure Tracking

```dart
_wsEventSub = wsService.events.listen((event) {
  if (event.type == WsEventType.otpFailed) {
    final attemptCount = event.get<int>('attempt_count') ?? 1;
    _otpAttemptCount = attemptCount;
    final remaining = 5 - attemptCount;

    if (remaining <= 0) {
      _otpExhausted = true;
      context.read<DashboardController>().clearActiveSession();
      // Screen shows error, session terminated
    }
  }
});
```

### 10.5 Heartbeat

- Client sends `{"type": "ping"}` every 30 seconds
- Server responds with `"pong"`
- `pong` messages are silently ignored in `_onMessage`

---

## 11. Board Readiness & FCM Integration

### 11.1 BoardReadinessNotifier

A global singleton that tracks which timetable slots have confirmed board connectivity:

```dart
class BoardReadinessNotifier extends ChangeNotifier {
  static final BoardReadinessNotifier instance = BoardReadinessNotifier._();
  final Set<String> _readySlots = {};

  bool isReady(String slotId) => _readySlots.contains(slotId);
  void markReady(String slotId) { _readySlots.add(slotId); notifyListeners(); }
  void clearReady(String slotId) { _readySlots.remove(slotId); notifyListeners(); }
  void clearAll() { _readySlots.clear(); notifyListeners(); }
}
```

### 11.2 FCM Message Types

| FCM Type | Action | BoardReadinessNotifier |
|---|---|---|
| `SESSION_PREPARING` | Show "Class Preparing" notification | `markReady(slotId)` |
| `BOARD_RECOVERED` | Show "Board Reconnected" notification | `markReady(slotId)` |
| `SESSION_LATE_START` | Show "Attendance Not Taken" notification | No change |
| `SILENT_SYNC_PING` + `INVALIDATE_LOCAL_DB` | Trigger `FacultyHydrationService.syncIfNeeded()` | No change |

### 11.3 Foreground vs Background

Both foreground (`onMessage`) and background (`_firebaseMessagingBackgroundHandler`) handlers process identical FCM types with the same logic. Background handler uses `@pragma('vm:entry-point')` annotation.

---

## 12. Session State Machine

### 12.1 States

```dart
enum SessionState { idle, preparing, igniting, active, closed }
```

| State | Meaning | OTP Visible | Board Linking | Attendance Collection |
|---|---|---|---|---|
| `idle` | No session | No | No | No |
| `preparing` | Board detected, class approaching | No | In progress | No |
| `igniting` | OTP generated, waiting for board | Yes | Active | No |
| `active` | Board verified OTP | N/A (navigated away) | Complete | Yes |
| `closed` | Session ended | No | No | No |

### 12.2 Transitions

```
idle ──▶ preparing (FCM: SESSION_PREPARING)
preparing ──▶ igniting (Faculty swipes to start / OTP fetched)
igniting ──▶ active (Board presents correct OTP / WS: sessionActivated)
igniting ──▶ closed (OTP exhausted / 5 failed attempts / faculty closes)
active ──▶ closed (Faculty ends session / timeout)
```

### 12.3 State Detection in AttendanceCodeScreen

The screen listens to `DashboardController.sessionState`:

```dart
void _onSessionStateChanged() {
  final state = context.read<DashboardController>().sessionState;
  switch (state) {
    case SessionState.active:
      setState(() => _otpVerified = true);
      HapticFeedback.lightImpact();
      // Show green success SnackBar
      break;
    case SessionState.closed:
      // Session ended
      break;
    case SessionState.igniting:
    case SessionState.preparing:
    case SessionState.idle:
      break;
  }
}
```

---

## 13. OTP Security Model

### 13.1 Generation

- Server generates a 6-character alphanumeric OTP
- OTP is bound to a specific `session_id` and `faculty_id`
- Each OTP has a server-enforced TTL (default 30s, clamped 10–300s)

### 13.2 Verification

- The SmartBoard (or dashboard) must present the OTP back to the server
- Server verifies: OTP matches + session_id matches + not expired + within attempt limit
- Maximum **5 attempts** per OTP rotation before lockout

### 13.3 Rotation

- Faculty can manually rotate (refresh) the OTP at any time
- Each rotation invalidates the previous OTP
- Rotation calls `POST /api/v1/faculty/refresh_otp` with `session_id`
- Server returns new OTP + new TTL

### 13.4 Lockout

```
Attempt 1: Wrong OTP → "Wrong OTP · 4 attempts remaining" (orange banner)
Attempt 2: Wrong OTP → "Wrong OTP · 3 attempts remaining"
Attempt 3: Wrong OTP → "Wrong OTP · 2 attempts remaining"
Attempt 4: Wrong OTP → "Wrong OTP · 1 attempt remaining"
Attempt 5: Wrong OTP → Session terminated, _otpExhausted = true
```

### 13.5 Transport Security

- OTP transmitted over WSS (WebSocket Secure)
- Firebase JWT required for WS connection
- API calls use Dio with auth interceptor (JWT in Authorization header)

---

## 14. React Dashboard — SmartBoardDisplay

The `Smart-Campus-Dashboard` React prototype includes a SmartBoard display component for showing OTP on classroom screens.

### 14.1 Component Spec

```tsx
interface SmartBoardDisplayProps {
  // Receives OTP state from WebSocket connection
}
```

### 14.2 Display States

| State | Visual |
|---|---|
| OTP Active | Large OTP text + circular countdown ring + "Secure Connection Active" |
| OTP Expired | Grayed out OTP + "CODE EXPIRED" + "Please refresh to continue" |
| Connected | Green checkmark + "SmartBoard Connected" |
| Invalid | Red X + "Invalid Code" + attempt count |

### 14.3 WebSocket Integration

The dashboard connects to the same WS endpoint and receives:
- `otp_rotated` — new OTP + countdown
- `session_activated` — success state
- `otp_failed` — failure with attempt count

---

## 15. API Contract

### 15.1 Start Session

```
POST /api/v1/faculty/start_session
Authorization: Bearer {firebase_jwt}

Request Body:
{
  "course_id": "CS101",
  "section_id": "A",
  "slot_id": "slot_3",
  "room_number": "B204"
}

Response (200):
{
  "session_id": "sess_abc123",
  "otp": "X7K-M9P",
  "seconds_remaining": 30,
  "expires_at": "2026-07-19T10:30:30Z",
  "current_time": "2026-07-19T10:30:00Z",
  "websocket_url": "wss://api.example.com/ws",
  "state": "IGNITING",
  "version": 1
}

Error (400): { "error": "SLOT_NOT_CURRENT" }
Error (409): { "error": "ALREADY_ACTIVE" }
Error (401): { "error": "AUTH_REQUIRED" }
```

### 15.2 Refresh OTP

```
POST /api/v1/faculty/refresh_otp
Authorization: Bearer {firebase_jwt}

Request Body:
{
  "session_id": "sess_abc123"
}

Response (200):
{
  "session_id": "sess_abc123",
  "otp": "R4T-W8N",
  "seconds_remaining": 30,
  "state": "IGNITING",
  "version": 2
}

Error (404): { "error": "SESSION_NOT_FOUND" }
Error (410): { "error": "SESSION_CLOSED" }
```

### 15.3 WebSocket Events (Server → Client)

| Event | Payload | Trigger |
|---|---|---|
| `board_connected` | `{ session_id }` | SmartBoard connects to WS room |
| `otp_failed` | `{ session_id, attempt_count, retries_remaining }` | Wrong OTP presented |
| `session_activated` | `{ session_id, version }` | Correct OTP verified |
| `faculty_sync` | `{ total_present, total_students, present_students }` | Periodic roster sync |
| `full_state_sync` | `{ total_present, total_students, roster }` | Full state recovery |
| `attendance_update` | `{ student_id, status, ... }` | Individual attendance change |
| `heartbeat` / `pong` | `{}` | Keep-alive response |

### 15.4 WebSocket Events (Client → Server)

| Event | Payload | Purpose |
|---|---|---|
| `ping` | `{ "type": "ping" }` | Heartbeat (every 30s) |
| `mark_attendance` | `{ session_id, student_id, faculty_email }` | Manual attendance mark |

---

## 16. State Management

### 16.1 AttendanceCodeScreen (StatefulWidget)

| Variable | Type | Purpose |
|---|---|---|
| `_currentCode` | `String` | Current OTP display value |
| `_secondsLeft` | `int` | Countdown remaining |
| `_isRefreshing` | `bool` | Refresh request in flight |
| `_refreshFailed` | `bool` | Last refresh failed |
| `_refreshCount` | `int` | Number of successful refreshes |
| `_otpVerified` | `bool` | Board successfully linked |
| `_otpAttemptCount` | `int` | Failed verification attempts |
| `_otpExhausted` | `bool` | All 5 attempts used |
| `_navigatingToLive` | `bool` | Guard against double navigation |
| `_currentVersion` | `int` | Session state version for polling |
| `_rotateEnabled` | `bool` | Whether refresh button is active |
| `_isFetchingOtp` | `bool` | Guard against concurrent fetches |

### 16.2 Animation Controllers

| Controller | Duration | Purpose |
|---|---|---|
| `_progressController` | Dynamic (matches `_secondsLeft`) | Countdown ring progress |
| `_glowController` | 2000ms, repeat reverse | Pulsing glow behind countdown |
| `_otpChangeController` | 500ms | Scale animation on OTP change |

### 16.3 Stream Subscriptions

| Subscription | Source | Cleanup |
|---|---|---|
| `_wsEventSub` | `WebSocketService().events` | `cancel()` in `dispose()` |
| `_wsConnSub` | `WebSocketService().connectionState` | `cancel()` in `dispose()` |
| `_stateListener` | `DashboardController.addListener` | `removeListener()` in `dispose()` |
| `_countdownTimer` | `Timer.periodic(1s)` | `cancel()` in `dispose()` |
| `_rotateUnlockTimer` | `Timer(10s)` | `cancel()` in `dispose()` |
| `_activationPollTimer` | `Timer.periodic(3s)` | `cancel()` in `dispose()` |

### 16.4 SmartBoardController (ChangeNotifier)

| Getter | Type | Source |
|---|---|---|
| `otp` | `String` | `_otp` |
| `secondsLeft` | `int` | `_secondsLeft` |
| `initialDuration` | `int` | `_initialDuration` |
| `isRotating` | `bool` | `_isRotating` |

---

## 17. Error Handling

### 17.1 OTP Fetch Errors

| Error | Code | Handling |
|---|---|---|
| `SLOT_NOT_CURRENT` | 400 | "This class is not currently in session." |
| `ALREADY_ACTIVE` | 409 | "A session is already active. End it first." |
| `AUTH_REQUIRED` | 401 | "Authentication expired. Please log in again." |
| `Course not found` | 404 | "Course not assigned to you." |
| Network timeout | — | "Server unavailable. Check your connection." |
| Server error | 500/502/503 | "Server error. Please try again." |

### 17.2 Friendly Error Mapping

```dart
String _friendlyError(Object e) {
  final msg = e.toString();
  if (msg.contains('SLOT_NOT_CURRENT'))  return 'This class is not currently in session.';
  if (msg.contains('ALREADY_ACTIVE'))    return 'A session is already active. End it first.';
  if (msg.contains('AUTH') || msg.contains('401')) return 'Authentication expired. Please log in again.';
  if (msg.contains('NOT_FOUND') || msg.contains('404')) return 'Course not assigned to you.';
  if (msg.contains('timeout') || msg.contains('Connection')) return 'Server unavailable. Check your connection.';
  if (msg.contains('500') || msg.contains('502') || msg.contains('503')) return 'Server error. Please try again.';
  // Strip "Exception: " prefix, truncate to 80 chars
}
```

### 17.3 WebSocket Reconnection

```dart
// Exponential backoff
_reconnectDelaySec = (_reconnectDelaySec * 2).clamp(1, 30);
// Sequence: 1s → 2s → 4s → 8s → 16s → 30s (cap)

// Connection states broadcast via StreamController
enum WsConnectionState { disconnected, connecting, connected, reconnecting }
```

### 17.4 OTP Refresh Errors

| Scenario | Handling |
|---|---|
| Refresh returns null | `_refreshFailed = true`, button re-enabled |
| Network error | `_refreshFailed = true`, SnackBar error |
| Session closed (410) | Screen displays error, navigation back |
| Concurrent refresh guard | `if (_isRefreshing) return;` |

---

## 18. Offline Behavior

### 18.1 What Works Offline

| Feature | Works? | Notes |
|---|---|---|
| Display cached OTP | Yes | OTP is stored in widget state |
| Countdown timer | Yes | Local `Timer.periodic` |
| Rolling digit animation | Yes | Pure Flutter animation |
| Manual refresh | No | Requires server call |
| WS connection | No | Requires network |
| Board verification | No | Requires WS |
| Activation polling | No | Requires server call |

### 18.2 Offline Recovery

- If WS disconnects during session, exponential backoff reconnect is automatic
- If faculty goes offline after OTP display, the OTP remains visible but cannot be refreshed
- If board goes offline, `BOARD_RECOVERED` FCM will re-mark slot as ready
- `FacultyHydrationService.syncIfNeeded()` can be triggered by `SILENT_SYNC_PING` FCM to refresh local cache

### 18.3 Offline States in UI

- WS connection state is displayed via the connection status indicator
- "Waiting for SmartBoard" (teal) → "Verifying..." (orange) → "Board Connected" (green)
- If WS cannot connect, indicator stays at "Waiting for SmartBoard"
