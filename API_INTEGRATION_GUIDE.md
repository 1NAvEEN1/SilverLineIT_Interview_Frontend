# API Integration Guide

## Overview
This document explains how the frontend integrates with the backend API for the Course Management System.

## Base Configuration

### Environment Variables
The API base URL is configured in `.env`:
```
VITE_BASE_URL=http://localhost:8080/api
```

## Services Architecture

### 1. API Manager (`src/app/apiManager.js`)
Central API communication manager that handles:
- HTTP methods (GET, POST, PUT, DELETE)
- Multipart form data uploads
- Automatic authentication token injection
- Error handling and token expiration
- Automatic logout on 401 errors

**Key Functions:**
- `get()` - GET requests with automatic auth
- `post()` - POST requests with JSON body
- `put()` - PUT requests with JSON body
- `del()` - DELETE requests
- `postFormData()` - POST with multipart/form-data
- `putFormData()` - PUT with multipart/form-data

### 2. User Service (`src/services/UserService.js`)
Handles all user authentication and profile operations.

#### Available Methods:

**Authentication:**
```javascript
// Register new instructor
await UserService.register(firstName, lastName, email, password);

// Login
await UserService.login(email, password);

// Refresh access token
await UserService.refreshToken();

// Logout
await UserService.logout();
```

**Profile Management:**
```javascript
// Get current user profile
await UserService.getCurrentUser();

// Update profile
await UserService.updateProfile(firstName, lastName, email);

// Check authentication status
const isAuth = UserService.isAuthenticated();

// Get stored user data
const user = UserService.getStoredUser();
```

### 3. Course Service (`src/services/CourseService.js`)
Handles all course and course content operations.

#### Available Methods:

**Course Operations:**
```javascript
// Get course by ID (includes content)
await CourseService.getCourseById(courseId);

// Get all courses by instructor
await CourseService.getCoursesByInstructor(instructorId);

// Create course with optional files
const courseData = {
  courseName: "Introduction to Java",
  courseCode: "CS101",
  description: "Learn Java basics",
  instructorId: 1
};
const files = [file1, file2]; // Array of File objects
await CourseService.createCourse(courseData, files);

// Update course with optional new files
await CourseService.updateCourse(courseId, courseData, files);

// Delete course content
await CourseService.deleteCourseContent(contentId);
```

**File Utilities:**
```javascript
// Get download/preview URL
const url = CourseService.getDownloadUrl(fileUrl);
const previewUrl = CourseService.getPreviewUrl(fileUrl);

// Validate file type
const isValid = CourseService.validateFileType(file);

// Validate file size (10MB max)
const sizeOk = CourseService.validateFileSize(file);

// Get file category
const category = CourseService.getFileTypeCategory(file.type);
// Returns: 'pdf', 'video', 'image', or 'unknown'
```

### 4. Auth Service (`src/services/AuthService.js`)
Handles authentication state and token management.

#### Available Methods:

```javascript
// Initialize auth from localStorage
const authState = AuthService.initAuth();

// Check if token is expired
const expired = AuthService.isTokenExpired(token);

// Ensure valid token (auto-refresh if needed)
await AuthService.ensureValidToken();

// Setup automatic token refresh
AuthService.setupTokenRefresh();
```

## Authentication Flow

