import React, { useState, useEffect } from "react";

const FrontPolicies = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    // Static dummy data
    const samplePolicies = [
      { id: 1, name: "Health Insurance", price: "₹5,00,000", duration: "3 months" },
      { id: 2, name: "Car Insurance", price: "₹1,00,000", duration: "6 months" },
      { id: 3, name: "LIC Policy", price: "₹2,00,000", duration: "1 year" },
      { id: 4, name: "Travel Insurance", price: "₹50,000", duration: "6 months" },
    ];

    setPolicies(samplePolicies);
  }, []);

  return (
    <div className="mt-10 p-5 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-5 text-center">Available Insurance Policies</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg mb-2">{policy.name}</h3>
            <p>Coverage: {policy.price}</p>
            <p>Duration: {policy.duration}</p>
            <button
              onClick={() => alert("Please login as Customer to view or buy this policy.")}
              className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              View / Buy Policy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrontPolicies;
