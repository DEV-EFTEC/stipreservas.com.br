import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "./loader";
import * as Sentry from "@sentry/react"
import FallbackUI from "@/pages/FallbackUI";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  const [path, setPath] = useState();

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") {
      setPath("/admin/home");
    } else if (user.role === "associate") {
      setPath("/associado/home");
    } else if (user.role === "local") {
      setPath("/local/home");
    } else {
      setPath("/signin")
    }
  }, [user])

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center flex-col"><Loader /><p>Carregando</p></div>
  }

  if (!user) return <Navigate to={"/signin"} />;
  if (role && user.role !== role) return <Navigate to={"/unauthorized"} />;

  return (
    <Sentry.ErrorBoundary fallback={<FallbackUI homePath={path}/>}>
      {children}
    </Sentry.ErrorBoundary>
  );
}