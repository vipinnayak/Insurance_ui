import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("Fill all fields");

    const res = register({ name, email, password, role });
    if (res.success) {
      alert("Registration successful! Please login.");
      nav("/login");
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
        <h1>Create Your Account</h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Join our insurance portal to manage policies, claims, and more.
        </p>

        <form onSubmit={handleSubmit}>
          <motion.input 
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            whileFocus={{ scale: 1.02, borderColor: "#1e293b" }}
            required
          />
          <motion.input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            whileFocus={{ scale: 1.02, borderColor: "#1e293b" }}
            required
          />
          <motion.input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            whileFocus={{ scale: 1.02, borderColor: "#1e293b" }}
            required
          />
          <motion.select
            value={role}
            onChange={e => setRole(e.target.value)}
            whileFocus={{ scale: 1.02, borderColor: "#1e293b" }}
          >
            <option value="customer">Customer</option>
            <option value="surveyor">Surveyor</option>
          </motion.select>
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05, backgroundColor: "#334155" }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </form>

        <p style={{ marginTop: 12 }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </motion.div>
    </div>
  );
}
