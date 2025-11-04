
import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const AuthContext = createContext();

// Hardcoded Admin
const ADMIN_CREDENTIALS = {
  email: "admin@insurance.com",
  password: "admin123",
  role: "admin",
  name: "Admin",
};

// ✅ Hardcoded Surveyors (ye fix rahenge code me)
const PREDEFINED_SURVEYORS = [
  {
    name: "Rahul Sharma",
    email: "rahul.surveyor@insurance.com",
    password: "rahul123",
    role: "surveyor",
  },
  {
    name: "Priya Verma",
    email: "priya.surveyor@insurance.com",
    password: "priya123",
    role: "surveyor",
  },
  {
    name: "Amit Singh",
    email: "amit.surveyor@insurance.com",
    password: "amit123",
    role: "surveyor",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("loggedInUser");
    return saved ? JSON.parse(saved) : null;
  });

  // ✅ Ye effect har baar app load hone par predefined surveyor localStorage me daalega
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const allEmails = existingUsers.map((u) => u.email);

    // Agar predefined surveyors missing hain to unhe add karo
    const updatedUsers = [
      ...existingUsers,
      ...PREDEFINED_SURVEYORS.filter((s) => !allEmails.includes(s.email)),
    ];

    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("loggedInUser", JSON.stringify(user));
    else localStorage.removeItem("loggedInUser");
  }, [user]);

  // ✅ Login function
  const login = ({ email, password, role }) => {
    // Admin login
    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setUser(ADMIN_CREDENTIALS);
      return { success: true, role: "admin", user: ADMIN_CREDENTIALS };
    }

    // Surveyor ya Customer login
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const existingUser = registeredUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (existingUser) {
      setUser(existingUser);
      return { success: true, role: existingUser.role, user: existingUser };
    }

    return { success: false, message: "Invalid credentials" };
  };

  // ✅ Register (sirf customers ke liye)
  const register = (newUser) => {
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    if (users.find((u) => u.email === newUser.email))
      return { success: false, message: "Email already registered" };
    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    return { success: true };
  };

  // Logout
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
