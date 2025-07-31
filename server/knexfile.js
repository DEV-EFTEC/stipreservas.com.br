import "dotenv/config";

export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "devlyh",
      password: process.env.DB_PASSWORD || "abc",
      database: process.env.DB_NAME || "stipreservas",
      port: process.env.DB_PORT || "5432",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_PUBLIC_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
