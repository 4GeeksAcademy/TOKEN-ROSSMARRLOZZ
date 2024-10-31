import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation(); // Hook para obtener la ubicación actual

  const handleLogout = async () => {
    const token = sessionStorage.getItem('token');
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    };

    try {
      const response = await fetch("https://scary-wand-v6p499j44g69cp7jq-3001.app.github.dev/api/logout", fetchOptions);
      if (response.status === 200) {
        sessionStorage.removeItem('token');
        onLogout();
        navigate('/');
      } else {
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error durante el logout:", error);
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Home</span>
        </Link>
        <div className="ml-auto">
          {isAuthenticated ? (
            <>
              <button className="btn btn-danger" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            // opciones de acuerdo a la ubicación
            <>
              {location.pathname === "/login" ? (
                <>
                  <Link to="/">
                    <button className="btn btn-info btn-spacing">Back to Home</button>
                  </Link>
                  <Link to="/signup">
                    <button className="btn btn-info ">Signup</button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <button className="btn btn-info btn-spacing">Signup</button>
                  </Link>
                  <Link to="/login">
                    <button className="btn btn-info">Log in</button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
