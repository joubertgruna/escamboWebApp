require('dotenv').config();

const parseDbPort = (value, fallback = 3306) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value).toLowerCase() === 'true';
};

const buildConnectionFromUrl = (dbUrl) => {
  if (!dbUrl) return null;

  try {
    const parsed = new URL(dbUrl);
    return {
      host: parsed.hostname,
      port: parseDbPort(parsed.port, 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ''),
      charset: 'utf8mb4',
    };
  } catch (error) {
    return null;
  }
};

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  process.env.MYSQL_PUBLIC_URL ||
  process.env.DB_URL;
const parsedUrlConnection = buildConnectionFromUrl(dbUrl);

const explicitHost = process.env.DB_HOST;
const effectiveHost = parsedUrlConnection?.host || explicitHost || '';
const shouldUseSsl = parseBoolean(
  process.env.DB_SSL,
  effectiveHost.includes('proxy.rlwy.net')
);

const productionConnection = parsedUrlConnection || {
  host: process.env.DB_HOST,
  port: parseDbPort(process.env.DB_PORT, 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
};

if (shouldUseSsl) {
  productionConnection.ssl = { rejectUnauthorized: false };
}

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseDbPort(process.env.DB_PORT, 3306),
      user: process.env.DB_USER || 'escambo',
      password: process.env.DB_PASSWORD || 'escambo123',
      database: process.env.DB_NAME || 'escambo_dev',
      charset: 'utf8mb4',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  test: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseDbPort(process.env.DB_PORT, 3306),
      user: process.env.DB_USER || 'escambo',
      password: process.env.DB_PASSWORD || 'escambo123',
      database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : 'escambo_test',
      charset: 'utf8mb4',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  production: {
    client: 'mysql2',
    connection: productionConnection,
    acquireConnectionTimeout: parseDbPort(process.env.DB_CONNECT_TIMEOUT_MS, 30000),
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
