export const getPurchasedPolicies = (customerEmail) => {
  const purchased = JSON.parse(localStorage.getItem("purchasedPolicies")) || [];
  return purchased.filter(p => p.customerEmail === customerEmail);
};

export const buyPolicy = (policy, customerEmail) => {
  const purchased = JSON.parse(localStorage.getItem("purchasedPolicies")) || [];
  purchased.push({ ...policy, customerEmail });
  localStorage.setItem("purchasedPolicies", JSON.stringify(purchased));
};
