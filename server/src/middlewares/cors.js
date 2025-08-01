const allowCrossDomain = (req, res, next) => {
  const origin = req.headers.origin;

  if (origin === "https://www.stip-reservas.com.br" || origin === "http://localhost:5173") {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};

export default allowCrossDomain;
