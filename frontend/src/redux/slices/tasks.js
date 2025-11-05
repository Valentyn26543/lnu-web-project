import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const { data } = await axios.get("/tasks");
  return data;
});

export const fetchCreateTask = createAsyncThunk(
  "tasks/fetchCreateTask",
  async (params) => {
    const { data } = await axios.post("/tasks", params);
    return data;
  }
);

export const fetchSolveTask = createAsyncThunk(
  "tasks/fetchSolveTask",
  async (id) => {
    const { data } = await axios.post(`/tasks/${id}/solve`);
    return data; 
  }
);

export const fetchTaskStatus = createAsyncThunk(
  "tasks/fetchTaskStatus",
  async (taskId) => {
    const { data } = await axios.get(`/tasks/${taskId}`);
    return data; 
  }
);

export const fetchCancelTask = createAsyncThunk(
  "tasks/fetchCancelTask",
  async (id) => {
    const { data } = await axios.post(`/tasks/${id}/cancel`);
    return data; 
  }
);


const initialState = {
  items: [],
  status: "loading",
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    updateTaskProgress: (state, action) => {
      const index = state.items.findIndex(
        (task) => task._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = "loaded";
    });
    builder.addCase(fetchTasks.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTasks.rejected, (state) => {
      state.status = "error";
      state.items = [];
    });

    // fetchCreateTask
    builder.addCase(fetchCreateTask.fulfilled, (state, action) => {
      state.items.unshift(action.payload); // додаємо нове завдання на початок списку
    });

    builder.addCase(fetchTaskStatus.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      const index = state.items.findIndex(
        (task) => task._id === updatedTask._id
      );
      if (index !== -1) {
        state.items[index] = updatedTask;
      }
    });
    
    builder
      .addCase(fetchCancelTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.items.findIndex(
          (task) => task._id === updatedTask._id
        );
        if (index !== -1) {
          state.items[index] = updatedTask; //(status: "rejected")
        }
      })
      .addCase(fetchCancelTask.rejected, (state, action) => {
        console.error("Помилка скасування:", action.payload);
      });
  },
});

export const tasksReducer = tasksSlice.reducer;
export const { updateTaskProgress } = tasksSlice.actions;
