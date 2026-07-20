# VOLUME 08: OFFLINE ARCHITECTURE & SYNC

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Offline Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Offline-First | App fully functional without network |
| Graceful Degradation | Features degrade progressively as connectivity worsens |
| Automatic Sync | Background sync when connectivity returns |
| Conflict Resolution | Server timestamp wins, client notified |
| Data Integrity | Never lose attendance data |

### 1.2 Connectivity States

| State | Description | Behavior |
|-------|-------------|----------|
| `online` | Full connectivity | Real-time API calls + WebSocket |
| `wifi_only` | WiFi available, no mobile data | Full functionality |
| `limited` | Intermittent connectivity | Queue operations, retry |
| `offline` | No connectivity | Local cache only |

---

## 2. Offline Queue System

### 2.1 Queue Structure

```dart
class OfflineQueue {
  final Hive box;
  final String boxName = 'offline_queue';

  Future<void> initialize() async {
    await Hive.openBox(boxName);
  }

  Future<void> enqueue(OfflineOperation operation) async {
    final box = Hive.box(boxName);
    await box.add({
      'id': operation.id,
      'type': operation.type,
      'payload': operation.payload,
      'timestamp': operation.timestamp.toIso8601String(),
      'retryCount': 0,
      'maxRetries': 3,
      'status': 'pending',
      'createdAt': DateTime.now().toIso8601String(),
    });
  }

  Future<List<OfflineOperation>> getPending() async {
    final box = Hive.box(boxName);
    return box.values
        .where((op) => op['status'] == 'pending')
        .map((op) => OfflineOperation.fromMap(op))
        .toList();
  }

  Future<void> markSynced(String operationId) async {
    final box = Hive.box(boxName);
    final key = box.keys.firstWhere((k) => box.get(k)['id'] == operationId);
    await box.put(key, {
      ...box.get(key),
      'status': 'synced',
      'syncedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> markFailed(String operationId, String error) async {
    final box = Hive.box(boxName);
    final key = box.keys.firstWhere((k) => box.get(k)['id'] == operationId);
    final op = box.get(key);
    
    if (op['retryCount'] >= op['maxRetries']) {
      await box.put(key, {
        ...op,
        'status': 'failed',
        'error': error,
        'failedAt': DateTime.now().toIso8601String(),
      });
    } else {
      await box.put(key, {
        ...op,
        'retryCount': op['retryCount'] + 1,
        'lastRetryAt': DateTime.now().toIso8601String(),
      });
    }
  }

  Future<void> clear() async {
    final box = Hive.box(boxName);
    await box.clear();
  }
}
```

### 2.2 Operation Types

```dart
enum OfflineOperationType {
  markAttendance,      // Student marks attendance
  createSession,       // Faculty creates session
  startSession,        // Faculty starts session
  endSession,          // Faculty ends session
  overrideAttendance,  // Faculty overrides record
  updateProfile,       // User updates profile
}
```

### 2.3 Operation Model

```dart
class OfflineOperation {
  final String id;
  final OfflineOperationType type;
  final Map<String, dynamic> payload;
  final DateTime timestamp;
  final int retryCount;
  final int maxRetries;
  final OfflineOperationStatus status;
  final String? error;

  OfflineOperation({
    required this.id,
    required this.type,
    required this.payload,
    required this.timestamp,
    this.retryCount = 0,
    this.maxRetries = 3,
    this.status = OfflineOperationStatus.pending,
    this.error,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'type': type.name,
    'payload': payload,
    'timestamp': timestamp.toIso8601String(),
    'retryCount': retryCount,
    'maxRetries': maxRetries,
    'status': status.name,
    'error': error,
  };

  factory OfflineOperation.fromMap(Map<String, dynamic> map) => OfflineOperation(
    id: map['id'],
    type: OfflineOperationType.values.byName(map['type']),
    payload: map['payload'],
    timestamp: DateTime.parse(map['timestamp']),
    retryCount: map['retryCount'],
    maxRetries: map['maxRetries'],
    status: OfflineOperationStatus.values.byName(map['status']),
    error: map['error'],
  );
}

enum OfflineOperationStatus {
  pending,
  syncing,
  synced,
  failed
}
```

---

## 3. Sync Service

### 3.1 Sync Manager

