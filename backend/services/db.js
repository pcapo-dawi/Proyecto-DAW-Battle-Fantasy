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

// Nueva función para obtener misiones
/*export async function getMissionById(id) {
    const [rows] = await pool.query(`
    SELECT 
      m.*, 
      e.enemyName, 
      e.HP, 
      e.Attack,
      e.Defense,
      e.Experience,
      e.VideoPath
    FROM missions m
    JOIN enemies e ON m.ID_Enemy = e.ID_Enemy
    WHERE m.ID_Mission = ?
  `, [id]);

    return rows[0]; // Devuelve solo un objeto (la misión con su enemigo)
}*/

export async function getMissions() {
    const [rows] = await pool.query('SELECT ID as id, Name as name, Description as description, Time as time, Reward as reward FROM Missions');
    return rows;
}

// Nueva función para obtener raids con datos de la misión asociada
export async function getRaids() {
    const [rows] = await pool.query(`
        SELECT 
            Raids.ID as id,
            Missions.Name as name,
            Missions.Description as description,
            Missions.Time as time,
            Missions.Reward as reward
        FROM Raids
        JOIN Missions ON Raids.ID = Missions.ID
    `);
    return rows;
}

export default {
    query: (...args) => pool.query(...args),
    getPlayers,
    //getMissionById,
    getMissions,
    getRaids // <-- agrega aquí también
};

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
