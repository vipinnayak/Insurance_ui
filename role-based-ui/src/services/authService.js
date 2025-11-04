// authService.js
import { v4 as uuidv4 } from "uuid";

const USERS_KEY = "ic_users";

// seed sample admin + surveyor (only once)
function seed() {
  if (!localStorage.getItem(USERS_KEY)) {
    const users = [
      { id: uuidv4(), name: "Admin", email: "admin@ins.com", password: "admin123", role: "admin" },
      { id: uuidv4(), name: "Surveyor", email: "surveyor@ins.com", password: "surv123", role: "surveyor" },
      { id: uuidv4(), name: "Customer", email: "cust@ins.com", password: "cust123", role: "customer" },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}
seed();

export function register({ name, email, password, role = "customer" }) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  if (users.find((u) => u.email === email)) {
    throw new Error("Email already registered");
  }
  const newUser = { id: uuidv4(), name, email, password, role };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
}

export function login({ email, password }) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  // return without password
  const { password: pw, ...rest } = user;
  return rest;
}

export function getUserByEmail(email) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  return users.find((u) => u.email === email);
}
