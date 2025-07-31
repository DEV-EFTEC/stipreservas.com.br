import express from "express";
import * as drawController from "../controllers/drawController.js";

const router = express.Router();

router.post("/", drawController.createDraw);
router.post("/run", drawController.run);
router.post("/rerun", drawController.rerun);
router.post("/apply", drawController.createDrawApply);
router.post("/create-participants-draw", drawController.createParticipantsDraw);
router.get("/get-all", drawController.getDraws);
router.get("/get-draws", drawController.getDrawByDate);
router.get("/get-draws-applications", drawController.findDrawsByUser);
router.get("/get-draw-complete", drawController.getDrawApplyComplete);
router.get("/:id/get-draw", drawController.getDrawById);
router.get("/:id/participants", drawController.getDrawParticipants);
router.put("/update-participants-draw", drawController.updateParticipantsDraw);
router.put("/:id/update-draw", drawController.updateDraw);
router.put("/:id/update-draw-apply", drawController.updateDrawApply);
router.delete("/:id/delete-draw", drawController.deleteDraw);
router.post('/approve-draw', drawController.approveDraw);
router.post('/refuse-draw', drawController.refuseDraw);


export default router;
