import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { selectIsAuth } from "../redux/slices/auth";

import MatrixInput from "../components/MatrixInput/MatrixInput.js";
import TaskHistory from "../components/TaskHistory/TaskHistory.js";

const MainPage = () => {
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login"); 
    }
  }, [isAuth, navigate]);

  if (!isAuth) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Розв'язання СЛАР (Метод Гауса)
      </Typography>

      <MatrixInput />

      <TaskHistory />
    </Container>
  );
};

export default MainPage;
