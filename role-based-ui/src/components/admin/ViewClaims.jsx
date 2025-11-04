import React, { useState, useEffect } from "react";

export default function ViewClaims() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("claims")) || [];
    setClaims(saved);
  }, []);

  const assignSurveyor = (claim) => {
    const surveyorEmail = prompt("Enter surveyor email to assign:");
    if (!surveyorEmail) return;
    const updated = claims.map(c => c.id === claim.id ? {...c, assignedSurveyor: surveyorEmail} : c);
    setClaims(updated);
    localStorage.setItem("claims", JSON.stringify(updated));
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>All Claims</h3>
      {claims.length > 0 ? (
        <ul>
          {claims.map(c => (
            <li key={c.id}>
              {c.policyName} - {c.customerName} - {c.status} 
              {c.status==="Pending" && <button onClick={() => assignSurveyor(c)}>Assign Surveyor</button>}
            </li>
          ))}
        </ul>
      ) : <p>No claims yet.</p>}
    </div>
  );
}
