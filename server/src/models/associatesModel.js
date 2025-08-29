import knex from "knex";
import knexConfig from "../../knexfile.js";
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

export async function createAssociateByBooking(data) {
  const [created] = await db("associates_bookings").insert(data).returning("*");
  return created;
}
export async function createAssociateInviteByBooking(data) {
  const [created] = await db("associate_bookings_invites")
    .insert(data)
    .returning("*");
  return created;
}

export async function updateAssociateInvite(id, data) {
  const [updated] = await db('associate_bookings_invites').where({ id }).update(data).returning('*');
  return updated;
}

export async function updateInvite(id, data) {
  const [updated] = await db("associate_bookings_invites")
    .where({ id })
    .update(data)
    .returning("*");

  const allInvites = await db("associate_bookings_invites as abi")
    .where("abi.booking_id", updated.booking_id)
    .select("*");

  const allInfo = await db("associate_bookings_invites as abi")
    .join("users as u", "abi.created_by", "u.id")
    .join("users as us", "abi.associate_invited_id", "us.id")
    .where("abi.id", "=", id)
    .select(
      "abi.*",
      "us.name as invited_name",
      "u.name as holder_name",
      "u.email as holder_email"
    )
    .first();

  const hasPending = allInvites.some((invite) => invite.status === "pending");

  return {
    updated,
    hasPending,
    allInfo,
  };
}

export async function updateStatusInvite(
  booking_id,
  status,
  associate_invited_id
) {
  const [invite] = await db("associate_bookings_invites")
    .where({ booking_id })
    .andWhere({ associate_invited_id })
    .update({ status })
    .returning("*");

  if (!invite) return null;

  return db("associate_bookings_invites as ab")
    .join("bookings as b", "ab.booking_id", "b.id")
    .join("users as u", "ab.associate_invited_id", "u.id")
    .join("users as us", "ab.created_by", "us.id")
    .where({ booking_id })
    .andWhere({ associate_invited_id })
    .select(
      "b.*",
      "u.name as invited_name",
      "us.name as holder_name",
      "us.email as holder_email"
    );
}

export async function getAssociatesByBooking(booking_id) {
  return db("associates_bookings as ab")
    .join("users as u", "ab.associate_id", "u.id")
    .where("ab.booking_id", booking_id)
    .select("u.id as associate_id", "u.email as email", "u.name as name");
}

export async function inviteCountByUser(created_by) {
  return db("bookings").where({ created_by }).count();
}

export async function findInvitesByUser(id) {
  return db("associate_bookings_invites as ab")
    .join("bookings as b", "ab.booking_id", "b.id")
    .where("ab.associate_invited_id", id)
    .select("b.*")
    .orderBy("b.utc_created_on", "desc")
}

export async function findInviteById(id) {
  return db("associate_bookings_invites").where({ id }).select("*").first();
}
