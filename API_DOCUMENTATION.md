# Backend API Requirements

This document outlines the API endpoints expected by the frontend Course Content Upload System.

## Base URL
All endpoints should be prefixed with the base URL configured in `.env`:
```
VITE_BASE_URL=http://localhost:8080/api/v1
```

## Response Format
All responses should follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Authentication Endpoints

### Login
```http
POST /user/login-student
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "token": "jwt_token_here"
  }
}
```

---

## Course Endpoints

### Get All Courses (with pagination and search)
```http
GET /courses?page=1&limit=9&search=web
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Number of courses per page (default: 9)
- `search` (string, optional): Search query for course title/description

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course_1",
        "title": "Web Development Basics",
        "description": "Learn HTML, CSS, and JavaScript",
        "instructor": "John Doe",
        "duration": "8 weeks",
        "category": "Programming",
        "level": "Beginner",
        "status": "Published",
        "thumbnail": "https://example.com/image.jpg",
        "contentCount": {
          "pdfs": 5,
          "videos": 10,
          "images": 3
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-20T14:45:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "totalPages": 3
  }
}
```

### Get Single Course
```http
GET /courses/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "course_1",
    "title": "Web Development Basics",
    "description": "Learn HTML, CSS, and JavaScript",
    "instructor": "John Doe",
    "duration": "8 weeks",
    "category": "Programming",
    "level": "Beginner",
    "status": "Published",
    "thumbnail": "https://example.com/image.jpg",
    "contentCount": {
      "pdfs": 5,
      "videos": 10,
      "images": 3
    }
  }
}
```

### Create Course
```http
POST /courses
```

**Request Body:**
```json
{
  "title": "Web Development Basics",
  "description": "Learn HTML, CSS, and JavaScript",
  "instructor": "John Doe",
  "duration": "8 weeks",
  "category": "Programming",
  "level": "Beginner",
  "status": "Draft"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "course_1",
    "title": "Web Development Basics",
    // ... other fields
  }
}
```

### Update Course
```http
PUT /courses/:id
```

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "instructor": "Jane Doe",
  "duration": "10 weeks",
  "category": "Programming",
  "level": "Intermediate",
  "status": "Published"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": "course_1",
    // ... updated fields
  }
}
```

### Delete Course
```http
DELETE /courses/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## Course Content Endpoints

### Upload Course Content
```http
POST /courses/:courseId/content
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `files` (File[]): Array of files to upload
- `fileTypes` (string[]): Array of file types corresponding to each file (pdf, video, or image)
- `courseId` (string): Course ID

**Example using FormData:**
```javascript
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);
formData.append('fileTypes', 'pdf');
formData.append('fileTypes', 'video');
formData.append('courseId', 'course_1');
```

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": {
    "uploadedFiles": [
      {
        "id": "content_1",
        "filename": "lecture1.pdf",
        "originalName": "lecture1.pdf",
        "type": "pdf",
        "size": 1024000,
        "mimeType": "application/pdf",
        "url": "https://storage.example.com/course_1/lecture1.pdf",
        "uploadedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Get Course Content
```http
GET /courses/:courseId/content
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "content_1",
      "filename": "lecture1.pdf",
      "originalName": "lecture1.pdf",
      "type": "pdf",
      "size": 1024000,
      "mimeType": "application/pdf",
      "url": "https://storage.example.com/course_1/lecture1.pdf",
      "uploadedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "content_2",
      "filename": "intro-video.mp4",
      "originalName": "intro-video.mp4",
      "type": "video",
      "size": 50000000,
      "mimeType": "video/mp4",
      "url": "https://storage.example.com/course_1/intro-video.mp4",
      "uploadedAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### Delete Course Content
```http
DELETE /courses/:courseId/content/:contentId
```

**Response:**
```json
{
  "success": true,
  "message": "Content deleted successfully"
}
```

### Download Course Content
```http
GET /courses/content/:contentId/download
```

**Response:** Binary file stream with appropriate headers:
```
Content-Disposition: attachment; filename="lecture1.pdf"
Content-Type: application/pdf
```

### Preview Course Content
```http
GET /courses/content/:contentId/preview
```

**Response:** Binary file stream for preview (inline display):
```
Content-Disposition: inline
Content-Type: application/pdf (or image/jpeg, etc.)
```

---

## File Upload Specifications

### Supported File Types

1. **PDFs**
   - Extensions: `.pdf`
   - Max Size: 10 MB
   - MIME Type: `application/pdf`

2. **Videos**
   - Extensions: `.mp4`, `.avi`, `.mov`, `.mkv`, `.webm`
   - Max Size: 100 MB
   - MIME Types: `video/mp4`, `video/avi`, `video/quicktime`, `video/x-matroska`, `video/webm`

3. **Images**
   - Extensions: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
   - Max Size: 5 MB
   - MIME Types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

### Storage Recommendations

- Store files in a cloud storage service (AWS S3, Google Cloud Storage, Azure Blob, etc.)
- Generate unique filenames to avoid conflicts
- Store metadata (filename, size, type, upload date) in database
- Return publicly accessible URLs for download/preview
- Implement proper access control if needed

### Database Schema Recommendations

**courses table:**
```sql
CREATE TABLE courses (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  duration VARCHAR(100),
  category VARCHAR(255),
  level ENUM('Beginner', 'Intermediate', 'Advanced'),
  status ENUM('Draft', 'Published', 'Archived'),
  thumbnail VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**course_contents table:**
```sql
CREATE TABLE course_contents (
  id VARCHAR(255) PRIMARY KEY,
  course_id VARCHAR(255) NOT NULL,
  filename VARCHAR(500) NOT NULL,
  original_name VARCHAR(500),
  type ENUM('pdf', 'video', 'image') NOT NULL,
  size BIGINT,
  mime_type VARCHAR(100),
  storage_url TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
```

---

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `413` - Payload Too Large (file size exceeded)
- `422` - Unprocessable Entity (invalid file type)
- `500` - Internal Server Error

---

## Security Considerations

1. **Authentication**: Implement JWT or session-based authentication
2. **File Validation**: 
   - Verify file types on server-side
   - Check file signatures, not just extensions
   - Scan for malware
3. **Rate Limiting**: Limit upload frequency per user
4. **File Size**: Enforce file size limits strictly
5. **Access Control**: Ensure users can only access their own courses
6. **Input Sanitization**: Sanitize filenames and course data
7. **CORS**: Configure CORS properly for frontend domain

---

## Testing the API

### Using cURL

**Create a course:**
```bash
curl -X POST http://localhost:8080/api/v1/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Course",
    "description": "A test course",
    "instructor": "John Doe",
    "category": "Testing",
    "level": "Beginner",
    "status": "Draft"
  }'
```

**Upload a file:**
```bash
curl -X POST http://localhost:8080/api/v1/courses/course_1/content \
  -F "files=@/path/to/file.pdf" \
  -F "fileTypes=pdf" \
  -F "courseId=course_1"
```

### Using Postman

1. Import the endpoints into Postman
2. Set up environment variables for base URL
3. Test each endpoint with sample data
4. Verify response formats match the specifications

---

## Support

For questions about the API implementation, please refer to this documentation or contact the frontend development team.
