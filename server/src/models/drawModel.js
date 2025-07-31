import knex from "knex";
import knexConfig from "../../knexfile.js";
const db = knex(knexConfig.development);

export async function getDrawById(id) {
  return db("draws").where({ id }).first();
}

export async function createDraw(data) {
  const [draw] = await db("draws").insert(data).returning("*");

  return draw;
}

export async function updateDrawApply(id, data) {
  const [updated] = await db("draw_applications")
    .where({ id })
    .update(data)
    .returning("*");
  return updated;
}

export async function updateDraw(id, data) {
  const [updated] = await db("draws").where({ id }).update(data).returning("*");
  return updated;
}

export async function deleteDraw(id) {
  return db.transaction(async (trx) => {
    await trx("guests_draw_applies").where({ draw_apply_id: id }).delete();
    await trx("children_draw_applies").where({ draw_apply_id: id }).delete();
    await trx("dependents_draw_applies").where({ draw_apply_id: id }).delete();
    await trx("holders_draw_applies").where({ draw_apply_id: id }).delete();
    await trx("draw_rooms").where({ draw_apply_id: id }).delete();

    await trx("draws").where({ id }).delete();
  });
}

export async function getAllDraws(limit, offset) {
  return db("draws")
    .select("*")
    .orderBy("draws.utc_created_on", "desc")
    .limit(limit)
    .offset(offset);
}

export async function drawCount() {
  return db("draws").count();
}

export async function getDrawParticipants(limit, offset, id) {
  return db("draw_applications")
    .select(
      "draw_applications.*",
      "users.name as created_by_name",
      "users.associate_role as created_by_associate_role"
    )
    .join("users", "draw_applications.created_by", "=", "users.id")
    .where("draw_applications.draw_id", id)
    .andWhere("draw_applications.status", "<>", "incomplete")
    .orderBy("draw_applications.utc_created_on", "desc")
    .limit(limit)
    .offset(offset);
}

export async function drawAppliesCount(id) {
  return db("draw_applications").where({ draw_id: id }).count();
}

export async function getDrawByDate(start_date, end_date) {
  return db("draws")
    .select("*")
    .where("start_date", "<=", start_date)
    .andWhere("end_date", ">=", end_date)
    .andWhere("status", "=", "in_progress")
    .first();
}

export async function createDrawApply(data) {
  const [draw_apply] = await db("draw_applications")
    .insert(data)
    .returning("*");

  return draw_apply;
}

export async function findDrawsByUser(userId, limit, offset) {
  return db("draw_applications")
    .where("created_by", "=", userId)
    .orderBy("utc_created_on", "desc")
    .limit(limit)
    .offset(offset);
}

export async function drawCountByUser(created_by) {
  return db("draw_applications").where({ created_by }).count();
}

export async function findDrawApplicationsById(draw_id) {
  const applications = await db("draw_applications")
    .select("*")
    .where({ draw_id });

  const completedApplications = await Promise.all(
    applications.map(async (application) => {
      const [guests, dependents, children, holders] = await Promise.all([
        db("guests_draw_applies as gd")
          .join("guests as g", "gd.guest_id", "g.id")
          .select("g.*")
          .where("gd.draw_apply_id", application.id),

        db("dependents_draw_applies as dd")
          .join("dependents as d", "dd.dependent_id", "d.id")
          .select("d.*")
          .where("dd.draw_apply_id", application.id),

        db("children_draw_applies as cd")
          .join("children as c", "cd.child_id", "c.id")
          .select("c.*")
          .where("cd.draw_apply_id", application.id),

        db("holders_draw_applies as hd")
          .join("users as u", "hd.holder_id", "u.id")
          .select("u.*")
          .where("hd.draw_apply_id", application.id),
      ]);

      return {
        ...application,
        guests,
        dependents,
        children,
        holders,
      };
    })
  );

  return completedApplications;
}

