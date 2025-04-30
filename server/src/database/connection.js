import knex from 'knex';
import config from '../knexfile.js';
import dotenv from 'dotenv';

dotenv.config();

const db = knex(process.env.NODE_ENV === 'development' ? config.development : config.production);

export default db;