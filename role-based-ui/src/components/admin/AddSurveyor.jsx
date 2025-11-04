import React, { useState } from "react";

export default function AddSurveyor() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = () => {
    if (!name || !email || !password) return alert("Fill all fields");
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    if (users.find(u => u.email === email)) return alert("Email exists");
    users.push({ name, email, password, role: "surveyor" });
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    setName(""); setEmail(""); setPassword("");
    alert("Surveyor added successfully");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Add Surveyor</h3>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleAdd}>Add Surveyor</button>
    </div>
  );
}
