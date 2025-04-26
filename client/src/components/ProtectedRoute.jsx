import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) return <Navigate to={"/signin"} />;
  if (role && user.role !== role) return <Navigate to={"/unauthorized"} />;

  return children;
}