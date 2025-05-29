import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import db from '../services/db.js'; // Asegúrate que db.js también sea ES module o usa export default
import path from 'path';
import { fileURLToPath } from 'url';
import { getMissionById } from '../services/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//import initRaidSocket from './socket/raid.socket';

const app = express();

app.use(cors({
  origin: 'http://localhost:4200'
}));

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: '*',
  }
});

//initRaidSocket(io);

// Middleware para JSON
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM Players WHERE Email = ?', [email]);
  if (rows.length > 0) {
    const user = rows[0];
    const match = await bcrypt.compare(password, user.Password);
    if (match) {
      const token = jwt.sign({ id: user.ID }, 'secreto_super_seguro');
      res.json({ success: true, player: user, token }); // <-- devuelve el token aquí
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }
});

//Haz registro de un nuevo jugador
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Players (Name, Email, Password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    // Genera el token con el nuevo ID
    const token = jwt.sign({ id: result.insertId }, 'secreto_super_seguro');
    res.json({ success: true, playerId: result.insertId, token }); // <-- Devuelve el token aquí
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar el jugador', error: error.message });
  }
});

//Selecciona un job para un jugador
app.post('/api/players/:id/assign-job', async (req, res) => {
  const playerId = req.params.id;
  const { jobId, jobAspectId } = req.body;
  console.log('Asignando Job:', { playerId, jobId, jobAspectId }); // <-- Agrega este log
  try {
    await db.query(
      'UPDATE Players SET ID_Job = ?, ID_JobAspect = ? WHERE ID = ?',
      [jobId, jobAspectId, playerId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al asignar job', error: error.message });
  }
});


// Middleware para verificar el token
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

// Endpoint protegido
app.get('/api/player/me', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const [rows] = await db.query('SELECT * FROM Players WHERE ID = ?', [userId]);
  if (rows.length > 0) {
    res.json({ success: true, player: rows[0] });
  } else {
    res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
});

// Ejemplo de endpoint REST
app.get('/api/players', async (req, res) => {
  const players = await db.getPlayers();
  res.json(players);
});

// Endpoint para obtener trabajos
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await db.getJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener jobs', error: error.message });
  }
});

// Nuevo endpoint para obtener trabajos con aspectos
app.get('/api/jobs-with-aspects', async (req, res) => {
  try {
    const jobs = await db.getJobsWithAspects();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener jobs con aspectos', error: error.message });
  }
});

// Nuevo endpoint para obtener jobs con solo los IDs de sus aspectos
app.get('/api/jobs-aspect-ids', async (req, res) => {
  try {
    const jobs = await db.getJobsWithAspectIds(); // Esta función debe estar en db.js
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener jobs con aspectIds', error: error.message });
  }
});

// Endpoint para comprobar la conexión a la base de datos
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ success: true, message: 'Conexión exitosa a la base de datos', result: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error de conexión a la base de datos', error: error.message });
  }
});

// Nueva ruta para obtener misiones
app.get('/api/missions', async (req, res) => {
  try {
    const missions = await db.getMissions();
    res.json(missions);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener misiones', error: error.message });
  }
});

// Nuevo endpoint para obtener una misión con su enemigo
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

// Nueva ruta para obtener raids
app.get('/api/raids', async (req, res) => {
  try {
    const raids = await db.getRaids();
    res.json(raids);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener raids', error: error.message });
  }
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('¡Backend de Battle Fantasy funcionando!');
});

// Servir archivos estáticos de Angular
//const __dirname = path.dirname(fileURLToPath(import.meta.url));
//app.use(express.static(path.join(__dirname, '../../dist/battle-fantasy')));

// Redirigir todas las rutas no-API a index.html de Angular
//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, '../../dist/battle-fantasy/index.html'));
//});

// Ejemplo de evento Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('playerAction', (data) => {
    // Maneja la acción del jugador
    console.log('Acción recibida:', data);
    // Puedes emitir eventos a otros clientes si lo necesitas
    socket.broadcast.emit('playerAction', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Inicia el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
