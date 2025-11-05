import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Header.css";

import { selectIsAuth, logout } from "../../redux/slices/auth";

const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm("Ви впевнені, що хочете вийти?")) {
      dispatch(logout());
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          SLAE Solver
        </Link>

        <div className="button-group">
          {isAuth ? (
            <button
              onClick={onClickLogout}
              className="button-base button-logout"
            >
              Вийти
            </button>
          ) : (
            <>
              <Link to="/login" className="button-base button-login">
                Увійти
              </Link>

              <Link to="/register" className="button-base button-register">
                Зареєструватись
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
