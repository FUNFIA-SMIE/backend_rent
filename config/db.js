const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 12987,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20
});

// Test de connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err);
  } else {
    console.log('✅ Base de données connectée:', res.rows[0].now);
  }
});

module.exports = pool;