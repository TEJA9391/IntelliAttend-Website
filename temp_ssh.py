import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('172.16.7.189', username='maxhub', password='123456', timeout=10)
print("SSH connected.\n")

def run(cmd, timeout=60):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    return out, err

msi = r"C:\Users\MAXHUB\Downloads\intelliattend_smartboard.msi"
exe = r"C:\Users\MAXHUB\AppData\Local\intelliattend_smartboard\intelliattend_smartboard.exe"
extracted_exe = r"C:\Users\MAXHUB\Downloads\msi_extracted\intelliattend_smartboard\intelliattend_smartboard.exe"

# 1. Uninstall existing
print("=== UNINSTALLING ===")
out, _ = run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command '
             '"$prod = Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -like \'*intelliattend*\'}; '
             'if ($prod) { $prod.Uninstall(); Write-Output \'Uninstalled\' } else { Write-Output \'Not found\' }"',
             timeout=120)
print(out)
time.sleep(5)

# 2. Clean install fresh
print("\n=== FRESH INSTALL ===")
out, _ = run(f'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command '
             f'"Start-Process msiexec.exe -ArgumentList \'/i \\"{msi}\\" /qn\' -Wait -Verb RunAs"',
             timeout=120)
print(f"Install: {out}")
time.sleep(3)

# 3. IMMEDIATELY check exe
print("\n=== IMMEDIATE EXE CHECK ===")
out, _ = run(f'C:\\Windows\\System32\\cmd.exe /c if exist "{exe}" (echo EXISTS) else (echo MISSING)')
print(f"Exe (immediate): {out}")

# Also check timestamp of install dir
out, _ = run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command '
             '"Get-ChildItem \'C:\\Users\\MAXHUB\\AppData\\Local\\intelliattend_smartboard\' -ErrorAction SilentlyContinue | '
             'Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize"',
             timeout=15)
print(out)

# 4. If missing, copy from extracted MSI
if 'MISSING' in out or 'MISSING' in run(f'C:\\Windows\\System32\\cmd.exe /c if exist "{exe}" (echo EXISTS) else (echo MISSING)')[0]:
    print("\n=== EXE MISSING - COPYING FROM EXTRACTED MSI ===")
    out, _ = run(f'C:\\Windows\\System32\\cmd.exe /c copy "{extracted_exe}" "{exe}" /Y')
    print(f"Copy result: {out}")
    
    out, _ = run(f'C:\\Windows\\System32\\cmd.exe /c if exist "{exe}" (echo EXISTS) else (echo MISSING)')
    print(f"Exe after copy: {out}")

# 5. Copy the .env with DEBUG=true
print("\n=== SETTING .ENV ===")
import base64
env_content = (
    "API_BASE_URL=https://api.intelliattend.app\r\n"
    "LOCAL_API_URL=http://127.0.0.1:8000/v1/board/telemetry\r\n"
    "FIREBASE_API_KEY=AIzaSyBooFadQf3TZFvZOUJkihMUdgexrbeoQnE\r\n"
    "FIREBASE_PROJECT_ID=intelliattend-a2564\r\n"
    "FIREBASE_APP_ID=1:738499328288:web:c345f44de9d8393062ff45\r\n"
    "FIREBASE_MESSAGING_SENDER_ID=738499328288\r\n"
    "SSL_PIN_FINGERPRINT=\r\n"
    "ENABLE_DOCUMENTS=true\r\n"
    "DEBUG=true"
)
env_b64 = base64.b64encode(env_content.encode('utf-8')).decode('ascii')
run(f'C:\\Windows\\System32\\cmd.exe /c "echo {env_b64} > C:\\Users\\MAXHUB\\Downloads\\env_b64.txt"')
run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command '
    '"$b64 = Get-Content \'C:\\Users\\MAXHUB\\Downloads\\env_b64.txt\' -Raw; '
    '$bytes = [Convert]::FromBase64String($b64.Trim()); '
    '$path = \'C:\\Users\\MAXHUB\\AppData\\Local\\intelliattend_smartboard\\data\\flutter_assets\\.env\'; '
    '[System.IO.File]::WriteAllText($path, [System.Text.Encoding]::UTF8.GetString($bytes)); '
    'Write-Output \'Env written\'"')

# 6. Launch the app
print("\n=== LAUNCHING APP ===")
out, _ = run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command '
             '"Start-Process -FilePath \'C:\\Users\\MAXHUB\\AppData\\Local\\intelliattend_smartboard\\intelliattend_smartboard.exe\' '
             '-WorkingDirectory \'C:\\Users\\MAXHUB\\AppData\\Local\\intelliattend_smartboard\'"',
             timeout=15)
print(f"Launch: {out}")

time.sleep(15)

# 7. Check process
print("\n=== PROCESS CHECK ===")
out, _ = run('C:\\Windows\\System32\\tasklist.exe /FI "IMAGENAME eq intelliattend_smartboard.exe"')
print(out)

# Check if exe still exists
out, _ = run(f'C:\\Windows\\System32\\cmd.exe /c if exist "{exe}" (echo EXISTS) else (echo MISSING)')
print(f"Exe after launch: {out}")

# 8. Check files created by app
print("\n=== RECENTLY CREATED FILES ===")
out, _ = run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command '
             '"Get-ChildItem \'C:\\Users\\MAXHUB\\AppData\\Roaming\\com.example\\intelliattend_smartboard\' '
             '-Recurse -ErrorAction SilentlyContinue | '
             'Select-Object FullName, Length, LastWriteTime | Format-Table -AutoSize"',
             timeout=15)
print(out[:2000] if out else "Empty")

# Check event log
print("\n=== EVENT LOG (last 5 min) ===")
out, _ = run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command '
             '"Get-WinEvent -FilterHashtable @{LogName=\'Application\'; StartTime=(Get-Date).AddMinutes(-5)} '
             '-MaxEvents 10 -ErrorAction SilentlyContinue | '
             'Select-Object TimeCreated, LevelDisplayName, @{N=\'Msg\';E={$_.Message.Substring(0,[Math]::Min(300,$_.Message.Length))}} | Format-List"',
             timeout=30)
print(out[:3000] if out else "No events")

# 9. Network connections from app
print("\n=== NETWORK CONNECTIONS ===")
out, _ = run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command '
             '"Get-NetTCPConnection -ErrorAction SilentlyContinue | '
             'Where-Object {$_.State -eq \'Established\'} | '
             'Sort-Object LocalPort | Select-Object LocalPort, RemoteAddress, RemotePort, OwningProcess | Format-Table -AutoSize"',
             timeout=15)
print(out[:2000] if out else "No connections")

ssh.close()
print("\nDone.")
