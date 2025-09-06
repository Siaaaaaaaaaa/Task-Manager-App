import React, { Component } from "react";
import "./Modal.css";

class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: { ...this.props.activeItem },
      subtasks: this.props.activeItem.subtasks || [],
      newSubtaskTitle: "",
      newSubtaskAssigned: "",
      newSubtaskDueDate: "",
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      activeItem: { ...prevState.activeItem, [name]: value },
    }));
  };

  handleCheckbox = () => {
    this.setState((prevState) => ({
      activeItem: {
        ...prevState.activeItem,
        completed: !prevState.activeItem.completed,
      },
    }));
  };

  handleAddSubtask = () => {
    const { newSubtaskTitle, newSubtaskAssigned, newSubtaskDueDate } = this.state;
    if (!newSubtaskTitle) return;

    const newSubtask = {
      id: Date.now(),
      title: newSubtaskTitle,
      assigned_to: newSubtaskAssigned,
      due_date: newSubtaskDueDate,
      completed: false,
    };

    this.setState((prevState) => ({
      subtasks: [...prevState.subtasks, newSubtask],
      newSubtaskTitle: "",
      newSubtaskAssigned: "",
      newSubtaskDueDate: "",
    }));
  };

  toggleSubtaskCompleted = (index) => {
    this.setState((prevState) => {
      const subtasks = [...prevState.subtasks];
      subtasks[index].completed = !subtasks[index].completed;
      return { subtasks };
    });
  };

  handleSave = () => {
    const { activeItem, subtasks } = this.state;
    if (!activeItem.title || !activeItem.description) {
      alert("Title and Description are required!");
      return;
    }
    this.props.onSave({ ...activeItem, subtasks });
    this.props.toggle();
  };

  render() {
    const { toggle } = this.props;
    const {
      activeItem,
      subtasks,
      newSubtaskTitle,
      newSubtaskAssigned,
      newSubtaskDueDate,
    } = this.state;

    return (
      <div className="modal">
        <div className="modal-main">
          <span className="close-button" onClick={toggle}>
            &times;
          </span>
          <h2>{activeItem.id ? "Edit Task" : "Add New Task"}</h2>

          <form>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={activeItem.title}
              onChange={this.handleChange}
            />

            <label>Description</label>
            <textarea
              name="description"
              value={activeItem.description}
              onChange={this.handleChange}
            />

            <label>Due Date</label>
            <input
              type="datetime-local"
              name="due_date"
              value={activeItem.due_date || ""}
              onChange={this.handleChange}
            />

            <label>Priority</label>
            <select
              name="priority"
              value={activeItem.priority || "IMPORTANT"}
              onChange={this.handleChange}
            >
              <option value="CAN_WAIT">Can Wait</option>
              <option value="IMPORTANT">Important</option>
              <option value="URGENT">Urgent</option>
            </select>

            <label>Assigned To</label>
            <input
              type="text"
              name="assigned_to"
              value={activeItem.assigned_to || ""}
              onChange={this.handleChange}
            />

            <label>
              <input
                type="checkbox"
                checked={activeItem.completed}
                onChange={this.handleCheckbox}
              />
              Completed
            </label>

            {/* Subtasks – doar dacă e dintr-un proiect */}
            {activeItem.from_project && (
              <div className="subtask-section">
                <h4>Subtasks</h4>
                {subtasks.map((subtask, idx) => (
                  <div key={subtask.id} className="subtask-item">
                    <div>
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => this.toggleSubtaskCompleted(idx)}
                      />
                      {subtask.title}{" "}
                      {subtask.assigned_to && `(${subtask.assigned_to})`}{" "}
                      {subtask.due_date &&
                        `- ${new Date(subtask.due_date).toLocaleDateString()}`}
                    </div>
                  </div>
                ))}

                <div className="new-subtask">
                  <input
                    type="text"
                    placeholder="Subtask title"
                    value={newSubtaskTitle}
                    onChange={(e) =>
                      this.setState({ newSubtaskTitle: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Assigned to"
                    value={newSubtaskAssigned}
                    onChange={(e) =>
                      this.setState({ newSubtaskAssigned: e.target.value })
                    }
                  />
                  <input
                    type="datetime-local"
                    placeholder="Due date"
                    value={newSubtaskDueDate}
                    onChange={(e) =>
                      this.setState({ newSubtaskDueDate: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="app-button secondary"
                    onClick={this.handleAddSubtask}
                  >
                    Add Subtask
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="modal-buttons">
            <button type="button" onClick={this.handleSave}>
              Save
            </button>
            <button type="button" onClick={toggle}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomModal;

