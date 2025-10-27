# Course Content Upload System

A modern, full-featured Course Content Management System built with React, Material-UI, and Redux. This system allows instructors to upload, manage, and organize course materials including PDFs, videos, and images.

## Features

### 🎓 Course Management
- **Create, Edit, View, and Delete Courses**: Full CRUD operations for course management
- **Course Information**: Title, description, instructor, duration, category, level, and status
- **Modern Card-Based UI**: Clean and intuitive interface with gradient effects
- **Search Functionality**: Real-time search with debouncing
- **Infinite Scroll Pagination**: Seamless loading of courses as you scroll

### 📁 Content Upload System
- **Multi-File Upload**: Upload PDFs, videos, and images simultaneously
- **File Validation**: 
  - PDFs: up to 10MB
  - Videos (MP4, AVI, MOV, MKV, WebM): up to 100MB
  - Images (JPG, PNG, GIF, WebP): up to 5MB
- **Upload Progress Bar**: Real-time upload progress tracking
- **Error Handling**: Comprehensive validation and error messages
- **Drag and Drop Support**: User-friendly file selection

### 📚 Content Management
- **View Content**: Tabbed interface to filter by file type (All, PDFs, Videos, Images)
- **Preview Files**: Preview images and PDFs directly in the browser
- **Download Files**: Download any uploaded content
- **Delete Content**: Remove unwanted files
- **File Metadata Display**: Shows filename, size, type, and upload date

### 🎨 User Interface
- **Modern Design**: Clean, gradient-based design with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Header with Avatar**: User profile menu with avatar initials
- **Profile Management**: Update user information and preferences
- **Floating Action Button**: Quick access to add courses on mobile

### 🔐 Authentication & Navigation
- **Login System**: Email and password authentication
- **Protected Routes**: Layout with nested routing
- **Redux State Management**: Centralized state for courses and user data
- **Persistent Storage**: Redux Persist for maintaining state across sessions

## Tech Stack

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios (for file uploads), Fetch API
- **Build Tool**: Vite
- **State Persistence**: Redux Persist

## Project Structure

```
src/
├── app/
│   ├── apiManager.js           # API utility functions (GET, POST, PUT, DELETE)
│   ├── store.js                # Redux store configuration
│   └── ...
├── components/
│   ├── CourseCard/             # Course card component for grid view
│   ├── FileUpload/             # File upload component with validation
│   ├── ViewContent/            # Content viewing and management component
│   ├── Loadable/               # Lazy loading wrapper
│   └── ...
├── layout/
│   └── Layout.jsx              # Main layout with header and navigation
├── pages/
│   ├── Home/                   # Course listing page with search and pagination
│   ├── CourseForm/             # Add/Edit/View course page
│   ├── Profile/                # User profile page
│   └── Login/                  # Login page
├── reducers/
│   ├── courseSlice.js          # Course state management
│   ├── userSlice.js            # User state management
│   └── ...
├── services/
│   └── CourseService.js        # Course API service layer
└── App.jsx                     # Main app component with routing

```

## API Endpoints

The system expects the following backend API endpoints:

### Courses
- `GET /courses?page=1&limit=9&search=query` - Get courses with pagination
- `GET /courses/:id` - Get single course by ID
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

### Course Content
- `POST /courses/:courseId/content` - Upload course content (multipart/form-data)
- `GET /courses/:courseId/content` - Get course content list
- `DELETE /courses/:courseId/content/:contentId` - Delete specific content
- `GET /courses/content/:contentId/download` - Download content file
- `GET /courses/content/:contentId/preview` - Preview content file

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd SilverLineIT_Interview_Frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
VITE_BASE_URL=http://localhost:3000/api
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## Usage

### Login
1. Navigate to the login page
2. Enter your email and password
3. Click "Sign in" to access the dashboard

### Managing Courses

#### Create a Course
1. Click "Add New Course" button on the home page
2. Fill in the course information form
3. Click "Save Course"
4. Upload course materials (PDFs, videos, images)

#### Edit a Course
1. Click the edit icon on any course card
2. Modify the course information
3. Upload additional materials or delete existing ones
4. Click "Save Course"

#### View a Course
1. Click the view icon on any course card
2. Browse through all course materials
3. Preview or download files

#### Delete a Course
1. Click the delete icon on any course card
2. Confirm deletion

### Uploading Files

1. Navigate to edit/add course page
2. Scroll to "Course Content" section
3. Click on the upload area or drag and drop files
4. Selected files will be validated automatically
5. Click "Upload Files" to start the upload
6. Monitor progress with the progress bar

### Managing Content

1. In the "Course Materials" section, use tabs to filter by file type
2. Preview images and PDFs by clicking the eye icon
3. Download files by clicking the download icon
4. Delete files by clicking the delete icon

## Key Features Explained

### File Validation
- Checks file types against allowed extensions
- Validates file sizes based on type
- Displays clear error messages for invalid files

### Upload Progress
- Real-time progress tracking using Axios progress events
- Percentage-based progress bar
- Prevents navigation during upload

### Search with Debouncing
- 500ms debounce delay to reduce API calls
- Real-time results as you type
- Maintains search state across navigation

### Infinite Scroll
- Automatically loads more courses when scrolling near bottom
- Detects when all courses are loaded
- Smooth user experience without pagination buttons

### Redux State Management
- Centralized course and user state
- Persistent storage across page refreshes
- Optimistic UI updates

## Customization

### Modify File Upload Limits
Edit `src/components/FileUpload/FileUpload.jsx`:
```javascript
const FILE_TYPES = {
  pdf: {
    extensions: [".pdf"],
    maxSize: 10 * 1024 * 1024, // Change this
  },
  // ...
};
```

### Change Theme Colors
Edit `src/theme/palette.js` for global theme changes.

### Modify Gradient Colors
Search for `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` throughout the codebase to customize gradients.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is part of the SilverlineIT interview assessment.

## Support

For issues or questions, please create an issue in the repository.
