import knex from "knex";
import knexConfig from "../../knexfile.js";

const db = knex(knexConfig.development);

function getRandomToneOfColor(hue = 210) {
  const saturation = Math.floor(Math.random() * 20) + 80; // entre 70% e 100%
  const lightness = Math.floor(Math.random() * 40) + 30; // entre 30% e 70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export async function findAllOccupations() {
  const rooms = await db("rooms").select("id", "number");
  const groups = rooms.map((room) => ({
    id: room.id,
    title: `Quarto ${room.number}`,
  }));

  let bookingItems = await db("booking_rooms")
    .join("bookings", "booking_rooms.booking_id", "bookings.id")
    .join("users", "bookings.created_by", "users.id")
    .select(
      "booking_rooms.id",
      "booking_rooms.room_id as group",
      "users.name as title",
      "bookings.check_in as start_time",
      "bookings.check_out as end_time"
    );
  bookingItems = bookingItems.map((item) => ({
    ...item,
    bgColor: getRandomToneOfColor(210),
    color: "#FFFFFF",
  }));

  let drawItems = await db("draw_rooms")
    .join(
      "draw_applications",
      "draw_rooms.draw_apply_id",
      "draw_applications.id"
    )
    .join("users", "draw_applications.created_by", "users.id")
    .join("rooms", "draw_rooms.room_id", "rooms.id") // ✅ JOIN com rooms
    .where("draw_applications.status", "=", "drawn")
    .select(
      "draw_rooms.id",
      "draw_rooms.room_id as group",
      "users.name as title",
      "draw_applications.check_in as start_time",
      "draw_applications.check_out as end_time",
      "rooms.capacity" // ✅ Seleciona a capacidade
    );

  drawItems = drawItems.map((item) => ({
    ...item,
    bgColor: item.capacity === 6 ? getRandomToneOfColor(280) : getRandomToneOfColor(20),
    color: "#FFFFFF",
  }));

  const items = [...bookingItems, ...drawItems].map((item) => ({
    ...item,
    start_time: new Date(item.start_time),
    end_time: new Date(item.end_time),
  }));

  return { groups, items };
}
