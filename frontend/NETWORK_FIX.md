# Network Request Failed - Quick Fix Guide

## Problem
You're getting "network request failed" error when trying to use the app.

## Status Check
✅ Backend server IS running on port 3000  
❌ But it's NOT responding to network requests

## Likely Cause: FIREWALL BLOCKING PORT 3000

### Quick Fixes (Choose ONE):

## Option 1: Allow Port 3000 Through Windows Firewall (Recommended)

**Step 1: Open Windows Defender Firewall**
1. Press `Win + R`
2. Type `firewall.cpl`
3. Press Enter

**Step 2: Allow Node.js Through Firewall**
1. Click "Allow an app through firewall"
2. Click "Change settings" (if asked for admin)
3. Click "Allow another app..."
4. Browse to: `C:\Program Files\nodejs\node.exe`
5. Click "Add"
6. Make sure both "Private" and "Public" are checked
7. Click OK

OR use PowerShell as Administrator:

```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="Allow Node Port 3000" dir=in action=allow protocol=tcp localport=3000 enable=yes
```

## Option 2: Disable Firewall Temporarily (For Testing Only)

```powershell
# Run as Administrator
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $false
```

⚠️ Re-enable after testing:
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $true
```

## Option 3: Check if Port is Actually Open

Run these commands:

```powershell
# Check if Node process is listening on port 3000
netstat -ano | findstr :3000

# Should show something like:
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
```

If no output = port not listening = server crashed

## Option 4: Use Localhost Instead

If you're testing on the SAME MACHINE as backend:

Change in `frontend/src/services/apiService.js`:
```javascript
// FROM:
const API_BASE_URL = 'http://192.168.0.228:3000/api';

// TO:
const API_BASE_URL = 'http://localhost:3000/api';
```

Then restart frontend app.

---

## Complete Fix Steps (Do These In Order)

### Step 1: Add Node to Windows Firewall
```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="Allow Node Port 3000" dir=in action=allow protocol=tcp localport=3000 enable=yes
```

### Step 2: Restart Backend Server
```bash
# Kill existing process (Ctrl+C in terminal)
# Then restart:
cd c:\Users\nandu\OneDrive\Desktop\TrainemeApp\backend
npm start
```

### Step 3: Test Connection
```powershell
# From another PowerShell window, test:
Test-NetConnection -ComputerName 192.168.0.228 -Port 3000
# Should show: TcpTestSucceeded : True
```

### Step 4: Test API Endpoint
```powershell
# If using localhost:
Invoke-WebRequest -Uri http://localhost:3000/health

# If using 192.168.0.228:
Invoke-WebRequest -Uri http://192.168.0.228:3000/health

# Should see: status : OK
```

### Step 5: Restart App
- Close frontend app
- Reopen frontend app
- Try registration again

---

## If Still Not Working

### Check These:

1. **Is backend actually running?**
   ```bash
   # Look for this in the terminal where backend is running:
   ✅ Server running on http://localhost:3000
   ```

2. **Can you reach it from same machine?**
   ```powershell
   # Try localhost instead:
   Invoke-WebRequest -Uri http://localhost:3000/health
   ```

3. **Is firewall still blocking?**
   ```powershell
   # Check firewall rules:
   Get-NetFirewallRule -DisplayName "*3000*" | Select-Object Name,DisplayName,Enabled,Direction,Action
   ```

4. **Try a different port**
   Edit `backend/.env`:
   ```
   PORT=3001
   ```
   
   Edit `frontend/src/services/apiService.js`:
   ```javascript
   const API_BASE_URL = 'http://192.168.0.228:3001/api';
   ```

---

## Firewall Rules to Add (Complete List)

Run as Administrator:

```powershell
# Add inbound rule for Node on port 3000
netsh advfirewall firewall add rule `
  name="Allow Node Port 3000" `
  dir=in `
  action=allow `
  protocol=tcp `
  localport=3000 `
  enable=yes

# If using different port, adjust 3000 above

# Remove rule if needed:
netsh advfirewall firewall delete rule name="Allow Node Port 3000"
```

---

## Common Firewall Issues

| Issue | Solution |
|-------|----------|
| "Connection refused" | Port not open, firewall blocking |
| "Connection timeout" | Firewall dropping packets |
| "Unable to connect" | Firewall or server not running |
| Works on localhost but not 192.168.x.x | Firewall blocking network access |

---

## Test Your Setup

After making changes, run this:

```powershell
# 1. Check if server is running
Test-NetConnection -ComputerName 192.168.0.228 -Port 3000

# Should show:
# TcpTestSucceeded : True
# TcpTestSucceeded : False (means firewall is still blocking)

# 2. Test if API responds
Invoke-WebRequest -Uri http://192.168.0.228:3000/health

# Should see status: OK

# 3. Test registration endpoint
$body = @{
    firstName = "Test"
    lastName = "User"
    email = "test@example.com"
    phone = "1234567890"
    password = "Test@1234"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://192.168.0.228:3000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body

# Should see token and user data in response
```

---

## After Fixing Firewall

1. ✅ Restart backend server
2. ✅ Restart frontend app  
3. ✅ Try registration again
4. ✅ Watch console for logs

If you still see "network request failed", the error message will now tell you EXACTLY what's wrong!

---

**Need Help?**

Check:
1. Backend terminal - any errors?
2. Frontend console - exact error message?
3. Firewall status - port 3000 allowed?
4. Network - can ping 192.168.0.228?
