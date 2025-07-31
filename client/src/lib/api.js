export async function apiRequest(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Erro inesperado');
  }

  return res.json();
}
