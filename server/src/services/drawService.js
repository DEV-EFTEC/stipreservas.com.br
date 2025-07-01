import * as drawModel from "../models/drawModel.js";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();

export async function findBookingById(id) {
  const booking = await drawModel.findBookingById(id);
  return booking || null;
}

export async function createDraw(drawData) {
  return await drawModel.createDraw(drawData);
}

export async function updateBooking(data) {
  const { id, ...payload } = data;
  return await drawModel.updateBooking(id, payload);
}

export async function deleteBooking(id) {
  return await drawModel.deleteBooking(id);
}

export async function getAllBookings(userType, page, limit) {
  if (userType === "admin") {
    const newPage = parseInt(page) || 1;
    const newLimit = parseInt(limit) || 10;

    const offset = (page - 1) * limit;

    const bookings = await drawModel.getAllBookings(newLimit, offset);
    const [{ count }] = await drawModel.bookingCount();
    return {
      data: bookings,
      pagination: {
        total: parseInt(count),
        page: newPage,
        limit: newLimit,
        total_pages: Math.ceil(count / newLimit),
      },
    };
  } else {
    throw new Error("Não autorizado");
  }
}
