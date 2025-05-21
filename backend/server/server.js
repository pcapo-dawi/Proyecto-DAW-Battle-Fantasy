import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import db from '../services/db.js'; // Asegúrate que db.js también sea ES module o usa export default
import path from 'path';
import { fileURLToPath } from 'url';

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

// Ejemplo de endpoint REST
app.get('/api/players', async (req, res) => {
  const players = await db.getPlayers();
  res.json(players);
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
/*app.get('/api/missions/:id', async (req, res) => {
  try {
    const mission = await getMissionById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Misión no encontrada' });
    }

    res.json(mission);
  } catch (error) {
    console.error('Error al obtener la misión:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});*/

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
