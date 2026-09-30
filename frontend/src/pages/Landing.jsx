import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  CheckSquare,
  Timer,
  Calendar,
  BarChart3,
  Flame,
  Sparkles,
  Target,
  ChevronDown,
  ChevronUp,
  Star,
  LayoutDashboard,
  TrendingUp,
  Menu,
  X,
  ShieldCheck,
  CreditCard,
  Cloud
} from "lucide-react";

import heroImg from "../assets/hero.png";
import "./Landing.css";

function Landing() {
  const [isLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));
  const [userName] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      return storedUser?.name ? storedUser.name.split(" ")[0] : "";
    } catch {
      return "";
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const faqs = [
    {
      q: "Is StudyFlow completely free to use?",
      a: "Yes! StudyFlow is 100% free for all students. You can manage unlimited subjects, track assignments, run Pomodoro study timers, and visualize academic trends with zero paywalls."
    },
    {
      q: "How does the study timer improve my academic focus?",
      a: "StudyFlow's study timer is built around the proven Pomodoro method. It features customizable focus intervals (15m, 25m, 45m, 60m, or custom durations) and automatically saves completed sessions into your analytics to track deep work."
    },
    {
      q: "Can I track multiple courses and upcoming deadlines together?",
      a: "Yes. You can assign tasks to specific subjects, set priority levels (High, Medium, Low), configure due dates, and view all coursework plotted on the interactive study calendar."
    },
    {
      q: "Does StudyFlow support Dark Mode and personal study goals?",
      a: "Absolutely! StudyFlow includes a sleek Dark Mode for late-night study sessions and lets you set a daily study hour target to maintain your study streak and build lasting discipline."
    },
    {
      q: "How do I get started?",
      a: "Click 'Get Started Free' at the top of the page, create your account in under 30 seconds, and you'll immediately enter your personalized student workspace."
    }
  ];

  return (
    <div className="landing-page">
      {/* Background Ambient Glowing Orbs */}
      <div className="lp-glow-orb lp-glow-1"></div>
      <div className="lp-glow-orb lp-glow-2"></div>
      <div className="lp-glow-orb lp-glow-3"></div>
      <div className="lp-glow-orb lp-glow-4"></div>

      {/* ===================================================================
          NAVBAR
          =================================================================== */}
      <header className="lp-navbar">
        <div className="lp-container">
          <div className="lp-nav-content">
            <Link to="/" className="lp-logo" onClick={closeMobileMenu}>
              <div className="lp-logo-icon">
                <GraduationCap size={24} />
              </div>
              <span className="lp-logo-text">
                StudyFlow
                <span className="lp-badge-version">v2.0</span>
              </span>
            </Link>

            <nav className="lp-nav-links">
              <a href="#features">Features</a>
              <a href="#preview">Preview</a>
              <a href="#workflow">How It Works</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#faq">FAQ</a>
            </nav>

            <div className="lp-nav-actions">
              {isLoggedIn ? (
                <>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--sf-text-muted)" }}>
                    Hi, {userName || "Student"} 👋
                  </span>
                  <Link to="/" className="lp-btn-primary">
                    <LayoutDashboard size={16} />
                    Open Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="lp-btn-ghost">
                    Sign In
                  </Link>
                  <Link to="/register" className="lp-btn-primary">
                    Get Started Free
                    <ArrowRight size={15} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              className="lp-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`lp-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <a href="#features" onClick={closeMobileMenu}>Features</a>
          <a href="#preview" onClick={closeMobileMenu}>Preview</a>
          <a href="#workflow" onClick={closeMobileMenu}>How It Works</a>
          <a href="#testimonials" onClick={closeMobileMenu}>Testimonials</a>
          <a href="#faq" onClick={closeMobileMenu}>FAQ</a>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
            {isLoggedIn ? (
              <Link to="/" className="lp-btn-primary" onClick={closeMobileMenu} style={{ justifyContent: "center" }}>
                <LayoutDashboard size={16} />
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="lp-btn-ghost" onClick={closeMobileMenu} style={{ textAlign: "center" }}>
                  Sign In
                </Link>
                <Link to="/register" className="lp-btn-primary" onClick={closeMobileMenu} style={{ justifyContent: "center" }}>
                  Get Started Free
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================================
          HERO SECTION (SPLIT SCREEN SAAS HERO)
          =================================================================== */}
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-grid">
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lp-hero-left">
              <div className="lp-pill-badge">
                <img src={heroImg} alt="StudyFlow 3D Icon" />
                <span>The All-In-One Workspace Built for Students</span>
              </div>

              <h1 className="lp-hero-title">
                Master Your Studies. <br />
                <span className="lp-hero-gradient">Plan Smarter. Achieve More.</span>
              </h1>

              <p className="lp-hero-subtitle">
                StudyFlow replaces scattered notes, chaotic spreadsheets, and missed deadlines with
                an intelligent workspace designed to maximize your focus, productivity, and academic results.
              </p>

              <div className="lp-hero-actions">
                {isLoggedIn ? (
                  <Link to="/" className="lp-btn-primary lp-btn-large">
                    <LayoutDashboard size={18} />
                    Open Your Dashboard
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="lp-btn-primary lp-btn-large">
                      Get Started Free
                      <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="lp-btn-secondary">
                      <Sparkles size={17} style={{ color: "#a855f7" }} />
                      Sign In to Account
                    </Link>
                  </>
                )}
              </div>

              {/* Trust / Benefit Indicators */}
              <div className="lp-hero-perks">
                <div className="lp-perk-item">
                  <ShieldCheck size={16} />
                  <span>100% Free Forever</span>
                </div>
                <div className="lp-perk-item">
                  <CreditCard size={16} />
                  <span>No Credit Card Needed</span>
                </div>
                <div className="lp-perk-item">
                  <Cloud size={16} />
                  <span>Instant Cloud Sync</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Glowing Dashboard Preview */}
            <div className="lp-hero-right" id="preview">
              <div className="lp-preview-glow-backdrop"></div>

              {/* Floating Badge: Streak */}
              <div className="lp-floating-badge lp-badge-left">
                <div style={{ background: "rgba(249, 115, 22, 0.18)", padding: "8px", borderRadius: "10px", display: "flex" }}>
                  <Flame size={20} style={{ color: "#f97316" }} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>7-Day Streak 🔥</div>
                  <div style={{ fontSize: "11px", color: "var(--sf-text-muted)" }}>Daily goal completed!</div>
                </div>
              </div>

              {/* Floating Badge: Progress */}
              <div className="lp-floating-badge lp-badge-right">
                <div style={{ background: "rgba(16, 185, 129, 0.18)", padding: "8px", borderRadius: "10px", display: "flex" }}>
                  <TrendingUp size={20} style={{ color: "#10b981" }} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>94% Completed ⚡</div>
                  <div style={{ fontSize: "11px", color: "var(--sf-text-muted)" }}>Weekly assignments done</div>
                </div>
              </div>

              {/* App Mockup Window */}
              <div className="lp-preview-card">
                <div className="lp-window-bar">
                  <div className="lp-window-dot lp-dot-red"></div>
                  <div className="lp-window-dot lp-dot-yellow"></div>
                  <div className="lp-window-dot lp-dot-green"></div>
                  <div className="lp-window-title">
                    <GraduationCap size={13} style={{ color: "#818cf8" }} />
                    StudyFlow — Student Productivity Hub
                  </div>
                </div>

                <div className="lp-mockup-body">
                  {/* Mini Sidebar */}
                  <div className="lp-mockup-sidebar">
                    <div className="lp-mock-logo">
                      <GraduationCap size={16} style={{ color: "#818cf8" }} />
                      <span>StudyFlow</span>
                    </div>
                    <div className="lp-mock-item active">
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </div>
                    <div className="lp-mock-item">
                      <BookOpen size={14} />
                      <span>Subjects</span>
                    </div>
                    <div className="lp-mock-item">
                      <CheckSquare size={14} />
                      <span>Tasks</span>
                    </div>
                    <div className="lp-mock-item">
                      <Timer size={14} />
                      <span>Timer</span>
                    </div>
                    <div className="lp-mock-item">
                      <Calendar size={14} />
                      <span>Calendar</span>
                    </div>
                    <div className="lp-mock-item">
                      <BarChart3 size={14} />
                      <span>Analytics</span>
                    </div>
                  </div>

                  {/* Mini Dashboard Content */}
                  <div className="lp-mockup-content">
                    <div className="lp-mock-header">
                      <div>
                        <h4>Welcome back, Alex 👋</h4>
                        <p style={{ fontSize: "11px", color: "var(--sf-text-muted)", margin: 0 }}>
                          Here is your academic overview today.
                        </p>
                      </div>
                      <span
                        style={{
                          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.25))",
                          border: "1px solid rgba(139, 92, 246, 0.4)",
                          color: "#c4b5fd",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          fontSize: "11px",
                          fontWeight: 700
                        }}
                      >
                        🎯 Daily Goal: 2h
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="lp-mock-stats-row">
                      <div className="lp-mock-stat-card">
                        <div className="lp-mock-stat-label">Hours</div>
                        <div className="lp-mock-stat-val" style={{ color: "#60a5fa" }}>18.5h</div>
                      </div>
                      <div className="lp-mock-stat-card">
                        <div className="lp-mock-stat-label">Tasks</div>
                        <div className="lp-mock-stat-val" style={{ color: "#34d399" }}>14/15</div>
                      </div>
                      <div className="lp-mock-stat-card">
                        <div className="lp-mock-stat-label">Courses</div>
                        <div className="lp-mock-stat-val" style={{ color: "#c084fc" }}>5 Enrolled</div>
                      </div>
                      <div className="lp-mock-stat-card">
                        <div className="lp-mock-stat-label">Streak</div>
                        <div className="lp-mock-stat-val" style={{ color: "#fb923c" }}>🔥 7 Days</div>
                      </div>
                    </div>

                    {/* Two Inner Preview Cards */}
                    <div className="lp-mock-cards-row">
                      <div className="lp-mock-subcard">
                        <h5>
                          <CheckSquare size={13} style={{ color: "#60a5fa" }} />
                          Today's Tasks
                        </h5>
                        <div className="lp-mock-task-item">
                          <span>Operating Systems Lab 4</span>
                          <span className="lp-mock-tag lp-tag-high">High</span>
                        </div>
                        <div className="lp-mock-task-item">
                          <span>Linear Algebra Homework</span>
                          <span className="lp-mock-tag lp-tag-med">Med</span>
                        </div>
                        <div className="lp-mock-task-item">
                          <span>Database Design Project</span>
                          <span className="lp-mock-tag lp-tag-med">Med</span>
                        </div>
                      </div>

                      <div className="lp-mock-subcard">
                        <h5>
                          <Timer size={13} style={{ color: "#c084fc" }} />
                          Pomodoro Focus
                        </h5>
                        <div style={{ textAlign: "center", padding: "6px 0" }}>
                          <div style={{ fontSize: "26px", fontWeight: 800, color: "#a78bfa", letterSpacing: "1px" }}>
                            24:50
                          </div>
                          <p style={{ fontSize: "10.5px", color: "var(--sf-text-muted)", margin: "2px 0 8px" }}>
                            Deep Focus • Computer Science
                          </p>
                          <span
                            style={{
                              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                              color: "white",
                              padding: "3px 12px",
                              borderRadius: "6px",
                              fontSize: "10.5px",
                              fontWeight: 700,
                              boxShadow: "0 2px 10px rgba(59, 130, 246, 0.4)"
                            }}
                          >
                            Active Focus Session
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          METRICS HIGHLIGHT BANNER
          =================================================================== */}
      <section className="lp-metrics-section">
        <div className="lp-container">
          <div className="lp-metrics-grid">
            <div className="lp-metric-card">
              <h3>100%</h3>
              <p>Free Forever for Students</p>
            </div>
            <div className="lp-metric-card">
              <h3>6-in-1</h3>
              <p>Integrated Academic Tools</p>
            </div>
            <div className="lp-metric-card">
              <h3>24/7</h3>
              <p>Cloud Synchronized & Secure</p>
            </div>
            <div className="lp-metric-card">
              <h3>4.9 / 5</h3>
              <p>Student Satisfaction Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FEATURE CARDS (BENTO GRID)
          =================================================================== */}
      <section className="lp-features-section" id="features">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-tag">Feature Suite</span>
            <h2 className="lp-section-title">Everything you need to excel in your studies</h2>
            <p className="lp-section-desc">
              StudyFlow brings together the vital tools students rely on into one cohesive,
              distraction-free, and beautiful workspace.
            </p>
          </div>

          <div className="lp-features-grid">
            {/* Feature 1 */}
            <div className="lp-feature-card">
              <div className="lp-feature-icon-wrapper lp-icon-blue">
                <BookOpen size={24} />
              </div>
              <h3>Subject & Course Hub</h3>
              <p>
                Organize all your courses in one centralized hub. Record module codes, credits,
                professor info, and track completion progress across every subject.
              </p>
              <div className="lp-feature-footer">
                <span>Structured Coursework</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="lp-feature-card">
              <div className="lp-feature-icon-wrapper lp-icon-purple">
                <CheckSquare size={24} />
              </div>
              <h3>Task & Deadline Tracker</h3>
              <p>
                Prioritize homework, term papers, and lab reports. Filter by High, Medium, or Low
                urgency and never let an assignment deadline slip past.
              </p>
              <div className="lp-feature-footer">
                <span>Priority Management</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="lp-feature-card">
              <div className="lp-feature-icon-wrapper lp-icon-pink">
                <Timer size={24} />
              </div>
              <h3>Pomodoro Focus Timer</h3>
              <p>
                Crush procrastination with integrated interval timers. Use standard 25, 45, or 60
                minute blocks or set custom durations for productive deep work.
              </p>
              <div className="lp-feature-footer">
                <span>Deep Work Mode</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="lp-feature-card">
              <div className="lp-feature-icon-wrapper lp-icon-emerald">
                <Calendar size={24} />
              </div>
              <h3>Interactive Study Calendar</h3>
              <p>
                Coordinate assignment due dates, quiz dates, and scheduled study sessions across an
                intuitive monthly calendar view.
              </p>
              <div className="lp-feature-footer">
                <span>Calendar Sync</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="lp-feature-card">
              <div className="lp-feature-icon-wrapper lp-icon-cyan">
                <BarChart3 size={24} />
              </div>
              <h3>Visual Analytics & Streaks</h3>
              <p>
                Understand your study habits with visual performance charts. Monitor your total hours,
                subject breakdown, and build an unbreakable study streak.
              </p>
              <div className="lp-feature-footer">
                <span>Data-Driven Growth</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="lp-feature-card">
              <div className="lp-feature-icon-wrapper lp-icon-amber">
                <Target size={24} />
              </div>
              <h3>Goals & Dark Mode</h3>
              <p>
                Set personalized daily study hour targets, toggle eye-friendly Dark Mode for late-night
                study marathons, and customize your study flow.
              </p>
              <div className="lp-feature-footer">
                <span>Personalized Workspace</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          HOW IT WORKS (WORKFLOW)
          =================================================================== */}
      <section className="lp-workflow-section" id="workflow">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-tag">Proven Workflow</span>
            <h2 className="lp-section-title">How StudyFlow elevates your academic performance</h2>
            <p className="lp-section-desc">
              Organize your semester and start achieving noticeable results in three easy steps.
            </p>
          </div>

          <div className="lp-steps-grid">
            <div className="lp-step-card">
              <div className="lp-step-number">1</div>
              <h3>Add Your Subjects & Goals</h3>
              <p>
                Enter your semester courses, set daily study targets, and establish a clear roadmap
                for all your modules.
              </p>
            </div>

            <div className="lp-step-card">
              <div className="lp-step-number">2</div>
              <h3>Plan Tasks & Run Focus Sessions</h3>
              <p>
                Break syllabi into prioritized tasks, assign due dates, and launch the Pomodoro
                timer to power through homework distraction-free.
              </p>
            </div>

            <div className="lp-step-card">
              <div className="lp-step-number">3</div>
              <h3>Track Analytics & Achieve High Grades</h3>
              <p>
                Review study charts, watch your streaks climb, and feel confident knowing you are
                always prepared for exams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          INTERACTIVE TABBED PREVIEW
          =================================================================== */}
      <section className="lp-interactive-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-tag">Interactive Tour</span>
            <h2 className="lp-section-title">Designed for every phase of your study routine</h2>
            <p className="lp-section-desc">
              Click through the tabs below to preview the tools built into StudyFlow.
            </p>
          </div>

          <div className="lp-tab-nav">
            <button
              className={`lp-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard size={16} />
              Dashboard Overview
            </button>
            <button
              className={`lp-tab-btn ${activeTab === "tasks" ? "active" : ""}`}
              onClick={() => setActiveTab("tasks")}
            >
              <CheckSquare size={16} />
              Task Prioritization
            </button>
            <button
              className={`lp-tab-btn ${activeTab === "timer" ? "active" : ""}`}
              onClick={() => setActiveTab("timer")}
            >
              <Timer size={16} />
              Pomodoro Timer
            </button>
            <button
              className={`lp-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 size={16} />
              Study Analytics
            </button>
          </div>

          <div className="lp-tab-content-box">
            {activeTab === "dashboard" && (
              <>
                <div className="lp-tab-text">
                  <h3>Your Academic Command Center</h3>
                  <p>
                    Get an instant morning briefing of your study commitments, upcoming deadlines, active
                    courses, and streak momentum in one unified view.
                  </p>
                  <ul className="lp-tab-bullets">
                    <li>
                      <CheckCircle2 size={18} />
                      Real-time summary of completed vs pending assignments
                    </li>
                    <li>
                      <CheckCircle2 size={18} />
                      Daily study goal progress bar and streak counter
                    </li>
                    <li>
                      <CheckCircle2 size={18} />
                      Quick-launch buttons for tasks and focus sessions
                    </li>
                  </ul>
                  <Link to={isLoggedIn ? "/" : "/register"} className="lp-btn-primary">
                    Try Dashboard Now
                    <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="lp-tab-visual">
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ padding: "16px", background: "rgba(15, 23, 42, 0.8)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>Daily Goal (2.0 hrs)</span>
                        <span style={{ fontSize: "12px", color: "#60a5fa", fontWeight: 700 }}>100% Achieved</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #3b82f6, #a855f7)" }}></div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ padding: "14px", background: "rgba(15, 23, 42, 0.8)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <div style={{ fontSize: "11px", color: "var(--sf-text-muted)" }}>Total Hours</div>
                        <div style={{ fontSize: "22px", fontWeight: 800, color: "#60a5fa" }}>42.8 hrs</div>
                      </div>
                      <div style={{ padding: "14px", background: "rgba(15, 23, 42, 0.8)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <div style={{ fontSize: "11px", color: "var(--sf-text-muted)" }}>Completed Tasks</div>
                        <div style={{ fontSize: "22px", fontWeight: 800, color: "#34d399" }}>38 Tasks</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "tasks" && (
              <>
                <div className="lp-tab-text">
                  <h3>Master Your Assignments with Zero Stress</h3>
                  <p>
                    Organize every quiz, lab report, reading assignment, and presentation with precise
                    priority tags and status toggles.
                  </p>
                  <ul className="lp-tab-bullets">
                    <li>
                      <CheckCircle2 size={18} />
                      Color-coded urgency indicators (High, Medium, Low)
                    </li>
                    <li>
                      <CheckCircle2 size={18} />
                      One-click completion checkboxes
                    </li>
                    <li>
                      <CheckCircle2 size={18} />
                      Filtered views to focus on what matters today
                    </li>
                  </ul>
                  <Link to={isLoggedIn ? "/" : "/register"} className="lp-btn-primary">
                    Create Your First Task
                    <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="lp-tab-visual">
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { title: "Distributed Systems Project Proposal", priority: "High", color: "#f87171" },
                      { title: "Database Normalization Exercises", priority: "Medium", color: "#fbbf24" },
                      { title: "Read Chapter 4: Computer Networks", priority: "Low", color: "#34d399" }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "14px 16px",
                          background: "rgba(15, 23, 42, 0.8)",
                          borderRadius: "12px",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <CheckCircle2 size={16} style={{ color: "#64748b" }} />
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>{item.title}</span>
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: item.color + "22",
                            color: item.color,
                            border: `1px solid ${item.color}44`
                          }}
                        >
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "timer" && (
              <>
                <div className="lp-tab-text">
                  <h3>Enter the Zone with Pomodoro Sessions</h3>
                  <p>
                    Interval studying produces deeper retention and less mental fatigue. Select your
                    preferred interval and lock in.
                  </p>
                  <ul className="lp-tab-bullets">
                    <li>
                      <CheckCircle2 size={18} />
                      Presets: 15m, 25m, 30m, 45m, 60m, or Custom duration
                    </li>
                    <li>
                      <CheckCircle2 size={18} />
                      Automatically records completed minutes to your subject stats
                    </li>
                    <li>
                      <CheckCircle2 size={18} />
                      Distraction-free interface designed for sustained focus
                    </li>
                  </ul>
                  <Link to={isLoggedIn ? "/" : "/register"} className="lp-btn-primary">
                    Start a Study Session
                    <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="lp-tab-visual" style={{ textAlign: "center", padding: "30px 20px" }}>
                  <div style={{ fontSize: "52px", fontWeight: 800, color: "#818cf8", letterSpacing: "2px" }}>
                    25:00
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--sf-text-muted)", marginBottom: "20px" }}>
                    Standard Pomodoro Focus Block
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    {["25m", "45m", "60m"].map((preset, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: 700,
                          background: i === 0 ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255, 255, 255, 0.05)",
                          color: "#ffffff",
                          border: "1px solid rgba(255, 255, 255, 0.12)"
                        }}
                      >
                        {preset}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "analytics" && (
              <>
                <div className="lp-tab-text">
                  <h3>Visual Insights on How You Learn</h3>
                  <p>
                    Turn hard work into clear charts. See how many hours you devoted to each subject, track
                    weekly study trends, and stay motivated.
                  </p>
                  <ul className="lp-tab-bullets">
                    <li>
                      <CheckCircle2 size={18} />
                      Total weekly study hours calculated automatically
                    </li>
                    <li>
                      <CheckCircle2 size={18} />
                      Subject breakdown to balance coursework effectively
                    </li>
                    <li>
                      <CheckCircle2 size={18} />
                      Visual progress indicators that reward consistency
                    </li>
                  </ul>
                  <Link to={isLoggedIn ? "/" : "/register"} className="lp-btn-primary">
                    Explore Analytics
                    <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="lp-tab-visual">
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { subject: "Computer Science", pct: 45, hours: "18.2h", color: "#60a5fa" },
                      { subject: "Mathematics", pct: 30, hours: "12.0h", color: "#c084fc" },
                      { subject: "Physics", pct: 25, hours: "9.5h", color: "#34d399" }
                    ].map((row, i) => (
                      <div key={i} style={{ background: "rgba(15, 23, 42, 0.8)", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                          <span style={{ color: "#ffffff" }}>{row.subject}</span>
                          <span style={{ color: row.color }}>{row.hours}</span>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "3px" }}>
                          <div style={{ width: `${row.pct}%`, height: "100%", background: row.color, borderRadius: "3px" }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================
          STUDENT TESTIMONIALS
          =================================================================== */}
      <section className="lp-testimonials-section" id="testimonials">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-tag">Student Stories</span>
            <h2 className="lp-section-title">Loved by students striving for top marks</h2>
            <p className="lp-section-desc">
              Here is how students use StudyFlow to elevate their GPA and organize their semesters.
            </p>
          </div>

          <div className="lp-testimonials-grid">
            <div className="lp-testimonial-card">
              <div>
                <div className="lp-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="lp-testimonial-quote">
                  "StudyFlow completely replaced the 4 different apps I was juggling. The Pomodoro timer
                  syncing directly into my study analytics helped me boost my GPA from 3.2 to 3.8."
                </p>
              </div>
              <div className="lp-user-info">
                <div className="lp-avatar">EK</div>
                <div>
                  <div className="lp-user-name">Elena Rostova</div>
                  <div className="lp-user-role">Computer Science Junior</div>
                </div>
              </div>
            </div>

            <div className="lp-testimonial-card">
              <div>
                <div className="lp-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="lp-testimonial-quote">
                  "The deadline and task management is a lifesaver. During finals week, having all my
                  assignment priorities color-coded in one dashboard kept me completely calm and organized."
                </p>
              </div>
              <div className="lp-user-info">
                <div className="lp-avatar" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}>
                  MP
                </div>
                <div>
                  <div className="lp-user-name">Marcus Patel</div>
                  <div className="lp-user-role">Pre-Med Student</div>
                </div>
              </div>
            </div>

            <div className="lp-testimonial-card">
              <div>
                <div className="lp-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="lp-testimonial-quote">
                  "The dark mode is gorgeous, and setting daily hour targets keeps me accountable every single
                  day. Best student productivity tool I have ever used!"
                </p>
              </div>
              <div className="lp-user-info">
                <div className="lp-avatar" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}>
                  SL
                </div>
                <div>
                  <div className="lp-user-name">Sarah Lin</div>
                  <div className="lp-user-role">Mechanical Engineering Sophomore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FREQUENTLY ASKED QUESTIONS
          =================================================================== */}
      <section className="lp-faq-section" id="faq">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-tag">Got Questions?</span>
            <h2 className="lp-section-title">Frequently Asked Questions</h2>
            <p className="lp-section-desc">
              Everything you need to know about StudyFlow and how it powers your learning.
            </p>
          </div>

          <div className="lp-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`lp-faq-item ${openFaq === index ? "active" : ""}`}>
                <button className="lp-faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={18} style={{ color: "#a855f7" }} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === index && (
                  <div className="lp-faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          FINAL HIGH-IMPACT CTA BANNER
          =================================================================== */}
      <section className="lp-cta-section">
        <div className="lp-container">
          <div className="lp-cta-card">
            <div className="lp-cta-glow"></div>
            <h2 className="lp-cta-title">Ready to take control of your study journey?</h2>
            <p className="lp-cta-desc">
              Join students who study smarter, manage deadlines effortlessly, and achieve higher grades
              with StudyFlow.
            </p>
            <div className="lp-cta-actions">
              {isLoggedIn ? (
                <Link to="/" className="lp-btn-cta">
                  <LayoutDashboard size={18} />
                  Open Your Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="lp-btn-cta">
                    Create Your Free Account
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    style={{
                      color: "#e2e8f0",
                      fontSize: "15px",
                      fontWeight: 600,
                      textDecoration: "none",
                      padding: "12px 20px"
                    }}
                  >
                    Already have an account? Sign In →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FOOTER
          =================================================================== */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-top">
            <div className="lp-footer-brand">
              <Link to="/" className="lp-logo">
                <div className="lp-logo-icon">
                  <GraduationCap size={22} />
                </div>
                <span className="lp-logo-text">StudyFlow</span>
              </Link>
              <p>
                An intelligent, all-in-one productivity suite built to help students learn, plan, and achieve
                their highest potential.
              </p>
            </div>

            <div className="lp-footer-links">
              <div className="lp-footer-col">
                <h5>Product</h5>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#preview">Preview</a></li>
                  <li><a href="#workflow">How It Works</a></li>
                  <li><a href="#testimonials">Testimonials</a></li>
                </ul>
              </div>

              <div className="lp-footer-col">
                <h5>Navigation</h5>
                <ul>
                  <li><Link to="/login">Sign In</Link></li>
                  <li><Link to="/register">Register</Link></li>
                  {isLoggedIn && <li><Link to="/">Dashboard</Link></li>}
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <div>
              © {new Date().getFullYear()} StudyFlow. All rights reserved.
            </div>
            <div>
              🌱 <em>Small steps every day lead to big results.</em>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
