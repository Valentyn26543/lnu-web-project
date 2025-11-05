import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth";
import { tasksReducer } from "./slices/tasks"; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer, 
  },
});

export default store;
