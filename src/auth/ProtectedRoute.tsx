import { Navigate } from "react-router-dom";
import { getUser } from "./auth";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
