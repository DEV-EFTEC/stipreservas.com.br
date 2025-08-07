import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "./loader";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center flex-col"><Loader /><p>Carregando</p></div>
  }

  if (!user) return <Navigate to={"/signin"} />;
  if (role && user.role !== role) return <Navigate to={"/unauthorized"} />;

  return children;
}