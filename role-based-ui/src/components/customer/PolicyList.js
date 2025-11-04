import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PolicyList() {
  const [policies, setPolicies] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("policies")) || [];
    setPolicies(saved);
  }, []);

  const handleView = (policy) => {
    alert(`Login as customer to buy this policy: ${policy.name}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Policies</h2>
      {policies.length > 0 ? (
        <ul>
          {policies.map(p => (
            <li key={p.id}>
              {p.name} - {p.duration} months - ${p.price} 
              <button onClick={() => handleView(p)}>View / Buy</button>
            </li>
          ))}
        </ul>
      ) : <p>No policies added yet.</p>}
    </div>
  );
}
