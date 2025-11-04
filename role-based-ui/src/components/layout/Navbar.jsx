import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="navbar">
      <div>
        <Link to="/">INSURANCE MANAGEMENT SYSTEM</Link>
        {user && user.role === "admin" && <Link to="/admin">Admin</Link>}
        {user && user.role === "customer" && <Link to="/customer">Customer</Link>}
        {user && user.role === "surveyor" && <Link to="/surveyor">Surveyor</Link>}
      </div>
      <div>
        {user ? (
          <>
            <span>Hi, {user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
