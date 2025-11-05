import React, { useEffect, useCallback } from "react";
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

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    socket.on("taskUpdated", (updatedTask) => {
      dispatch(updateTaskProgress(updatedTask));
    });

    return () => socket.off("taskUpdated");
  }, [dispatch]);


  const handleSolve = useCallback(
    (taskId) => {
      dispatch(
        updateTaskProgress({ _id: taskId, status: "in_progress", progress: 5 })
      );
      dispatch(fetchSolveTask(taskId));
    },
    [dispatch]
  );

  const handleCancel = useCallback(
    (taskId) => {
      dispatch(fetchCancelTask(taskId));
    },
    [dispatch]
  );

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
            <TaskItem
              key={task._id}
              task={task}
              onSolve={handleSolve}
              onCancel={handleCancel}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskHistory;
