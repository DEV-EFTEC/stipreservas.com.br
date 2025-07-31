import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/find-user-by-id', userController.findUserById);
router.patch('/update-user/:id', userController.updateUser);
router.post('/login', userController.signIn);
router.post('/find-user-by-cpf', userController.findUserByCpf);

export default router;
