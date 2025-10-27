 import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./app/store";
import React, { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeProvider from "./theme";
import Loadable from "./components/Loadable/Loadable";
import LoadingAnimation from "./components/LoadingAnimation/LoadingAnimation";
import SuccessMessage from "./components/SuccessMessage/SuccessMessage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthService from "./services/AuthService";
import "./App.css";

//----------------------import Pages-----------------------------//
const Login = Loadable(lazy(() => import("./pages/Login/Login")));
const Register = Loadable(lazy(() => import("./pages/Register/Register")));
const Layout = Loadable(lazy(() => import("./layout/Layout")));
const Home = Loadable(lazy(() => import("./pages/Home/Home")));
const CourseForm = Loadable(lazy(() => import("./pages/CourseForm/CourseForm")));
const Profile = Loadable(lazy(() => import("./pages/Profile/Profile")));
const Test = Loadable(lazy(() => import("./pages/Test/Test")));

//--------------------------------------------------------------//

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/courses/add",
        element: <CourseForm mode="add" />,
      },
      {
        path: "/courses/edit/:id",
        element: <CourseForm mode="edit" />,
      },
      {
        path: "/courses/view/:id",
        element: <CourseForm mode="view" />,
      },
    ],
  },
]);

// Component to initialize auth state and setup token refresh
const AuthInitializer = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    // Setup automatic token refresh if user is authenticated
    if (isAuthenticated) {
      AuthService.setupTokenRefresh();
    }
  }, [isAuthenticated]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer />
        <SuccessMessage />
        <LoadingAnimation />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
