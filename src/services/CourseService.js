import { get, post } from "../app/apiManager";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

class CourseService {
  // Get all courses with pagination and search
  static async getCourses(page = 1, limit = 9, search = "") {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await get({
        path: `/courses?${queryParams.toString()}`,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get a single course by ID
  static async getCourseById(courseId) {
    try {
      const response = await get({
        path: `/courses/${courseId}`,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create a new course
  static async createCourse(courseData) {
    try {
      const response = await post({
        path: "/courses",
        requestBody: courseData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update a course
  static async updateCourse(courseId, courseData) {
    try {
      const response = await fetch(`${baseUrl}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });
      const body = await response.json();
      return body;
    } catch (error) {
      throw error;
    }
  }

  // Delete a course
  static async deleteCourse(courseId) {
    try {
      const response = await fetch(`${baseUrl}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const body = await response.json();
      return body;
    } catch (error) {
      throw error;
    }
  }

  // Upload course content (files)
  static async uploadCourseContent(courseId, files, onUploadProgress) {
    try {
      const formData = new FormData();
      
      files.forEach((fileObj) => {
        formData.append("files", fileObj.file);
        formData.append("fileTypes", fileObj.type); // pdf, video, image
      });
      
      formData.append("courseId", courseId);

      const response = await axios.post(
        `${baseUrl}/courses/${courseId}/content`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onUploadProgress(percentCompleted);
            }
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get course content/materials
  static async getCourseContent(courseId) {
    try {
      const response = await get({
        path: `/courses/${courseId}/content`,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete course content
  static async deleteCourseContent(courseId, contentId) {
    try {
      const response = await fetch(
        `${baseUrl}/courses/${courseId}/content/${contentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const body = await response.json();
      return body;
    } catch (error) {
      throw error;
    }
  }

  // Download course content
  static getDownloadUrl(contentId) {
    return `${baseUrl}/courses/content/${contentId}/download`;
  }

  // Get file preview URL
  static getPreviewUrl(contentId) {
    return `${baseUrl}/courses/content/${contentId}/preview`;
  }
}

export default CourseService;
