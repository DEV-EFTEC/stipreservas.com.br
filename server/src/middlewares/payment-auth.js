import dotenv from "dotenv";

dotenv.config();

function paymentAuth(req, res, next) {
  const token = req.headers["asaas-access-token"];
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    if (process.env.ASAAS_ACCESS_TOKEN_WEBHOOK === token) {
      next();
    }
  } catch (err) {
    res.status(403).json({ error: "Token inválido." });
  }
}

export default paymentAuth;