```dart
class SyncService {
  final OfflineQueue _queue;
  final ConnectivityService _connectivity;
  final ApiService _api;
  Timer? _syncTimer;

  SyncService({
    required OfflineQueue queue,
    required ConnectivityService connectivity,
    required ApiService api,
  })  : _queue = queue,
        _connectivity = connectivity,
        _api = api;

  void initialize() {
    // Listen for connectivity changes
    _connectivity.onConnectivityChanged.listen((status) {
      if (status == ConnectivityStatus.online) {
        _startSync();
      }
    });

    // Start periodic sync (every 5 minutes)
    _syncTimer = Timer.periodic(
      Duration(minutes: 5),
      (_) => _syncIfNeeded(),
    );
  }

  Future<void> _syncIfNeeded() async {
    if (_connectivity.status != ConnectivityStatus.online) return;
    await _startSync();
  }

  Future<void> _startSync() async {
    final pending = await _queue.getPending();
    if (pending.isEmpty) return;

    for (final operation in pending) {
      await _processOperation(operation);
    }
  }

  Future<void> _processOperation(OfflineOperation operation) async {
    try {
      // Mark as syncing
      await _queue.updateStatus(operation.id, OfflineOperationStatus.syncing);

      // Execute operation
      switch (operation.type) {
        case OfflineOperationType.markAttendance:
          await _api.markAttendance(operation.payload);
          break;
        case OfflineOperationType.createSession:
          await _api.createSession(operation.payload);
          break;
        case OfflineOperationType.startSession:
          await _api.startSession(operation.payload['sessionId']);
          break;
        case OfflineOperationType.endSession:
          await _api.endSession(operation.payload['sessionId']);
          break;
        case OfflineOperationType.overrideAttendance:
          await _api.overrideAttendance(
            operation.payload['recordId'],
            operation.payload,
          );
          break;
        case OfflineOperationType.updateProfile:
          await _api.updateProfile(operation.payload);
          break;
      }

      // Mark as synced
      await _queue.markSynced(operation.id);
    } catch (e) {
      // Mark as failed
      await _queue.markFailed(operation.id, e.toString());
    }
  }

  void dispose() {
    _syncTimer?.cancel();
  }
}
```

### 3.2 Retry Strategy

| Attempt | Delay | Backoff |
|---------|-------|---------|
| 1st | Immediate | - |
| 2nd | 30 seconds | Linear |
| 3rd | 2 minutes | Exponential |
| 4th+ | Mark as failed | Manual intervention |

---

## 4. Offline Data Cache

### 4.1 Cache Strategy

| Data Type | Cache Duration | Sync Frequency |
|-----------|----------------|----------------|
| User Profile | 24 hours | On login |
| Sessions | 7 days | Every 5 minutes |
| Attendance Records | 7 days | On sync |
| Courses | 7 days | On login |
| Notifications | 24 hours | Every 5 minutes |
| Dashboard Data | 5 minutes | Every 5 minutes |

### 4.2 Cache Implementation

```dart
class CacheService {
  final Hive _cacheBox;

  CacheService({required Hive cacheBox}) : _cacheBox = cacheBox;

  Future<void> cacheData<T>({
    required String key,
    required T data,
    required Duration ttl,
  }) async {
    final cacheEntry = CacheEntry(
      data: data,
      cachedAt: DateTime.now(),
      expiresAt: DateTime.now().add(ttl),
    );
    await _cacheBox.put(key, cacheEntry.toMap());
  }

  Future<T?> getCached<T>({
    required String key,
    required T Function(Map<String, dynamic>) fromMap,
  }) async {
    final entry = _cacheBox.get(key);
    if (entry == null) return null;

    final cacheEntry = CacheEntry.fromMap(entry);
    if (cacheEntry.isExpired) {
      await _cacheBox.delete(key);
      return null;
    }

    return fromMap(cacheEntry.data);
  }

  Future<void> invalidate(String key) async {
    await _cacheBox.delete(key);
  }

  Future<void> invalidateAll() async {
    await _cacheBox.clear();
  }
}

class CacheEntry {
  final dynamic data;
  final DateTime cachedAt;
  final DateTime expiresAt;

  CacheEntry({
    required this.data,
    required this.cachedAt,
    required this.expiresAt,
  });

  bool get isExpired => DateTime.now().isAfter(expiresAt);

  Map<String, dynamic> toMap() => {
    'data': data,
    'cachedAt': cachedAt.toIso8601String(),
    'expiresAt': expiresAt.toIso8601String(),
  };

  factory CacheEntry.fromMap(Map<String, dynamic> map) => CacheEntry(
    data: map['data'],
    cachedAt: DateTime.parse(map['cachedAt']),
    expiresAt: DateTime.parse(map['expiresAt']),
  );
}
```

