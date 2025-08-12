import * as enterpriseModel from "../models/enterpriseModel.js";

export async function createEnterprise(data) {
  return enterpriseModel.createEnterprise(data);
}

export async function getEnterpriseById(id) {
  return enterpriseModel.getEnterpriseById(id);
}
