function allowCrossDomain(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
  
    // 🔥 ESSENCIAL: responder OPTIONS manualmente
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
  
    next();
  }
  
  export default allowCrossDomain;
  