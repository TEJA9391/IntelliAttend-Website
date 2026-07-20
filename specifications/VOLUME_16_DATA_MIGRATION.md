# VOLUME 16: DATA MIGRATION & BACKWARD COMPATIBILITY

**Version:** 1.0
**Date:** 2026-07-19
**Status:** Draft
**Project:** IntelliAttend — Smart Campus Attendance Management System

---

## 1. Migration Philosophy

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| Zero Downtime | Migrations without service interruption |
| Backward Compatible | New versions work with old data |
| Forward Compatible | Old versions handle new data gracefully |
| Idempotent | Migrations can be run multiple times safely |
| Auditable | All migrations logged and traceable |

---

## 2. Versioning Strategy

### 2.1 API Versioning

```
/api/v1/...  (Current)
/api/v2/...  (Future major version)
```

### 2.2 Client Versioning

```dart
class AppVersion {
  static const String current = '1.0.0';
  static const int buildNumber = 1;
  static const int minSupportedVersion = 1; // Minimum supported API version
  static const int maxSupportedVersion = 1; // Maximum supported API version
}
```

### 2.3 Data Model Versioning

```dart
class VersionedModel {
  final int schemaVersion;
  
  VersionedModel({required this.schemaVersion});
  
  Map<String, dynamic> toFirestore() {
    return {
      ...toJson(),
      '_schemaVersion': schemaVersion,
    };
  }
  
  factory VersionedModel.fromFirestore(Map<String, dynamic> data) {
    final version = data['_schemaVersion'] ?? 1;
    
    switch (version) {
      case 1:
        return ModelV1.fromFirestore(data);
      case 2:
        return ModelV2.fromFirestore(data);
      default:
        return ModelV1.fromFirestore(data); // Default to latest
    }
  }
}
```

---

## 3. Firestore Migration Scripts

### 3.1 Migration Framework

```python
# migrations/migration_runner.py
class MigrationRunner:
    def __init__(self):
        self.migrations = []
    
    def register(self, migration):
        self.migrations.append(migration)
    
    def run(self, target_version=None):
        for migration in sorted(self.migrations, key=lambda m: m.version):
            if target_version and migration.version > target_version:
                break
            
            if not migration.applied():
                print(f"Running migration {migration.version}: {migration.name}")
                migration.up()
                migration.mark_applied()
                print(f"Migration {migration.version} completed")
```

### 3.2 Sample Migration

```python
# migrations/001_add_schema_version.py
class Migration001(Migration):
    version = 1
    name = "Add schema version to all documents"
    
    def up(self):
        # Add _schemaVersion to all user documents
        db = firestore.client()
        
        # Users
        for doc in db.collection('users').stream():
            doc.reference.update({'_schemaVersion': 1})
        
        # Sessions
        for doc in db.collection('sessions').stream():
            doc.reference.update({'_schemaVersion': 1})
        
        # Attendance
        for doc in db.collection('attendance').stream():
            doc.reference.update({'_schemaVersion': 1})
    
    def down(self):
        # Remove _schemaVersion (rollback)
        db = firestore.client()
        
        for collection in ['users', 'sessions', 'attendance']:
            for doc in db.collection(collection).stream():
                doc.reference.update({'_schemaVersion': firestore.DELETE_FIELD})
```

### 3.3 Migration Registry

```python
# migrations/__init__.py
from migration_runner import MigrationRunner
from migrations.001_add_schema_version import Migration001
from migrations.002_add_trust_score import Migration002

runner = MigrationRunner()
runner.register(Migration001())
runner.register(Migration002())

if __name__ == '__main__':
    runner.run()
```

---

## 4. Client-Side Migration

### 4.1 Hive Box Migration

```dart
class HiveMigration {
  static Future<void> migrate() async {
    final currentVersion = await _getCurrentVersion();
    
    if (currentVersion < 1) {
      await _migrateToV1();
    }
    
    if (currentVersion < 2) {
      await _migrateToV2();
    }
    
    await _setCurrentVersion(2);
  }
  
  static Future<void> _migrateToV1() async {
    // Migration 1: Add trust score to student profiles
    final box = Hive.box('students');
    for (var key in box.keys) {
      final data = box.get(key);
      if (data != null && !data.containsKey('trustScore')) {
        await box.put(key, {
          ...data,
          'trustScore': 50.0, // Default value
        });
      }
    }
  }
  
  static Future<void> _migrateToV2() async {
    // Migration 2: Restructure attendance records
    final box = Hive.box('attendance');
    for (var key in box.keys) {
      final data = box.get(key);
      if (data != null && data.containsKey('studentId')) {
        // Rename studentId to studentUserId
        await box.put(key, {
          ...data,
          'studentUserId': data['studentId'],
        });
        await box.delete(key);
      }
    }
  }
}
```

### 4.2 Shared Preferences Migration

