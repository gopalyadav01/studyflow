import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck
} from "lucide-react";

import { apiRequest } from "../api/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Login API call
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password
        })
      });

      // Save token
      localStorage.setItem("token", data.token);

      // Fetch complete user profile
      const user = await apiRequest("/users/profile");

      // Save complete user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user._id,
          name: user.name,
          email: user.email,
          dailyGoal: user.dailyGoal,
          notifications: user.notifications,
          darkMode: user.darkMode
        })
      );

      // Apply saved theme immediately
      document.body.classList.toggle(
        "dark-mode",
        Boolean(user.darkMode)
      );

      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Ambient Glowing Orbs */}
      <div className="auth-glow-orb auth-glow-1"></div>
      <div className="auth-glow-orb auth-glow-2"></div>

      {/* Top Header */}
      <header className="auth-topbar">
        <Link to="/" className="auth-topbar-logo">
          <div className="auth-topbar-icon">
            <GraduationCap size={22} />
          </div>
          <span className="auth-topbar-title">StudyFlow</span>
        </Link>

        <Link to="/" className="auth-back-link">
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Two-Column Auth Container */}
      <main className="auth-container">
        {/* Left Side: Brand, Value Proposition & Benefits */}
        <div className="auth-left">
          <div className="auth-brand-badge">
            <Sparkles size={14} style={{ color: "#a855f7" }} />
            <span>Student Productivity Suite</span>
          </div>

          <h1 className="auth-left-title">
            Your smarter workspace for{" "}
            <span className="auth-gradient-text">better learning.</span>
          </h1>

          <p className="auth-left-subtitle">
            StudyFlow connects your subjects, assignments, focus sessions, and academic calendar into
            one high-performance dashboard.
          </p>

          <div className="auth-benefits-list">
            <div className="auth-benefit-item">
              <div className="auth-benefit-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Organize your courses & modules in one place</span>
            </div>

            <div className="auth-benefit-item">
              <div className="auth-benefit-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Track daily study streaks and deep work hours</span>
            </div>

            <div className="auth-benefit-item">
              <div className="auth-benefit-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Stay ahead of assignments and upcoming exams</span>
            </div>
          </div>

          <div className="auth-trust-pill">
            <ShieldCheck size={16} style={{ color: "#60a5fa" }} />
            <span>
              <strong>100% Free</strong> for students • Cloud synchronized
            </span>
          </div>
        </div>

        {/* Right Side: Glassmorphism Login Card */}
        <div className="auth-card-wrapper">
          <div className="auth-card-glow"></div>

          <div className="auth-card">
            <div className="auth-card-header">
              <div className="auth-card-icon-badge">
                <GraduationCap size={28} />
              </div>
              <div className="auth-heading">
                <h2>Welcome Back 👋</h2>
                <p>Login to continue your study journey.</p>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="auth-spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <Link to="/register">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="auth-footer">
        © {new Date().getFullYear()} StudyFlow. Learn • Plan • Achieve
      </footer>
    </div>
  );
}

export default Login;