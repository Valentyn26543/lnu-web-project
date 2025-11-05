import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { fetchRegister, selectIsAuth } from "../redux/slices/auth";
import { Alert, Container } from "@mui/material";

const RegistrationPage = () => {
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
    const result = await dispatch(fetchRegister(values));

    if (result.payload?.token) {
      window.localStorage.setItem("token", result.payload.token);
    } else if (result.meta.requestStatus === "rejected") {
      alert(
        "Помилка реєстрації. Перевірте дані (пошта вже використовується чи слабкий пароль)."
      );
    }
  };

  return (
    <Container>
      {authStatus === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Помилка реєстрації.
        </Alert>
      )}

      <AuthForm isRegister={true} onSubmit={onSubmit} />
    </Container>
  );
};

export default RegistrationPage;
