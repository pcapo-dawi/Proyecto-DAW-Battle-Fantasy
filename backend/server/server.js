import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import db from '../services/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMissionById } from '../services/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const app = express();

app.use(cors({ origin: '*' }));

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: '*',
  }
});

//Middleware para JSON
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM Players WHERE Email = ?', [email]);
  if (rows.length > 0) {
    const user = rows[0];
    const match = await bcrypt.compare(password, user.Password);
    if (match) {
      const token = jwt.sign({ id: user.ID }, 'secreto_super_seguro');
      res.json({ success: true, player: user, token });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }
});

//Registro de un nuevo jugador
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Players (Name, Email, Password, HP, Attack, Defense, Experience, Level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 100, 1, 1, 0, 1]
    );
    //Genera el token con el nuevo ID
    const token = jwt.sign({ id: result.insertId }, 'secreto_super_seguro');
    res.json({ success: true, playerId: result.insertId, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar el jugador', error: error.message });
  }
});

//Selecciona un job para un jugador
app.post('/api/players/:id/assign-job', async (req, res) => {
  const playerId = req.params.id;
  const { jobId, jobAspectId } = req.body;
  try {
    //Asigna el Job y el Aspect
    await db.query(
      'UPDATE Players SET ID_Job = ?, ID_JobAspect = ? WHERE ID = ?',
      [jobId, jobAspectId, playerId]
    );

    //Selecciona una UniqueAbility aleatoria para ese Job
    const [abilities] = await db.query(
      'SELECT ID FROM UniqueAbilities WHERE ID_Job = ?',
      [jobId]
    );
    if (abilities.length > 0) {
      const randomIndex = Math.floor(Math.random() * abilities.length);
      const uniqueAbilityId = abilities[randomIndex].ID;
      await db.query(
        'UPDATE Players SET ID_UniqueAbility = ? WHERE ID = ?',
        [uniqueAbilityId, playerId]
      );
    } else {
      await db.query(
        'UPDATE Players SET ID_UniqueAbility = NULL WHERE ID = ?',
        [playerId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al asignar job', error: error.message });
  }
});


//Middleware para verificar el token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secreto_super_seguro', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//Endpoint protegido
app.get('/api/player/me', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const [rows] = await db.query(`
    SELECT p.*, j.Name as JobName
    FROM Players p
    LEFT JOIN Jobs j ON p.ID_Job = j.ID
    WHERE p.ID = ?
  `, [userId]);
  if (rows.length > 0) {
    res.json({ success: true, player: rows[0] });
  } else {
    res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
});

//Ejemplo de endpoint REST
app.get('/api/players', async (req, res) => {
  const players = await db.getPlayers();
  res.json(players);
});

//Endpoint para obtener trabajos
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await db.getJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener jobs', error: error.message });
  }
});

//Endpoint para obtener trabajos con aspectos
app.get('/api/jobs-with-aspects', async (req, res) => {
  try {
    const jobs = await db.getJobsWithAspects();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener jobs con aspectos', error: error.message });
  }
});

//Endpoint para obtener jobs con solo los IDs de sus aspectos
app.get('/api/jobs-aspect-ids', async (req, res) => {
  try {
    const jobs = await db.getJobsWithAspectIds();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener jobs con aspectIds', error: error.message });
  }
});

//Endpoint para comprobar la conexión a la base de datos
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ success: true, message: 'Conexión exitosa a la base de datos', result: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error de conexión a la base de datos', error: error.message });
  }
});

//Endpoint para obtener misiones
app.get('/api/missions', async (req, res) => {
  try {
    const missions = await db.getMissions();
    res.json(missions);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener misiones', error: error.message });
  }
});

