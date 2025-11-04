import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ClaimForm from "../claims/ClaimForm";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import "./Dashboard.css";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [ownedPolicies, setOwnedPolicies] = useState([]);

  
  const fetchData = async () => {
    try {
      
      const policiesSnap = await getDocs(collection(db, "policies"));
      const policiesData = policiesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolicies(policiesData);


      const ownedSnap = await getDocs(
        query(collection(db, "ownedPolicies"), where("customerEmail", "==", user.email))
      );
      const ownedData = ownedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOwnedPolicies(ownedData);

      // Claims fetch karo (sirf current user ke)
      const claimsSnap = await getDocs(
        query(collection(db, "claims"), where("customerEmail", "==", user.email))
      );
      const claimsData = claimsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClaims(claimsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // ✅ Policy buy karna
  const handleBuy = async (policy) => {
    try {
      const policyNo = "POL" + Date.now();
      await addDoc(collection(db, "ownedPolicies"), {
        policyId: policy.id,
        policyName: policy.name,
        customerEmail: user.email,
        policyNo,
        price: policy.price,
        duration: policy.duration,
      });
      alert(`Policy purchased successfully! Policy No: ${policyNo}`);
      fetchData();
    } catch (error) {
      console.error("Error buying policy:", error);
      alert("Error buying policy, please try again.");
    }
  };

  // ✅ Claim form submission ke baad list refresh
  const handleNewClaim = () => {
    fetchData();
  };

  return (
    <div className="dashboard-container">
      <h2>Customer Dashboard</h2>

      {/* Available Policies */}
      <div className="dashboard-card">
        <h3>Available Policies</h3>
        <ul className="policy-list">
          {policies.length > 0 ? (
            policies.map((p) => (
              <li key={p.id}>
                <span>
                  {p.name} — {p.duration} months — ${p.price}
                </span>
                <button onClick={() => handleBuy(p)}>Buy</button>
              </li>
            ))
          ) : (
            <p>No policies available</p>
          )}
        </ul>
      </div>

      {/* Owned Policies */}
      <div className="dashboard-card">
        <h3>Your Owned Policies</h3>
        <ul className="policy-list">
          {ownedPolicies.length > 0 ? (
            ownedPolicies.map((p) => (
              <li key={p.policyNo}>
                {p.policyName} — Policy No: {p.policyNo} — ${p.price}
              </li>
            ))
          ) : (
            <p>No policies purchased yet</p>
          )}
        </ul>
      </div>

      {/* Claim Form */}
      <div className="dashboard-card">
        <ClaimForm user={user} refresh={fetchData} onClaimSubmit={handleNewClaim} />
      </div>

      {/* Claims List */}
      <div className="dashboard-card">
        <h3>Your Claims</h3>
        <ul className="claim-list">
          {claims.length > 0 ? (
            claims.map((c) => (
              <li
                key={c.id}
                className={
                  c.status === "Approved"
                    ? "claim-approved"
                    : c.status === "Rejected"
                    ? "claim-rejected"
                    : "claim-pending"
                }
              >
                <strong>{c.policyName}</strong> — Requested: ${c.amountRequested} |
                Status: <b>{c.status}</b>{" "}
                {c.approvedAmount
                  ? `| Approved Amount: $${c.approvedAmount}`
                  : ""}
                {c.assignedSurveyor
                  ? ` | Surveyor: ${c.assignedSurveyor}`
                  : ""}
              </li>
            ))
          ) : (
            <li>No claims yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}
