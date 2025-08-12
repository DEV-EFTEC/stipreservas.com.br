import * as enterpriseService from "../services/enterpriseService.js";
import logger from "#core/logger.js";

export async function createEnterprise(req, res) {
  try {
    await enterpriseService.createEnterprise(req.body);
    res.status(200).json({ message: "Enterprise created." });
  } catch (err) {
    logger.error("Error on createEnterprise", { err });
    res.status(500).json({ message: "Erro ao criar empresa" });
  }
}

export async function getEnterpriseById(req, res) {
  try {
    const { id } = req.params;
    const enterprise = await enterpriseService.getEnterpriseById(id);
    res.status(200).json({ enterprise });
  } catch (err) {
    logger.error("Error on getEnterpriseById", { err });
    res.status(500).json({ message: "Erro ao criar empresa" });
  }
}
