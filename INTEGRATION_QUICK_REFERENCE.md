# Quick Reference: Login & Registration Integration

## 🔑 Key Changes at a Glance

### Login Page - Before & After

**BEFORE (Mock):**
```javascript
const handleSubmit = (ev) => {
  ev.preventDefault();
  setTimeout(() => {
    dispatch(setUser({ email, name: email.split("@")[0] }));
    navigate("/home");
  }, 500);
};
```

**AFTER (Real API):**
```javascript
const handleSubmit = async (ev) => {
  ev.preventDefault();
  try {
    const response = await UserService.login(email, password);
    dispatch(setAuthData({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    }));
    AuthService.setupTokenRefresh();
    navigate("/home");
  } catch (error) {
    setApiError(error.message);
  }
};
```

---

### Register Page - Before & After

**BEFORE (Mock):**
```javascript
const handleSubmit = (ev) => {
  ev.preventDefault();
  setTimeout(() => {
    dispatch(setUser({
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`
    }));
    navigate("/home");
  }, 1000);
};
```

**AFTER (Real API):**
```javascript
const handleSubmit = async (ev) => {
  ev.preventDefault();
  try {
    const response = await UserService.register(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password
    );
    dispatch(setAuthData({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    }));
    AuthService.setupTokenRefresh();
    navigate("/home");
  } catch (error) {
    setApiError(error.message);
    setActiveStep(0);
  }
};
```

---

### Layout Logout - Before & After

**BEFORE (Local Only):**
```javascript
const handleLogout = () => {
  dispatch(setUser(null));
  navigate("/");
};
```

**AFTER (API Call):**
```javascript
const handleLogout = async () => {
  try {
    await UserService.logout();
    dispatch(clearAuth());
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error);
    dispatch(clearAuth());
    navigate("/");
  }
};
```

---

## 🎯 What Each Service Does

### UserService Methods Used:

```javascript
// Login user
UserService.login(email, password)
// Returns: { accessToken, refreshToken, user, tokenType, expiresIn }

// Register new user
UserService.register(firstName, lastName, email, password)
// Returns: { accessToken, refreshToken, user, tokenType, expiresIn }

// Logout user
UserService.logout()
// Returns: { success: true }

// Check if authenticated
UserService.isAuthenticated()
// Returns: boolean
```

### AuthService Methods Used:

```javascript
// Initialize auth from localStorage
AuthService.initAuth()
// Returns: { user, accessToken, refreshToken, isAuthenticated }

// Setup automatic token refresh
AuthService.setupTokenRefresh()
// Sets up timer to refresh token before expiry
```

---

## 📱 User Journey

### New User Registration:
```
1. Visit /register
2. Fill Step 1: Email & Password
3. Fill Step 2: First Name, Last Name
4. Review Step 3: Confirm Info
5. Submit → API Call → Store Tokens → Redirect /home
```

### Returning User Login:
```
1. Visit / (login page)
2. Enter Email & Password
3. Submit → API Call → Store Tokens → Redirect /home
```

### After Login:
```
1. User sees header with name and avatar
2. Can navigate to /home, /profile, /courses
3. Click avatar → Logout → API Call → Clear Tokens → Redirect /
```

### Page Refresh:
```
1. User refreshes page
2. AuthInitializer runs on App mount
3. Checks localStorage for tokens
4. Restores user and auth state
5. Sets up auto token refresh
6. User stays logged in
```

---

## 🔐 Token Flow Diagram

```
Login/Register
    ↓
API Call
    ↓
Receive Tokens
    ↓
Store in localStorage ← ─ ─ ─ ─ ┐
    ↓                           │
Store in Redux                  │
    ↓                           │
Setup Token Refresh             │
    ↓                           │
Navigate to /home               │
                                │
Page Refresh                    │
    ↓                           │
AuthInitializer                 │
    ↓                           │
Read from localStorage ─ ─ ─ ─ ─ ┘
    ↓
Restore Redux State
    ↓
Setup Token Refresh
    ↓
User Stays Logged In
```

---

## 🎨 UI Components Added

### Error Alert (Both Pages):
```jsx
{apiError && (
  <Alert 
    severity="error" 
    onClose={() => setApiError("")}
    sx={{ mb: 2, borderRadius: 2 }}
  >
    {apiError}
  </Alert>
)}
```

### Loading State (Both Pages):
```jsx
<Button
  type="submit"
  disabled={submitting}
>
  {submitting ? "Signing in..." : "Sign In"}
</Button>
```

---

## 🛠️ Testing Commands

```bash
# 1. Make sure backend is running
# Backend should be at: http://localhost:8080

# 2. Start frontend
npm run dev

# 3. Test Login
# Navigate to: http://localhost:5173/
# Enter credentials and submit

# 4. Test Registration
# Navigate to: http://localhost:5173/register
# Fill form and submit

# 5. Test Logout
# Click avatar in header → Logout

# 6. Test Persistent Login
# Login → Refresh page → Should stay logged in
```

---

## ✅ Checklist

### Login Page:
- [x] API integration complete
- [x] Error handling added
- [x] Loading states added
- [x] Token storage implemented
- [x] Redux integration updated
- [x] Navigation after login
- [x] Error alerts displayed

### Register Page:
- [x] API integration complete
- [x] Error handling added
- [x] Loading states added
- [x] Token storage implemented
- [x] Redux integration updated
- [x] Navigation after registration
- [x] Error alerts displayed
- [x] Step navigation on error

### Layout:
- [x] Logout API integrated
- [x] Clear auth state on logout
- [x] User display updated
- [x] Avatar initials updated

### App Component:
- [x] Auth initialization added
- [x] Token refresh setup
- [x] Persistent login enabled

---

## 🎉 Result

✅ **Fully functional authentication system**
✅ **Backend API integrated**
✅ **Token management automated**
✅ **Persistent login working**
✅ **Error handling comprehensive**
✅ **User experience smooth**

The login and registration pages are now production-ready!
