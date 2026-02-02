const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10), // <-- convertir en number
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
    require: true
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20
});

// Test de connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    console.log("DB_PORT:", process.env.DB_PORT, "type:", typeof process.env.DB_PORT);

    console.error('❌ Erreur de connexion à la base de données:', err);
  } else {
    console.log('✅ Base de données connectée:', res.rows[0].now);
  }
});

module.exports = pool;
