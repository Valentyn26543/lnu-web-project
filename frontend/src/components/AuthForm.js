import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Box } from "@mui/material";

const AuthForm = ({ isRegister, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      fullName: isRegister ? "" : undefined,
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {isRegister ? "Реєстрація" : "Вхід"}
      </Typography>

      <TextField
        label="E-Mail"
        type="email"
        fullWidth
        margin="normal"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        {...register("email", { required: "Вкажіть пошту" })}
      />
      <TextField
        label="Пароль"
        type="password"
        fullWidth
        margin="normal"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        {...register("password", {
          required: "Вкажіть пароль",
          minLength: { value: 5, message: "Мінімум 5 символів" },
        })}
      />

      {isRegister && (
        <TextField
          label="Повне ім'я"
          fullWidth
          margin="normal"
          error={Boolean(errors.fullName)}
          helperText={errors.fullName?.message}
          {...register("fullName", {
            required: "Вкажіть ім'я",
            minLength: { value: 3, message: "Мінімум 3 символи" },
          })}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        {isRegister ? "Зареєструватися" : "Увійти"}
      </Button>
    </Box>
  );
};

export default AuthForm;
