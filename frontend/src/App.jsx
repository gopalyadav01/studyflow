import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Subjects from "./components/Subjects";
import Tasks from "./components/Tasks";
import StudyTimer from "./components/StudyTimer";
import Calendar from "./components/Calendar";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";

import { apiRequest } from "./api/api";


function AppContent() {
  const location = useLocation();

  const hasToken = Boolean(localStorage.getItem("token"));
  const isLandingView =
    location.pathname === "/landing" ||
    (!hasToken && location.pathname === "/");

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    isLandingView;


  // ---------------------------------------
  // APPLY SAVED THEME
  // ---------------------------------------

  useEffect(() => {

    const applyTheme = async () => {

      // First apply the locally saved preference
      // so the UI can switch immediately.

      const savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (savedUser?.darkMode !== undefined) {

        document.body.classList.toggle(
          "dark-mode",
          Boolean(savedUser.darkMode)
        );

      }


      // Then verify the latest preference from
      // the backend.

      const token =
        localStorage.getItem("token");

      if (!token) {
        return;
      }


      try {

        const user = await apiRequest(
          "/users/profile"
        );


        // Update local user data

        const existingUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...existingUser,
            name: user.name,
            email: user.email,
            dailyGoal: user.dailyGoal,
            notifications: user.notifications,
            darkMode: user.darkMode
          })
        );


        // Apply latest backend preference

        document.body.classList.toggle(
          "dark-mode",
          Boolean(user.darkMode)
        );

      } catch (error) {

        console.error(
          "Failed to load theme preference:",
          error
        );

      }

    };


    applyTheme();

  }, []);


  return (
    <div className="app">

      {!isAuthPage && <Sidebar />}


      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/landing"
          element={<Landing />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/"
          element={hasToken ? <Dashboard /> : <Landing />}
        />

        <Route
          path="/subjects"
          element={<Subjects />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

        <Route
          path="/timer"
          element={<StudyTimer />}
        />

        <Route
          path="/calendar"
          element={<Calendar />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </div>
  );
}


function App() {

  return (
    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
}


export default App;