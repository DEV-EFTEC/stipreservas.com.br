import * as userService from '../services/userService.js';
import logger from '#core/logger.js';

export async function signIn(req, res) {
  try {
    const { cpf, password } = req.body;
    const result = await userService.authenticate(cpf, password);

    if (!result) return res.status(401).json({ message: "CPF ou Senha Inválidos." });

    res.status(200).json(result);
  } catch (err) {
    logger.error('Error on signin', { err });
    res.status(500).json({ error: err.message });
  }
}

export async function register(req, res) {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json({ result, message: "User created successfully." });
  } catch (err) {
    logger.error('Error creating user', { err });
    res.status(400).json({ error: err.message });
  }
}

export async function findUserById(req, res) {
  try {
    const result = await userService.findUserById(req.body.id);
    res.status(201).json({ result, message: "User founded." });
  } catch (err) {
    logger.error('Error creating user', { err });
    res.status(400).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    const { password, ...newUser} = user;
    res.status(200).json(newUser);
  } catch (err) {
    logger.error('Error on createdependents', { err });
    res.status(500).json({ error: 'Erro ao atualizar dependents' });
  }
}