//Endpoint para obtener una misión con su enemigo
app.get('/api/missions/:id', async (req, res) => {
  try {
    const mission = await getMissionById(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Misión no encontrada' });
    }
    res.json(mission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//Endpoint para obtener raids
app.get('/api/raids', async (req, res) => {
  try {
    const raids = await db.getRaids();
    res.json(raids);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener raids', error: error.message });
  }
});

//Endpoint de inicio
app.get('/', (req, res) => {
  res.send('¡Backend de Battle Fantasy funcionando!');
});

//Ejemplo de evento Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('playerAction', (data) => {
    //Maneja la acción del jugador
    console.log('Acción recibida:', data);
    //Puedes emitir eventos a otros clientes si lo necesitas
    socket.broadcast.emit('playerAction', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

//Inicia el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

app.post('/api/battle/attack', async (req, res) => {
  const { playerId, missionId } = req.body;
  try {
    //Obtén la misión activa
    const [activeRows] = await db.query(
      'SELECT * FROM ActiveMissions WHERE ID_Player = ? AND ID_Mission = ?',
      [playerId, missionId]
    );
    if (activeRows.length === 0) return res.status(404).json({ error: 'Active mission not found' });
    let currentEnemyHP = activeRows[0].EnemyHP;
    let currentTurn = activeRows[0].Turn || 1;

    //Obtén los datos del jugador y job
    const [playerRows] = await db.query('SELECT * FROM Players WHERE ID = ?', [playerId]);
    if (playerRows.length === 0) return res.status(404).json({ error: 'Player not found' });
    const player = playerRows[0];
    const [jobRows] = await db.query('SELECT * FROM Jobs WHERE ID = ?', [player.ID_Job]);
    if (jobRows.length === 0) return res.status(404).json({ error: 'Job not found' });
    const job = jobRows[0];

    //Obtén el enemigo de la misión
    const [missionRows] = await db.query('SELECT ID_Enemy FROM Missions WHERE ID = ?', [missionId]);
    const enemyId = missionRows[0].ID_Enemy;
    const [enemyRows] = await db.query('SELECT * FROM Enemies WHERE ID = ?', [enemyId]);
    if (enemyRows.length === 0) return res.status(404).json({ error: 'Enemy not found' });
    const enemy = enemyRows[0];

    //Calcula el daño
    let damage = player.Attack + job.BaseAttack - enemy.Defense;
    if (damage < 0) damage = 0;

    //Resta el daño al HP actual
    let newEnemyHP = currentEnemyHP - damage;
    if (newEnemyHP < 0) newEnemyHP = 0;

    //Calcula el daño recibido por el jugador
    let playerDamage = enemy.Attack - (player.Defense + job.BaseDefense);
    if (playerDamage < 0) playerDamage = 0;

    let newPlayerHP = activeRows[0].PlayerHP - playerDamage;
    if (newPlayerHP < 0) newPlayerHP = 0;

    //Actualiza el HP del jugador en ActiveMissions
    await db.query(
      'UPDATE ActiveMissions SET PlayerHP = ? WHERE ID_Player = ? AND ID_Mission = ?',
      [newPlayerHP, playerId, missionId]
    );

    //Incrementa el turno solo si el enemigo no ha muerto
    let newTurn = currentTurn;
    if (newEnemyHP > 0) {
      newTurn = currentTurn + 1;
      await db.query(
        'UPDATE ActiveMissions SET EnemyHP = ?, Turn = ? WHERE ID_Player = ? AND ID_Mission = ?',
        [newEnemyHP, newTurn, playerId, missionId]
      );
    } else {
      //Cuando el enemigo muere
      const [missionRows] = await db.query('SELECT ID_Enemy FROM Missions WHERE ID = ?', [missionId]);
      const enemyId = missionRows[0].ID_Enemy;
      const [enemyRows] = await db.query('SELECT Experience FROM Enemies WHERE ID = ?', [enemyId]);
      const experience = enemyRows[0].Experience;

      await db.query(
        'DELETE FROM ActiveMissions WHERE ID_Player = ? AND ID_Mission = ?',
        [playerId, missionId]
      );

      return res.json({ enemyHP: 0, damage, playerDamage, playerHP: newPlayerHP, turn: newTurn, experience });
    }

    res.json({ enemyHP: newEnemyHP, damage, playerDamage, playerHP: newPlayerHP, turn: newTurn });
  } catch (error) {
    res.status(500).json({ error: 'Error en el ataque', details: error.message });
  }
});

app.post('/api/active-missions/start', async (req, res) => {
  const { playerId, missionId } = req.body;

  //Verifica si ya tiene una misión activa
  const [activeRows] = await db.query(
    'SELECT * FROM ActiveMissions WHERE ID_Player = ?',
    [playerId]
  );
  if (activeRows.length > 0) {
    //Ya tiene una misión activa, devuelve el ID de la misión activa
    return res.status(400).json({
      error: 'Ya tienes una misión activa',
      activeMissionId: activeRows[0].ID_Mission
    });
  }

  //Obtén el HP del enemigo de la misión
  const [missionRows] = await db.query('SELECT ID_Enemy FROM Missions WHERE ID = ?', [missionId]);
  if (missionRows.length === 0) return res.status(404).json({ error: 'Mission not found' });
  const enemyId = missionRows[0].ID_Enemy;
  const [enemyRows] = await db.query('SELECT HP FROM Enemies WHERE ID = ?', [enemyId]);
  if (enemyRows.length === 0) return res.status(404).json({ error: 'Enemy not found' });
  const enemyHP = enemyRows[0].HP;

  //Obtén el HP del jugador
  const [playerRows] = await db.query('SELECT HP FROM Players WHERE ID = ?', [playerId]);
  if (playerRows.length === 0) return res.status(404).json({ error: 'Player not found' });
  const playerHP = playerRows[0].HP;

  //Inserta la misión activa
  await db.query(
    'INSERT INTO ActiveMissions (ID_Player, ID_Mission, StartTime, EnemyHP, PlayerHP, Turn) VALUES (?, ?, NOW(), ?, ?, ?)',
    [playerId, missionId, enemyHP, playerHP, 1]
  );
  res.json({ success: true, enemyHP, playerHP, turn: 1 });
});

//En /api/battle/enemy-attack
app.post('/api/battle/enemy-attack', async (req, res) => {
  const { playerId, missionId } = req.body;
  try {
    //Obtén la misión activa
    const [activeRows] = await db.query(
      'SELECT * FROM ActiveMissions WHERE ID_Player = ? AND ID_Mission = ?',
      [playerId, missionId]
    );
    if (activeRows.length === 0) return res.status(404).json({ error: 'Active mission not found' });
    let currentPlayerHP = activeRows[0].PlayerHP;
    let enemySuperAttack = activeRows[0].EnemySuperAttack || 0;

    //Obtén los datos del jugador y job
    const [playerRows] = await db.query('SELECT * FROM Players WHERE ID = ?', [playerId]);
    if (playerRows.length === 0) return res.status(404).json({ error: 'Player not found' });
    const player = playerRows[0];
    const [jobRows] = await db.query('SELECT * FROM Jobs WHERE ID = ?', [player.ID_Job]);
    if (jobRows.length === 0) return res.status(404).json({ error: 'Job not found' });
    const job = jobRows[0];

    //Obtén el enemigo de la misión
    const [missionRows] = await db.query('SELECT ID_Enemy FROM Missions WHERE ID = ?', [missionId]);
    const enemyId = missionRows[0].ID_Enemy;
    const [enemyRows] = await db.query('SELECT * FROM Enemies WHERE ID = ?', [enemyId]);
    if (enemyRows.length === 0) return res.status(404).json({ error: 'Enemy not found' });
    const enemy = enemyRows[0];

    let damage;
    let usedSuperAttack = false;

    if (enemySuperAttack >= 100) {
      //Usa el SuperAttack
      const [superRows] = await db.query('SELECT * FROM SuperAttack WHERE ID = ?', [enemy.ID_SuperAttack]);
      if (superRows.length === 0) return res.status(404).json({ error: 'SuperAttack not found' });
      damage = superRows[0].Damage;
      enemySuperAttack = 0;
      usedSuperAttack = true;
    } else {
      //Ataque normal
      damage = enemy.Attack - (player.Defense + job.BaseDefense);
      if (damage < 0) damage = 0;
    }

    //Resta el daño al HP actual del jugador
    let newPlayerHP = currentPlayerHP - damage;
    if (newPlayerHP < 0) newPlayerHP = 0;

    //Actualiza el HP y la barra de super ataque en ActiveMissions
    await db.query(
      'UPDATE ActiveMissions SET PlayerHP = ?, EnemySuperAttack = ? WHERE ID_Player = ? AND ID_Mission = ?',
      [newPlayerHP, enemySuperAttack, playerId, missionId]
    );

    //Si el jugador muere, borra la ActiveMission
    if (newPlayerHP === 0) {
      await db.query(
        'DELETE FROM ActiveMissions WHERE ID_Player = ? AND ID_Mission = ?',
        [playerId, missionId]
      );
    }

    res.json({ playerHP: newPlayerHP, damage, usedSuperAttack });
  } catch (error) {
    res.status(500).json({ error: 'Error en el ataque del enemigo', details: error.message });
  }
});

app.get('/api/active-missions/by-player/:playerId', async (req, res) => {
  const playerId = req.params.playerId;
  const [rows] = await db.query(
    'SELECT * FROM ActiveMissions WHERE ID_Player = ?',
    [playerId]
  );
  if (rows.length > 0) {
    res.json({ activeMission: rows[0] });
  } else {
    res.json({ activeMission: null });
  }
});

app.get('/api/enemies/:id', async (req, res) => {
  const enemyId = req.params.id;
  const [rows] = await db.query('SELECT * FROM Enemies WHERE ID = ?', [enemyId]);
  if (rows.length > 0) {
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: 'Enemy not found' });
  }
});

app.delete('/api/players/:id', async (req, res) => {
  const playerId = req.params.id;
  try {
    await db.query('DELETE FROM Players WHERE ID = ?', [playerId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al borrar el jugador', error: error.message });
  }
});

//Endpoint para actualizar experiencia y nivel del jugador
app.post('/api/players/update-exp', async (req, res) => {
  const { playerId, experience, level, attack, defense, hp } = req.body;
  try {
    await db.query(
      'UPDATE Players SET Experience = ?, Level = ?, Attack = ?, Defense = ?, HP = ? WHERE ID = ?',
      [experience, level, attack, defense, hp, playerId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar experiencia', error: error.message });
  }
});

//Endpoint para obtener abilities por job
app.get('/api/abilities/by-job/:jobId', async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const [rows] = await db.query(
      'SELECT * FROM Abilities WHERE ID_Job = ? ORDER BY UnlockLvl ASC',
      [jobId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener habilidades', error: error.message });
  }
});

app.post('/api/battle/use-ability', async (req, res) => {
  const { playerId, missionId, abilityId, isUnique } = req.body;
  try {
    const [[activeMission]] = await db.query('SELECT * FROM ActiveMissions WHERE ID_Player = ? AND ID_Mission = ?', [playerId, missionId]);
    if (!activeMission) return res.status(404).json({ success: false, message: 'Active mission not found' });

    let ability;
    let cooldownKey;
    if (isUnique) {
      [[ability]] = await db.query('SELECT * FROM UniqueAbilities WHERE ID = ?', [abilityId]);
      cooldownKey = `u_${abilityId}`;
    } else {
      [[ability]] = await db.query('SELECT * FROM Abilities WHERE ID = ?', [abilityId]);
      cooldownKey = `a_${abilityId}`;
    }
    if (!ability) return res.status(404).json({ success: false, message: 'Ability not found' });

    let cooldowns = {};
    if (activeMission.AbilityCooldowns) {
      cooldowns = JSON.parse(activeMission.AbilityCooldowns);
    }
    const currentTurn = activeMission.Turn || 1;

    //Validar cooldown
    if (cooldowns[cooldownKey] && cooldowns[cooldownKey] > currentTurn) {
      return res.status(400).json({ success: false, message: 'Habilidad en cooldown' });
    }

    let enemyHP = activeMission.EnemyHP - ability.Damage;
    if (enemyHP < 0) enemyHP = 0;

    //Actualiza el cooldown de la habilidad
    cooldowns[cooldownKey] = currentTurn + ability.Cooldown;

    await db.query(
      'UPDATE ActiveMissions SET EnemyHP = ?, AbilityCooldowns = ? WHERE ID_Player = ? AND ID_Mission = ?',
      [enemyHP, JSON.stringify(cooldowns), playerId, missionId]
    );

    //Si el enemigo muere, elimina la misión activa y otorga experiencia
    let experience = 0;
    if (enemyHP === 0) {
      const [[mission]] = await db.query('SELECT * FROM Missions WHERE ID = ?', [missionId]);
      const [[enemy]] = await db.query('SELECT * FROM Enemies WHERE ID = ?', [mission.ID_Enemy]);
      experience = enemy.Experience || 0;
      await db.query('DELETE FROM ActiveMissions WHERE ID_Player = ? AND ID_Mission = ?', [playerId, missionId]);
    }

    res.json({
      success: true,
      enemyHP,
      damage: ability.Damage,
      experience,
      cooldowns
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al usar habilidad', error: error.message });
  }
});

//En /api/battle/use-ultimate
app.post('/api/battle/use-ultimate', async (req, res) => {
  const { playerId, missionId } = req.body;
  try {
    //Obtener misión activa
    const [[activeMission]] = await db.query('SELECT * FROM ActiveMissions WHERE ID_Player = ? AND ID_Mission = ?', [playerId, missionId]);
    if (!activeMission) return res.status(404).json({ success: false, message: 'Active mission not found' });

    //Obtener datos del jugador y job
    const [[player]] = await db.query('SELECT * FROM Players WHERE ID = ?', [playerId]);
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
    const [[job]] = await db.query('SELECT * FROM Jobs WHERE ID = ?', [player.ID_Job]);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    //Obtener definitivo del job
    const [[ultimate]] = await db.query('SELECT * FROM Definitivo WHERE ID = ?', [job.ID_Definitivo]);
    if (!ultimate) return res.status(404).json({ success: false, message: 'Ultimate not found' });

    //Aplicar daño al enemigo
    let enemyHP = activeMission.EnemyHP - ultimate.Damage;
    if (enemyHP < 0) enemyHP = 0;

    //Actualizar HP del enemigo en la misión activa
    await db.query(
      'UPDATE ActiveMissions SET EnemyHP = ? WHERE ID_Player = ? AND ID_Mission = ?',
      [enemyHP, playerId, missionId]
    );

    //Si el enemigo muere, elimina la misión activa y otorga experiencia
    let experience = 0;
    if (enemyHP === 0) {
      const [[mission]] = await db.query('SELECT * FROM Missions WHERE ID = ?', [missionId]);
      const [[enemy]] = await db.query('SELECT * FROM Enemies WHERE ID = ?', [mission.ID_Enemy]);
      experience = enemy.Experience || 0;
      await db.query('DELETE FROM ActiveMissions WHERE ID_Player = ? AND ID_Mission = ?', [playerId, missionId]);
    }

    res.json({
      success: true,
      enemyHP,
      damage: ultimate.Damage,
      experience
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al usar definitivo', error: error.message });
  }
});

app.post('/api/active-missions/update-definitivo', async (req, res) => {
  const { playerId, missionId, playerDefinitivo } = req.body;
  try {
    await db.query(
      'UPDATE ActiveMissions SET PlayerDefinitivo = ? WHERE ID_Player = ? AND ID_Mission = ?',
      [playerDefinitivo, playerId, missionId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar definitivo', error: error.message });
  }
});

app.post('/api/active-missions/update-enemy-superattack', async (req, res) => {
  const { playerId, missionId, enemySuperAttack } = req.body;
  try {
    await db.query(
      'UPDATE ActiveMissions SET EnemySuperAttack = ? WHERE ID_Player = ? AND ID_Mission = ?',
      [enemySuperAttack, playerId, missionId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar EnemySuperAttack', error: error.message });
  }
});

app.get('/api/unique-abilities/:id', async (req, res) => {
  const id = req.params.id;
  const [rows] = await db.query('SELECT * FROM UniqueAbilities WHERE ID = ?', [id]);
  if (rows.length > 0) {
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: 'UniqueAbility not found' });
  }
});

app.get('/api/definitivo/:id', async (req, res) => {
  const id = req.params.id;
  const [rows] = await db.query('SELECT * FROM Definitivo WHERE ID = ?', [id]);
  if (rows.length > 0) {
    res.json(rows[0]);
  } else {
    res.status(404).json({ error: 'Definitivo not found' });
  }
});
