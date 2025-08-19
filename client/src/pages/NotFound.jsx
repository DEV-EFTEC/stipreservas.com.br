import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === 'admin') {
      navigate('/admin/home');
    } else if (user.role === 'local') {
      navigate('/local/home');
    } else {
      navigate('/associado/home')
    }
  }, [])

  return (
    <>
      <h1>Rota não encontrada</h1>
    </>
  )
}