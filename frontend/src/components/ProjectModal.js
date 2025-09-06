import React, { useState } from "react";
import "./ProjectModal.css";

const ProjectModal = ({
  project,
  onClose,
  onToggleSubtask,
  onAddSubtask,
  teamMembers,
}) => {
  const [newSubtask, setNewSubtask] = useState("");
  const [deadline, setDeadline] = useState(project.deadline || "");
  const [assigned, setAssigned] = useState("");

  const completedCount = project.subtasks.filter((st) => st.completed).length;
  const totalCount = project.subtasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    onAddSubtask(project.id, newSubtask, assigned, deadline);
    setNewSubtask("");
    setAssigned("");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{project.title}</h2>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span className="progress-text">{progress}%</span>
        </div>

        <div className="deadline">
          <label>Deadline:</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="subtasks-section">
          {project.subtasks.map((subtask) => (
            <div key={subtask.id} className="subtask-item">
              <span className={subtask.completed ? "completed" : ""}>
                {subtask.title}
              </span>
              <span className="assigned-to">
                {subtask.assigned_to || "Unassigned"}
              </span>
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={(e) => onToggleSubtask(subtask.id, e.target.checked)}
              />
            </div>
          ))}
        </div>

        <div className="add-subtask">
          <input
            type="text"
            placeholder="New subtask"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
          />
          <select
            value={assigned}
            onChange={(e) => setAssigned(e.target.value)}
          >
            <option value="">Assign to</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.username}>
                {m.username}
              </option>
            ))}
          </select>
          <button className="btn-add" onClick={handleAddSubtask}>
            Add
          </button>
        </div>

        <div className="modal-footer">
          <button className="btn-delete" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
