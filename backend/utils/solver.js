const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // ЦЕ ДЛЯ СЕБЕ, НЕ ЗАБУТИ ПРИБРАТИ

export const solveSLAE = async (matrixA, vectorB, taskId, TaskModel) => {
  const N = matrixA.length;
  const augmentedMatrix = matrixA.map((row, i) => [...row, vectorB[i]]);
  const progressSteps = [];

  for (let i = 0; i < N; i++) {
    let maxRow = i;
    for (let k = i + 1; k < N; k++) {
      if (
        Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])
      ) {
        maxRow = k;
      }
    }
    [augmentedMatrix[i], augmentedMatrix[maxRow]] = [
      augmentedMatrix[maxRow],
      augmentedMatrix[i],
    ];

    if (augmentedMatrix[i][i] === 0) {
      throw new Error(
        "Система є сингулярною або має нескінченну/відсутню кількість розв'язків"
      );
    }

    const progress = Math.round((i / N) * 70);
    progressSteps.push({
      stage: "forward_elimination",
      step: i + 1,
      progress: progress,
    });

    if (taskId && TaskModel) {
      await TaskModel.updateOne({ _id: taskId }, { progress: progress });
    }

    await sleep(2000); // ЦЕ ДЛЯ СЕБЕ, НЕ ЗАБУТИ ПРИБРАТИ

    for (let k = i + 1; k < N; k++) {
      const factor = augmentedMatrix[k][i] / augmentedMatrix[i][i];
      for (let j = i; j < N + 1; j++) {
        augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
      }
    }
  }

  const solutionVector = new Array(N);
  for (let i = N - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < N; j++) {
      sum += augmentedMatrix[i][j] * solutionVector[j];
    }

    solutionVector[i] = (augmentedMatrix[i][N] - sum) / augmentedMatrix[i][i];

    const progress = 70 + Math.round(((N - i) / N) * 30);
    progressSteps.push({
      stage: "backward_substitution",
      step: N - i,
      progress: progress,
    });

    if (taskId && TaskModel) {
      await TaskModel.updateOne({ _id: taskId }, { progress: progress });
    }

    await sleep(2000); // ЦЕ ДЛЯ СЕБЕ, НЕ ЗАБУТИ ПРИБРАТИ
  }

  progressSteps.push({ stage: "completed", step: N, progress: 100 });

  return { solutionVector, progressSteps };
};
