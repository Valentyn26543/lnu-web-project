import TaskModel from "../models/Task.js";
import { solveSLAE } from "../utils/solver.js";

export const create = async (req, res) => {
  try {
    const matrixA = req.body.matrixA;
    const N = matrixA.length;

    const currentDate = new Date();
    const generatedTitle = `СЛАР ${N}x${N} (Створено: ${currentDate.toLocaleDateString(
      "uk-UA"
    )} о ${currentDate.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    })})`;

    const currentServerId = process.env.SERVER_ID || "SERVER_1"; // треба доробити лоад балансер, шоб він навадав SERVER_ID за допопомгою nginx

    const doc = new TaskModel({
      user: req.userId,
      title: generatedTitle,
      matrixA: matrixA,
      vectorB: req.body.vectorB,
      serverId: currentServerId,
    });

    const task = await doc.save();
    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не вдалось створити завдання." });
  }
};

export const solve = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.findById(taskId);

    if (!task || task.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Немає доступу." });
    }

    const io = req.app.get("io");

    task.status = "in_progress";
    task.progress = 5;
    await task.save();

    const { solutionVector, progressSteps } = await solveSLAE(
      task.matrixA,
      task.vectorB,
      taskId,
      TaskModel,
      io
    );

    const latest = await TaskModel.findById(taskId);
    if (latest.status === "rejected") {
      return res.json({ message: "Задача скасована користувачем." });
    }

    task.status = "completed";
    task.progress = 100;
    task.solutionVector = solutionVector;
    await task.save();

    io.emit("taskUpdated", task);

    res.json({
      task,
      progressSteps,
    });
  } catch (error) {
    await TaskModel.updateOne(
      { _id: req.params.id },
      { status: "failed", progress: 100 }
    );

    res.status(500).json({
      message: "Помилка розв'язання",
    });
  }
};

export const cancel = async (req, res) => {
  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status: "rejected", progress: 100 },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Помилка скасування",
      });
    }

    req.app.get("io").emit("taskUpdated", updatedTask.toObject());

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Помилка скасування",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .exec();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Помилка отримання тасок",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Завдання не знайдено",
      });
    }

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Немає доступу. Завдання належить іншому користувачеві.",
      });
    }

    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Неможливо отримати завдання",
    });
  }
};
