import { useEffect, useState } from "react";

import {
  Clock3,
  CheckCircle2,
  Flame,
  TrendingUp,
  BookOpen,
  Code2,
  Database,
  Atom,
  Plus,
  CalendarDays,
  ArrowRight,
  Target
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { apiRequest } from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);

  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // DYNAMIC TIME-BASED GREETING
  // ---------------------------------------

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    }
    if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    }
    if (hour >= 17 && hour < 21) {
      return "Good Evening";
    }
    return "Good Night";
  };

  const [greeting, setGreeting] = useState(getTimeGreeting);

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------
  // LOAD DASHBOARD DATA
  // ---------------------------------------

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    setUser(storedUser);

    const loadDashboardData = async () => {
      try {
        const [
          subjectsData,
          tasksData,
          sessionsData
        ] = await Promise.all([
          apiRequest("/subjects"),
          apiRequest("/tasks"),
          apiRequest("/study-sessions")
        ]);

        setSubjects(subjectsData);
        setTasks(tasksData);
        setStudySessions(sessionsData);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ---------------------------------------
  // TASK STATISTICS
  // ---------------------------------------

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const taskPercentage =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  // ---------------------------------------
  // TOTAL STUDY HOURS
  // ---------------------------------------

  const totalStudyMinutes = studySessions.reduce(
    (total, session) =>
      total + Number(session.duration || 0),
    0
  );

  const totalStudyHours = (
    totalStudyMinutes / 60
  ).toFixed(1);

  // ---------------------------------------
  // DATE HELPER
  // ---------------------------------------

  const getDateKey = (date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  // ---------------------------------------
  // WEEKLY ACTIVITY
  // ---------------------------------------

  const today = new Date();

  const weeklyActivity = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(today);

      date.setDate(
        today.getDate() - (6 - index)
      );

      const dateKey = getDateKey(date);

      const totalMinutes = studySessions
        .filter(
          (session) =>
            getDateKey(session.date) === dateKey
        )
        .reduce(
          (total, session) =>
            total + Number(session.duration || 0),
          0
        );

      return {
        day: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short"
          }
        ),
        hours: Number(
          (totalMinutes / 60).toFixed(1)
        ),
        dateKey
      };
    }
  );

  // ---------------------------------------
  // CURRENT STUDY STREAK
  // ---------------------------------------

  const studyDates = new Set(
    studySessions.map((session) =>
      getDateKey(session.date)
    )
  );

  let currentStreak = 0;

  const checkDate = new Date();

  while (
    studyDates.has(
      getDateKey(checkDate)
    )
  ) {
    currentStreak++;

    checkDate.setDate(
      checkDate.getDate() - 1
    );
  }

  // ---------------------------------------
  // CHART SCALING
  // ---------------------------------------

  const maxWeeklyHours = Math.max(
    ...weeklyActivity.map(
      (item) => item.hours
    ),
    1
  );

  // ---------------------------------------
  // SUBJECT ICON
  // ---------------------------------------

  const getSubjectIcon = (name) => {
    const subjectName =
      name.toLowerCase();

    if (subjectName.includes("java")) {
      return <BookOpen size={18} />;
    }

    if (
      subjectName.includes("dsa") ||
      subjectName.includes("data")
    ) {
      return <Code2 size={18} />;
    }

    if (
      subjectName.includes("react")
    ) {
      return <Atom size={18} />;
    }

    if (
      subjectName.includes("db") ||
      subjectName.includes("database")
    ) {
      return <Database size={18} />;
    }

    return <BookOpen size={18} />;
  };

  // ---------------------------------------
  // SUBJECT COLOR
  // ---------------------------------------

  const getSubjectColor = (index) => {
    const colors = [
      "purple-bg",
      "blue-bg",
      "cyan-bg",
      "orange-bg"
    ];

    return colors[
      index % colors.length
    ];
  };

  // ---------------------------------------
  // LOADING
  // ---------------------------------------

  if (loading) {
    return (
      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Loading dashboard...</h1>

            <p className="subtitle">
              Getting your study data.
            </p>
          </div>
        </div>

        <div className="dashboard-loading-grid">
          <div className="dashboard-skeleton"></div>
          <div className="dashboard-skeleton"></div>
          <div className="dashboard-skeleton"></div>
        </div>
      </main>
    );
  }

  // ---------------------------------------
  // DASHBOARD
  // ---------------------------------------

  return (
    <main className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header dashboard-header-polished">

        <div>
          <div className="dashboard-welcome">
            <span className="welcome-dot"></span>
            Your personal study dashboard
          </div>

          <h1>
            {greeting},{" "}
            {user?.name || "Student"} 👋
          </h1>

          <p className="subtitle">
            Here's your study overview for today.
            Keep making progress!
          </p>
        </div>

        <button
          className="calendar-button"
          onClick={() => navigate("/calendar")}
        >
          <CalendarDays size={18} />
          Today
        </button>
      </div>

      {/* STATISTICS */}

      <div className="stats">

        {/* STUDY HOURS */}

        <div className="card study-card polished-stat-card">

          <div className="card-top">

            <div className="card-icon purple">
              <Clock3 size={22} />
            </div>

            <TrendingUp
              size={20}
              className="trend-icon"
            />

          </div>

          <h3>Study Hours</h3>

          <p>{totalStudyHours} hrs</p>

          <span className="card-info">
            Total recorded study time
          </span>

        </div>

        {/* TASKS */}

        <div className="card task-card polished-stat-card">

          <div className="card-top">

            <div className="card-icon green">
              <CheckCircle2 size={22} />
            </div>

            <span className="stat-mini-badge">
              {taskPercentage}%
            </span>

          </div>

          <h3>Tasks Completed</h3>

          <p>
            {completedTasks} / {totalTasks}
          </p>

          <span className="card-info">
            {totalTasks === 0
              ? "No tasks added yet"
              : "Keep completing your tasks"}
          </span>

        </div>

        {/* STREAK */}

        <div className="card streak-card polished-stat-card">

          <div className="card-top">

            <div className="card-icon orange">
              <Flame size={22} />
            </div>

            <span className="streak-live">
              Active
            </span>

          </div>

          <h3>Current Streak</h3>

          <p>{currentStreak} Days 🔥</p>

          <span className="card-info">
            {currentStreak > 0
              ? "Keep your momentum going"
              : "Start studying to build a streak"}
          </span>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="dashboard-grid">

        {/* SUBJECT PROGRESS */}

        <section className="section progress-section">

          <div className="section-header">

            <div>
              <h2>Study Progress</h2>

              <p>
                Track your subject-wise progress
              </p>
            </div>

            <button
              className="small-button"
              onClick={() =>
                navigate("/subjects")
              }
            >
              View Details
              <ArrowRight size={15} />
            </button>

          </div>

          <div className="subject-progress">

            {subjects.length === 0 ? (

              <div className="dashboard-empty-state">

                <div className="empty-icon">
                  <BookOpen size={22} />
                </div>

                <strong>
                  No subjects yet
                </strong>

                <span>
                  Add your first subject to
                  start tracking progress.
                </span>

                <button
                  onClick={() =>
                    navigate("/subjects")
                  }
                >
                  Add Subject
                  <ArrowRight size={15} />
                </button>

              </div>

            ) : (

              subjects.map(
                (subject, index) => (

                  <div
                    className="subject-row"
                    key={subject._id}
                  >

                    <div className="subject-name">

                      <div
                        className={`subject-icon ${getSubjectColor(
                          index
                        )}`}
                      >
                        {getSubjectIcon(
                          subject.name
                        )}
                      </div>

                      <div className="subject-label">
                        <span>
                          {subject.name}
                        </span>

                        <small>
                          {subject.topicsCompleted || 0}
                          {" "}
                          /{" "}
                          {subject.totalTopics || 0}
                          {" "}
                          topics
                        </small>
                      </div>

                    </div>

                    <div className="progress-wrapper">

                      <div className="progress-bar">

                        <div
                          className="progress java-progress"
                          style={{
                            width: `${subject.progress}%`
                          }}
                        ></div>

                      </div>

                      <strong>
                        {subject.progress}%
                      </strong>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

        {/* WEEKLY ACTIVITY */}

        <section className="section activity-section">

          <div className="section-header">

            <div>
              <h2>Weekly Activity</h2>

              <p>
                Your study hours · Last 7 days
              </p>
            </div>

            <div className="activity-total">
              <Target size={15} />

              {weeklyActivity
                .reduce(
                  (total, item) =>
                    total + item.hours,
                  0
                )
                .toFixed(1)}
              {" "}hrs
            </div>

          </div>

          <div className="chart">

            {weeklyActivity.map(
              (item, index) => {

                const height =
                  item.hours > 0
                    ? Math.max(
                        (item.hours /
                          maxWeeklyHours) *
                          100,
                        8
                      )
                    : 3;

                const isToday =
                  index === 6;

                return (
                  <div
                    className={`chart-column ${
                      isToday
                        ? "today-column"
                        : ""
                    }`}
                    key={item.dateKey}
                  >

                    <div className="chart-value">
                      {item.hours}
                    </div>

                    <div
                      className={`chart-bar ${
                        isToday
                          ? "active-bar"
                          : ""
                      }`}
                      style={{
                        height:
                          `${height}%`
                      }}
                      title={`${item.day}: ${item.hours} hrs`}
                    ></div>

                  </div>
                );
              }
            )}

          </div>

          <div className="chart-days">

            {weeklyActivity.map(
              (item, index) => (

                <span
                  className={
                    index === 6
                      ? "today-day"
                      : ""
                  }
                  key={item.dateKey}
                >
                  {item.day}
                </span>

              )
            )}

          </div>

        </section>

      </div>

      {/* TODAY'S TASKS */}

      <section className="section tasks-section">

        <div className="section-header">

          <div>
            <h2>Today's Tasks</h2>

            <p>
              Stay consistent and finish
              what you start.
            </p>
          </div>

          <button
            className="add-task-button"
            onClick={() => navigate("/tasks")}
          >
            <Plus size={18} />
            Add Task
          </button>

        </div>

        {tasks.length === 0 ? (

          <div className="dashboard-empty-state task-empty-state">

            <div className="empty-icon green-empty">
              <CheckCircle2 size={22} />
            </div>

            <strong>
              You're all caught up!
            </strong>

            <span>
              No tasks have been added yet.
            </span>

            <button
              onClick={() =>
                navigate("/tasks")
              }
            >
              Create a Task
              <ArrowRight size={15} />
            </button>

          </div>

        ) : (

          <div className="dashboard-task-list">

            {tasks
              .slice(0, 5)
              .map((task) => (

                <div
                  className="task modern-task polished-task"
                  key={task._id}
                >

                  <span
                    className={`task-check ${
                      task.completed
                        ? "completed"
                        : ""
                    }`}
                  >
                    {task.completed
                      ? "✓"
                      : ""}
                  </span>

                  <div className="task-content">

                    <strong>
                      {task.title}
                    </strong>

                    <span>
                      {task.dueDate
                        ? `Due ${new Date(
                            task.dueDate
                          ).toLocaleDateString()}`
                        : "No due date"}
                    </span>

                  </div>

                  <span
                    className={`priority ${
                      task.completed
                        ? "completed-label"
                        : task.priority?.toLowerCase()
                    }`}
                  >
                    {task.completed
                      ? "Completed"
                      : task.priority}
                  </span>

                </div>

              ))}

          </div>

        )}

        {tasks.length > 5 && (
          <button
            className="view-all-tasks"
            onClick={() =>
              navigate("/tasks")
            }
          >
            View all {tasks.length} tasks
            <ArrowRight size={16} />
          </button>
        )}

      </section>

    </main>
  );
}

export default Dashboard;