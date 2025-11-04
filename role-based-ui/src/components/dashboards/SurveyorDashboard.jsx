import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

export default function SurveyorDashboard() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);

  // ✅ Fetch assigned claims from Firestore
  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, "claims"),
      where("assignedSurveyor", "==", user.email)
    );

    // ✅ Real-time updates listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const claimData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClaims(claimData);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Approve or Reject claim
  const handleApproveReject = async (claimId, status) => {
    try {
      const claimRef = doc(db, "claims", claimId);
      let approvedAmount = null;

      if (status === "Approved") {
        const amt = prompt("Enter approved amount:", "5000");
        approvedAmount = amt || null;
      }

      await updateDoc(claimRef, {
        status,
        approvedAmount,
      });

      alert(`Claim ${status} successfully`);
    } catch (error) {
      console.error("Error updating claim:", error);
      alert("Failed to update claim. Check console for details.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Surveyor Dashboard</h2>

      {claims.length > 0 ? (
        claims.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid gray",
              borderRadius: "8px",
              margin: "10px 0",
              padding: "10px",
              backgroundColor:
                c.status === "Approved"
                  ? "#e6ffed"
                  : c.status === "Rejected"
                  ? "#ffe6e6"
                  : "#f9f9f9",
            }}
          >
            <p>
              <b>Policy:</b> {c.policyName}
            </p>
            <p>
              <b>Customer:</b> {c.customerName}
            </p>
            <p>
              <b>Requested Amount:</b> ${c.amountRequested}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    c.status === "Approved"
                      ? "green"
                      : c.status === "Rejected"
                      ? "red"
                      : "black",
                }}
              >
                {c.status}
              </span>
            </p>

            {c.status === "Approved" && (
              <p>
                <b>Approved Amount:</b> ${c.approvedAmount}
              </p>
            )}

            {c.status === "Pending" && (
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => handleApproveReject(c.id, "Approved")}
                  style={{
                    marginRight: 10,
                    padding: "6px 12px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveReject(c.id, "Rejected")}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No claims assigned to you yet</p>
      )}
    </div>
  );
}
