 import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
 import store from "./app/store";
import React, { lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import ThemeProvider from "./theme";
import Loadable from "./components/Loadable/Loadable";
import LoadingAnimation from "./components/LoadingAnimation/LoadingAnimation";
import SuccessMessage from "./components/SuccessMessage/SuccessMessage";
import AuthService from "./services/AuthService";
import { setAuthData } from "./reducers/userSlice";
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
    element: <Layout />,
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

// Component to initialize auth state
const AuthInitializer = () => {
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

  return null;
};

const App = () => {
  return (
     <Provider store={store}>
    <ThemeProvider>
    <AuthInitializer />
    <SuccessMessage/>
    <LoadingAnimation />
      <RouterProvider router={router} />
    </ThemeProvider>
     </Provider>
  );
};

export default App;
