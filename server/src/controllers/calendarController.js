import * as calendarService from "../services/calendarService.js";
import logger from "#core/logger.js";

export async function findAllOccupations(req, res) {
  try {
    const calendar = await calendarService.findAllOccupations();
    res.status(200).json(calendar);
  } catch (err) {
    logger.error("Error on findAllOccupations", { err });
    res.status(500).json({ error: "Erro ao encontrar todas as ocupações" });
  }
}