export async function findDrawApplicationsNotDrawById(draw_id) {
  const applications = await db("draw_applications")
    .select("*")
    .where("status", "=", "not_drawn")
    .where({ draw_id });

  const completedApplications = await Promise.all(
    applications.map(async (application) => {
      const [guests, dependents, children, holders] = await Promise.all([
        db("guests_draw_applies as gd")
          .join("guests as g", "gd.guest_id", "g.id")
          .select("g.*")
          .where("gd.draw_apply_id", application.id),

        db("dependents_draw_applies as dd")
          .join("dependents as d", "dd.dependent_id", "d.id")
          .select("d.*")
          .where("dd.draw_apply_id", application.id),

        db("children_draw_applies as cd")
          .join("children as c", "cd.child_id", "c.id")
          .select("c.*")
          .where("cd.draw_apply_id", application.id),

        db("holders_draw_applies as hd")
          .join("users as u", "hd.holder_id", "u.id")
          .select("u.*")
          .where("hd.draw_apply_id", application.id),
      ]);

      return {
        ...application,
        guests,
        dependents,
        children,
        holders,
      };
    })
  );

  return completedApplications;
}

export async function getDrawApplyComplete(id) {
  const [guests, dependents, children, holders, rooms] = await Promise.all([
    db("guests_draw_applies as gd")
      .join("guests as g", "gd.guest_id", "g.id")
      .select("*")
      .where("gd.draw_apply_id", id),
    db("dependents_draw_applies as dd")
      .join("dependents as d", "dd.dependent_id", "d.id")
      .select("*")
      .where("dd.draw_apply_id", id),
    db("children_draw_applies as cd")
      .join("children as c", "cd.child_id", "c.id")
      .select("*")
      .where("cd.draw_apply_id", id),
    db("holders_draw_applies as hd")
      .join("users as u", "hd.holder_id", "u.id")
      .select("*")
      .where("hd.draw_apply_id", id),
    db("draw_rooms as dr")
      .join("rooms as r", "dr.room_id", "r.id")
      .select("*")
      .where("dr.draw_apply_id", id),
  ]);

  const draw = await db("draw_applications").where({ id }).first();
  const totalPeople = guests.length + dependents.length + holders.length;

  const newRoom =
    rooms.length > 0
      ? rooms[0]
      : await db("rooms")
          .where("capacity", ">=", totalPeople)
          .orderBy("capacity", "asc")
          .select("*")
          .first();

  if (!newRoom) {
    throw new Error(
      `Nenhum quarto disponível para acomodar ${totalPeople} pessoas.`
    );
  }

  const newGuests = guests.map((g) => {
    return {
      ...g,
      check_in: draw.check_in,
      check_out: draw.check_out,
      room_id: newRoom.id,
    };
  });

  const newDependents = dependents.map((d) => {
    return {
      ...d,
      check_in: draw.check_in,
      check_out: draw.check_out,
      room_id: newRoom.id,
    };
  });

  const newChildren = children.map((c) => {
    return {
      ...c,
      check_in: draw.check_in,
      check_out: draw.check_out,
      room_id: newRoom.id,
    };
  });

  return {
    ...draw,
    guests: newGuests,
    dependents: newDependents,
    children: newChildren,
    holders,
    rooms: [newRoom],
  };
}

export async function findDrawRooms(start_period_date, end_period_date) {
  return db("draw_rooms")
    .select("*")
    .where("check_in", ">=", start_period_date)
    .andWhere("check_out", "<=", end_period_date);
}

export async function createDrawRoom(data) {
  const [created] = await db("draw_rooms").insert(data).returning("*");
  return created;
}

export async function approveDraw(id) {
  const [updatedDraw] = await db("draw_applications")
    .where({ id })
    .update({
      status: "awaiting_draw",
    })
    .returning("*");

  return updatedDraw;
}

export async function refuseBooking(id) {
  const [updatedDraw] = await db("draw_applications")
    .where({ id })
    .update({
      expires_at: db.raw(`"utc_created_on" + interval '1 day'`),
      status: "refused",
    })
    .returning("*");

  return updatedDraw;
}