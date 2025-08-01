import * as enterpriseModel from '../models/enterpriseModel.js';

export async function createEnterprise(data) {
  return enterpriseModel.createEnterprise(data);
}
