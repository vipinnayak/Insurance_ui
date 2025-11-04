import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Auth
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Dashboards
import AdminDashboard from "./components/dashboards/AdminDashboard";
import CustomerDashboard from "./components/dashboards/CustomerDashboard";
import SurveyorDashboard from "./components/dashboards/SurveyorDashboard";

// Home page (Policies before login)
import PolicyList from "./components/customer/PolicyList";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>

        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home page */}
        <Route path="/policies" element={<PolicyList />} />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }/>

        {/* Customer */}
        <Route path="/customer" element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }/>

        {/* Surveyor */}
        <Route path="/surveyor" element={
          <ProtectedRoute role="surveyor">
            <SurveyorDashboard />
          </ProtectedRoute>
        }/>

      </Routes>
    </AuthProvider>
  );
}

export default App;
