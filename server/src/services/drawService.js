import * as drawModel from "../models/drawModel.js";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();

export async function getDrawById(id) {
  const booking = await drawModel.getDrawById(id);
  return booking || null;
}

export async function createDraw(drawData) {
  return await drawModel.createDraw(drawData);
}

export async function updateDraw(data) {
  const { id, ...payload } = data;
  return await drawModel.updateDraw(id, payload);
}

export async function deleteDraw(id) {
  return await drawModel.deleteDraw(id);
}

export async function getAllDraws(page, limit) {
  const newPage = parseInt(page) || 1;
  const newLimit = parseInt(limit) || 10;

  const offset = (page - 1) * limit;

  const draws = await drawModel.getAllDraws(newLimit, offset);
  const [{ count }] = await drawModel.drawCount();
  return {
    data: draws,
    pagination: {
      total: parseInt(count),
      page: newPage,
      limit: newLimit,
      total_pages: Math.ceil(count / newLimit),
    },
  };
}

export async function getDrawByDate(start_date, end_date) {
  return await drawModel.getDrawByDate(start_date, end_date);
}
