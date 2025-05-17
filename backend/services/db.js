import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Nueva función para obtener jugadores
export async function getPlayers() {
    const [rows] = await pool.query('SELECT * FROM players');
    return rows;
}

export default {
    query: (...args) => pool.query(...args),
    getPlayers
};

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
