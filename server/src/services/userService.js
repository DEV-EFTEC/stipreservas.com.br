import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";
import * as enterpriseModel from "../models/enterpriseModel.js";
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

const enumPathRole = {
  local: "/local/home",
  associate: "/associado/home",
  admin: "/admin/home",
};

export async function authenticate(cpf, password) {
  const user = await userModel.findUserByCpfAndAll(cpf);
  if (!user) return null;

  const enterprise = await enterpriseModel.getEnterpriseById(
    user.enterprise_id
  );

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const { password: _, ...userWithoutPassword } = user;
  const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  const path = enumPathRole[user.role] ?? "/";

  return { user: { ...userWithoutPassword, enterprise }, token, path };
}

export async function findUserById(id) {
  return userModel.findUserById(id);
}

export async function findUserByCpf(cpf) {
  const user = await userModel.findUserByCpf(cpf);
  let enterprise;
  if (user.enterprise_id) {
    enterprise = await enterpriseModel.getEnterpriseById(user.enterprise_id);
  } else {
    enterprise = {
      id: "",
      name: "",
      cnpj: "",
    };
  }
  return { ...user, enterprise };
}

export async function updateUser(id, data) {
  const user = await userModel.updateUser(id, data);
  const enterprise = await enterpriseModel.getEnterpriseById(
    user.enterprise_id
  );
  return { ...user, enterprise };
}

export async function createUserLocal(data) {
  return userModel.createUserLocal(data);
}

export async function findNoAssociate() {
  return userModel.findNoAssociate();
}

export async function verifyPassword(cpf, password) {
  const user = await userModel.findUserByCpfAndAll(cpf);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return { success: true };
}
