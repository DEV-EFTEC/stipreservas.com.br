import express from "express";
import * as drawController from "../controllers/drawController.js";

const router = express.Router();

router.post("/", drawController.createDraw);
router.get("/get-all", drawController.getDraws);
router.get("/:id/get-draw", drawController.getDrawById);
router.put("/:id/update-draw", drawController.updateDraw);
router.delete("/:id/delete-draw", drawController.deleteDraw);
router.get("/get-draws", drawController.getDrawsByDate);

export default router;
