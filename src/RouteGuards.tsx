import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/signin" replace />;
}

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/dashboard" replace /> : children;
}
