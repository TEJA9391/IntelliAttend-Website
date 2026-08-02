# IntelliAttend SmartBoard - Production Deployment & Test Report

**Date:** July 21, 2026  
**Target Machine:** 172.16.7.189 (MAXHUB Smart Board)  
**Software Version:** intelliattend_smartboard v5.5.0.11  
**Tested By:** Automated deployment via plink SSH  

---

## 1. PRODUCTION MACHINE SPECIFICATIONS

| Component | Value | Assessment |
|-----------|-------|------------|
| **Hostname** | CSE4-4005 | - |
| **OS** | Windows 10 IoT Enterprise LTSC 10.0.19044 (Build 19044) | Supported |
| **Architecture** | 64-bit | Compatible |
| **CPU** | 11th Gen Intel Core i5-11320H @ 3.20GHz (4 cores / 8 threads) | Excellent |
| **RAM** | 7.68 GB | Sufficient (Flutter needs ~500MB) |
| **Primary GPU** | Intel Iris Xe Graphics (1024 MB shared) | Compatible |
| **Secondary GPU** | "Sharing Monitor" (ROOT\DISPLAY\0000, 0 MB VRAM) | **CONCERN** |
| **Display** | 3840x2160 @ 60Hz (4K) | Compatible |
| **Disk C:** | 69.81 GB free / 150 GB total | Sufficient |
| **Disk D:** | 62.37 GB free / 67.72 GB total | Available |
| **Disk E:** | 11.66 GB free / 19.99 GB total | Available |
| **Intel GPU Driver** | 31.0.101.4146 (Feb 22, 2023) | **OUTDATED** |
| **Sharing Monitor Driver** | 11.28.49.440 (Aug 25, 2022) | Unknown device |
| **.NET Runtime** | Not found at default path (exists at x86) | Not needed for Flutter |
| **Windows Defender** | Real-time protection DISABLED | N/A |
| **VC++ Redistributable** | v14.29.30156 installed | Sufficient |

---

## 2. DOWNLOAD PROCESS

| Step | Status | Details |
|------|--------|---------|
| API endpoint reachable | **PARTIAL** | `https://api.intelliattend.app/api/v1/board/download/latest` returns 405 on HEAD, 200 on GET |
| Download via `Invoke-WebRequest` | SUCCESS | 18.79 MB MSI downloaded successfully |
| TLS 1.2 | SUCCESS | Cloudflare-fronted (ips: 104.21.22.87, 172.67.203.194) |
| DNS Resolution | SUCCESS | Resolves to Cloudflare IPs |
| Download to production machine | SUCCESS | Downloaded directly on production via PowerShell |

**Issues:**
- The download endpoint does not support HEAD requests (returns 405). This prevents proper content-length pre-checks and resume support.

---

## 3. INSTALLATION PROCESS

| Step | Status | Details |
|------|--------|---------|
| Previous install detected | YES | v5.5.0.11 was already installed |
| Uninstall existing (MSI) | **FAILED** | Error 1619 - "This installation package could not be opened" |
| Uninstall via WMI | SUCCESS | Product removed via Win32_Product |
| Clean directory removal | SUCCESS | All files removed manually |
| Fresh MSI install (silent) | SUCCESS | Exit code 0, `msiexec /i MSI /qn /norestart` |
| EXE present after install | SUCCESS | 174,080 bytes at expected path |
| VC++ Runtime dependency | SATISFIED | v14.29.30156 present |

**Issues:**
- The old MSI uninstaller fails with error 1619 because the original MSI file path is no longer valid. This means upgrades via `msiexec /x` will fail - only clean reinstalls work.
- Install requires manual cleanup of leftover files when the original MSI is unavailable.
- Install works without elevation (admin) on this machine.

---

## 4. CONFIGURATION (.env)

| Variable | Value | Status |
|----------|-------|--------|
| `API_BASE_URL` | `https://api.intelliattend.app` | Correct |
| `LOCAL_API_URL` | `http://127.0.0.1:8000/v1/board/telemetry` | **CONCERN** - no local service running |
| `FIREBASE_API_KEY` | `AIzaSyBooFadQf3TZFvZOUJkihMUdgexrbeoQnE` | Set |
| `FIREBASE_PROJECT_ID` | `intelliattend-a2564` | Set |
| `FIREBASE_APP_ID` | `1:738499328288:web:c345f44de9d8393062ff45` | Set |
| `FIREBASE_MESSAGING_SENDER_ID` | `738499328288` | Set |
| `SSL_PIN_FINGERPRINT` | (empty) | Certificate pinning disabled (warning logged) |
| `ENABLE_DOCUMENTS` | `true` | Set |
| `DEBUG` | `true` | **CONCERN** - should be `false` in production |

