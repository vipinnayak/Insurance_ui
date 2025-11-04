import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Dashboard.css";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [policyName, setPolicyName] = useState("");
  const [policyPrice, setPolicyPrice] = useState("");
  const [policyDuration, setPolicyDuration] = useState("3");
  const [claims, setClaims] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [assignSurveyorEmail, setAssignSurveyorEmail] = useState("");

  // ✅ Fetch policies + claims + surveyors from Firestore 
  useEffect(() => {
    const fetchData = async () => {
      // Get all policies
      const policySnap = await getDocs(collection(db, "policies"));
      setPolicies(policySnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Get all claims
      const claimSnap = await getDocs(collection(db, "claims"));
      setClaims(claimSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Get all surveyors
      const surveyorSnap = await getDocs(collection(db, "surveyors"));
      setSurveyors(surveyorSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchData();
  }, []);

  // ✅ Add Policy (Firestore me store karna)
  const handleAddPolicy = async () => {
    if (!policyName || !policyPrice) return alert("Please fill all fields!");

    try {
      await addDoc(collection(db, "policies"), {
        name: policyName,
        price: policyPrice,
        duration: policyDuration,
      });
      alert("✅ Policy added successfully!");
      setPolicyName("");
      setPolicyPrice("");
      setPolicyDuration("3");

      // refresh list
      const policySnap = await getDocs(collection(db, "policies"));
      setPolicies(policySnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error adding policy: ", error);
      alert("❌ Failed to add policy. Check console.");
    }
  };

  // ✅ Assign Surveyor (update claim)
  const handleAssign = async (claimId) => {
    if (!assignSurveyorEmail) return alert("Select a surveyor");

    try {
      const claimRef = doc(db, "claims", claimId);
      await updateDoc(claimRef, { assignedSurveyor: assignSurveyorEmail });
      alert("Surveyor assigned successfully!");

      // Refresh
      const claimSnap = await getDocs(collection(db, "claims"));
      setClaims(claimSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setAssignSurveyorEmail("");
    } catch (error) {
      console.error("Error assigning surveyor: ", error);
    }
  };

  // ✅ Approve or Reject Claim
  const handleApproveReject = async (claimId, status) => {
    try {
      let approvedAmount;
      if (status === "Approved") {
        const amt = prompt("Enter approved amount:", "1000");
        approvedAmount = amt || "1000";
      }

      const claimRef = doc(db, "claims", claimId);
      await updateDoc(claimRef, {
        status,
        approvedAmount: approvedAmount || "",
      });

      alert(`Claim ${status} successfully!`);

      // Refresh
      const claimSnap = await getDocs(collection(db, "claims"));
      setClaims(claimSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error updating claim: ", error);
    }
  };

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2>Welcome, {user?.name || "Admin"}</h2>

      {/* Add Policy */}
      <motion.div className="dashboard-card" whileHover={{ scale: 1.02 }}>
        <h3>Add Policy</h3>
        <input
          placeholder="Policy Name"
          value={policyName}
          onChange={(e) => setPolicyName(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          value={policyPrice}
          onChange={(e) => setPolicyPrice(e.target.value)}
        />
        <select
          value={policyDuration}
          onChange={(e) => setPolicyDuration(e.target.value)}
        >
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
        </select>
        <button onClick={handleAddPolicy}>Add Policy</button>
      </motion.div>

      {/* All Policies */}
      <motion.div className="dashboard-card" whileHover={{ scale: 1.02 }}>
        <h3>All Policies</h3>
        <ul className="policy-list">
          {policies.length > 0 ? (
            policies.map((p) => (
              <li key={p.id}>
                {p.name} - ₹{p.price} - {p.duration} months
              </li>
            ))
          ) : (
            <p>No policies added yet</p>
          )}
        </ul>
      </motion.div>

      {/* Claims */}
      <motion.div className="dashboard-card" whileHover={{ scale: 1.02 }}>
        <h3>Claims</h3>
        {claims.length > 0 ? (
          claims.map((c) => (
            <div key={c.id} className="claim-list">
              <p>
                {c.policyName} - Customer: {c.customerName} - Status: {c.status}
              </p>
              <p>
                Requested: ₹{c.amountRequested} - Assigned Surveyor:{" "}
                {c.assignedSurveyor || "None"}
              </p>

              {!c.assignedSurveyor && surveyors.length > 0 && (
                <div>
                  <select
                    value={assignSurveyorEmail}
                    onChange={(e) => setAssignSurveyorEmail(e.target.value)}
                  >
                    <option value="">Select Surveyor</option>
                    {surveyors.map((s) => (
                      <option key={s.email} value={s.email}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleAssign(c.id)}>
                    Assign Surveyor
                  </button>
                </div>
              )}

              {c.assignedSurveyor && (
                <div>
                  <button onClick={() => handleApproveReject(c.id, "Approved")}>
                    Approve
                  </button>
                  <button onClick={() => handleApproveReject(c.id, "Rejected")}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No claims yet</p>
        )}
      </motion.div>
    </motion.div>
  );
}
