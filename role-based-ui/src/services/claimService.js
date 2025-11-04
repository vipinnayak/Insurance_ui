export const getClaimsForCustomer = (email) => {
  const claims = JSON.parse(localStorage.getItem("claims")) || [];
  return claims.filter(c => c.customerEmail === email);
};

export const addClaim = (claim) => {
  const claims = JSON.parse(localStorage.getItem("claims")) || [];
  claim.id = Date.now();
  claims.push(claim);
  localStorage.setItem("claims", JSON.stringify(claims));
};
