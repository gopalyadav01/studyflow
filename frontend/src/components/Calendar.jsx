import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCw
} from "lucide-react";

import { apiRequest } from "../api/api";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  const [studySessions, setStudySessions] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const dayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // ---------------------------------------
  // LOAD CALENDAR DATA
  // ---------------------------------------

  const loadCalendarData = async (
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
        tasksData
      ] = await Promise.all([
        apiRequest("/study-sessions"),
        apiRequest("/tasks")
      ]);

      setStudySessions(sessionsData);
      setTasks(tasksData);

    } catch (error) {
      console.error(
        "Failed to load calendar data:",
        error
      );

      setError(
        error.message ||
        "Unable to load calendar data. Please try again."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, []);

  // ---------------------------------------
  // DATE KEY HELPER
  // ---------------------------------------

  const getDateKey = (date) => {
    if (
      typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return date;
    }

    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  // ---------------------------------------
  // NAVIGATION
  // ---------------------------------------

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  // ---------------------------------------
  // DAY CHECKS
  // ---------------------------------------

  const isToday = (day) => {
    const today = new Date();

    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  // ---------------------------------------
  // GET DATE ACTIVITY
  // ---------------------------------------

  const getActivity = (day) => {
    const date = new Date(
      year,
      month,
      day
    );

    const dateKey = getDateKey(date);

    const hasStudySession =
      studySessions.some(
        (session) =>
          getDateKey(session.date) === dateKey
      );

    const hasTask =
      tasks.some(
        (task) =>
          task.dueDate &&
          getDateKey(task.dueDate) === dateKey
      );

    return hasStudySession || hasTask;
  };

  // ---------------------------------------
  // SELECTED DATE DATA
  // ---------------------------------------

  const selectedDateKey =
    getDateKey(selectedDate);

  const selectedStudySessions =
    studySessions.filter(
      (session) =>
        getDateKey(session.date) ===
        selectedDateKey
    );

  const selectedTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      getDateKey(task.dueDate) ===
        selectedDateKey
  );

  // ---------------------------------------
  // STUDY TIME
  // ---------------------------------------

  const selectedStudyMinutes =
    selectedStudySessions.reduce(
      (total, session) =>
        total +
        Number(session.duration || 0),
      0
    );

  const selectedStudyHours =
    (selectedStudyMinutes / 60).toFixed(1);

  // ---------------------------------------
  // TASK STATISTICS
  // ---------------------------------------

  const completedSelectedTasks =
    selectedTasks.filter(
      (task) => task.completed
    ).length;

  const totalSelectedTasks =
    selectedTasks.length;

  // ---------------------------------------
  // LOADING STATE
  // ---------------------------------------

  if (loading) {
    return (
      <main className="dashboard">

        <div className="dashboard-header">

          <div>
            <h1>
              Study Calendar 📅
            </h1>

            <p className="subtitle">
              Loading your study activity...
            </p>
          </div>

        </div>

        <section className="section calendar-loading-card">

          <div className="calendar-loading-spinner">
            <RefreshCw size={24} />
          </div>

          <h2>
            Loading calendar...
          </h2>

          <p>
            Fetching your study sessions and tasks.
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
            Study Calendar 📅
          </h1>

          <p className="subtitle">
            Track your study activity and
            daily tasks.
          </p>

        </div>

        <div className="calendar-header-actions">

          <button
            className="small-button"
            onClick={() =>
              loadCalendarData(false)
            }
            disabled={refreshing}
          >

            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "calendar-refresh-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

          <button
            className="today-button"
            onClick={goToToday}
          >
            Today
          </button>

        </div>

      </div>


      {/* ==============================
          ERROR
      =============================== */}

      {error && (
        <div className="calendar-error">

          <div>
            <strong>
              Unable to load calendar
            </strong>

            <p>
              {error}
            </p>
          </div>

          <button
            className="small-button"
            onClick={() =>
              loadCalendarData(false)
            }
            disabled={refreshing}
          >
            Try Again
          </button>

        </div>
      )}


      <div className="calendar-layout">

        {/* ==============================
            CALENDAR
        =============================== */}

        <section className="section calendar-card">

          <div className="calendar-header">

            <button
              className="calendar-nav"
              onClick={previousMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>


            <h2>
              {monthNames[month]} {year}
            </h2>


            <button
              className="calendar-nav"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>

          </div>


          {/* WEEK DAYS */}

          <div className="calendar-weekdays">

            {dayNames.map((day) => (
              <div key={day}>
                {day}
              </div>
            ))}

          </div>


          {/* CALENDAR DAYS */}

          <div className="calendar-grid">

            {/* EMPTY DAYS */}

            {Array.from({
              length: firstDay
            }).map((_, index) => (

              <div
                key={`empty-${index}`}
                className="calendar-day empty"
              />

            ))}


            {/* MONTH DAYS */}

            {Array.from(
              {
                length: daysInMonth
              },
              (_, index) => index + 1
            ).map((day) => (

              <button
                key={day}
                className={`calendar-day ${
                  isToday(day)
                    ? "today"
                    : ""
                } ${
                  isSelected(day)
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      year,
                      month,
                      day
                    )
                  )
                }
              >

                <span>
                  {day}
                </span>


                {/* ACTIVITY DOT */}

                {getActivity(day) && (
                  <span className="activity-dot" />
                )}

              </button>

            ))}

          </div>

        </section>


        {/* ==============================
            SELECTED DAY
        =============================== */}

        <section className="section selected-day-card">

          <div className="selected-day-header">

            <div className="selected-icon">

              <CalendarDays size={22} />

            </div>


            <div>

              <h2>
                {selectedDate.toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric"
                  }
                )}
              </h2>

              <p>
                Your study activity
              </p>

            </div>

          </div>


          {/* ==============================
              SUMMARY
          =============================== */}

          <div className="calendar-summary">

            {/* STUDY TIME */}

            <div>

              <Clock3 size={18} />

              <span>

                <strong>
                  {selectedStudyHours} hrs
                </strong>

                Study Time

              </span>

            </div>


            {/* TASKS */}

            <div>

              <CheckCircle2 size={18} />

              <span>

                <strong>
                  {completedSelectedTasks} /{" "}
                  {totalSelectedTasks}
                </strong>

                Tasks Done

              </span>

            </div>

          </div>


          {/* ==============================
              TASK LIST
          =============================== */}

          <h3>
            Tasks
          </h3>


          <div className="calendar-tasks">

            {selectedTasks.length === 0 ? (

              <p className="empty-message">
                No tasks for this day.
              </p>

            ) : (

              selectedTasks.map((task) => (

                <div
                  className={`calendar-task ${
                    task.completed
                      ? "calendar-task-completed"
                      : ""
                  }`}
                  key={task._id}
                >

                  {task.completed ? (

                    <CheckCircle2 size={19} />

                  ) : (

                    <div className="task-circle" />

                  )}


                  <div>

                    <strong>
                      {task.title}
                    </strong>

                    <span>
                      {task.subject?.name ||
                        "General"}
                    </span>

                  </div>

                </div>

              ))

            )}

          </div>


          {/* ==============================
              STUDY SESSIONS
          =============================== */}

          {selectedStudySessions.length > 0 && (

            <>

              <h3>
                Study Sessions
              </h3>

              <div className="calendar-tasks">

                {selectedStudySessions.map(
                  (session) => (

                    <div
                      className="calendar-task"
                      key={session._id}
                    >

                      <Clock3 size={19} />

                      <div>

                        <strong>
                          {session.duration} min
                        </strong>

                        <span>
                          {session.subject?.name ||
                            "General"}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </>

          )}

        </section>

      </div>

    </main>
  );
}

export default Calendar;