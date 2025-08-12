import express from "express";
import * as userController from "../controllers/userController.js";
import auth from "#middlewares/auth.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/find-user-by-id", userController.findUserById);
router.patch("/update-user/:id", userController.updateUser);
router.post("/login", userController.signIn);
router.post("/verify-password", auth, userController.verifyPassword);
router.post("/find-user-by-cpf", userController.findUserByCpf);
router.post("/generate-new-password", auth, userController.generateNewPasswordToUser);
router.post(
  "/generate-registration-link",
  auth,
  userController.registrationLink
);
router.post("/create-new-superuser", auth, userController.createUserLocal);
router.post("/verify-registration-link", userController.verifyToken);
router.get("/find-no-associate", auth, userController.findNoAssociate);

export default router;