**Issues:**
- `DEBUG=true` should be set to `false` for production deployment.
- `LOCAL_API_URL` points to `127.0.0.1:8000` but no local service is running on this port. If the board telemetry service is required, it needs to be deployed.
- `SSL_PIN_FINGERPRINT` is empty, meaning certificate pinning is disabled. This is a security concern for a production environment.
- The `.env` file path is at `flutter_assets/.env` which is inside the application binary directory. Any app update will overwrite this file.

---

## 5. APPLICATION LAUNCH & RUNTIME

### CRITICAL BLOCKER: GPU Rendering Failure (Exit Code 1)

The application launches but **immediately crashes** due to GPU rendering failures:

```
[ERROR:flutter/shell/platform/windows/direct_manipulation.cc(202)] 
  manager_->Activate(window_->GetWindowHandle()) failed

ERR: SwapChain11.cpp:640: Could not create additional swap chains or 
  offscreen surfaces, HRESULT: 0x887A0022

ERR: SwapChain11.cpp:647: Device lost in SwapChain11::reset 
  HRESULT: 0x887A0022

[ERROR:flutter/shell/platform/windows/egl/egl.cc(57)] 
  EGL Error: Context Lost (12302) Surface creation failed.

[ERROR:flutter/shell/platform/windows/egl/egl.cc(57)] 
  EGL Error: Context Lost (12302) in context.cc:33

[ERROR:flutter/shell/platform/embedder/embedder_surface_gl_skia.cc(121)] 
  Could not create a resource context for async texture uploads.

[ERROR:flutter/shell/gpu/gpu_surface_gl_skia.cc(46)] 
  Could not make the context current to set up the Gr context.

[ERROR:flutter/shell/platform/windows/egl/egl.cc(57)] 
  EGL Error: Context Lost (12302) in context.cc:33

[ERROR:flutter/shell/platform/windows/egl/egl.cc(57)] 
  EGL Error: Context Lost (12302) in context.cc:33

[ERROR:flutter/shell/common/platform_view.cc(76)] 
  Failed to create platform view rendering surface
```

**Root Cause:** `HRESULT: 0x887A0022` = `DXGI_ERROR_DEVICE_REMOVED` - The DirectX/Direct3D device was lost, preventing Flutter from creating a rendering surface.

**After crash, the EXE self-deletes from the install directory.** This is observed when launched from the install path but NOT when launched from a different location (Desktop).

### App Log Output (before crash)
```json
{"level":"warning","message":"[AppConfig] SSL_PIN_FINGERPRINT not set — certificate pinning disabled.","service":"smartboard","version":"","environment":"production"}
{"level":"warning","message":"[Heartbeat] Token refresh failed; will retry next beat: Kiosk credentials not found. Route to onboarding.","service":"smartboard","version":"5.5.0+11","environment":"production"}
```

**Analysis:** The app boots far enough to:
1. Read the `.env` configuration
2. Log SSL pinning warning
3. Attempt heartbeat/token refresh
4. Then crash on the first frame render

---

## 6. ROOT CAUSE ANALYSIS - GPU CRASH

### Primary Theory: Dual GPU Conflict

The machine has **two display adapters**:
1. **Intel Iris Xe Graphics** (actual GPU, PCI\VEN_8086, driver 31.0.101.4146)
2. **"Sharing Monitor"** (virtual/display adapter, ROOT\DISPLAY\0000, driver 11.28.49.440)

The "Sharing Monitor" adapter appears to be a **virtual display driver** (possibly from MAXHUB display sharing software) with:
- Device ID: `ROOT\DISPLAY\0000` (software-emulated, not hardware)
- 0 MB VRAM
- No resolution/refresh rate reported
- Unknown driver (11.28.49.440 - not a standard Intel/NVIDIA/AMD driver)

**Flutter's GPU initialization may be selecting the wrong adapter** (the "Sharing Monitor" instead of Intel Iris Xe), causing the DirectX device to be lost immediately.

### Contributing Factors
1. **Outdated Intel GPU driver** (Feb 2023, over 3 years old) - May have EGL/DirectX compatibility issues with current Flutter
2. **4K resolution** (3840x2160) - Higher GPU memory pressure
3. **No .NET runtime** at the standard path (only x86 version) - unlikely to matter for Flutter
4. **The EXE self-deletes after crash** - This is abnormal behavior. Possible causes:
   - MSI repair/reconfiguration triggered by the crash
   - The 174KB exe is a **stub launcher** that extracts to a temp location
   - Some cleanup mechanism in the app or OS

---

## 7. NETWORK & API

