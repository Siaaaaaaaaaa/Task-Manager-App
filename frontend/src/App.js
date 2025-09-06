// App.js
import React, { Component } from "react";
import axios from "axios";
import CustomModal from "./components/Modal";
import TeamProject from "./components/TeamProject";
import Dashboard from "./Dashboard";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      todoList: [],
      activeItem: {
        title: "",
        description: "",
        completed: false,
        due_date: "",
        priority: "IMPORTANT",
        assigned_to: "",
      },
      expandedTasks: [],
      teams: [],
      allUsers: [],
      activeTab: "team",
      user: null,
    };
  }

  componentDidMount() {
    this.checkLogin();
    this.fetchUsers();
    this.fetchTeams();
  }

  checkLogin = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      this.fetchUser();
      this.refreshList();
    }
  };

  fetchUser = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/users/me/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => this.setState({ user: res.data }))
      .catch((err) => console.error(err));
  };

  fetchUsers = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/users/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => this.setState({ allUsers: res.data }))
      .catch((err) => console.error(err));
  };

  refreshList = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/api/todos/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.error(err));
  };

  fetchTeams = async () => {
    const token = localStorage.getItem("token");
    try {
      const teamRes = await axios.get("http://localhost:8000/api/teams/", {
        headers: { Authorization: `Token ${token}` },
      });

      const teams = teamRes.data;

      for (const team of teams) {
        const projectRes = await axios.get(
          `http://localhost:8000/api/projects/?team=${team.id}`,
          { headers: { Authorization: `Token ${token}` } }
        );
        team.projects = projectRes.data;

        for (const project of team.projects) {
          const subtasksRes = await axios.get(
            `http://localhost:8000/api/subtasks/?project=${project.id}`,
            { headers: { Authorization: `Token ${token}` } }
          );
          project.subtasks = subtasksRes.data;
        }
      }

      this.setState({ teams });
    } catch (err) {
      console.error("Error fetching teams/projects/subtasks:", err);
    }
  };

  createTeam = (name) => {
  const token = localStorage.getItem("token");
  axios
    .post(
      "http://localhost:8000/api/teams/",
      { name },
      { headers: { Authorization: `Token ${token}` } }
    )
    .then(() => this.fetchTeams())
    .catch((err) => console.error(err));
};

  createItem = () => {
    const item = {
      title: "",
      description: "",
      completed: false,
      due_date: "",
      priority: "IMPORTANT",
      assigned_to: "",
    };
    this.setState({ activeItem: item, modal: true });
  };

  handleSubmit = (item) => {
    this.toggle();
    const token = localStorage.getItem("token");

    const request = item.id
      ? axios.put(`http://localhost:8000/api/todos/${item.id}/`, item, {
          headers: { Authorization: `Token ${token}` },
        })
      : axios.post("http://localhost:8000/api/todos/", item, {
          headers: { Authorization: `Token ${token}` },
        });

    request.then(() => this.refreshList());
  };

  handleDelete = (item) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8000/api/todos/${item.id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => this.refreshList());
  };

  toggle = () => this.setState({ modal: !this.state.modal });

  toggleTaskCompleted = (taskId, completed) => {
    const token = localStorage.getItem("token");
    axios
      .patch(
        `http://localhost:8000/api/todos/${taskId}/`,
        { completed },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => this.refreshList());
  };

  toggleExpandTask = (taskId) => {
    this.setState((prevState) => {
      const expanded = prevState.expandedTasks.includes(taskId)
        ? prevState.expandedTasks.filter((id) => id !== taskId)
        : [...prevState.expandedTasks, taskId];
      return { expandedTasks: expanded };
    });
  };

  toggleViewCompleted = () => {
    this.setState({ viewCompleted: !this.state.viewCompleted });
  };

  addProject = (teamId, title) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:8000/api/projects/",
        { title, team: teamId },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => this.fetchTeams())
      .catch((err) => console.error(err));
  };

  editProject = (projectId, data) => {
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:8000/api/projects/${projectId}/`, data, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => this.fetchTeams())
      .catch((err) => console.error(err));
  };

  deleteProject = (projectId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8000/api/projects/${projectId}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => this.fetchTeams())
      .catch((err) => console.error(err));
  };

  deleteTeam = (teamId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8000/api/teams/${teamId}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => this.fetchTeams())
      .catch((err) => console.error(err));
  };

  addMemberToTeam = (teamId, userId) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `http://localhost:8000/api/teams/${teamId}/add_member/`,
        { user_id: userId },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => this.fetchTeams())
      .catch((err) => console.error(err));
  };

  addSubtask = (projectId, title, assignedTo, dueDate) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:8000/api/subtasks/",
        {
          title,
          project: projectId,
          assigned_to: assignedTo,
          due_date: dueDate,
        },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => this.fetchTeams())
      .catch((err) => console.error(err));
  };

  toggleSubtask = (subtaskId, completed) => {
    const token = localStorage.getItem("token");
    axios
      .patch(
        `http://localhost:8000/api/subtasks/${subtaskId}/`,
        { completed },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => this.fetchTeams())
      .catch((err) => console.error(err));
  };

  renderTablist = () => (
    <div className="tab-list">
      {["tasks", "team", "profile", "dashboard"].map((tab) => (
        <span
          key={tab}
          className={`tab-item ${this.state.activeTab === tab ? "active" : ""}`}
          onClick={() => this.setState({ activeTab: tab })}
        >
          {`My ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
        </span>
      ))}
    </div>
  );

  renderProfile = () => {
    const { user } = this.state;
    if (!user) return <div>Loading...</div>;
    return (
      <div className="profile-card">
        <div className="avatar">👤</div>
        <h3>{user.profile.full_name}</h3>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.profile.role || "N/A"}</p>
        <button className="btn-logout" onClick={this.logout}>
          Logout
        </button>
      </div>
    );
  };

  render() {
    const { modal, activeTab, todoList, viewCompleted, teams } = this.state;
    const displayList = todoList.filter(
      (task) => task.completed === viewCompleted
    );

    return (
      <div className="content">
        <div className="card">
          <h1 className="app-title">Task Manager</h1>
          {this.renderTablist()}

          {activeTab === "tasks" && (
            <>
              <button className="btn-add" onClick={this.createItem}>
                Add Task
              </button>

              <div className="completed-toggle">
                <input
                  type="checkbox"
                  checked={viewCompleted}
                  onChange={this.toggleViewCompleted}
                />
                Show Completed Tasks
              </div>

              <ul className="list-group">
                {displayList.map((task) => {
                  const isExpanded = this.state.expandedTasks.includes(task.id);
                  return (
                    <li
                      key={task.id}
                      className={`list-group-item task-card ${
                        task.completed ? "completed-todo" : ""
                      } ${isExpanded ? "expanded" : ""}`}
                      onClick={() => this.toggleExpandTask(task.id)}
                    >
                      <div className="task-main">
                        <span className="task-title">{task.title}</span>
                        <span className="task-due">
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : ""}
                        </span>

                        {isExpanded && (
                          <div className="task-details">
                            <p>{task.description}</p>
                            <p>Priority: {task.priority}</p>
                            {task.assigned_to && (
                              <p>Assigned to: {task.assigned_to.username}</p>
                            )}
                            <div className="task-complete">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) =>
                                  this.toggleTaskCompleted(
                                    task.id,
                                    e.target.checked
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                              Completed
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="task-actions">
                        <button
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.setState({ activeItem: task, modal: true });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.handleDelete(task);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {activeTab === "team" && (
            <TeamProject
              teams={teams}
              allUsers={this.state.allUsers}
              onCreateTeam={this.createTeam}
              onAddProject={this.addProject}
              onEditProject={this.editProject}
              onDeleteProject={this.deleteProject}
              onDeleteTeam={this.deleteTeam}
              onAddMember={this.addMemberToTeam}
              onAddSubtask={this.addSubtask}
              onToggleSubtask={this.toggleSubtask}
            />
          )}

          {activeTab === "profile" && this.renderProfile()}
          {activeTab === "dashboard" && (
            <Dashboard todos={this.state.todoList} />
          )}
        </div>

        {modal && (
          <CustomModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        )}

        <footer className="footer">
          Copyright 2025 © All Rights Reserved
        </footer>
      </div>
    );
  }
}

export default App;