```dart
class SharedPreferencesMigration {
  static Future<void> migrate() async {
    final prefs = await SharedPreferences.getInstance();
    final currentVersion = prefs.getInt('migration_version') ?? 0;
    
    if (currentVersion < 1) {
      await _migrateToV1(prefs);
    }
    
    await prefs.setInt('migration_version', 1);
  }
  
  static Future<void> _migrateToV1(SharedPreferences prefs) async {
    // Migration 1: Rename notification preferences
    final oldEnabled = prefs.getBool('notifications_enabled');
    if (oldEnabled != null) {
      await prefs.setBool('push_notifications_enabled', oldEnabled);
      await prefs.remove('notifications_enabled');
    }
  }
}
```

---

## 5. API Backward Compatibility

### 5.1 Response Transformation

```python
# api/transformers/response_transformer.py
class ResponseTransformer:
    def transform(self, data, api_version, client_version):
        if api_version == 1 and client_version < 2:
            return self._transformV1(data)
        return data
    
    def _transformV1(self, data):
        # Transform response for older clients
        if 'attendancePercentage' in data:
            data['attendance_rate'] = data.pop('attendancePercentage')
        return data
```

### 5.2 Field Deprecation

```python
# api/models/deprecated_fields.py
class DeprecatedFields:
    DEPRECATED = {
        'v1': ['old_field_1', 'old_field_2'],
        'v2': ['deprecated_field'],
    }
    
    @classmethod
    def filter(cls, data, api_version):
        deprecated = []
        for version in range(1, api_version):
            deprecated.extend(cls.DEPRECATED.get(f'v{version}', []))
        
        return {k: v for k, v in data.items() if k not in deprecated}
```

---

## 6. Data Sync Compatibility

### 6.1 Offline Queue Migration

```dart
class OfflineQueueMigration {
  static Future<void> migrateQueue() async {
    final box = Hive.box('offline_queue');
    final entries = box.values.toList();
    
    for (var entry in entries) {
      if (entry['version'] == null || entry['version'] < 2) {
        // Migrate entry to version 2
        final migrated = {
          ...entry,
          'version': 2,
          'metadata': {
            ...entry['metadata'],
            'migratedAt': DateTime.now().toIso8601String(),
          },
        };
        
        final key = box.keys.firstWhere((k) => box.get(k)['id'] == entry['id']);
        await box.put(key, migrated);
      }
    }
  }
}
```

### 6.2 Cache Invalidation

```dart
class CacheInvalidation {
  static Future<void> invalidateOnUpgrade(int fromVersion, int toVersion) async {
    // Determine which caches need invalidation
    final cachesToInvalidate = _getCachesToInvalidate(fromVersion, toVersion);
    
    for (final cacheName in cachesToInvalidate) {
      await _invalidateCache(cacheName);
    }
  }
  
  static List<String> _getCachesToInvalidate(int from, int to) {
    final caches = <String>[];
    
    // Version-specific invalidation rules
    if (from < 2 && to >= 2) {
      caches.add('attendance_records');
      caches.add('student_profiles');
    }
    
    return caches;
  }
  
  static Future<void> _invalidateCache(String cacheName) async {
    final box = Hive.box(cacheName);
    await box.clear();
  }
}
```

---

## 7. Rollback Procedures

### 7.1 API Rollback

```python
# rollback/api_rollback.py
class APIRollback:
    def rollback(self, from_version, to_version):
        print(f"Rolling back from v{from_version} to v{to_version}")
        
        # 1. Switch to previous API version
        self._switch_api_version(to_version)
        
        # 2. Restore previous database schema
        self._restore_database_schema(to_version)
        
        # 3. Invalidate client caches
        self._invalidate_caches()
        
        # 4. Notify monitoring
        self._notify_rollback(from_version, to_version)
    
    def _switch_api_version(self, version):
        # Update routing to use previous version
        pass
    
    def _restore_database_schema(self, version):
        # Run reverse migrations
        pass
```

### 7.2 Client Rollback

```dart
class ClientRollback {
  static Future<void> rollback(int fromVersion, int toVersion) async {
    // 1. Restore previous Hive boxes
    await _restoreHiveBoxes(toVersion);
    
    // 2. Clear incompatible caches
    await _clearIncompatibleCaches(fromVersion, toVersion);
    
    // 3. Reset settings
    await _resetSettings(toVersion);
  }
  
  static Future<void> _restoreHiveBoxes(int version) async {
    // Restore from backup if available
    final backup = await _getBackup(version);
    if (backup != null) {
      await _restoreFromBackup(backup);
    }
  }
}
```

---

## 8. Testing Migrations

### 8.1 Migration Tests

```python
# tests/test_migrations.py
class TestMigrations:
    def test_migration_001(self):
        # Setup
        db = firestore.client()
        db.collection('users').document('test').set({
            'name': 'Test User',
        })
        
        # Run migration
        migration = Migration001()
        migration.up()
        
        # Verify
        doc = db.collection('users').document('test').get()
        assert doc.to_dict()['_schemaVersion'] == 1
    
    def test_migration_rollback(self):
        # Setup with migrated data
        db = firestore.client()
        db.collection('users').document('test').set({
            'name': 'Test User',
            '_schemaVersion': 1,
        })
        
        # Rollback
        migration = Migration001()
        migration.down()
        
        # Verify
        doc = db.collection('users').document('test').get()
        assert '_schemaVersion' not in doc.to_dict()
```

---

*Always test migrations in staging before production. Have a rollback plan for every migration.*