---

## 5. Offline Attendance Flow

### 5.1 Student Marks Attendance Offline

```
Student App                 Local Cache              Server
    │                           │                      │
    │  1. Scan QR               │                      │
    │──────────────────────────>│                      │
    │                           │                      │
    │  2. Validate QR locally   │                      │
    │  (check expiration)       │                      │
    │                           │                      │
    │  3. Add to offline queue  │                      │
    │──────────────────────────>│                      │
    │                           │                      │
    │  4. Show "Pending Sync"   │                      │
    │<──────────────────────────│                      │
    │                           │                      │
    │  [Later, connectivity]    │                      │
    │                           │                      │
    │  5. Sync starts           │                      │
    │──────────────────────────>│                      │
    │                           │  6. POST /attendance/mark
    │                           │─────────────────────>│
    │                           │                      │
    │                           │  7. Success response │
    │                           │<─────────────────────│
    │                           │                      │
    │  8. Update local status   │                      │
    │<──────────────────────────│                      │
```

### 5.2 Conflict Resolution

| Scenario | Resolution |
|----------|------------|
| Duplicate attendance | Server rejects, client notified |
| Session ended while offline | Mark as "late" if within grace, "absent" otherwise |
| QR expired while offline | Reject, prompt new QR scan |
| Server timestamp differs | Server timestamp wins |
| Data integrity check fails | Log error, notify admin |

---

## 6. Connectivity Monitoring

### 6.1 Connectivity Service

```dart
class ConnectivityService {
  final StreamController<ConnectivityStatus> _controller =
      StreamController<ConnectivityStatus>.broadcast();
  
  Stream<ConnectivityStatus> get onConnectivityChanged => _controller.stream;
  ConnectivityStatus _status = ConnectivityStatus.offline;

  ConnectivityStatus get status => _status;

  void initialize() {
    // Check initial connectivity
    _checkConnectivity();

    // Listen for changes
    Connectivity().onConnectivityChanged.listen((result) {
      _updateStatus(result);
    });
  }

  void _checkConnectivity() async {
    final result = await Connectivity().checkConnectivity();
    _updateStatus(result);
  }

  void _updateStatus(ConnectivityResult result) {
    switch (result) {
      case ConnectivityResult.wifi:
        _status = ConnectivityStatus.wifi;
        break;
      case ConnectivityResult.mobile:
        _status = ConnectivityStatus.online;
        break;
      case ConnectivityResult.none:
        _status = ConnectivityStatus.offline;
        break;
      default:
        _status = ConnectivityStatus.offline;
    }
    _controller.add(_status);
  }
}

enum ConnectivityStatus {
  online,
  wifi,
  offline
}
```

---

## 7. Offline UI Indicators

### 7.1 Status Banner

```dart
class ConnectivityBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<ConnectivityService>(
      builder: (context, connectivity, child) {
        if (connectivity.status == ConnectivityStatus.offline) {
          return Container(
            color: Colors.orange,
            padding: EdgeInsets.all(8),
            child: Row(
              children: [
                Icon(Icons.cloud_off, color: Colors.white),
                SizedBox(width: 8),
                Text(
                  'Offline Mode - Changes will sync when connected',
                  style: TextStyle(color: Colors.white),
                ),
              ],
            ),
          );
        }
        return SizedBox.shrink();
      },
    );
  }
}
```

### 7.2 Pending Sync Indicator

```dart
class PendingSyncBadge extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<OfflineQueue>(
      builder: (context, queue, child) {
        final pendingCount = queue.pendingCount;
        if (pendingCount == 0) return SizedBox.shrink();

        return Badge(
          label: Text('$pendingCount'),
          child: Icon(Icons.sync_problem),
        );
      },
    );
  }
}
```

---

*All offline operations must be idempotent. Use UUIDs for operation deduplication. Never lose attendance data due to connectivity issues.*