### 1. Login Process
```javascript
import UserService from './services/UserService';
import { setAuthData } from './reducers/userSlice';

// In your login component
const handleLogin = async (email, password) => {
  try {
    const response = await UserService.login(email, password);
    
    // Update Redux store
    dispatch(setAuthData({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    }));
    
    // Navigate to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

### 2. Registration Process
```javascript
const handleRegister = async (firstName, lastName, email, password) => {
  try {
    const response = await UserService.register(firstName, lastName, email, password);
    
    // Update Redux store
    dispatch(setAuthData({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    }));
    
    // Navigate to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};
```

### 3. Token Management
Tokens are automatically managed:
- **Access Token**: Stored in localStorage, injected in all authenticated requests
- **Refresh Token**: Used to get new access tokens before expiry
- **Auto Refresh**: Set up automatic refresh 5 minutes before token expiry

### 4. Logout Process
```javascript
const handleLogout = async () => {
  try {
    await UserService.logout();
    dispatch(clearAuth());
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
};
```

## Course Management Flow

### 1. Creating a Course with Files
```javascript
import CourseService from './services/CourseService';

const handleCreateCourse = async (formData, files) => {
  try {
    // Validate files
    const validFiles = files.filter(file => {
      if (!CourseService.validateFileType(file)) {
        alert(`Invalid file type: ${file.name}`);
        return false;
      }
      if (!CourseService.validateFileSize(file)) {
        alert(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    const courseData = {
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      description: formData.description,
      instructorId: user.id,
    };

    const response = await CourseService.createCourse(courseData, validFiles);
    console.log('Course created:', response);
  } catch (error) {
    console.error('Failed to create course:', error.message);
  }
};
```

### 2. Viewing Course with Content
```javascript
const handleViewCourse = async (courseId) => {
  try {
    const course = await CourseService.getCourseById(courseId);
    
    // course.contents contains array of course materials
    course.contents.forEach(content => {
      console.log('File:', content.fileName);
      console.log('Type:', content.fileType);
      console.log('Size:', content.fileSize);
      console.log('URL:', CourseService.getPreviewUrl(content.fileUrl));
    });
  } catch (error) {
    console.error('Failed to fetch course:', error.message);
  }
};
```

### 3. Updating Course
```javascript
const handleUpdateCourse = async (courseId, updatedData, newFiles) => {
  try {
    const response = await CourseService.updateCourse(
      courseId,
      updatedData,
      newFiles
    );
    console.log('Course updated:', response);
  } catch (error) {
    console.error('Failed to update course:', error.message);
  }
};
```

### 4. Deleting Course Content
```javascript
const handleDeleteContent = async (contentId) => {
  try {
    await CourseService.deleteCourseContent(contentId);
    console.log('Content deleted successfully');
  } catch (error) {
    console.error('Failed to delete content:', error.message);
  }
};
```

## Error Handling

All API calls throw errors that can be caught and handled:

```javascript
try {
  const result = await UserService.login(email, password);
} catch (error) {
  // error object structure:
  // {
  //   status: 400,
  //   message: "Error message",
  //   errors: { field: "error detail" } // for validation errors
  // }
  
  if (error.status === 401) {
    console.log('Invalid credentials');
  } else if (error.status === 409) {
    console.log('User already exists');
  } else {
    console.log('Error:', error.message);
  }
}
```

## File Upload Constraints

- **Maximum file size:** 10 MB
- **Allowed file types:**
  - PDF (application/pdf)
  - MP4 (video/mp4)
  - JPG/JPEG (image/jpeg, image/jpg)
  - PNG (image/png)

## Redux Integration

### User Slice Actions:
```javascript
import { setAuthData, setUser, clearAuth } from './reducers/userSlice';

// After login/register
dispatch(setAuthData({ user, accessToken, refreshToken }));

// Update user profile
dispatch(setUser(updatedUser));

// Logout
dispatch(clearAuth());
```

## Protected Routes Example

```javascript
import { Navigate } from 'react-router-dom';
import UserService from './services/UserService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = UserService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Usage in routes
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## App Initialization

Set up authentication on app start:

```javascript
// In your main App component or main.jsx
import AuthService from './services/AuthService';
import { setAuthData } from './reducers/userSlice';

useEffect(() => {
  // Initialize auth state from localStorage
  const authState = AuthService.initAuth();
  
  if (authState.isAuthenticated) {
    dispatch(setAuthData(authState));
    
    // Setup automatic token refresh
    AuthService.setupTokenRefresh();
  }
}, []);
```

## API Response Examples

### Login Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "roles": ["ROLE_INSTRUCTOR"]
  }
}
```

### Course with Content Response:
```json
{
  "id": 1,
  "courseName": "Introduction to Java",
  "courseCode": "CS101",
  "description": "Learn Java basics",
  "instructorId": 1,
  "instructorName": "John Doe",
  "createdAt": "2025-10-27T12:00:00",
  "updatedAt": "2025-10-27T12:00:00",
  "contents": [
    {
      "id": 1,
      "fileName": "syllabus.pdf",
      "fileType": "application/pdf",
      "fileSize": 102400,
      "uploadDate": "2025-10-27T12:00:00",
      "fileUrl": "1/syllabus_1730044800000.pdf",
      "courseId": 1,
      "courseName": "Introduction to Java",
      "uploadedByUserId": 1,
      "uploadedByUserName": "John Doe"
    }
  ]
}
```

## Testing the Integration

1. **Start the backend server** on `http://localhost:8080`
2. **Start the frontend dev server**: `npm run dev`
3. **Test the flow**:
   - Register a new instructor
   - Login with credentials
   - Create a course with files
   - View course details
   - Update course
   - Delete course content

## Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- User will be automatically logged out
- Clear localStorage and login again

### 413 Payload Too Large
- File exceeds 10MB limit
- Reduce file size or split into smaller files

### 415 Unsupported Media Type
- Invalid file type
- Use only: PDF, MP4, JPG, JPEG, PNG

### CORS Issues
- Ensure backend CORS is configured to allow frontend origin
- Check backend allows `http://localhost:5173` (or your dev server port)

## Next Steps

1. Implement the UI components to use these services
2. Add loading states and error messages
3. Implement file upload progress indicators
4. Add form validation
5. Implement protected routes
6. Add toast notifications for success/error messages
