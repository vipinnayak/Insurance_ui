import React, { useState, useEffect } from "react";

export default function ViewCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    setCustomers(allUsers.filter(u => u.role === "customer"));
  }, []);

  return (
    <div style={{ marginTop: 20, backgroundColor: "white", padding: 20, borderRadius: 8 }}>
      <h3>All Customers</h3>
      {customers.length > 0 ? (
        <ul>
          {customers.map(c => (
            <li key={c.email}>{c.name} - {c.email}</li>
          ))}
        </ul>
      ) : (
        <p>No customers yet.</p>
      )}
    </div>
  );
}
