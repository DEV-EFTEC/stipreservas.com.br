import * as userService from "../services/userService.js";
import * as userModel from "../models/userModel.js";
import * as enterpriseService from "../services/enterpriseService.js";
import logger from "#core/logger.js";

export async function signIn(req, res) {
  try {
    const { cpf, password } = req.body;
    const result = await userService.authenticate(cpf, password);

    if (!result)
      return res.status(401).json({ message: "CPF ou Senha Inválidos." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on signin", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function verifyPassword(req, res) {
  try {
    const { cpf } = req.user;
    const { password } = req.body;
    const result = await userService.verifyPassword(cpf, password);

    if (!result)
      return res.status(401).json({ message: "CPF ou Senha Inválidos." });

    res.status(200).json(result);
  } catch (err) {
    logger.error("Error on signin", { err });
    res.status(500).json({ error: err.message });
  }
}

export async function register(req, res) {
  try {
    const { token, enterprise, cnpj, enterprise_name, ...userData } = req.body;
    const enterpriseId = await enterpriseService.createEnterprise({
      cnpj: enterprise.cnpj.replaceAll(".", "").replace("-", ""),
      ...enterprise,
    });
    const result = await userService.registerUser(
      {
        ...userData,
        enterprise_id: enterpriseId,
        mobile_phone: userData.mobile_phone
          .replaceAll(" ", "")
          .replace("+", "")
          .replace("(", "")
          .replace(")", "")
          .replace("-", ""),
      },
      token
    );

    res.status(201).json({ result, message: "User created successfully." });
  } catch (err) {
    logger.error("Error creating user", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function registrationLink(req, res) {
  try {
    if (req.user.role !== "admin") {
      res.status(401).json({ message: "Unauthorized" });
    }

    const link = await userService.registrationLink();
    res.status(201).json({ link });
  } catch (err) {
    logger.error("Error creating user", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function verifyToken(req, res) {
  try {
    const { token } = req.body;
    const result = await userService.verifyToken(token);
    if (!result || result.used) {
      return res.status(400).json({ error: "Token inválido ou expirado" });
    }
    res.status(201).json({ success: true });
  } catch (err) {
    logger.error("Error creating user", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function findUserById(req, res) {
  try {
    const result = await userService.findUserById(req.body.id);
    res.status(201).json({ result, message: "User founded." });
  } catch (err) {
    logger.error("Error creating user", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function findUserByCpf(req, res) {
  try {
    const result = await userService.findUserByCpf(req.body.cpf);
    res.status(201).json(result);
  } catch (err) {
    logger.error("Error creating user", { err });
    res.status(400).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.status(200).json(user);
  } catch (err) {
    logger.error("Error on createdependents", { err });
    res.status(500).json({ error: "Erro ao atualizar dependents" });
  }
}

export async function createUserLocal(req, res) {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      res.status(401).json({ message: "Não autorizado" });
    }

    const user = await userService.createUserLocal(req.body);
    res.status(200).json(user);
  } catch (err) {
    logger.error("Error on createUserLocal", { err });
    res.status(500).json({ error: "Erro ao createUserLocal" });
  }
}

export async function findNoAssociate(req, res) {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      res.status(401).json({ message: "Não autorizado" });
    }

    const users = await userService.findNoAssociate();
    res.status(200).json(users);
  } catch (err) {
    logger.error("Error on findNoAssociate", { err });
    res.status(500).json({ error: "Erro ao findNoAssociate" });
  }
}

export async function generateNewPasswordToUser(req, res) {
  try {
    const { role } = req.user;
    const { userId } = req.body;

    if (role !== "admin") {
      res.status(401).json({ message: "Não autorizado" });
    }

    const password = await userModel.generateNewPasswordToUser(userId);
    res.status(200).json(password);
  } catch (err) {
    logger.error("Error on findNoAssociate", { err });
    res.status(500).json({ error: "Erro ao findNoAssociate" });
  }
}
