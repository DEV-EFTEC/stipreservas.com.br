import express from 'express';
import dotenv from 'dotenv';
import logger from '#core/logger.js';
import cors from '#middlewares/cors.js';
import routes from '#routes/index.js';
import requestLogger from '#middlewares/request-logger.js';
import "#jobs/expireBookings.js";

const app = express();
dotenv.config();

function fatalHandler(err) {
    logger.error(err, { FATAL: true });
    process.exit(1);
}

process.on('uncaughtException', fatalHandler);
process.on('unhandledRejection', fatalHandler);

app.use(requestLogger);
app.use(cors);
app.use(express.json());

routes(app);

app.listen(process.env.API_HTTP_PORT, () => {
    logger.info(`http server opended on http://localhost:${process.env.API_HTTP_PORT}`)
})