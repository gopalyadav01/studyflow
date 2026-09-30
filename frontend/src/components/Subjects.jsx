import { useEffect, useState } from "react";

import {
  BookOpen,
  Code2,
  Database,
  Atom,
  Plus,
  MoreVertical,
  X,
  Pencil,
  Trash2,
  RefreshCw
} from "lucide-react";

import { apiRequest } from "../api/api";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit modal
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Three-dot menu
  const [openMenu, setOpenMenu] = useState(null);

  const [name, setName] = useState("");
  const [progress, setProgress] = useState(0);
  const [totalTopics, setTotalTopics] = useState(0);
  const [topicsCompleted, setTopicsCompleted] = useState(0);

  const [saving, setSaving] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // Load Subjects
  // =========================

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/subjects");

      setSubjects(data);

    } catch (error) {
      console.error(
        "Failed to load subjects:",
        error
      );

      setError(
        error.message ||
        "Unable to load subjects. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // =========================
  // Open Add Form
  // =========================

  const openAddForm = () => {
    setEditingSubject(null);

    setName("");
    setProgress(0);
    setTotalTopics(0);
    setTopicsCompleted(0);

    setError("");
    setSuccess("");
    setOpenMenu(null);
    setShowForm(true);
  };

  // =========================
  // Open Edit Form
  // =========================

  const openEditForm = (subject) => {
    setEditingSubject(subject);

    setName(subject.name);
    setProgress(subject.progress);
    setTotalTopics(subject.totalTopics);
    setTopicsCompleted(subject.topicsCompleted);

    setError("");
    setSuccess("");
    setOpenMenu(null);
    setShowForm(true);
  };

  // =========================
  // Add / Edit Subject
  // =========================

  const handleSaveSubject = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter a subject name.");
      return;
    }

    if (Number(totalTopics) < 0) {
      setError(
        "Total topics cannot be negative."
      );
      return;
    }

    if (Number(topicsCompleted) < 0) {
      setError(
        "Completed topics cannot be negative."
      );
      return;
    }

    if (
      Number(topicsCompleted) >
      Number(totalTopics)
    ) {
      setError(
        "Completed topics cannot be greater than total topics."
      );
      return;
    }

    try {
      setSaving(true);

      const total = Number(totalTopics);
      const completed = Number(topicsCompleted);

      const calculatedProgress =
        total > 0
          ? Math.round(
              (completed / total) * 100
            )
          : 0;

      const subjectData = {
        name: name.trim(),
        progress: calculatedProgress,
        totalTopics: total,
        topicsCompleted: completed
      };

      // EDIT
      if (editingSubject) {
        const updatedSubject =
          await apiRequest(
            `/subjects/${editingSubject._id}`,
            {
              method: "PUT",
              body: JSON.stringify(
                subjectData
              )
            }
          );

        setSubjects((prev) =>
          prev.map((subject) =>
            subject._id ===
            updatedSubject._id
              ? updatedSubject
              : subject
          )
        );

        setSuccess(
          "Subject updated successfully! ✅"
        );
      }

      // ADD
      else {
        const newSubject =
          await apiRequest(
            "/subjects",
            {
              method: "POST",
              body: JSON.stringify(
                subjectData
              )
            }
          );

        setSubjects((prev) => [
          newSubject,
          ...prev
        ]);

        setSuccess(
          "Subject added successfully! 📚"
        );
      }

      closeForm();

    } catch (error) {
      console.error(
        "Failed to save subject:",
        error
      );

      setError(
        error.message ||
        "Failed to save subject. Please try again."
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Delete Subject
  // =========================

  const handleDeleteSubject = async (
    subjectId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSubject(subjectId);
      setError("");
      setSuccess("");

      await apiRequest(
        `/subjects/${subjectId}`,
        {
          method: "DELETE"
        }
      );

      setSubjects((prev) =>
        prev.filter(
          (subject) =>
            subject._id !== subjectId
        )
      );

      setOpenMenu(null);

      setSuccess(
        "Subject deleted successfully. 🗑️"
      );

    } catch (error) {
      console.error(
        "Failed to delete subject:",
        error
      );

      setError(
        error.message ||
        "Failed to delete subject. Please try again."
      );

    } finally {
      setDeletingSubject(null);
    }
  };

  // =========================
  // Close Form
  // =========================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingSubject(null);

    setName("");
    setProgress(0);
    setTotalTopics(0);
    setTopicsCompleted(0);

    setError("");
  };

  // =========================
  // Subject Icon
  // =========================

  const getSubjectIcon = (name) => {
    const subjectName =
      name.toLowerCase();

    if (subjectName.includes("java")) {
      return <BookOpen size={25} />;
    }

    if (
      subjectName.includes("dsa") ||
      subjectName.includes("data")
    ) {
      return <Code2 size={25} />;
    }

    if (
      subjectName.includes("react")
    ) {
      return <Atom size={25} />;
    }

    if (
      subjectName.includes("db") ||
      subjectName.includes("database")
    ) {
      return <Database size={25} />;
    }

    return <BookOpen size={25} />;
  };

  // =========================
  // Subject Colors
  // =========================

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

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <main className="dashboard">

        <div className="dashboard-header">
          <div>
            <h1>My Subjects 📚</h1>

            <p className="subtitle">
              Loading your subjects...
            </p>
          </div>
        </div>

        <section className="section">
          <div className="loading-skeleton">
            Loading subjects...
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
          <h1>My Subjects 📚</h1>

          <p className="subtitle">
            Track your progress and stay
            consistent with your learning.
          </p>
        </div>

        <button
          className="add-task-button"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Subject
        </button>

      </div>

      {/* =========================
          Error / Success
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
          Subject Cards
      ========================= */}

      <div className="subjects-grid">

        {subjects.length === 0 ? (

          <div className="dashboard-empty-state">
            <BookOpen size={32} />

            <strong>
              No subjects yet
            </strong>

            <span>
              Add your first subject to start
              tracking your learning progress.
            </span>

            <button
              className="add-task-button"
              onClick={openAddForm}
            >
              <Plus size={17} />
              Add Subject
            </button>
          </div>

        ) : (

          subjects.map(
            (subject, index) => (

              <div
                className="subject-card"
                key={subject._id}
              >

                {/* Card Header */}

                <div className="subject-card-header">

                  <div
                    className={`large-subject-icon ${getSubjectColor(
                      index
                    )}`}
                  >
                    {getSubjectIcon(
                      subject.name
                    )}
                  </div>

                  <div className="subject-menu-wrapper">

                    <button
                      className="menu-button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu ===
                            subject._id
                            ? null
                            : subject._id
                        )
                      }
                      disabled={
                        deletingSubject ===
                        subject._id
                      }
                    >
                      <MoreVertical
                        size={20}
                      />
                    </button>

                    {/* Dropdown Menu */}

                    {openMenu ===
                      subject._id && (

                      <div className="subject-dropdown">

                        <button
                          onClick={() =>
                            openEditForm(
                              subject
                            )
                          }
                          disabled={
                            deletingSubject ===
                            subject._id
                          }
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          className="delete-option"
                          onClick={() =>
                            handleDeleteSubject(
                              subject._id
                            )
                          }
                          disabled={
                            deletingSubject ===
                            subject._id
                          }
                        >
                          {deletingSubject ===
                          subject._id ? (
                            <span className="task-spinner" />
                          ) : (
                            <Trash2
                              size={16}
                            />
                          )}

                          {deletingSubject ===
                          subject._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    )}

                  </div>

                </div>

                {/* Subject Name */}

                <h2>{subject.name}</h2>

                <p className="subject-description">
                  Keep learning and improve
                  your knowledge.
                </p>

                {/* Progress */}

                <div className="subject-progress-info">

                  <span>
                    Progress
                  </span>

                  <strong>
                    {subject.progress}%
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress java-progress"
                    style={{
                      width: `${subject.progress}%`
                    }}
                  ></div>

                </div>

                {/* Footer */}

                <div className="subject-footer">

                  <span>
                    {subject.totalTopics} Topics
                  </span>

                  <span>
                    {subject.topicsCompleted}{" "}
                    Completed
                  </span>

                </div>

              </div>

            )
          )

        )}

      </div>

      {/* =========================
          Add / Edit Modal
      ========================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="subject-modal">

            {/* Modal Header */}

            <div className="modal-header">

              <div>

                <h2>
                  {editingSubject
                    ? "Edit Subject"
                    : "Add New Subject"}
                </h2>

                <p>
                  {editingSubject
                    ? "Update your subject details."
                    : "Create a subject and track your progress."}
                </p>

              </div>

              <button
                className="modal-close"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            {/* Error */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={
                handleSaveSubject
              }
            >

              {/* Subject Name */}

              <div className="input-group">

                <label>
                  Subject Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Java"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  disabled={saving}
                  required
                />

              </div>

              {/* Progress */}

              <div className="input-group">

                <label>
                  Progress (%)
                </label>

                <input
                  type="number"
                  value={
                    Number(
                      totalTopics
                    ) > 0
                      ? Math.round(
                          (Number(
                            topicsCompleted
                          ) /
                            Number(
                              totalTopics
                            )) *
                            100
                        )
                      : 0
                  }
                  readOnly
                />

              </div>

              {/* Topics */}

              <div className="modal-row">

                <div className="input-group">

                  <label>
                    Total Topics
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      totalTopics
                    }
                    onChange={(e) =>
                      setTotalTopics(
                        e.target.value
                      )
                    }
                    disabled={saving}
                  />

                </div>

                <div className="input-group">

                  <label>
                    Completed
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      topicsCompleted
                    }
                    onChange={(e) =>
                      setTopicsCompleted(
                        e.target.value
                      )
                    }
                    disabled={saving}
                  />

                </div>

              </div>

              {/* Save Button */}

              <button
                type="submit"
                className="auth-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingSubject
                  ? "Update Subject"
                  : "Save Subject"}
              </button>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}

export default Subjects;