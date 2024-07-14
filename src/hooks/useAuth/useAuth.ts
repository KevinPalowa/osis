import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

// Define types for user and authentication context

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
