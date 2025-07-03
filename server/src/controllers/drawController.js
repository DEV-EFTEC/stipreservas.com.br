import * as drawService from "../services/drawService.js";
import logger from "#core/logger.js";

export async function getDrawById(req, res) {
  try {
    const { id } = req.params;
    const result = await drawService.getDrawById(id);

    if (!result)
      return res.status(404).json({ message: "Nenhum sorteio encontrado." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on findBookingById", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function createDraw(req, res) {
  try {
    const result = await drawService.createDraw(req.body);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Erro em createDraw", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function updateDraw(req, res) {
  try {
    const updatedDraw = await drawService.updateDraw(req.body);
    res.status(200).json(updatedDraw);
  } catch (err) {
    logger.error("Erro em updateStatus", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function deleteDraw(req, res) {
  try {
    const { id } = req.params;
    const result = await drawService.deleteDraw(id);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on updateParticipants", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function getDraws(req, res) {
  try {
    const { page, limit } = req.query;
    const result = await drawService.getAllDraws( page, limit);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on getAllBookings", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function getDrawByDate(req, res) {
  try {
    const { start_date, end_date } = req.query;
    const result = await drawService.getDrawByDate(start_date, end_date);

    if (!result)
      return res.status(404).json({ message: "Nenhum sorteio encontrado." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on findBookingById", { err });
    res.status(500).json({ error: err.message });
  }
}