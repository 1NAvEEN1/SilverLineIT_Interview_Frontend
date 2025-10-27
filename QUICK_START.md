# Quick Start Guide - Course Content Upload System

This guide will help you get the Course Content Upload System up and running quickly.

## Prerequisites

- **Node.js** 16 or higher
- **npm** or **yarn**
- A backend API server (see API_DOCUMENTATION.md for specifications)

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Axios
- And more...

## Step 2: Configure Environment

The `.env` file should already be configured. Verify it contains:

```env
VITE_BASE_URL=http://localhost:8080/api/v1
```

Update this URL to match your backend API server.

## Step 3: Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is busy).

## Step 4: Login

1. Open your browser and navigate to `http://localhost:5173`
2. Enter any email and password (minimum 6 characters)
3. Click "Sign in"

**Note:** The current implementation has a mock login. Replace this with your actual authentication API.

## Step 5: Explore Features

### Creating Your First Course

1. Click the **"Add New Course"** button
2. Fill in the course details:
   - **Title**: e.g., "Introduction to Web Development"
   - **Description**: Brief course overview
   - **Instructor**: Your name
   - **Duration**: e.g., "8 weeks"
   - **Category**: e.g., "Programming"
   - **Level**: Select from Beginner/Intermediate/Advanced
   - **Status**: Draft or Published
3. Click **"Save Course"**

### Uploading Course Content

After creating a course:

1. You'll be redirected to the edit page
2. Scroll to the **"Course Content"** section
3. Click the upload area or drag files
4. Select PDFs, videos, or images:
   - **PDFs**: Up to 10MB
   - **Videos**: Up to 100MB (MP4, AVI, MOV, MKV, WebM)
   - **Images**: Up to 5MB (JPG, PNG, GIF, WebP)
5. Click **"Upload Files"**
6. Watch the progress bar complete

### Managing Content

- **View by Type**: Use tabs to filter (All, PDFs, Videos, Images)
- **Preview**: Click the eye icon on images or PDFs
- **Download**: Click the download icon
- **Delete**: Click the trash icon

### Searching Courses

- Use the search bar on the home page
- Type your query (e.g., "web", "design")
- Results update in real-time with 500ms debounce

### Editing a Course

1. Click the **edit icon** on any course card
2. Modify course information
3. Add or remove content
4. Click **"Save Course"**

### Viewing Course Details

- Click the **eye icon** on any course card
- View all course information
- Browse uploaded materials
- Download or preview files

## Project Structure Overview

```
src/
├── pages/
│   ├── Home/           # Main course listing
│   ├── CourseForm/     # Add/Edit/View courses
│   ├── Profile/        # User profile
│   └── Login/          # Authentication
├── components/
│   ├── CourseCard/     # Course display card
│   ├── FileUpload/     # File upload with validation
│   └── ViewContent/    # Content viewer
├── services/
│   └── CourseService.js # API calls
├── reducers/
│   ├── courseSlice.js  # Course state
│   └── userSlice.js    # User state
└── layout/
    └── Layout.jsx      # Header with navigation
```

## Common Commands

### Development
```bash
npm run dev          # Start dev server
```

### Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port. Check the terminal output.

### API Connection Errors
1. Verify your backend server is running
2. Check `.env` file for correct API URL
3. Ensure CORS is configured on backend
4. Check browser console for error details

### File Upload Fails
1. Check file size limits (see Feature Documentation)
2. Verify file type is supported
3. Ensure backend API is properly configured
4. Check network tab for API errors

### State Not Persisting
- Clear browser storage: localStorage and sessionStorage
- Restart the development server
- Check Redux DevTools extension

## Features Checklist

After setup, you should be able to:

- ✅ Login to the system
- ✅ View list of courses
- ✅ Search courses
- ✅ Create new courses
- ✅ Edit existing courses
- ✅ Upload course materials (PDF, videos, images)
- ✅ View uploaded content by type
- ✅ Preview images and PDFs
- ✅ Download files
- ✅ Delete content
- ✅ Navigate with header menu
- ✅ Update profile
- ✅ Logout

## Next Steps

1. **Connect to Real Backend**: 
   - Replace mock login with real API
   - Test all CRUD operations
   - Verify file upload/download

2. **Customize Theme**:
   - Edit `src/theme/palette.js`
   - Modify gradient colors in components

3. **Add Features**:
   - Student enrollment
   - Course categories
   - Progress tracking
   - Comments/Reviews

4. **Deploy**:
   - Build production bundle: `npm run build`
   - Deploy to hosting (Vercel, Netlify, etc.)
   - Update environment variables

## Additional Resources

- **README.md**: Comprehensive feature documentation
- **API_DOCUMENTATION.md**: Backend API specifications
- **Material-UI Docs**: https://mui.com
- **React Router Docs**: https://reactrouter.com
- **Redux Toolkit Docs**: https://redux-toolkit.js.org

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify API endpoints match documentation
3. Review component props and state
4. Check Redux DevTools for state issues

## Default Credentials (Mock Login)

Since the current implementation uses mock authentication:
- **Email**: Any valid email format
- **Password**: Minimum 6 characters

Remember to implement real authentication before production!

---

**Happy Coding! 🚀**
