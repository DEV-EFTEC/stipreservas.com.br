import * as periodModel from "../models/periodModel.js";

export async function getPeriods() {
  return periodModel.getPeriods();
}

export async function createPeriod(data) {
  return periodModel.createPeriod(data);
}

export async function updatePeriod(id, data) {
  return periodModel.updatePeriod(id, data);
}
