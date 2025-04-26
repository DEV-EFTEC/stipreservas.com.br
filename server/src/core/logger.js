import util from 'node:util';
import _ from 'lodash';

const ts = () => `${new Date().toISOString()} ~ `;

const output = (msg) => (_.isString(msg) ? msg : util.inspect(msg));

const isTTYout = Boolean(process.stdout.isTTY);
const isTTYerr = Boolean(process.stdout.isTTY);

const labelInfo = isTTYout ? '\x1b[32m{info}\x1b[0m' : '';
const labelError = isTTYerr ? '\x1b[31m!error!\x1b[0m' : '';

function formatError(error) {
    if (error instanceof Error) {
        return error;
    }

    const message = output(error);
    const err = new Error(message);

    return err;
}

function info(msg, context) {
    const params = [labelInfo + ts() + output(msg)];

    if (context) {
        params.push(util.inspect(context));
    }

    params.push('');
    console.log(params.join(''));
}

function errorFn(error, context) {
    if (!(error instanceof Error || typeof error === 'string')) {
        error = new Error(error);
    }

    const formatedError = formatError(error);
    const { stack } = formatedError;
    let { message } = formatedError;

    message = labelError + ts() + message;
    const params = [message, stack];

    if (context) {
        params.push(util.inspect(context));
    }

    params.push('');
    console.error(params.join('\n'));
}

export default { error: errorFn, info };