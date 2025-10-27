# API Quick Reference

## 🚀 Quick Start

```javascript
// 1. Login
import UserService from './services/UserService';
const response = await UserService.login(email, password);

// 2. Create Course
import CourseService from './services/CourseService';
const course = await CourseService.createCourse(courseData, files);

// 3. Get Courses
const courses = await CourseService.getCoursesByInstructor(instructorId);
```

## 📚 User Service

```javascript
import UserService from './services/UserService';

// Register
await UserService.register(firstName, lastName, email, password);

// Login
await UserService.login(email, password);

// Get Profile
await UserService.getCurrentUser();

// Update Profile
await UserService.updateProfile(firstName, lastName, email);

// Logout
await UserService.logout();

// Check Auth
UserService.isAuthenticated(); // returns boolean

// Get Stored User
UserService.getStoredUser(); // returns user object
```

## 🎓 Course Service

```javascript
import CourseService from './services/CourseService';

// Get Course by ID
await CourseService.getCourseById(courseId);

// Get Instructor's Courses
await CourseService.getCoursesByInstructor(instructorId);

// Create Course (with optional files)
const courseData = { courseName, courseCode, description, instructorId };
const files = [file1, file2]; // File objects
await CourseService.createCourse(courseData, files);

// Update Course (with optional new files)
await CourseService.updateCourse(courseId, courseData, files);

// Delete Content
await CourseService.deleteCourseContent(contentId);

// Get File URL
const url = CourseService.getDownloadUrl(fileUrl);
const previewUrl = CourseService.getPreviewUrl(fileUrl);

// Validate Files
CourseService.validateFileType(file); // returns boolean
CourseService.validateFileSize(file); // returns boolean (10MB max)
CourseService.getFileTypeCategory(fileType); // returns 'pdf', 'video', 'image'
```

## 🔐 Auth Service

```javascript
import AuthService from './services/AuthService';

// Init Auth from localStorage
const authState = AuthService.initAuth();

// Check Token Expiry
AuthService.isTokenExpired(token);

// Ensure Valid Token (auto-refresh)
await AuthService.ensureValidToken();

// Setup Auto Refresh
AuthService.setupTokenRefresh();
```

## 🗂️ Redux Actions

```javascript
import { setAuthData, setUser, clearAuth } from './reducers/userSlice';

// After Login/Register
dispatch(setAuthData({ user, accessToken, refreshToken }));

// Update User
dispatch(setUser(updatedUser));

// Logout
dispatch(clearAuth());
```

## 📋 File Constraints

✅ **Max Size:** 10 MB  
✅ **Allowed Types:** PDF, MP4, JPG, JPEG, PNG

## ⚠️ Error Handling

```javascript
try {
  const result = await UserService.login(email, password);
} catch (error) {
  console.log(error.status);    // 400, 401, 404, etc.
  console.log(error.message);   // Error message
  console.log(error.errors);    // Validation errors object
}
```

## 🌐 Environment

```bash
VITE_BASE_URL=http://localhost:8080/api
```

## 📝 Common Patterns

### Login Flow
```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await UserService.login(email, password);
    dispatch(setAuthData(response));
    AuthService.setupTokenRefresh();
    navigate('/dashboard');
  } catch (error) {
    alert(error.message);
  }
};
```

### Create Course with Files
```javascript
const handleCreate = async () => {
  // Validate files
  const validFiles = files.filter(f => 
    CourseService.validateFileType(f) && 
    CourseService.validateFileSize(f)
  );

  const course = { 
    courseName, 
    courseCode, 
    description, 
    instructorId: user.id 
  };

  await CourseService.createCourse(course, validFiles);
};
```

### App Initialization
```javascript
useEffect(() => {
  const authState = AuthService.initAuth();
  if (authState.isAuthenticated) {
    dispatch(setAuthData(authState));
    AuthService.setupTokenRefresh();
  }
}, []);
```

## 📖 Full Documentation

- **API_INTEGRATION_GUIDE.md** - Complete guide with examples
- **API_INTEGRATION_SUMMARY.md** - What was implemented
- **src/examples/ApiIntegrationExamples.jsx** - Working code examples
