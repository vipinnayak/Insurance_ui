import React, { useState, useEffect, useContext } from "react";
import { getClaimById, updateClaim } from "../../services/claimService";
import { useAuth } from "../../context/AuthContext";

export default function ClaimDetails({ id }) {
  const { user } = useAuth();
  const [claim, setClaim] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    setClaim(getClaimById(id));
  }, [id]);

  if (!claim) return <div>Claim not found</div>;

  const handleAction = (action, extra = {}) => {
    const updates = { status: action, actionBy: user.email, note: extra.note || "" };
    if (action === "assigned_to_surveyor" && extra.surveyorEmail) updates.assignedSurveyor = extra.surveyorEmail;
    const updated = updateClaim(claim.id, updates);
    setClaim(updated);
    alert("Updated");
  };

  return (
    <div style={{ background: "white", padding: 12, borderRadius: 8 }}>
      <h3>Claim Details</h3>
      <p><b>ID:</b> {claim.id}</p>
      <p><b>Customer:</b> {claim.customerName} — {claim.customerEmail}</p>
      <p><b>Policy:</b> {claim.policyNumber}</p>
      <p><b>Amount:</b> {claim.amount}</p>
      <p><b>Description:</b> {claim.description}</p>
      <p><b>Status:</b> {claim.status}</p>

      <h4>History</h4>
      <ul>
        {(claim.history || []).map((h, idx) => <li key={idx}>{new Date(h.when).toLocaleString()} — {h.by} — {h.note}</li>)}
      </ul>

      {user.role === "admin" && (
        <>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => handleAction("approved")} style={{ marginRight: 8 }}>Approve</button>
            <button onClick={() => handleAction("rejected")} style={{ marginRight: 8 }}>Reject</button>
            <button onClick={() => {
              const surveyorEmail = prompt("Enter surveyor email to assign:");
              if (surveyorEmail) handleAction("assigned_to_surveyor", { surveyorEmail, note: "Assigned to surveyor" });
            }}>Assign to Surveyor</button>
          </div>
        </>
      )}

      {user.role === "surveyor" && user.email === claim.assignedSurveyor && (
        <>
          <h4 style={{ marginTop: 12 }}>Surveyor actions</h4>
          <textarea placeholder="Survey notes" value={note} onChange={(e)=>setNote(e.target.value)} style={{ width: "100%", marginBottom: 8 }}/>
          <button onClick={() => handleAction("surveyed", { note })}>Submit Survey</button>
        </>
      )}

      {user.role === "customer" && user.email === claim.customerEmail && (
        <div style={{ marginTop: 12 }}>
          <p>You submitted this claim.</p>
        </div>
      )}
    </div>
  );
}
