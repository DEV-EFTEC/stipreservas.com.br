import * as bookingService from "../services/bookingService.js";
import logger from "#core/logger.js";
import { normalizeRowToPlainDate } from "#lib/to-business-iso.js";

export async function findBookingById(req, res) {
  try {
    const { id } = req.query;
    const result = await bookingService.findBookingById(id);
    const bookingN = normalizeRowToPlainDate(result);

    if (!result)
      return res.status(404).json({ message: "Nenhuma reserva encontrada." });

    res.status(200).json(bookingN);
  } catch (err) {
    logger.error("Error on findBookingById", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function findBookingsByUser(req, res) {
  try {
    const { page, limit } = req.query;
    const user_id = req.user.id;
    const result = await bookingService.findBookingsByUser(
      user_id,
      page,
      limit
    );

    if (!result)
      return res.status(404).json({ message: "Nenhuma reserva encontrada." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on findBookingsByUser", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function findInvitesByUser(req, res) {
  try {
    const { page, limit } = req.query;
    const user_id = req.user.id;
    const result = await bookingService.findInvitesByUser(user_id, page, limit);

    if (!result)
      return res.status(404).json({ message: "Nenhum convite encontrado." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on findBookingsByUser", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function findInviteById(req, res) {
  try {
    const { id } = req.query;
    const result = await bookingService.findInviteById(id);

    if (!result)
      return res.status(404).json({ message: "Nenhum convite encontrado." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on findBookingsByUser", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function createBooking(req, res) {
  try {
    const result = await bookingService.createBooking(req.body);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Erro em createBooking", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function updateStatusInvite(req, res) {
  try {
    const { id } = req.params;
    const { status, associate_invited_id } = req.body;
    const result = await bookingService.updateStatusInvite(
      id,
      status,
      associate_invited_id
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error("Erro em updateStatusInvite", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function updateInvite(req, res) {
  try {
    const { id } = req.params;
    const result = await bookingService.updateInvite(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Erro em updateStatusInvite", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const updatedBooking = await bookingService.updateBooking(req.body);
    res.status(200).json(updatedBooking);
  } catch (err) {
    logger.error("Erro em updateStatus", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function getBookingComplete(req, res) {
  try {
    const { booking_id } = req.query;
    const result = await bookingService.getBookingComplete(booking_id);

    if (!result)
      return res.status(404).json({ message: "Nenhuma reserva encontrada." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on getBookingComplete", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function getLocalBookingComplete(req, res) {
  try {
    const { date } = req.query;
    const result = await bookingService.getLocalBookingComplete(date);

    if (!result)
      return res.status(404).json({ message: "Nenhuma encontrada." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on getBookingComplete", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function getParticipants(req, res) {
  try {
    const { booking_id } = req.query;
    const result = await bookingService.getParticipants(booking_id);
    res.status(201).json(result);
  } catch (err) {
    logger.error("Error on createParticipants", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    const result = await bookingService.deleteBooking(id);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on updateParticipants", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function getAllBookings(req, res) {
  try {
    const { user_type, page, limit } = req.query;
    const result = await bookingService.getAllBookings(user_type, page, limit);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on getAllBookings", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function createParticipantsBooking(req, res) {
  try {
    const { children, guests, dependents, associates, stepchildren, holders } =
      req.body;
    const result = await bookingService.createParticipantsBooking(
      children,
      guests,
      dependents,
      associates,
      stepchildren,
      holders
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on createParticipantsBooking", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateParticipantsBooking(req, res) {
  try {
    const { booking_id } = req.query;
    const { children, guests, dependents, stepchildren, holders } = req.body;
    const result = await bookingService.updateParticipantsBooking(
      booking_id,
      children,
      guests,
      dependents,
      stepchildren,
      holders
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on updateParticipantsBooking", err);
    res.status(500).json({ error: err.message });
  }
}

export async function approveBooking(req, res) {
  try {
    const { booking_id, user_id, value } = req.body;
    const result = await bookingService.approveBooking(
      booking_id,
      user_id,
      value
    );

    const io = req.app.get("io");

    const message = {
      booking_id,
      status: result.status,
    };

    io.to(`user:${user_id}`).emit("booking:approved", message);

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on approveBooking", err);
    res.status(500).json({ error: err.message });
  }
}

export async function refuseBooking(req, res) {
  try {
    const { booking_id, user_id, justification } = req.body;
    const result = await bookingService.refuseBooking(
      booking_id,
      user_id,
      justification
    );

    const io = req.app.get("io");

    const message = {
      booking_id,
      status: result.status,
    };

    io.to(`user:${user_id}`).emit("booking:refused", message);

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on refuseBooking", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateParticipants(req, res) {
  try {
    const { booking_id } = req.params;
    const {
      children,
      guests,
      dependents,
      associates,
      holders,
      word_card_file_status,
      receipt_picture_status,
    } = req.body;
    const result = await bookingService.updateParticipants(
      booking_id,
      children,
      guests,
      dependents,
      associates,
      holders,
      word_card_file_status,
      receipt_picture_status
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on updateParticipants", err);
    res.status(500).json({ error: err.message });
  }
}
