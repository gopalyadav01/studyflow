import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  User,
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

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password
        })
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
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
            <span>Join Ambitious Learners</span>
          </div>

          <h1 className="auth-left-title">
            Take complete control of your{" "}
            <span className="auth-gradient-text">academic success.</span>
          </h1>

          <p className="auth-left-subtitle">
            Sign up in seconds and experience how a focused, organized study dashboard transforms your
            grades, productivity, and peace of mind.
          </p>

          <div className="auth-benefits-list">
            <div className="auth-benefit-item">
              <div className="auth-benefit-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Setup all your semester courses and targets</span>
            </div>

            <div className="auth-benefit-item">
              <div className="auth-benefit-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Boost focus with customizable Pomodoro sessions</span>
            </div>

            <div className="auth-benefit-item">
              <div className="auth-benefit-icon">
                <CheckCircle2 size={16} />
              </div>
              <span>Visualize academic momentum with streak analytics</span>
            </div>
          </div>

          <div className="auth-trust-pill">
            <ShieldCheck size={16} style={{ color: "#60a5fa" }} />
            <span>
              <strong>Zero Cost</strong> • No credit card required • Instant setup
            </span>
          </div>
        </div>

        {/* Right Side: Glassmorphism Registration Card */}
        <div className="auth-card-wrapper">
          <div className="auth-card-glow"></div>

          <div className="auth-card">
            <div className="auth-card-header">
              <div className="auth-card-icon-badge">
                <GraduationCap size={28} />
              </div>
              <div className="auth-heading">
                <h2>Create Your Account 🚀</h2>
                <p>Start your smarter study journey today.</p>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

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
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login">
                Login
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

export default Register;