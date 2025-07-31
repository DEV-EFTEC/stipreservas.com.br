import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import logger from "#core/logger.js";
import cors from "#middlewares/cors.js";
import routes from "#routes/index.js";
import requestLogger from "#middlewares/request-logger.js";
import "#jobs/expireBookings.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

function fatalHandler(err) {
  logger.error(err, { FATAL: true });
  process.exit(1);
}

process.on("uncaughtException", fatalHandler);
process.on("unhandledRejection", fatalHandler);

app.use(requestLogger);
app.use(cors);
app.use(express.json());

routes(app);

io.on("connection", (socket) => {
  logger.info(`Usuário conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`Usuário desconectado: ${socket.id}`);
  });

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    logger.info(`Socket ${socket.id} entrou na sala: ${roomName}`);
  });

  socket.on("new-booking", (data) => {
    logger.info("Nova reserva recebida:", data.userId);
    io.to("admin").emit("new-booking-response", data);
  });

  socket.on("join", (data) => {
    const { userId, isAdmin } = data;
    if (userId && !isAdmin) {
      socket.join(`user:${userId}`);
    } else if (userId && isAdmin) {
      socket.join("admin");
    }
  });

  socket.on("cancelled", (data) => {
    const { booking_id } = data;
    logger.info(`Reserva cancelada: ${booking_id}`);

    io.to("admin").emit("cancelled-response", booking_id);
  });
});

httpServer.listen(process.env.API_HTTP_PORT, () => {
  logger.info(
    `Servidor HTTP+WebSocket rodando em http://localhost:${process.env.API_HTTP_PORT}`
  );
});
