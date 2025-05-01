const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const client = new MongoClient(process.env.MONGODB_URI);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (msg) => {
    const message = { text: msg, timestamp: new Date() };
    try {
      const db = client.db('chatApp');
      const collection = db.collection('messages');
      await collection.insertOne(message);
      io.emit('chat message', message);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch(err => console.error('Failed to connect to MongoDB:', err));
