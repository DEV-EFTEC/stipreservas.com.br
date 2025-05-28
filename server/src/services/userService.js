import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';

const SALT_ROUNDS = 12;

export async function registerUser(userData) {
  const hash = bcrypt.hashSync(userData.password, SALT_ROUNDS);
  return userModel.createUser({ ...userData, password: hash });
}

export async function authenticate(cpf, password) {
  const user = await userModel.findUserByCPF(cpf);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const { password: _, ...userWithoutPassword } = user;
  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, { expiresIn: '14d' });
  const path = user.role === 'associate' ? "/associado/home" : "/admin/home";

  return { user: userWithoutPassword, token, path };
}

export async function findUserById(id) {
  return userModel.findUserById(id);
}

export async function updateUser(id, data) {
  return userModel.updateUser(id, data);
}