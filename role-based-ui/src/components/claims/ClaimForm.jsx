import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function ClaimForm({ user, refresh, onClaimSubmit }) {
  const [policyNo, setPolicyNo] = useState("");
  const [amount, setAmount] = useState("");
  const [ownedPolicies, setOwnedPolicies] = useState([]);

  // ✅ Fetch owned policies from Firestore
  useEffect(() => {
    const fetchOwnedPolicies = async () => {
      try {
        const q = query(
          collection(db, "ownedPolicies"),
          where("customerEmail", "==", user.email)
        );
        const snapshot = await getDocs(q);
        const policiesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOwnedPolicies(policiesData);
      } catch (error) {
        console.error("Error fetching owned policies:", error);
      }
    };

    fetchOwnedPolicies();
  }, [user]);

  // ✅ Submit claim to Firestore
  const handleSubmit = async () => {
    if (!policyNo || !amount) return alert("Select a policy and enter amount");

    const selectedPolicy = ownedPolicies.find((p) => p.policyNo === policyNo);
    if (!selectedPolicy) return alert("Invalid policy selected");

    try {
      await addDoc(collection(db, "claims"), {
        policyNo: selectedPolicy.policyNo,
        policyName: selectedPolicy.policyName,
        customerName: user.name,
        customerEmail: user.email,
        status: "Pending",
        amountRequested: amount,
        assignedSurveyor: null,
        approvedAmount: null,
        createdAt: new Date().toISOString(),
      });

      setPolicyNo("");
      setAmount("");

      alert("Claim submitted successfully!");
      if (onClaimSubmit) onClaimSubmit(); // UI refresh
      refresh(); // fetchData() call from parent
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Error submitting claim. Please try again.");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>File a Claim</h3>

      <select
        value={policyNo}
        onChange={(e) => setPolicyNo(e.target.value)}
      >
        <option value="">Select Your Policy</option>
        {ownedPolicies.map((p) => (
          <option key={p.policyNo} value={p.policyNo}>
            {p.policyName} - {p.policyNo}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Claim Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit Claim</button>
    </div>
  );
}
