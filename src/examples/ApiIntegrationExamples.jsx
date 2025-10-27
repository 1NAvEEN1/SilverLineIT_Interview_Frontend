/**
 * API Integration Examples
 * 
 * This file contains practical examples of how to use the API services
 * in your React components.
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import CourseService from '../services/CourseService';
import AuthService from '../services/AuthService';
import { setAuthData, clearAuth, setUser } from '../reducers/userSlice';

// ============================================
// EXAMPLE 1: Login Component
// ============================================
export const LoginExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await UserService.login(email, password);
      
      // Store auth data in Redux
      dispatch(setAuthData({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }));

      // Setup automatic token refresh
      AuthService.setupTokenRefresh();

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// ============================================
// EXAMPLE 2: Registration Component
// ============================================
export const RegisterExample = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

// ============================================
// EXAMPLE 3: Profile Update Component
// ============================================
export const ProfileUpdateExample = () => {
  const user = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const dispatch = useDispatch();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await UserService.updateProfile(
        formData.firstName,
        formData.lastName,
        formData.email
      );
      
      dispatch(setUser(response));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <input
        type="text"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        placeholder="First Name"
      />
      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        placeholder="Last Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

// ============================================
// EXAMPLE 4: Create Course with Files
// ============================================
export const CreateCourseExample = () => {
  const user = useSelector((state) => state.user.user);
  const [courseData, setCourseData] = useState({
    courseName: '',
    courseCode: '',
    description: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate files
    const validFiles = selectedFiles.filter((file) => {
      if (!CourseService.validateFileType(file)) {
        alert(`Invalid file type: ${file.name}. Only PDF, MP4, JPG, JPEG, PNG allowed.`);
        return false;
      }
      if (!CourseService.validateFileSize(file)) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    setFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const course = {
        ...courseData,
        instructorId: user.id,
      };

      const response = await CourseService.createCourse(course, files);
      console.log('Course created:', response);
      navigate(`/courses/${response.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        value={courseData.courseName}
        onChange={(e) => setCourseData({ ...courseData, courseName: e.target.value })}
        placeholder="Course Name"
        required
      />
      <input
        type="text"
        value={courseData.courseCode}
        onChange={(e) => setCourseData({ ...courseData, courseCode: e.target.value })}
        placeholder="Course Code"
        required
      />
      <textarea
        value={courseData.description}
        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
        placeholder="Description"
        required
      />
      <input
        type="file"
        multiple
        accept=".pdf,.mp4,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
      {files.length > 0 && (
        <div>
          <h4>Selected Files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} ({CourseService.getFileTypeCategory(file.type)})
              </li>
            ))}
          </ul>
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  );
};

// ============================================
// EXAMPLE 5: View Course List
// ============================================
export const CourseListExample = () => {
  const user = useSelector((state) => state.user.user);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      const data = await CourseService.getCoursesByInstructor(user.id);
      setCourses(data);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found. Create your first course!</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <h3>{course.courseName}</h3>
              <p>Code: {course.courseCode}</p>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 6: View Course Details with Content
// ============================================
export const CourseDetailsExample = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await CourseService.getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await CourseService.deleteCourseContent(contentId);
      // Reload course to update content list
      await loadCourse();
    } catch (err) {
      alert(err.message || 'Failed to delete content');
    }
  };

  if (loading) return <div>Loading course...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div>
      <h2>{course.courseName}</h2>
      <p>Code: {course.courseCode}</p>
      <p>Instructor: {course.instructorName}</p>
      <p>{course.description}</p>

      <h3>Course Materials</h3>
      {course.contents && course.contents.length > 0 ? (
        <ul>
          {course.contents.map((content) => (
            <li key={content.id}>
              <a
                href={CourseService.getDownloadUrl(content.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.fileName}
              </a>
              <span> ({content.fileType})</span>
              <button onClick={() => handleDeleteContent(content.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No course materials uploaded yet.</p>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 7: App Initialization
// ============================================
export const AppInitializationExample = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    const authState = AuthService.initAuth();
    
    if (authState.isAuthenticated) {
      dispatch(setAuthData(authState));
      
      // Setup automatic token refresh
      AuthService.setupTokenRefresh();
    }
  }, [dispatch]);

  return null; // This component just handles initialization
};

// ============================================
// EXAMPLE 8: Logout Handler
// ============================================
export const LogoutButtonExample = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await UserService.logout();
      dispatch(clearAuth());
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if API call fails, clear local state
      dispatch(clearAuth());
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
};
