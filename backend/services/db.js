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

export async function getJobs() {
    const [rows] = await pool.query('SELECT * FROM Jobs');
    return rows;
}

export async function getJobsWithAspects() {
    const [rows] = await pool.query(`
        SELECT 
            j.ID as jobId,
            j.Name as jobName,
            j.Description as jobDescription,
            j.BaseAttack,
            j.BaseDefense,
            j.ID_Definitivo,
            ja.ID as aspectId,
        FROM Jobs j
        LEFT JOIN JobAspects ja ON j.ID = ja.ID_Job
        ORDER BY j.ID, ja.ID
    `);
    // Agrupa los aspectos por job
    const jobsMap = {};
    for (const row of rows) {
        if (!jobsMap[row.jobId]) {
            jobsMap[row.jobId] = {
                id: row.jobId,
                name: row.jobName,
                description: row.jobDescription,
                baseAttack: row.BaseAttack,
                baseDefense: row.BaseDefense,
                idDefinitivo: row.ID_Definitivo,
                aspectID: []
            };
        }
        if (row.aspectId) {
            jobsMap[row.jobId].aspects.push(row.aspectId);
        }
    }
    return Object.values(jobsMap);
}

export async function getJobsWithAspectIds() {
    const [rows] = await pool.query(`
        SELECT 
            j.ID as jobId,
            j.Name as jobName,
            j.Description as jobDescription,
            j.BaseAttack,
            j.BaseDefense,
            j.ID_Definitivo,
            ja.ID as aspectId
        FROM Jobs j
        LEFT JOIN JobAspects ja ON j.ID = ja.ID_Job
        ORDER BY j.ID, ja.ID
    `);

    const jobsMap = {};
    for (const row of rows) {
        if (!jobsMap[row.jobId]) {
            jobsMap[row.jobId] = {
                ID: row.jobId,
                Name: row.jobName,
                Description: row.jobDescription,
                BaseAttack: row.BaseAttack,
                BaseDefense: row.BaseDefense,
                ID_Definitivo: row.ID_Definitivo,
                aspectIds: []
            };
        }
        if (row.aspectId) {
            jobsMap[row.jobId].aspectIds.push(row.aspectId);
        }
    }
    return Object.values(jobsMap);
}

// Nueva función para obtener misiones
export async function getMissionById(id) {
    const [rows] = await pool.query(`
        SELECT 
            m.ID as id,
            m.Name as name,
            m.Description as description,
            m.Time as time,
            m.Reward as reward,
            e.ID as enemyId,
            e.Name as enemyName,
            e.HP as enemyHp,
            e.Attack as enemyAttack,
            e.Defense as enemyDefense,
            e.Experience as enemyExperience,
            e.ID_SuperAttack as enemySuperAttackId
        FROM Missions m
        JOIN Enemies e ON m.ID_Enemy = e.ID
        WHERE m.ID = ?
    `, [id]);
    return rows[0];
}

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
    getJobs,
    getJobsWithAspects,
    getJobsWithAspectIds,
    getMissionById,
    getMissions,
    getRaids, // <-- agrega aquí también
};