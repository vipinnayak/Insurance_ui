import React from "react";
import { useParams } from "react-router-dom";
import ClaimDetails from "../components/claims/ClaimDetails";

export default function ClaimDetailsWrapper() {
  const { id } = useParams();
  return <ClaimDetails id={id} />;
}
