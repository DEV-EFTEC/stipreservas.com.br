import cron from "node-cron";
import knex from "knex";
import knexConfig from "../../knexfile.js";

const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

cron.schedule("5 */10 * * * *", async () => {
  console.log(
    `\x1b[33m[CRON - status: INCOMPLETE]\x1b[0m${new Date().toISOString()} ~ Verificando reservas expiradas...`
  );

  try {
    const expiredBookings = await db("bookings")
      .where("status", "incomplete")
      .andWhere("expires_at", "<=", db.fn.now())
      .select("id");

    const bookingIds = expiredBookings.map((b) => b.id);

    if (bookingIds.length) {
      await db.transaction(async (trx) => {
        await trx("guests_bookings").whereIn("booking_id", bookingIds).del();
        await trx("dependents_bookings")
          .whereIn("booking_id", bookingIds)
          .del();
        await trx("children_bookings").whereIn("booking_id", bookingIds).del();
        await trx("booking_rooms").whereIn("booking_id", bookingIds).del();
        await trx("bookings").whereIn("id", bookingIds).del();
      });
      console.log(
        `\x1b[33m[CRON - status: INCOMPLETE]\x1b[0m${new Date().toISOString()} = Reservas expiradas removidas.`
      );
    } else {
      console.log(
        `\x1b[33m[CRON - status: INCOMPLETE]\x1b[0m${new Date().toISOString()} + Nenhuma reserva expirada encontrada.`
      );
    }
  } catch (err) {
    console.error(
      "[CRON- status: INCOMPLETE] : Erro ao limpar reservas expiradas:",
      err
    );
  }
});

cron.schedule("15 */1 * * * *", async () => {
  console.log(
    `\x1b[33m[CRON - status: PAYMENT_PENDING]\x1b[0m${new Date().toISOString()} ~ Verificando reservas com pendencia de pagamento expiradas...`
  );

  try {
    const expiredBookings = await db("bookings")
      .where("status", "payment_pending")
      .andWhere("expires_at", "<=", db.fn.now())
      .select("id");

    const bookingIds = expiredBookings.map((b) => b.id);

    if (bookingIds.length) {
      await db.transaction(async (trx) => {
        await trx("bookings")
          .whereIn("id", bookingIds)
          .update({ status: "expired", expires_at: null });
      });

      console.log(
        `\x1b[33m[CRON - status: PAYMENT_PENDING]\x1b[0m${new Date().toISOString()} = Reservas expiradas removidas.`
      );
    } else {
      console.log(
        `\x1b[33m[CRON - status: PAYMENT_PENDING]\x1b[0m${new Date().toISOString()} + Nenhuma reserva expirada encontrada.`
      );
    }
  } catch (err) {
    console.error(
      "[CRON - status: PAYMENT_PENDING] : Erro ao limpar reservas expiradas:",
      err
    );
  }
});

cron.schedule("30 */5 * * * *", async () => {
  console.log(
    `\x1b[33m[CRON - status: DECLINED]\x1b[0m${new Date().toISOString()} ~ Verificando reservas com pendencia de pagamento expiradas...`
  );

  try {
    const expiredBookings = await db("draw_applications")
      .where("status", "declined")
      .select("id");

    const bookingIds = expiredBookings.map((b) => b.id);

    if (bookingIds.length) {
      await db("draw_rooms").whereIn("draw_apply_id", bookingIds).del();
      console.log(
        `\x1b[33m[CRON - status: DECLINED]\x1b[0m${new Date().toISOString()} = Reservas expiradas removidas.`
      );
    } else {
      console.log(
        `\x1b[33m[CRON - status: DECLINED]\x1b[0m${new Date().toISOString()} + Nenhuma reserva expirada encontrada.`
      );
    }
  } catch (err) {
    console.error(
      "[CRON - status: DECLINED] : Erro ao limpar reservas expiradas:",
      err
    );
  }
});
