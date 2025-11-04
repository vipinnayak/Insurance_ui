import React, { useState, useEffect } from "react";

export default function AddPolicy() {
  const [policies, setPolicies] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("3");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("policies")) || [];
    setPolicies(saved);
  }, []);

  const handleAdd = () => {
    if (!name || !price) return alert("Fill all fields");
    const saved = JSON.parse(localStorage.getItem("policies")) || [];
    const newPolicy = { id: Date.now(), name, duration, price };
    saved.push(newPolicy);
    localStorage.setItem("policies", JSON.stringify(saved));
    setPolicies(saved);
    setName(""); setPrice(""); setDuration("3");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Add Policy</h3>
      <input placeholder="Policy Name" value={name} onChange={e => setName(e.target.value)} />
      <select value={duration} onChange={e => setDuration(e.target.value)}>
        <option value="3">3 Months</option>
        <option value="6">6 Months</option>
        <option value="12">12 Months</option>
      </select>
      <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={handleAdd}>Add Policy</button>
      <ul>
        {policies.map(p => <li key={p.id}>{p.name} - {p.duration} months - ${p.price}</li>)}
      </ul>
    </div>
  );
}
