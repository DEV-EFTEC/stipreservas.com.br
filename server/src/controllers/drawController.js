import * as drawService from "../services/drawService.js";
import logger from "#core/logger.js";

export async function findDrawById(req, res) {
  try {
    const { id } = req.query;
    const result = await drawService.findDrawById(id);

    if (!result)
      return res.status(404).json({ message: "Nenhuma reserva encontrada." });

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

export async function updateBooking(req, res) {
  try {
    const updatedBooking = await drawService.updateBooking(req.body);
    res.status(200).json(updatedBooking);
  } catch (err) {
    logger.error("Erro em updateStatus", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    const result = await drawService.deleteBooking(id);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on updateParticipants", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function getAllBookings(req, res) {
  try {
    const { user_type, page, limit } = req.query;
    const result = await drawService.getAllBookings(user_type, page, limit);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on getAllBookings", { err });
    res.status(500).json({ error: err.message });
  }
}
