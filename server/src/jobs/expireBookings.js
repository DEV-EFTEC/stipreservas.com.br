import cron from "node-cron";
import knex from "knex";
import knexConfig from '../../knexfile.js';

const db = knex(knexConfig.development);

cron.schedule("*/30 * * * *", async () => {
  console.log(`\x1b[33m[CRON]\x1b[0m${new Date().toISOString()} ~ Verificando reservas expiradas...`);

  try {
    const expiredBookings = await db("bookings")
    .where("status", "incomplete")
    .andWhere("expires_at", "<=", db.fn.now())
    .select("id");
  
    const bookingIds = expiredBookings.map(b => b.id);
    
    if (bookingIds.length) {
      await db("guests_bookings").whereIn("booking_id", bookingIds).del();
      await db("dependents_bookings").whereIn("booking_id", bookingIds).del();
      await db("children_bookings").whereIn("booking_id", bookingIds).del();
      await db("booking_rooms").whereIn("booking_id", bookingIds).del();
    
      await db("bookings").whereIn("id", bookingIds).del();
      console.log("Reservas expiradas removidas.");

    } else {
      console.log("Nenhuma reserva expirada encontrada.");
    }
  } catch (err) {
    console.error("[CRON] Erro ao limpar reservas expiradas:", err);
  }
});
