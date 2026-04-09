import { Navigate } from "react-router-dom";
import { getUser } from "@/lib/utils";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
