import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { fetchLogin, selectIsAuth } from "../redux/slices/auth";
import { Alert, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  const onSubmit = async (values) => {
    const result = await dispatch(fetchLogin(values));

    if (result.payload?.token) {
      window.localStorage.setItem("token", result.payload.token);
    } 
    
  };

  return (
    <Container>
      {authStatus === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          ПОМИЛКА ВХОДУ.
        </Alert>
      )}

      <AuthForm isRegister={false} onSubmit={onSubmit} />

      <Typography align="center" sx={{ mt: 2 }}>
        Немає акаунту? <Link to="/register">Зареєструватися</Link>
      </Typography>
    </Container>
  );
};

export default LoginPage;