| Test | Result | Details |
|------|--------|---------|
| Ping (172.16.7.189) | SUCCESS | 24-36ms latency |
| SSH (port 22) | SUCCESS | OpenSSH server running |
| API DNS resolution | SUCCESS | Resolves to Cloudflare IPs |
| API HTTPS (GET) | SUCCESS | 200 OK (download works) |
| API HTTPS (HEAD) | **405** | Method not allowed |
| Local telemetry (127.0.0.1:8000) | **NOT TESTED** | No service running on port |

---

## 8. PRODUCTION READINESS ASSESSMENT

### BLOCKERS (Must fix before deployment)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 1 | **GPU rendering crash** - App fails to start on production hardware | **CRITICAL** | App unusable |
| 2 | **EXE self-deletion after crash** - Corrupts installation | **HIGH** | Requires reinstall after every crash |
| 3 | **DEBUG=true in production** | **MEDIUM** | Security risk, performance impact |

### CONCERNS (Should fix)

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 4 | SSL certificate pinning disabled | MEDIUM | Man-in-the-middle vulnerability |
| 5 | LOCAL_API_URL points to non-existent local service | MEDIUM | Telemetry data lost |
| 6 | MSI uninstall fails (error 1619) when original MSI unavailable | MEDIUM | Upgrades problematic |
| 7 | .env stored inside app directory (overwritten on update) | MEDIUM | Configuration loss on update |
| 8 | Intel GPU driver is 3+ years outdated | LOW | May cause rendering issues |
| 9 | "Sharing Monitor" virtual display adapter conflict | LOW | May confuse GPU selection |

### RECOMMENDATIONS

1. **GPU Fix (CRITICAL):**
   - Update Intel Iris Xe Graphics driver to latest version (Intel Arc driver 32.0.101.x or newer)
   - Investigate or remove the "Sharing Monitor" virtual display adapter
   - Consider adding GPU adapter preference logic in the app (force Intel Iris Xe)
   - Test with software rendering fallback (`--enable-software-rendering` flag or equivalent)
   - If the MAXHUB display sharing is needed, ensure the virtual driver doesn't interfere with DirectX

2. **Self-Deletion Fix (HIGH):**
   - Investigate why the 174KB exe deletes itself after a failed launch from the install directory
   - The exe may be a stub launcher - verify it's a true Flutter Windows build, not a wrapper
   - Ensure the MSI installs the actual Flutter Windows build output (not just a launcher)

3. **Configuration (MEDIUM):**
   - Move `.env` to a persistent location outside the app directory (e.g., `%APPDATA%\IntelliAttend\`)
   - Set `DEBUG=false` for production
   - Either deploy the local telemetry service or remove `LOCAL_API_URL`
   - Implement SSL certificate pinning with the actual server certificate fingerprint

4. **Installation (MEDIUM):**
   - Fix MSI to include proper uninstall support (self-contained MSI)
   - Consider using a custom installer instead of MSI for better upgrade/downgrade support
   - Add a configuration wizard for first-run setup instead of hardcoded `.env`

5. **API (LOW):**
   - Add HEAD method support to the download endpoint
   - Add version/check endpoint to verify latest version before download

---

## 9. TEST LOG SUMMARY

```
11:37:04 - System compatibility check: PASS (CPU, RAM, Disk OK)
11:37:04 - GPU: Sharing Monitor + Intel Iris Xe detected
11:37:05 - .NET: Not at standard path (not needed)
11:37:08 - Download: SUCCESS (18.79 MB)
11:37:08 - Uninstall existing: FAILED (error 1619)
11:37:14 - Kill running instances: SUCCESS
11:37:14 - Install MSI (no elevation): SUCCESS (exit 0)
11:37:19 - EXE verified: 174,080 bytes, 07/18/2026
11:37:19 - .env written: SUCCESS
11:37:19 - App launched: Start-Process SUCCESS
11:37:34 - Process check: NOT RUNNING (15s elapsed)
11:43:28 - EXE self-deletion confirmed
11:55:00 - Direct exe launch with output capture: 
           CRASH - Exit Code 1 - GPU rendering failure
           DXGI_ERROR_DEVICE_REMOVED (0x887A0022)
           EGL Context Lost (12302)
           Failed to create platform view rendering surface
```

---

**CONCLUSION:** The IntelliAttend SmartBoard v5.5.0.11 **cannot run** on this production machine due to a GPU rendering failure. The application crashes immediately on launch with DirectX/EGL context loss errors. This is likely caused by a conflict between the Intel Iris Xe GPU and the "Sharing Monitor" virtual display adapter, compounded by an outdated GPU driver. The app also exhibits abnormal self-deletion behavior after crashing. **Deployment is BLOCKED until the GPU rendering issue is resolved.**
