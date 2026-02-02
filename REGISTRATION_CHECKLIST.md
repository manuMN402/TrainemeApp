# Quick Registration Troubleshooting Checklist

## Before Testing Registration

### ✅ Backend Setup
- [ ] Backend server is running (`npm start` from backend folder)
- [ ] Database file exists (backend/prisma/dev.db)
- [ ] .env file exists with DATABASE_URL configured
- [ ] No database migration errors

### ✅ Frontend Setup
- [ ] API base URL is correct in `frontend/src/services/apiService.js`
- [ ] IP address matches your backend machine's IP
- [ ] Port 3000 is configured
- [ ] Frontend app is running

### ✅ Network Setup
- [ ] Frontend and backend on same WiFi network
- [ ] Firewall allows port 3000
- [ ] No VPN conflicts
- [ ] Ping test succeeds: `ping 192.168.0.228` (replace with your IP)

---

## During Registration

### Watch Console for These Messages

**✅ SUCCESS INDICATORS:**
```
🔵 Register button pressed
📤 Sending registration request...
✅ Response received
✨ Registration successful
🏁 Setting loading to false
```

**❌ FAILURE INDICATORS:**
```
❌ Registration error:
Request timeout
Connection refused
Invalid response format
Email already registered
Missing required fields
```

---

## If Registration Fails

### Step 1: Check Backend is Running
```bash
curl http://localhost:3000/health
```
**Expected:** `{"status":"OK","message":"Server is running"}`

### Step 2: Test Direct API Call
```powershell
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
```

**Expected:** HTTP 201 with JSON response containing `token` and `user`

### Step 3: Check Frontend Logs
- Open React Native Debugger
- Look for console logs with 🔵, 🚀, 📤, ✅, ❌ emojis
- Read error messages carefully

### Step 4: Check Backend Logs
- Look at terminal where `npm start` is running
- Find logs starting with `[REGISTER]`
- Look for database errors (P2002, P2025, P1000, P1001)

### Step 5: Verify Credentials
- Email must be valid format
- Password must be 6+ chars with uppercase, lowercase, number
- First/Last names must be letters only
- Phone must be 7-15 digits

---

## Common Errors & Fixes

| Error | Check | Fix |
|-------|-------|-----|
| "Request timeout" | Network connectivity | Check WiFi, restart backend |
| "Connection refused" | Backend running | Run `npm start` in backend folder |
| "Email already registered" | Database state | Use different email or clear DB |
| "Invalid response format" | Backend returning JSON | Check Content-Type headers |
| "Missing required fields" | Form validation | Fill all fields correctly |
| "Invalid password" | Password requirements | Use at least 6 chars, uppercase, lowercase, number |

---

## Reset Everything (Nuclear Option)

If nothing works, try this:

```bash
# 1. Kill backend process
# 2. Delete database
cd backend
rm prisma/dev.db

# 3. Reinitialize database
npx prisma migrate dev --name init

# 4. Restart backend
npm start

# 5. Try registration again in app
```

---

## Success Verification

After successful registration:
1. ✅ Alert showing "Registration successful"
2. ✅ Redirected to UserDashboard or TrainerRegister
3. ✅ User can login with credentials
4. ✅ User profile is saved in database

---

## Keep Logs for Debugging

If you still have issues:
1. Take screenshot of error message
2. Copy console logs (entire flow)
3. Copy backend server logs (entire registration attempt)
4. Share both for detailed debugging

Format for sharing:
```
# Frontend Console Logs
[paste frontend logs here]

# Backend Server Logs
[paste backend logs here]

# Error Message Seen
[exact error message]

# Steps Taken
[what you tried]
```

---

## Useful Commands

```bash
# Start backend
cd backend && npm start

# Check database
cd backend && npm run checkDB

# View database with GUI
cd backend && npx prisma studio

# Run migrations
cd backend && npx prisma migrate dev

# Test health endpoint
curl http://localhost:3000/health

# Check backend IP
ipconfig /all
```

---

## Contact Points

If stuck, check:
1. Backend terminal for error logs
2. Frontend console for error messages
3. Network connectivity (ping test)
4. IP address configuration
5. Database file existence
6. .env file configuration
