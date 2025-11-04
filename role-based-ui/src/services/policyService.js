export const getAllPolicies = () => JSON.parse(localStorage.getItem("policies")) || [];

export const addPolicy = (policy) => {
  const policies = JSON.parse(localStorage.getItem("policies")) || [];
  policy.id = Date.now();
  policies.push(policy);
  localStorage.setItem("policies", JSON.stringify(policies));
  return policy;
};
