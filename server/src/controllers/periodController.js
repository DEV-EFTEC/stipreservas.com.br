import * as periodService from "../services/periodService.js";
import logger from "#core/logger.js";

export async function getPeriods(req, res) {
  try {
    const result = await periodService.getPeriods();

    if (!result)
      return res
        .status(401)
        .json({ message: "Não foram encontrados períodos já cadastrados." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on signin", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function createPeriod(req, res) {
  try {
    const result = await periodService.createPeriod(req.body);
    res.status(201).json(result);
  } catch (err) {
    logger.error("Error creating user", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function updatePeriod(req, res) {
  try {
    const { id } = req.params;
    const period = await periodService.updatePeriod(id, req.body);
    res.status(200).json(period);
  } catch (err) {
    logger.error("Error on createdependents", { err });
    res.status(500).json({ error: "Erro ao atualizar dependents" });
  }
}

export async function isHighSeason(req, res) {
  try {
    const { date } = req.body;
    const period = await periodService.isHighSeason(date);
    res.status(200).json(period);
  } catch (err) {
    logger.error("Error on createdependents", { err });
    res.status(500).json({ error: "Erro ao atualizar dependents" });
  }
}
