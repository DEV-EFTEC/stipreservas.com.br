import * as paymentService from "#services/paymentService.js";
import * as bookingService from "../services/bookingService.js";
import logger from "#core/logger.js";

export async function bookingPaided(req, res) {
  const { body } = req;

  try {
    if (!body.payment?.externalReference?.startsWith("STIPreservas-")) {
      return res.status(200).send("Ignorado");
    }

    const payment = await paymentService.updatePaymentByAsaasPaymentId(
      body.payment.id,
      "payments",
      {
        status_role: ["RECEIVED", "RECEIVED_IN_CASH"].includes(
          body.payment.status
        )
          ? "paid"
          : "pending",
      }
    );

    const booking = await bookingService.updateBooking({
      id: payment.booking_id,
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

export async function bookingRefunded(req, res) {
  const { body } = req;

  try {
    const payment = await paymentService.updatePaymentByAsaasPaymentId(
      body.payment.id,
      "payments",
      { status_role: body.payment.status === "REFUNDED" && "refunded" }
    );

    const booking = await bookingService.updateBooking({
      id: payment.booking_id,
      status: "refunded",
    });

    const io = req.app.get("io");

    const message = {
      paymentId: body.payment.id,
      booking,
      userId: payment.user_id,
      customer: body.payment.customer,
      status: body.payment.status,
    };

    io.to(`user:${payment.user_id}`).emit("payment:refunded", message);
    io.to("admin").emit("admin:payment:refunded", message);

    res.status(200).json(message);
  } catch (err) {
    logger.error("Error on bookingPaided", { err });
    res.status(500).json({ error: "Erro em bookingPaided" });
  }
}
