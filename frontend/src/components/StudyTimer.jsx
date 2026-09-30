import { useEffect, useState } from "react";

import {
  Play,
  Pause,
  RotateCcw,
  Clock3
} from "lucide-react";

import { apiRequest } from "../api/api";

function StudyTimer() {
  // =========================
  // Timer State
  // =========================

  const [selectedMinutes, setSelectedMinutes] =
    useState(25);

  const [customMinutes, setCustomMinutes] =
    useState("");

  const [time, setTime] = useState(25 * 60);

  const [isRunning, setIsRunning] =
    useState(false);

  // =========================
  // Subjects
  // =========================

  const [subjects, setSubjects] =
    useState([]);

  const [subject, setSubject] =
    useState("");

  const [loadingSubjects, setLoadingSubjects] =
    useState(true);

  // =========================
  // Saving
  // =========================

  const [savingSession, setSavingSession] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // =========================
  // Load Subjects
  // =========================

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data =
          await apiRequest("/subjects");

        setSubjects(data);

        if (data.length > 0) {
          setSubject(data[0]._id);
        }

      } catch (error) {
        console.error(
          "Failed to load subjects:",
          error
        );

        setMessage(
          "Unable to load subjects. Please try again."
        );

      } finally {
        setLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  // =========================
  // Timer
  // =========================

  useEffect(() => {
    let interval;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  // =========================
  // Timer Completed
  // =========================

  useEffect(() => {
    if (time === 0 && isRunning) {
      setIsRunning(false);
      saveStudySession();
    }
  }, [time, isRunning]);

  // =========================
  // Change Duration
  // =========================

  const changeDuration = (minutes) => {
    if (isRunning || savingSession) {
      return;
    }

    setSelectedMinutes(minutes);
    setCustomMinutes("");
    setTime(minutes * 60);
    setMessage("");
  };

  // =========================
  // Custom Duration
  // =========================

  const handleCustomDuration = (value) => {
    if (isRunning || savingSession) {
      return;
    }

    setCustomMinutes(value);

    const minutes = Number(value);

    if (
      minutes >= 1 &&
      minutes <= 180
    ) {
      setSelectedMinutes(minutes);
      setTime(minutes * 60);
      setMessage("");
    }
  };

  // =========================
  // Save Study Session
  // =========================

  const saveStudySession = async () => {
    try {
      setSavingSession(true);
      setMessage("");

      const studiedSeconds =
        selectedMinutes * 60 - time;

      const studiedMinutes =
        Math.floor(
          studiedSeconds / 60
        );

      // Don't save empty sessions
      if (studiedMinutes <= 0) {
        setTime(
          selectedMinutes * 60
        );

        return;
      }

      await apiRequest(
        "/study-sessions",
        {
          method: "POST",
          body: JSON.stringify({
            subject:
              subject || undefined,
            duration:
              studiedMinutes
          })
        }
      );

      setMessage(
        `🎉 Great job! You studied for ${studiedMinutes} minute${
          studiedMinutes !== 1
            ? "s"
            : ""
        }. Your session was saved.`
      );

      setTime(
        selectedMinutes * 60
      );

    } catch (error) {
      console.error(
        "Failed to save study session:",
        error
      );

      setMessage(
        error.message ||
        "Your study session could not be saved."
      );

    } finally {
      setSavingSession(false);
    }
  };

  // =========================
  // Format Time
  // =========================

  const formatTime = (seconds) => {
    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const remainingSeconds =
      seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =========================
  // Reset Timer
  // =========================

  const resetTimer = async () => {
    if (savingSession) {
      return;
    }

    const studiedSeconds =
      selectedMinutes * 60 - time;

    const studiedMinutes =
      Math.floor(
        studiedSeconds / 60
      );

    setIsRunning(false);

    // Nothing studied
    if (studiedMinutes <= 0) {
      setTime(
        selectedMinutes * 60
      );

      setMessage("");

      return;
    }

    try {
      setSavingSession(true);
      setMessage("");

      await apiRequest(
        "/study-sessions",
        {
          method: "POST",
          body: JSON.stringify({
            subject:
              subject || undefined,
            duration:
              studiedMinutes
          })
        }
      );

      setMessage(
        `⏱️ Session saved! You studied for ${studiedMinutes} minute${
          studiedMinutes !== 1
            ? "s"
            : ""
        }.`
      );

      setTime(
        selectedMinutes * 60
      );

    } catch (error) {
      console.error(
        "Failed to save study session:",
        error
      );

      setMessage(
        error.message ||
        "Your session could not be saved."
      );

    } finally {
      setSavingSession(false);
    }
  };

  // =========================
  // Start Timer
  // =========================

  const startTimer = () => {
    if (selectedMinutes < 1) {
      setMessage(
        "Please select a valid study duration."
      );

      return;
    }

    setMessage("");
    setIsRunning(true);
  };

  // =========================
  // Render
  // =========================

  return (
    <main className="dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h1>
            Study Timer ⏱️
          </h1>

          <p className="subtitle">
            Choose your study duration and
            start focusing.
          </p>
        </div>

      </div>

      {/* Timer */}

      <section className="timer-container">

        <div className="timer-card">

          <div className="timer-icon">
            <Clock3 size={24} />
          </div>

          <h2>
            Focus Session
          </h2>

          <p className="timer-subtitle">
            Set your own study time and
            stay focused.
          </p>

          {/* Duration Selection */}

          <div className="timer-duration-section">

            <label>
              Choose Duration
            </label>

            <div className="timer-presets">

              <button
                className={
                  selectedMinutes === 15 &&
                  !customMinutes
                    ? "duration-option active"
                    : "duration-option"
                }
                onClick={() =>
                  changeDuration(15)
                }
                disabled={
                  isRunning ||
                  savingSession
                }
              >
                15 min
              </button>

              <button
                className={
                  selectedMinutes === 25 &&
                  !customMinutes
                    ? "duration-option active"
                    : "duration-option"
                }
                onClick={() =>
                  changeDuration(25)
                }
                disabled={
                  isRunning ||
                  savingSession
                }
              >
                25 min
              </button>

              <button
                className={
                  selectedMinutes === 30 &&
                  !customMinutes
                    ? "duration-option active"
                    : "duration-option"
                }
                onClick={() =>
                  changeDuration(30)
                }
                disabled={
                  isRunning ||
                  savingSession
                }
              >
                30 min
              </button>

              <button
                className={
                  selectedMinutes === 45 &&
                  !customMinutes
                    ? "duration-option active"
                    : "duration-option"
                }
                onClick={() =>
                  changeDuration(45)
                }
                disabled={
                  isRunning ||
                  savingSession
                }
              >
                45 min
              </button>

              <button
                className={
                  selectedMinutes === 60 &&
                  !customMinutes
                    ? "duration-option active"
                    : "duration-option"
                }
                onClick={() =>
                  changeDuration(60)
                }
                disabled={
                  isRunning ||
                  savingSession
                }
              >
                60 min
              </button>

              <button
                className={
                  selectedMinutes === 90 &&
                  !customMinutes
                    ? "duration-option active"
                    : "duration-option"
                }
                onClick={() =>
                  changeDuration(90)
                }
                disabled={
                  isRunning ||
                  savingSession
                }
              >
                90 min
              </button>

            </div>

            {/* Custom Duration */}

            <div className="custom-duration">

              <input
                type="number"
                min="1"
                max="180"
                placeholder="Custom minutes"
                value={customMinutes}
                onChange={(e) =>
                  handleCustomDuration(
                    e.target.value
                  )
                }
                disabled={
                  isRunning ||
                  savingSession
                }
              />

              <span>
                1–180 min
              </span>

            </div>

          </div>

          {/* Timer Circle */}

          <div
  className="timer-circle"
  style={{
    "--progress": `${
      (time / (selectedMinutes * 60)) * 100
    }%`
  }}
>
  <div className="timer-inner">
    <span className="timer-display">
      {formatTime(time)}
    </span>

    <span className="timer-label">
      {savingSession
        ? "Saving session..."
        : isRunning
        ? "Studying..."
        : "Ready to focus"}
    </span>
  </div>
</div>

          {/* Subject */}

          <div className="subject-selector">

            <label>
              Study Subject
            </label>

            {loadingSubjects ? (

              <select disabled>
                <option>
                  Loading subjects...
                </option>
              </select>

            ) : subjects.length === 0 ? (

              <select disabled>
                <option>
                  No subjects available
                </option>
              </select>

            ) : (

              <select
                value={subject}
                onChange={(e) =>
                  setSubject(
                    e.target.value
                  )
                }
                disabled={
                  isRunning ||
                  savingSession
                }
              >

                {subjects.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            )}

          </div>

          {/* Message */}

          {message && (
            <div className="timer-message">
              {message}
            </div>
          )}

          {/* Buttons */}

          <div className="timer-buttons">

            {!isRunning ? (

              <button
                className="timer-start"
                onClick={startTimer}
                disabled={
                  savingSession ||
                  subjects.length === 0
                }
              >
                <Play size={18} />
                Start
              </button>

            ) : (

              <button
                className="timer-pause"
                onClick={() =>
                  setIsRunning(false)
                }
                disabled={savingSession}
              >
                <Pause size={18} />
                Pause
              </button>

            )}

            <button
              className="timer-reset"
              onClick={resetTimer}
              disabled={
                savingSession
              }
            >
              <RotateCcw size={18} />
              Reset
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}

export default StudyTimer;