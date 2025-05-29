import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import dotenv from 'dotenv';
import logger from '#core/logger.js';
import cors from '#middlewares/cors.js';
import routes from '#routes/index.js';
import requestLogger from '#middlewares/request-logger.js';
import "#jobs/expireBookings.js";

dotenv.config();

const app = express();
const httpServer = createServer(app); // criar servidor HTTP
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*", // ou defina as origens permitidas
        methods: ["GET", "POST"]
    }
});

function fatalHandler(err) {
    logger.error(err, { FATAL: true });
    process.exit(1);
}

process.on('uncaughtException', fatalHandler);
process.on('unhandledRejection', fatalHandler);

// middlewares
app.use(requestLogger);
app.use(cors);
app.use(express.json());

// rotas
routes(app);

// socket.io handlers
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
        socket.broadcast.emit("new-booking-response", data); // ✅ envia para todos os outros
    });

    socket.on("cancelled", (data) => {
        const {booking_id} = data;
        logger.info(`Reserva cancelada: ${booking_id}`);

        // Notifica apenas a sala dessa reserva
        io.to('admin').emit("cancelled-response", booking_id);
    });

});

// iniciar servidor HTTP com WebSocket
httpServer.listen(process.env.API_HTTP_PORT, () => {
    logger.info(`Servidor HTTP+WebSocket rodando em http://localhost:${process.env.API_HTTP_PORT}`);
});
