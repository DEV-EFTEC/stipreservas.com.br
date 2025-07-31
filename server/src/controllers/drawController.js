import * as drawService from "#services/drawService.js";
import logger from "#core/logger.js";
import * as dependentsModel from "#models/dependentsModel.js";
import * as guestsModel from "#models/guestsModel.js";
import * as childrenModel from "#models/childrenModel.js";
import * as holderModel from "#models/holderModel.js";

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

export async function findDrawsByUser(req, res) {
  try {
    const { user_id, page, limit } = req.query;
    const result = await drawService.findDrawsByUser(user_id, page, limit);

    if (!result)
      return res.status(404).json({ message: "Nenhuma inscrição em sorteio encontrada." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on findDrawsByUser", { err });
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
    const { id } = req.params;
    const updatedDraw = await drawService.updateDraw(id, req.body);
    res.status(200).json(updatedDraw);
  } catch (err) {
    logger.error("Erro em updateStatus", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function updateDrawApply(req, res) {
  try {
    const { id } = req.params;
    const updatedDraw = await drawService.updateDrawApply(id, req.body);
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
    const result = await drawService.getAllDraws(page, limit);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on getAllBookings", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function getDrawParticipants(req, res) {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const result = await drawService.getDrawParticipants(page, limit, id);
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

    if (!result) return res.status(404).json({ message: "Nenhum encontrado." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on getDrawByDate", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function run(req, res) {
  try {
    const { draw_id } = req.body;
    const result = await drawService.run(draw_id);

    if (!result) return res.status(404).json({ message: "Nenhum encontrado." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on run", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function rerun(req, res) {
  try {
    const { draw_id } = req.body;
    const result = await drawService.rerun(draw_id);

    if (!result) return res.status(404).json({ message: "Nenhum encontrado." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on run", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function createDrawApply(req, res) {
  try {
    const result = await drawService.createDrawApply(req.body);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Erro em createBooking", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function getDrawApplyComplete(req, res) {
  try {
    const { draw_apply_id } = req.query;
    const result = await drawService.getDrawApplyComplete(draw_apply_id);

    if (!result)
      return res.status(404).json({ message: "Nenhuma reserva de sorteio encontrada." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on getDrawApplyComplete", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function createParticipantsDraw(req, res) {
  try {
    const { children, guests, dependents, holders } = req.body;
    const result = await drawService.createParticipantsDraw(
      children,
      guests,
      dependents,
      holders
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on createParticipantsDraw", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateParticipantsDraw(req, res) {
  try {
    const { draw_apply_id } = req.query;
    const { children, guests, dependents, holders } = req.body;
    const result = await drawService.updateParticipantsDraw(
      draw_apply_id,
      children,
      guests,
      dependents,
      holders
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on updateParticipantsDraw", err);
    res.status(500).json({ error: err.message });
  }
}

export async function approveDraw(req, res) {
  try {
    const { draw_apply_id, user_id, value } = req.body;
    const result = await drawService.approveDraw(draw_apply_id, user_id, value);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on approveDraw", err);
    res.status(500).json({ error: err.message });
  }
}

export async function refuseDraw(req, res) {
  try {
    const { draw_apply_id, user_id, justification } = req.body;
    const result = await drawService.refuseDraw(draw_apply_id, user_id, justification);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on refuseDraw", err);
    res.status(500).json({ error: err.message });
  }
}