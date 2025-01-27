import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function RouteProtection({ children }) {
  const { token } = useUser();

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}
