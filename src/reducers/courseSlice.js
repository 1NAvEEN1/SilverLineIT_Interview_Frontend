import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  selectedCourse: null,
  searchQuery: "",
  currentPage: 1,
  hasMore: true,
  totalCourses: 0,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    appendCourses: (state, action) => {
      state.courses = [...state.courses, ...action.payload];
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setTotalCourses: (state, action) => {
      state.totalCourses = action.payload;
    },
    addCourse: (state, action) => {
      state.courses.unshift(action.payload);
      state.totalCourses += 1;
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(c => c.id !== action.payload);
      state.totalCourses -= 1;
    },
    resetCourses: (state) => {
      state.courses = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
});

export const {
  setCourses,
  appendCourses,
  setSelectedCourse,
  setSearchQuery,
  setCurrentPage,
  setHasMore,
  setTotalCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  resetCourses,
} = courseSlice.actions;

export default courseSlice.reducer;
