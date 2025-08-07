import { toast } from "sonner";

export async function apiRequest(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401 || res.status === 403) {
    toast.warning("Sessão expirada", {
      description: "Sua sessão expirou. Você será redirecionado para a página de login.",
    });
    localStorage.removeItem("token");
    setTimeout(() => window.location.href = "/signin", 2000)
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    toast.error(error.message)
    throw new Error(error.message || "Erro inesperado");
  }

  return res.json();
}
