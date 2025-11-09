import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchCreateTask,
  fetchSolveTask,
  updateTaskProgress,
} from "../../redux/slices/tasks";
import "./MatrixInput.css";

const parseInput = (text) => {
  return text
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) =>
      line
        .trim()
        .split(/\s+/)
        .filter((p) => p !== "")
        .map(Number)
    );
};

const MatrixInput = () => {
  const dispatch = useDispatch();
  const [matrixInput, setMatrixInput] = useState("1 2 3\n4 5 6\n7 8 9");
  const [vectorInput, setVectorInput] = useState("6\n15\n24");
  const [error, setError] = useState("");
  const [randomSize, setRandomSize] = useState(4);

  const generateRandomMatrix = (N) => {
    let matrix = [];
    for (let i = 0; i < N; i++) {
      let row = [];
      for (let j = 0; j < N; j++) {
        row.push(Math.floor(Math.random() * 10) + 1);
      }
      matrix.push(row.join(" "));
    }
    return matrix.join("\n");
  };

  const generateRandomVector = (N) => {
    let vector = [];
    for (let i = 0; i < N; i++) {
      vector.push(Math.floor(Math.random() * 10) + 1);
    }
    return vector.join("\n");
  };

  const handleGenerateRandom = () => {
    const N = parseInt(randomSize);
    if (isNaN(N) || N < 2 || N > 200) {
      return setError("Розмір матриці має бути числом від 2 до 200.");
    }

    const newMatrix = generateRandomMatrix(N);
    const newVector = generateRandomVector(N);

    setMatrixInput(newMatrix);
    setVectorInput(newVector);
    setError("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const parsedMatrix = parseInput(matrixInput);
    const parsedVector = parseInput(vectorInput).flat();
    const N = parsedMatrix.length;

    if (N === 0 || parsedVector.length === 0) {
      return setError("Матриця A та Вектор B не можуть бути порожніми.");
    }

    const isMatrixValid = parsedMatrix.flat().every((val) => !isNaN(val));
    const isVectorValid = parsedVector.every((val) => !isNaN(val));
    if (!isMatrixValid || !isVectorValid) {
      return setError("Всі елементи мають бути числами.");
    }

    if (
      parsedMatrix.some((row) => row.length !== N) ||
      parsedVector.length !== N
    ) {
      return setError(
        `Розмірність має бути N×N. Знайдено ${N}×${parsedMatrix[0].length} для A та ${parsedVector.length} для B.`
      );
    }

    const title = `Завдання ${N}x${N} (${new Date().toLocaleTimeString()})`;

    let currentTaskId = null;

    try {
      const createAction = dispatch(
        fetchCreateTask({
          title: title,
          matrixA: parsedMatrix,
          vectorB: parsedVector,
          serverId: "SERVER_1", // тимчасово
        })
      );
      const newTask = await createAction.unwrap();

      currentTaskId = newTask._id;

      dispatch(
        updateTaskProgress({
          _id: currentTaskId,
          status: "in_progress",
          progress: 0,
        })
      );

      dispatch(fetchSolveTask(currentTaskId));
    } catch (err) {
      const errorMessage = err.message || JSON.stringify(err);
      setError(`Помилка: ${errorMessage}`);
    }
  };

  return (
    <div className="matrix-input">
      <h2>Нове завдання (СЛАР)</h2>
      {error && <div className="error-box">{error}</div>}
      <div className="random-generator">
        <label htmlFor="randomSize">
          Генерувати випадкову матрицю N x N (N: 2-200)
        </label>
        <div className="generator-controls">
          <input
            id="randomSize"
            type="number"
            value={randomSize}
            onChange={(e) => setRandomSize(e.target.value)}
            min="2"
            max="200"
            className="size-input"
          />
          <button
            type="button"
            onClick={handleGenerateRandom}
            className="btn-secondary"
          >
            Згенерувати
          </button>
        </div>
      </div>
      <form onSubmit={onSubmit} className="matrix-form">
        <div className="form-row">
          <div className="form-group">
            <label>Матриця A</label>
            <textarea
              value={matrixInput}
              onChange={(e) => setMatrixInput(e.target.value)}
              placeholder="1 2 3\n4 5 6\n7 8 9"
              rows={5}
            />
          </div>
          <div className="form-group small">
            <label>Вектор B</label>
            <textarea
              value={vectorInput}
              onChange={(e) => setVectorInput(e.target.value)}
              placeholder="6\n15\n24"
              rows={5}
            />
          </div>
        </div>
        <button type="submit" className="btn-primary">
          Створити та Розв'язати 
        </button>
      </form>
    </div>
  );
};

export default MatrixInput;
