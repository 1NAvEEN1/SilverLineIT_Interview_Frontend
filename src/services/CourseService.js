import { get, post, put, del, postFormData, putFormData } from "../app/apiManager";

const baseUrl = import.meta.env.VITE_BASE_URL;

class CourseService {
  // Get a single course by ID with content
  static async getCourseById(courseId) {
    try {
      const response = await get({
        path: `/courses/${courseId}`,
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all courses by instructor ID
  static async getCoursesByInstructor(instructorId) {
    try {
      const response = await get({
        path: `/courses/instructor/${instructorId}`,
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create a new course with optional content/files
  static async createCourse(payload) {
    try {
      // Convert files to base64 if present
      const filesData = await Promise.all(
        (payload.files || []).map(async (file) => {
          if (!file) return null;
          
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
          
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64
          };
        })
      );

      const requestPayload = {
        courseName: payload.courseData.courseName,
        courseCode: payload.courseData.courseCode,
        description: payload.courseData.description,
        instructorId: payload.courseData.instructorId,
        files: filesData.filter(f => f !== null)
      };

      const response = await post({
        path: "/courses",
        requestBody: requestPayload,
        requiresAuth: true,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update a course with optional new content/files
  static async updateCourse(courseId, payload) {
    try {
      // Convert files to base64 if present
      const filesData = await Promise.all(
        (payload.files || []).map(async (file) => {
          if (!file) return null;
          
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });
          
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64
          };
        })
      );

      const requestPayload = {
        courseName: payload.courseData.courseName,
        courseCode: payload.courseData.courseCode,
        description: payload.courseData.description,
        instructorId: payload.courseData.instructorId,
        files: filesData.filter(f => f !== null)
      };

      const response = await put({
        path: `/courses/${courseId}`,
        requestBody: requestPayload,
        requiresAuth: true,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Soft delete course content
  static async deleteCourseContent(contentId) {
    try {
      const response = await del({
        path: `/course-content/${contentId}`,
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get download URL for course content
  static getDownloadUrl(fileUrl) {
    // The fileUrl comes from the backend in format like "1/syllabus_1730044800000.pdf"
    return `${baseUrl}/uploads/${fileUrl}`;
  }

  // Get preview URL for course content
  static getPreviewUrl(fileUrl) {
    // The fileUrl comes from the backend in format like "1/syllabus_1730044800000.pdf"
    return `${baseUrl}/uploads/${fileUrl}`;
  }

  // Validate file type
  static validateFileType(file) {
    const allowedTypes = [
      'application/pdf',
      'video/mp4',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    
    return allowedTypes.includes(file.type);
  }

  // Validate file size (10MB max)
  static validateFileSize(file) {
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    return file.size <= maxSize;
  }

  // Get file type category
  static getFileTypeCategory(fileType) {
    if (fileType === 'application/pdf') return 'pdf';
    if (fileType === 'video/mp4') return 'video';
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(fileType)) return 'image';
    return 'unknown';
  }
}

export default CourseService;
