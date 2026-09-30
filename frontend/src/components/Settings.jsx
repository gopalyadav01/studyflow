import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Target,
  Bell,
  Moon,
  Save,
  LogOut
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { apiRequest } from "../api/api";

function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dailyGoal, setDailyGoal] = useState("2");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ---------------------------------------
  // APPLY DARK MODE
  // ---------------------------------------

  useEffect(() => {
    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );
  }, [darkMode]);

  // ---------------------------------------
  // LOAD USER SETTINGS
  // ---------------------------------------

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await apiRequest(
          "/users/profile"
        );

        setName(user.name || "");
        setEmail(user.email || "");

        setDailyGoal(
          String(user.dailyGoal ?? 2)
        );

        setNotifications(
          user.notifications ?? true
        );

        setDarkMode(
          user.darkMode ?? false
        );

      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );

        setError(
          error.message ||
          "Failed to load settings."
        );

      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ---------------------------------------
  // SAVE SETTINGS
  // ---------------------------------------

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const data = await apiRequest(
        "/users/profile",
        {
          method: "PUT",

          body: JSON.stringify({
            name: name.trim(),
            dailyGoal: Number(dailyGoal),
            notifications,
            darkMode
          })
        }
      );

      // Update local user data
      const existingUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,

          name: data.user.name,
          email: data.user.email,

          dailyGoal: data.user.dailyGoal,
          notifications: data.user.notifications,
          darkMode: data.user.darkMode
        })
      );

      // Make sure the current page immediately
      // reflects the saved preference.
      document.body.classList.toggle(
        "dark-mode",
        data.user.darkMode
      );

      setDarkMode(
        data.user.darkMode
      );

      setMessage(
        "Settings saved successfully! ✅"
      );

    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      setError(
        error.message ||
        "Failed to save settings."
      );

    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------
  // LOGOUT
  // ---------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Remove dark mode when logging out.
    document.body.classList.remove(
      "dark-mode"
    );

    navigate("/login");
  };

  // ---------------------------------------
  // LOADING
  // ---------------------------------------

  if (loading) {
    return (
      <main className="dashboard">

        <div className="dashboard-header">

          <div>

            <h1>
              Settings ⚙️
            </h1>

            <p className="subtitle">
              Loading your settings...
            </p>

          </div>

        </div>

      </main>
    );
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <main className="dashboard">

      <div className="dashboard-header">

        <div>

          <h1>
            Settings ⚙️
          </h1>

          <p className="subtitle">
            Manage your profile and
            StudyFlow preferences.
          </p>

        </div>

      </div>


      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="settings-success">
          {message}
        </div>
      )}


      {/* ERROR MESSAGE */}

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}


      <div className="settings-grid">

        {/* =========================
            PROFILE
        ========================== */}

        <section className="section settings-card">

          <div className="settings-card-header">

            <div className="settings-icon purple">
              <User size={20} />
            </div>

            <div>

              <h2>
                Profile
              </h2>

              <p>
                Your personal information.
              </p>

            </div>

          </div>


          <div className="settings-form">

            <div className="settings-field">

              <label>
                Name
              </label>

              <div className="settings-input-wrapper">

                <User size={17} />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                />

              </div>

            </div>


            <div className="settings-field">

              <label>
                Email
              </label>

              <div className="settings-input-wrapper">

                <Mail size={17} />

                <input
                  type="email"
                  value={email}
                  disabled
                />

              </div>

              <small>
                Email cannot be changed from
                settings.
              </small>

            </div>

          </div>

        </section>


        {/* =========================
            STUDY PREFERENCES
        ========================== */}

        <section className="section settings-card">

          <div className="settings-card-header">

            <div className="settings-icon orange">
              <Target size={20} />
            </div>

            <div>

              <h2>
                Study Preferences
              </h2>

              <p>
                Set your daily study target.
              </p>

            </div>

          </div>


          <div className="settings-form">

            <div className="settings-field">

              <label>
                Daily Study Goal
              </label>

              <div className="settings-input-wrapper">

                <Target size={17} />

                <select
                  value={dailyGoal}
                  onChange={(e) =>
                    setDailyGoal(
                      e.target.value
                    )
                  }
                >

                  <option value="1">
                    1 hour
                  </option>

                  <option value="2">
                    2 hours
                  </option>

                  <option value="3">
                    3 hours
                  </option>

                  <option value="4">
                    4 hours
                  </option>

                  <option value="5">
                    5 hours
                  </option>

                  <option value="6">
                    6 hours
                  </option>

                  <option value="8">
                    8 hours
                  </option>

                  <option value="10">
                    10 hours
                  </option>

                </select>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            NOTIFICATIONS
        ========================== */}

        <section className="section settings-card">

          <div className="settings-card-header">

            <div className="settings-icon green">
              <Bell size={20} />
            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Control your study reminders.
              </p>

            </div>

          </div>


          <div className="settings-toggle-row">

            <div>

              <strong>
                Study reminders
              </strong>

              <span>
                Receive reminders to stay
                consistent.
              </span>

            </div>


            <button
              className={`toggle ${
                notifications
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
              type="button"
            >

              <span />

            </button>

          </div>

        </section>


        {/* =========================
            APPEARANCE
        ========================== */}

        <section className="section settings-card">

          <div className="settings-card-header">

            <div className="settings-icon blue">
              <Moon size={20} />
            </div>

            <div>

              <h2>
                Appearance
              </h2>

              <p>
                Customize your StudyFlow
                experience.
              </p>

            </div>

          </div>


          <div className="settings-toggle-row">

            <div>

              <strong>
                Dark mode
              </strong>

              <span>
                Use a darker interface.
              </span>

            </div>


            <button
              className={`toggle ${
                darkMode
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              type="button"
            >

              <span />

            </button>

          </div>

        </section>

      </div>


      {/* =========================
          ACTIONS
      ========================== */}

      <section className="section settings-actions">

        <button
          className="save-settings-button"
          onClick={handleSave}
          disabled={saving}
        >

          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>


        <button
          className="logout-button"
          onClick={handleLogout}
          type="button"
        >

          <LogOut size={18} />

          Logout

        </button>

      </section>

    </main>
  );
}

export default Settings;