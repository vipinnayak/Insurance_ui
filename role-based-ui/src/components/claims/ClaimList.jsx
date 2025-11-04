import React from "react";
import "./ClaimList.css";
export default function ClaimList({ claims }) {
  return (
    <ul>
      {claims.map(c=>(
        <li key={c.id}>{c.policyName} - {c.status}</li>
      ))}
    </ul>
  );
}
