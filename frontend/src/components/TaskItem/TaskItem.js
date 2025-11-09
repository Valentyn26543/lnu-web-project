import React from "react";
import "./TaskItem.css";

const TaskItem = ({ task, onSolve, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "in_progress":
        return "status-progress";
      case "failed":
        return "status-failed";
      default:
        return "status-created";
    }
  };

  const renderSolution = (solutionVector) => {
    if (!solutionVector || !Array.isArray(solutionVector)) return null;

    const text = solutionVector
      .map((x, i) => `x${i + 1} = ${typeof x === "number" ? x.toFixed(4) : x}`)
      .join(", ");

    return <p className="solution">Розв’язок: {text}</p>;
  };

  const handleClickSolve = (e) => {
    e.stopPropagation();
    onSolve(task._id);
  };

  const handleClickCancel = (e) => {
    e.stopPropagation();
    onCancel(task._id);
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className={`status ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      <p className="meta">
        Сервер: <b>{task.serverId || "N/A"}</b>
      </p>

      {task.status === "created" && (
        <button className="solve-btn" onClick={handleClickSolve}>
          Розв’язати
        </button>
      )}

      {task.status === "in_progress" && (
        <>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${task.progress || 0}%` }}
            />
          </div>
          <p className="progress-text">{task.progress || 0}%</p>

          <button className="cancel-btn" onClick={handleClickCancel}>
            Завершити завдання
          </button>
        </>
      )}

      {task.status === "completed" && renderSolution(task.solutionVector)}

      {task.status === "failed" && (
        <p className="error">
          Помилка: {task.errorMessage || "Невідома помилка обчислення."}
        </p>
      )}
    </div>
  );
};

export default TaskItem;
