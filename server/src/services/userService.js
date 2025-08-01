import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";
import "dotenv/config";
import randomBytes from "randombytes";

const SALT_ROUNDS = 12;

export async function registerUser(userData, token) {
  const hash = bcrypt.hashSync(userData.password, SALT_ROUNDS);
  return userModel.createUser({ ...userData, password: hash }, token);
}

export async function registrationLink() {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  await userModel.registrationLink({ token, expires_at: expiresAt });

  const link = `${process.env.CLIENT_URL}/register?token=${token}`;

  return link;
}

export async function verifyToken(token) {
  return userModel.verifyToken(token);
}

export async function authenticate(cpf, password) {
  const user = await userModel.findUserByCPF(cpf);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const { password: _, ...userWithoutPassword } = user;
  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });
  const path = user.role === "associate" ? "/associado/home" : "/admin/home";

  return { user: userWithoutPassword, token, path };
}

export async function findUserById(id) {
  return userModel.findUserById(id);
}

export async function findUserByCpf(cpf) {
  return userModel.findUserByCpf(cpf);
}

export async function updateUser(id, data) {
  return userModel.updateUser(id, data);
}
