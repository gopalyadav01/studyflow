import { useEffect, useState } from "react";

import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  CalendarDays,
  RefreshCw
} from "lucide-react";

import { apiRequest } from "../api/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // Load Tasks + Subjects
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [tasksData, subjectsData] = await Promise.all([
        apiRequest("/tasks"),
        apiRequest("/subjects")
      ]);

      setTasks(tasksData);
      setSubjects(subjectsData);

    } catch (error) {
      console.error("Failed to load tasks:", error);

      setError(
        error.message ||
        "Unable to load tasks. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // Add Task
  // =========================

  const addTask = async () => {
    if (newTask.trim() === "") {
      setError("Please enter a task name.");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const taskData = {
        title: newTask.trim(),
        subject: selectedSubject || undefined,
        priority,
        dueDate: dueDate || undefined
      };

      const createdTask = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(taskData)
      });

      setTasks((prev) => [createdTask, ...prev]);

      // Reset form
      setNewTask("");
      setSelectedSubject("");
      setPriority("Medium");
      setDueDate("");

      setSuccess("Task added successfully! ✅");

    } catch (error) {
      console.error("Failed to add task:", error);

      setError(
        error.message ||
        "Failed to add task. Please try again."
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Complete / Uncomplete
  // =========================

  const toggleTask = async (task) => {
    try {
      setUpdatingTask(task._id);
      setError("");
      setSuccess("");

      const updatedTask = await apiRequest(
        `/tasks/${task._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            completed: !task.completed
          })
        }
      );

      setTasks((prev) =>
        prev.map((item) =>
          item._id === updatedTask._id
            ? updatedTask
            : item
        )
      );

      setSuccess(
        updatedTask.completed
          ? "Task completed! 🎉"
          : "Task marked as pending."
      );

    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      setError(
        error.message ||
        "Failed to update task. Please try again."
      );

    } finally {
      setUpdatingTask(null);
    }
  };

  // =========================
  // Delete Task
  // =========================

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTask(taskId);
      setError("");
      setSuccess("");

      await apiRequest(`/tasks/${taskId}`, {
        method: "DELETE"
      });

      setTasks((prev) =>
        prev.filter(
          (task) => task._id !== taskId
        )
      );

      setSuccess("Task deleted successfully. 🗑️");

    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      setError(
        error.message ||
        "Failed to delete task. Please try again."
      );

    } finally {
      setDeletingTask(null);
    }
  };

  // =========================
  // Statistics
  // =========================

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks =
    tasks.length - completedTasks;

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <main className="dashboard">

        <div className="dashboard-header">
          <div>
            <h1>My Tasks ✅</h1>

            <p className="subtitle">
              Loading your tasks...
            </p>
          </div>
        </div>

        <section className="section">
          <div className="loading-skeleton">
            Loading tasks and subjects...
          </div>
        </section>

      </main>
    );
  }

  return (
    <main className="dashboard">

      {/* =========================
          Header
      ========================= */}

      <div className="dashboard-header">

        <div>
          <h1>My Tasks ✅</h1>

          <p className="subtitle">
            Organize your study work and stay productive.
          </p>
        </div>

      </div>

      {/* =========================
          Error / Success Messages
      ========================= */}

      {error && (
        <div className="auth-error task-message">
          {error}
        </div>
      )}

      {success && (
        <div className="settings-success task-message">
          {success}
        </div>
      )}

      {/* =========================
          Add Task
      ========================= */}

      <section className="section add-task-section">

        <div className="section-header">

          <div>
            <h2>Add a New Task</h2>

            <p>
              Create a task and keep track of your progress.
            </p>
          </div>

        </div>

        <div className="task-input-area">

          {/* Task Name */}

          <input
            type="text"
            placeholder="Enter task name..."
            value={newTask}
            onChange={(e) =>
              setNewTask(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
            disabled={saving}
          />

          {/* Subject */}

          <select
            value={selectedSubject}
            onChange={(e) =>
              setSelectedSubject(e.target.value)
            }
            disabled={saving}
          >
            <option value="">
              Select Subject
            </option>

            {subjects.map((subject) => (
              <option
                key={subject._id}
                value={subject._id}
              >
                {subject.name}
              </option>
            ))}
          </select>

          {/* Priority */}

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            disabled={saving}
          >
            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>
          </select>

          {/* Due Date */}

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
            disabled={saving}
          />

          {/* Add Button */}

          <button
            className="add-task-button"
            onClick={addTask}
            disabled={saving}
          >
            <Plus size={18} />

            {saving
              ? "Adding..."
              : "Add Task"}
          </button>

        </div>

      </section>

      {/* =========================
          Task Statistics
      ========================= */}

      <div className="task-stats">

        <div className="task-stat-card">

          <span>
            Total Tasks
          </span>

          <strong>
            {tasks.length}
          </strong>

        </div>

        <div className="task-stat-card completed-stat">

          <span>
            Completed
          </span>

          <strong>
            {completedTasks}
          </strong>

        </div>

        <div className="task-stat-card pending-stat">

          <span>
            Pending
          </span>

          <strong>
            {pendingTasks}
          </strong>

        </div>

      </div>

      {/* =========================
          Task List
      ========================= */}

      <section className="section tasks-list-section">

        <div className="section-header">

          <div>
            <h2>All Tasks</h2>

            <p>
              Your current study tasks.
            </p>
          </div>

          <button
            className="small-button"
            onClick={loadData}
            disabled={loading}
            title="Refresh tasks"
          >
            <RefreshCw size={15} />
            Refresh
          </button>

        </div>

        <div className="tasks-list">

          {tasks.length === 0 ? (

            <div className="dashboard-empty-state">
              <CheckCircle2 size={32} />

              <strong>
                No tasks yet
              </strong>

              <span>
                Add your first study task above to start
                organizing your day.
              </span>
            </div>

          ) : (

            tasks.map((task) => (

              <div
                className={`task-item ${
                  task.completed
                    ? "task-completed"
                    : ""
                }`}
                key={task._id}
              >

                {/* Complete */}

                <button
                  className="complete-button"
                  onClick={() =>
                    toggleTask(task)
                  }
                  disabled={
                    updatingTask === task._id ||
                    deletingTask === task._id
                  }
                  title={
                    task.completed
                      ? "Mark as pending"
                      : "Mark as completed"
                  }
                >

                  {updatingTask === task._id ? (
                    <span className="task-spinner" />
                  ) : task.completed ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Circle size={24} />
                  )}

                </button>

                {/* Task Information */}

                <div className="task-details">

                  <strong>
                    {task.title}
                  </strong>

                  <div className="task-meta">

                    <span>
                      📚{" "}
                      {task.subject?.name ||
                        "General"}
                    </span>

                    <span>
                      <CalendarDays size={13} />

                      {task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "No due date"}
                    </span>

                  </div>

                </div>

                {/* Priority */}

                <span
                  className={`priority ${
                    task.priority?.toLowerCase()
                  }`}
                >
                  {task.priority}
                </span>

                {/* Delete */}

                <button
                  className="delete-task"
                  onClick={() =>
                    deleteTask(task._id)
                  }
                  disabled={
                    deletingTask === task._id ||
                    updatingTask === task._id
                  }
                  title="Delete task"
                >

                  {deletingTask === task._id ? (
                    <span className="task-spinner" />
                  ) : (
                    <Trash2 size={18} />
                  )}

                </button>

              </div>

            ))

          )}

        </div>

      </section>

    </main>
  );
}

export default Tasks;