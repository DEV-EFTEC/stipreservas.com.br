import express from "express";
import paymentAuth from "#middlewares/payment-auth.js";
import auth from "#middlewares/auth.js";
import * as paymentController from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", auth, paymentController.createPayment);
router.post("/booking-paided", paymentAuth, paymentController.bookingPaided);
router.get("/get-payment", auth, paymentController.findPaymentById);
router.get("/get-payments", auth, paymentController.findPaymentsByUser);
router.get(
  "/find-payment-by-booking",
  auth,
  paymentController.findPaymentByBooking
);
router.get("/update-status/:id", auth, paymentController.updatePaymentStatus);
router.post("/refund", auth, paymentController.refund);

export default router;
