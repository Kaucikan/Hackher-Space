import { Navigate } from "react-router-dom";
import { getUser } from "@/lib/utils";
export const ProtectedRoute = ({ children }: any) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
