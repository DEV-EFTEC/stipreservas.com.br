import knex from "knex";
import knexConfig from "../../knexfile.js";
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

export async function findAllRooms() {
  return db("rooms").select("*");
}

export async function findDefaultRoom() {
  return db("rooms").select("*").where({ capacity: 4 }).first();
}

export async function createRoom(data) {
  return db("rooms").insert(data);
}

export async function findRoomById(id) {
  return db("rooms").select("*").where(id);
}

export async function findAvailableRooms(
  checkIn,
  checkOut,
  capacity,
  bookingId
) {
  return db("rooms as r")
    .whereNotExists(function () {
      this.select(1)
        .from("booking_rooms as br")
        .whereRaw("br.room_id = r.id")
        .andWhere("br.booking_id", "<>", bookingId)
        .andWhere(function () {
          this.where("br.check_out", ">", checkIn).andWhere(
            "br.check_in",
            "<",
            checkOut
          );
        });
    })
    .modify((queryBuilder) => {
      if (capacity < 5) {
        queryBuilder.where("r.capacity", 4);
      }
    })
    .select("r.*")
    .orderBy("r.number", "asc");
}

export async function bookRoom(data) {
  return db("booking_rooms").insert(data);
}

export async function unselectRoom(bookingId, roomId) {
  return db("booking_rooms")
    .where({ booking_id: bookingId, room_id: roomId })
    .del();
}

export async function findAvailableRoomsDraw(checkIn, checkOut, drawApplyId) {
  return db("rooms as r")
    .whereNotExists(function () {
      this.select(1)
        .from("draw_rooms as dr")
        .whereRaw("dr.room_id = r.id")
        .andWhere("dr.draw_apply_id", "<>", drawApplyId)
        .andWhere(function () {
          this.whereRaw(
            "DATE(dr.check_in) - INTERVAL '1 day' < ? AND DATE(dr.check_out) + INTERVAL '1 day' > ?",
            [checkOut, checkIn]
          );
        });
    })
    .andWhere("r.capacity", "=", 4)
    .select("r.*")
    .orderBy("r.number", "asc");
}

export async function bookDrawRoom(data) {
  return db("draw_rooms").insert(data);
}

export async function findRoomsForDraw() {
  return db("rooms").select("*").whereNotIn("number", [28, 37, 21]);
}
