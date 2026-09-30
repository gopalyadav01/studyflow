import { useEffect, useState } from "react";

import {
  TrendingUp,
  Clock3,
  CheckCircle2,
  Target,
  BookOpen,
  RefreshCw
} from "lucide-react";

import { apiRequest } from "../api/api";

function Analytics() {
  const [studySessions, setStudySessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Daily goal from Settings
  const [dailyGoal, setDailyGoal] = useState(2);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // ---------------------------------------
  // LOAD ANALYTICS DATA
  // ---------------------------------------

  const loadAnalyticsData = async (
    showMainLoading = true
  ) => {
    try {
      if (showMainLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [
        sessionsData,
        subjectsData,
        tasksData,
        userData
      ] = await Promise.all([
        apiRequest("/study-sessions"),
        apiRequest("/subjects"),
        apiRequest("/tasks"),
        apiRequest("/users/profile")
      ]);

      setStudySessions(sessionsData);
      setSubjects(subjectsData);
      setTasks(tasksData);

      setDailyGoal(
        Number(userData.dailyGoal || 2)
      );

    } catch (error) {
      console.error(
        "Failed to load analytics data:",
        error
      );

      setError(
        error.message ||
        "Unable to load analytics data. Please try again."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

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
  // TOTAL STUDY TIME
  // ---------------------------------------

  const totalStudyMinutes =
    studySessions.reduce(
      (total, session) =>
        total + Number(session.duration || 0),
      0
    );

  const totalStudyHours = (
    totalStudyMinutes / 60
  ).toFixed(1);

  // ---------------------------------------
  // TASK STATISTICS
  // ---------------------------------------

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const taskCompletionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  // ---------------------------------------
  // WEEKLY STUDY HOURS
  // ---------------------------------------

  const today = new Date();

  const weeklyHours = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(today);

      date.setDate(
        today.getDate() - (6 - index)
      );

      const dateKey = getDateKey(date);

      const minutes = studySessions
        .filter(
          (session) =>
            getDateKey(session.date) ===
            dateKey
        )
        .reduce(
          (total, session) =>
            total +
            Number(session.duration || 0),
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
          (minutes / 60).toFixed(1)
        ),
        dateKey
      };
    }
  );

  // ---------------------------------------
  // MAX CHART VALUE
  // ---------------------------------------

  const maxWeeklyHours = Math.max(
    ...weeklyHours.map(
      (item) => item.hours
    ),
    1
  );

  // ---------------------------------------
  // WEEKLY TOTAL
  // ---------------------------------------

  const weeklyTotalHours =
    weeklyHours.reduce(
      (total, item) =>
        total + item.hours,
      0
    );

  // ---------------------------------------
  // DAILY AVERAGE
  // ---------------------------------------

  const dailyAverage =
    weeklyTotalHours / 7;

  // ---------------------------------------
  // LONGEST SESSION
  // ---------------------------------------

  const longestSessionMinutes =
    studySessions.length > 0
      ? Math.max(
          ...studySessions.map(
            (session) =>
              Number(session.duration || 0)
          )
        )
      : 0;

  const longestSessionHours =
    (longestSessionMinutes / 60).toFixed(1);

  // ---------------------------------------
  // CURRENT STREAK
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
  // WEEKLY TASKS
  // ---------------------------------------

  const startOfWeek = new Date(today);

  startOfWeek.setDate(
    today.getDate() - 6
  );

  startOfWeek.setHours(
    0,
    0,
    0,
    0
  );

  const weeklyTasks = tasks.filter(
    (task) => {
      if (!task.dueDate) {
        return false;
      }

      const dueDate = new Date(
        task.dueDate
      );

      return (
        dueDate >= startOfWeek &&
        dueDate <= today
      );
    }
  );

  const completedWeeklyTasks =
    weeklyTasks.filter(
      (task) => task.completed
    ).length;

  const weeklyTaskRate =
    weeklyTasks.length > 0
      ? Math.round(
          (completedWeeklyTasks /
            weeklyTasks.length) *
            100
        )
      : 0;

  // ---------------------------------------
  // WEEKLY GOAL
  // ---------------------------------------

  const weeklyGoalHours =
    dailyGoal * 7;

  const weeklyGoalPercentage =
    weeklyGoalHours > 0
      ? Math.min(
          Math.round(
            (weeklyTotalHours /
              weeklyGoalHours) *
              100
          ),
          100
        )
      : 0;

  // ---------------------------------------
  // LOADING STATE
  // ---------------------------------------

  if (loading) {
    return (
      <main className="dashboard">

        <div className="dashboard-header">

          <div>

            <h1>
              Analytics 📊
            </h1>

            <p className="subtitle">
              Loading your study analytics...
            </p>

          </div>

        </div>

        <section className="section analytics-loading-card">

          <div className="analytics-loading-spinner">
            <RefreshCw size={24} />
          </div>

          <h2>
            Loading analytics...
          </h2>

          <p>
            Calculating your study progress and
            productivity.
          </p>

        </section>

      </main>
    );
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <main className="dashboard">

      {/* ==============================
          HEADER
      =============================== */}

      <div className="dashboard-header">

        <div>

          <h1>
            Analytics 📊
          </h1>

          <p className="subtitle">
            Understand your study habits
            and track your progress.
          </p>

        </div>

        <button
          className="small-button"
          onClick={() =>
            loadAnalyticsData(false)
          }
          disabled={refreshing}
        >

          <RefreshCw
            size={16}
            className={
              refreshing
                ? "analytics-refresh-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* ==============================
          ERROR
      =============================== */}

      {error && (
        <div className="analytics-error">

          <div>

            <strong>
              Unable to load analytics
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            className="small-button"
            onClick={() =>
              loadAnalyticsData(false)
            }
            disabled={refreshing}
          >
            Try Again
          </button>

        </div>
      )}


      {/* ==============================
          SUMMARY CARDS
      =============================== */}

      <div className="analytics-stats">

        {/* Total Study Time */}

        <div className="analytics-stat">

          <div className="analytics-stat-icon purple">

            <Clock3 size={21} />

          </div>

          <div>

            <span>
              Total Study Time
            </span>

            <strong>
              {totalStudyHours} hrs
            </strong>

            <small>
              {weeklyTotalHours.toFixed(1)} hrs
              this week
            </small>

          </div>

        </div>


        {/* Tasks Completed */}

        <div className="analytics-stat">

          <div className="analytics-stat-icon green">

            <CheckCircle2 size={21} />

          </div>

          <div>

            <span>
              Tasks Completed
            </span>

            <strong>
              {completedTasks}
            </strong>

            <small>
              {taskCompletionRate}%
              completion rate
            </small>

          </div>

        </div>


        {/* Weekly Goal */}

        <div className="analytics-stat">

          <div className="analytics-stat-icon orange">

            <Target size={21} />

          </div>

          <div>

            <span>
              Weekly Goal
            </span>

            <strong>
              {weeklyGoalPercentage}%
            </strong>

            <small>
              {weeklyTotalHours.toFixed(1)}
              {" / "}
              {weeklyGoalHours} hours
            </small>

          </div>

        </div>

      </div>


      {/* ==============================
          CHARTS
      =============================== */}

      <div className="analytics-grid">

        {/* WEEKLY ACTIVITY */}

        <section className="section analytics-chart-card">

          <div className="section-header">

            <div>

              <h2>
                Weekly Study Hours
              </h2>

              <p>
                Your study activity
                this week.
              </p>

            </div>

            <TrendingUp
              size={20}
              className="trend-icon"
            />

          </div>


          <div className="analytics-bar-chart">

            {weeklyHours.map(
              (item) => {

                const barHeight =
                  item.hours > 0
                    ? Math.max(
                        (item.hours /
                          maxWeeklyHours) *
                          100,
                        5
                      )
                    : 0;

                return (

                  <div
                    className="bar-column"
                    key={item.dateKey}
                  >

                    <span className="bar-value">
                      {item.hours}h
                    </span>

                    <div className="bar-background">

                      <div
                        className="bar-fill"
                        style={{
                          height:
                            `${barHeight}%`
                        }}
                      />

                    </div>

                    <span className="bar-label">
                      {item.day}
                    </span>

                  </div>

                );
              }
            )}

          </div>

        </section>


        {/* SUBJECT PROGRESS */}

        <section className="section analytics-subject-card">

          <div className="section-header">

            <div>

              <h2>
                Subject Progress
              </h2>

              <p>
                Current learning progress.
              </p>

            </div>

            <BookOpen
              size={20}
              className="trend-icon"
            />

          </div>


          <div className="analytics-subjects">

            {subjects.length === 0 ? (

              <p className="empty-message">
                No subjects added yet.
              </p>

            ) : (

              subjects.map(
                (subject) => (

                  <div
                    className="analytics-subject"
                    key={subject._id}
                  >

                    <div className="analytics-subject-info">

                      <span>
                        {subject.name}
                      </span>

                      <strong>
                        {subject.progress}%
                      </strong>

                    </div>


                    <div className="analytics-progress">

                      <div
                        style={{
                          width:
                            `${subject.progress}%`
                        }}
                      />

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

      </div>


      {/* ==============================
          PRODUCTIVITY OVERVIEW
      =============================== */}

      <section className="section productivity-card">

        <div className="section-header">

          <div>

            <h2>
              Productivity Overview
            </h2>

            <p>
              A quick look at your
              study performance.
            </p>

          </div>

        </div>


        <div className="productivity-grid">

          {/* Daily Average */}

          <div className="productivity-item">

            <span>
              Daily Average
            </span>

            <strong>
              {dailyAverage.toFixed(1)} hrs
            </strong>

            <small>
              Study time per day
            </small>

          </div>


          {/* Longest Session */}

          <div className="productivity-item">

            <span>
              Longest Session
            </span>

            <strong>
              {longestSessionHours} hrs
            </strong>

            <small>
              Single study session
            </small>

          </div>


          {/* Current Streak */}

          <div className="productivity-item">

            <span>
              Current Streak
            </span>

            <strong>
              {currentStreak} Days 🔥
            </strong>

            <small>
              Keep it going!
            </small>

          </div>


          {/* Tasks This Week */}

          <div className="productivity-item">

            <span>
              Tasks This Week
            </span>

            <strong>
              {completedWeeklyTasks} /{" "}
              {weeklyTasks.length}
            </strong>

            <small>
              {weeklyTaskRate}%
              completed
            </small>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Analytics;