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

export async function isHighSeason(date) {
  const newDate = new Date(date);
  const period = periodModel.isHighSeason(newDate);

  if (period.length === 0) {
    return { is_high_period: false };
  } else {
    return { is_high_period: true };
  }
}
