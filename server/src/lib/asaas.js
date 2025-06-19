import dotenv from "dotenv";

dotenv.config();

export async function apiAsaas(endpoint, options = {}) {
  const baseUrl = process.env.ASAAS_API_URL;

  const res = await fetch(`${baseUrl}/v3${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "access-token": `${process.env.ASAAS_API_KEY}`,
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("[Asaas API ERROR]", data); // 👈 loga erro completo
    const firstError =
      data.errors?.[0]?.description || data.message || "Erro inesperado";
    throw new Error(firstError);
  }

  return data;
}
