import express from "express";
import * as drawController from "../controllers/drawController.js";

const router = express.Router();

router.post("/", drawController.createDraw);
// router.get("/get-draws", drawController.findPaymentsByUser);

export default router;
