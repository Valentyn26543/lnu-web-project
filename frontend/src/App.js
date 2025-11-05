import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAuthMe } from "./redux/slices/auth";

import Header from "./components/Header/Header.js";
import LoginPage from "./pages/LoginPage.js"; 
import RegistrationPage from "./pages/RegistrationPage.js"; 
import MainPage from "./pages/MainPage.js";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </>
  );
};

export default App;
