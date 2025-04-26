import logger from "#core/logger.js";

export default function requestLogger(req, res, next) {
    const { ip, method, url, headers } = req;
    const { user_id } = headers;

    const id = new Date().getTime();

    let idsMsg = '';

    if (user_id) { idsMsg += ` _ u=${user_id}`; }

    if (process.env.DEBUG) {
        const msg = `[${ip}] {${method} ${id} - Receiving ${url}}`;
        logger.info(`${msg}${idsMsg}`);
    }

    const started = new Date().getTime();

    res.on('finish', () => {
        const took = new Date().getTime() - started;

        logger.info(`{req} [${ip}] ${method}` + `${url}${idsMsg} : http=${res.statusCode} ${took}ms`);
    });

    next();
}