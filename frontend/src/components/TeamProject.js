import React, { useState } from "react";
import ProjectModal from "./ProjectModal";
import "./TeamProject.css";

const TeamProject = ({
  teams,
  allUsers,
  onCreateTeam,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onDeleteTeam,
  onAddMember,
  onAddSubtask,
  onToggleSubtask,
}) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newProjectTitles, setNewProjectTitles] = useState({});
  const [selectedUser, setSelectedUser] = useState({});

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return alert("Team name cannot be empty");
    onCreateTeam(newTeamName);
    setNewTeamName("");
  };

  const handleAddProject = (teamId) => {
    const title = newProjectTitles[teamId];
    if (!title || !title.trim()) return alert("Project name cannot be empty");
    onAddProject(teamId, title);
    setNewProjectTitles((prev) => ({ ...prev, [teamId]: "" }));
  };

  const handleAddMember = (teamId) => {
    const userId = selectedUser[teamId];
    if (!userId) return alert("Select a user to add");
    onAddMember(teamId, userId);
  };

  const calculateProgress = (project) => {
    const completed = project.subtasks?.filter((st) => st.completed).length || 0;
    const total = project.subtasks?.length || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="team-project-container">
      <h3>Team Projects</h3>

      {teams.map((team) => (
        <div key={team.id} className="team-section">
          <div className="team-header">
            <h4>{team.name}</h4>
            <button className="btn-delete" onClick={() => onDeleteTeam(team.id)}>
              Delete Team
            </button>
          </div>

          <div className="team-members">
            <p>Members: {team.members.map((m) => m.username).join(", ") || "None"}</p>
            <div className="member-controls">
              <select
                value={selectedUser[team.id] || ""}
                onChange={(e) =>
                  setSelectedUser((prev) => ({ ...prev, [team.id]: e.target.value }))
                }
              >
                <option value="">Select user to add</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <button className="btn-add" onClick={() => handleAddMember(team.id)}>
                Add Member
              </button>
            </div>
          </div>

          <div className="add-project">
            <input
              type="text"
              placeholder="New project title"
              value={newProjectTitles[team.id] || ""}
              onChange={(e) =>
                setNewProjectTitles((prev) => ({
                  ...prev,
                  [team.id]: e.target.value,
                }))
              }
            />
            <button className="btn-add" onClick={() => handleAddProject(team.id)}>
              Create Project
            </button>
          </div>

          <div className="projects-list">
            {team.projects && team.projects.length > 0 ? (
              team.projects.map((project) => {
                const progress = calculateProgress(project);

                return (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => setSelectedProject(project)}
                    title="Click to view details"
                  >
                    <div className="project-header">
                      <span className="project-title">{project.title}</span>
                      <div className="project-actions">
                        <button
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTitle = prompt("Edit project title:", project.title);
                            if (newTitle) onEditProject(project.id, { title: newTitle });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(project.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {project.deadline && (
                      <div className="project-deadline">
                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    )}

                    <div className="progress-bar">
                       <div className="progress" style={{ width: `${progress}%` }}>
                          <span className="progress-label">{progress === 100 ? "✅ Done" : `${progress}%`}</span>
                        </div>
                    </div>
                      {progress === 100 ? (
                        <span className="progress-text done">✅ Done</span>
                      ) : (
                        <span className="progress-text">{progress}% complete</span>
                      )}
                  </div>
                );
              })
            ) : (
              <p className="empty">No projects yet.</p>
            )}
          </div>
        </div>
      ))}

      <div className="create-team">
        <input
          type="text"
          placeholder="Team name"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
        <button className="btn-add" onClick={handleCreateTeam}>
          Create Team
        </button>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          teamMembers={
            teams.find((t) => t.id === selectedProject.team)?.members || []
          }
        />
      )}
    </div>
  );
};

export default TeamProject;
