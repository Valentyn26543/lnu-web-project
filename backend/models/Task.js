import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
    },

    matrixA: {
      type: [[Number]],
      required: true,
    },
    vectorB: {
      type: [Number],
      required: true,
    },

    status: {
      type: String,
      enum: ["created", "in_progress", "completed", "failed", "rejected"],
      default: "created",
    },

    progress: {
      type: Number, 
      default: 0,
    },

    solutionVector: {
      type: [Number],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", TaskSchema);
