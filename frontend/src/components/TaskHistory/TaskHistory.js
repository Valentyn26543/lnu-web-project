import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskItem from "../../components/TaskItem/TaskItem.js";
import socket from "../../socket.js";
import {
  fetchTasks,
  fetchSolveTask,
  updateTaskProgress,
  fetchCancelTask,
} from "../../redux/slices/tasks";
import "./TaskHistory.css";

const TaskHistory = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  const tasksStatus = useSelector((state) => state.tasks.status);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    socket.on("taskUpdated", (updatedTask) => {
      dispatch(updateTaskProgress(updatedTask));
    });
    return () => socket.off("taskUpdated");
  }, [dispatch]);

  const handleSolve = (taskId) => {
    dispatch(
      updateTaskProgress({ _id: taskId, status: "in_progress", progress: 5 })
    );
    dispatch(fetchSolveTask(taskId));
  };

  const handleCancel = (taskId) => {
    dispatch(fetchCancelTask(taskId));
  };

  if (tasksStatus === "loading") {
    return <h3 className="loading">Завантаження історії...</h3>;
  }

  return (
    <div className="task-history">
      <h2>Історія обчислень</h2>

      {tasks.length === 0 ? (
        <div className="alert-info">
          Історія завдань порожня. Створіть нове завдання вище.
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} onClick={() => setSelectedTask(task)}>
              <TaskItem
                task={task}
                onSolve={handleSolve}
                onCancel={handleCancel}
              />
            </li>
          ))}
        </ul>
      )}

      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.title}</h3>
            <p>
              <strong>Статус:</strong> {selectedTask.status}
            </p>
            <p>
              <strong>Прогрес:</strong> {selectedTask.progress}%
            </p>

            <div className="matrix-container">
              <div className="matrix-block">
                <h4>Матриця A:</h4>
                <div className="matrix-scroll">
                  <table className="matrix-table">
                    <tbody>
                      {selectedTask.matrixA.map((row, i) => (
                        <tr key={i}>
                          {row.map((val, j) => (
                            <td key={j}>{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="vector-block">
                <h4>Вектор B:</h4>
                <div className="matrix-scroll">
                  <table className="matrix-table">
                    <tbody>
                      {selectedTask.vectorB.map((val, i) => (
                        <tr key={i}>
                          <td>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <h4>Розв’язок:</h4>
            <div className="matrix-scroll">
              <table className="matrix-table">
                <tbody>
                  {selectedTask.solutionVector &&
                  selectedTask.solutionVector.length > 0 ? (
                    selectedTask.solutionVector.map((x, i) => (
                      <tr key={i}>
                        <td>{`x${i + 1}`}</td>
                        <td>
                          {typeof x === "number"
                            ? x.toFixed(4)
                            : parseFloat(x).toFixed(4)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>—</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button onClick={() => setSelectedTask(null)}>Закрити</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskHistory;
