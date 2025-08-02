import * as paymentService from "#services/paymentService.js";
import logger from "#core/logger.js";

export async function createPayment(req, res) {
  try {
    const result = await paymentService.createPayment(
      "payments-bookings",
      req.body
    );
    res.status(201).json(result);
  } catch (err) {
    logger.error("Error on createPayment", { err });
    res.status(500).json({ error: "Erro ao criar payments" });
  }
}

export async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const status = req.body;
    await paymentService.updatePaymentStatus(id, status);
    res.status(200).json({ message: "Payment atualizado" });
  } catch (err) {
    logger.error("Error on updatePaymentStatus", { err });
    res.status(500).json({ error: "Erro ao atualizar payment status" });
  }
}

export async function findPaymentById(req, res) {
  try {
    const { id } = req.query;
    const result = await paymentService.findPaymentById(id);
    res.status(201).json(result);
  } catch (err) {
    logger.error("Error on findPaymentById", { err });
    res.status(500).json({ error: "Erro ao buscar payment by id" });
  }
}

export async function findPaymentsByUser(req, res) {
  try {
    const { id } = req.query;
    const result = await paymentService.findPaymentsByUser(id);
    res.status(201).json(result);
  } catch (err) {
    logger.error("Error on findPaymentsByUser", { err });
    res.status(500).json({ error: "Erro ao buscar payments by user" });
  }
}

export async function findPaymentByBooking(req, res) {
  try {
    const { id } = req.query;
    const result = await paymentService.findPaymentByBooking(id);
    res.status(201).json(result);
  } catch (err) {
    logger.error("Error on findPaymentsByBooking", { err });
    res.status(500).json({ error: "Erro ao buscar payments by booking" });
  }
}

export async function findPaymentByDraw(req, res) {
  try {
    const { id } = req.query;
    const result = await paymentService.findPaymentByDraw(id);
    res.status(201).json(result);
  } catch (err) {
    logger.error("Error on findPaymentByDraw", { err });
    res.status(500).json({ error: "Erro ao buscar payments by booking" });
  }
}

export async function drawPaided(req, res) {
  const { body } = req;

  try {
    const payment = await paymentService.updatePaymentByAsaasPaymentId(
      body.payment.id,
      { status_role: body.payment.status === "RECEIVED" && "paid" }
    );

    const draw = await drawService.updateDraw({
      id: payment.draw_id,
      status: "approved",
    });

    const io = req.app.get("io");

    const message = {
      paymentId: body.payment.id,
      booking,
      userId: payment.user_id,
      customer: body.payment.customer,
      status: body.payment.status,
    };

    io.to(`user:${payment.user_id}`).emit("payment:confirmed", message);
    io.to("admin").emit("admin:payment:confirmed", message);

    res.status(200).json(message);
  } catch (err) {
    logger.error("Error on bookingPaided", { err });
    res.status(500).json({ error: "Erro em bookingPaided" });
  }
}

export async function refund(req, res) {
  const { booking_id } = req.body;

  try {
    const refund = await paymentService.refundPayment(booking_id, "payments");

    res.status(200).json(refund);
  } catch (err) {
    logger.error("Error on refundPayment", { err });
    res.status(500).json({ error: "Erro em refundPayment" });
  }
}
