import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import "./Auth.css";


export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Fill all fields");

    const res = login({ email, password, role });
    if (res.success) {
      alert("Login successful");
      if (res.role === "admin") nav("/admin");
      else if (res.role === "customer") nav("/customer");
      else if (res.role === "surveyor") nav("/surveyor");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1>Secure Insurance Portal</h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Protect your future today. Login to manage your policies, claims, and more.
        </p>

        <form onSubmit={handleSubmit}>
          <motion.input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            whileFocus={{ scale: 1.02, borderColor: "#1e293b" }}
            required
          />
          <motion.input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            whileFocus={{ scale: 1.02, borderColor: "#1e293b" }}
            required
          />
          <motion.select
            value={role}
            onChange={e=>setRole(e.target.value)}
            whileFocus={{ scale: 1.02, borderColor: "#1e293b" }}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="surveyor">Surveyor</option>
          </motion.select>
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05, backgroundColor: "#334155" }}
            whileTap={{ scale: 0.95 }}
          >
            
            Login
          </motion.button>
        </form>

        <p style={{ marginTop: 12 }}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </motion.div>
    </div>
  );
}