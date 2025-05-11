const http = require('http');
const app = require('./app');
const { Socket } = require('dgram');
const server = require('socket.io');
const initRaidSocket = require('./socket/raid.socket');

const server = http.createServer(app);
const io = new server.Server(server, {
  cors: {
    origin: '*',
  }
});

initRaidSocket(io);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

/*const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
let raids = [];


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create-raid', (raidNmae) => {
    const raid = {
        id: socket.id,
        name: raidNmae,
        players: [socket.id]
    };

    raids.push(raid);
    socket.emit('raid-created', raid);
  })


});*/
