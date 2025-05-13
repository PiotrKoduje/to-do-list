const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

const tasks = [
  { id: 1, name: 'Shopping' },
  { id: 2, name: 'Go out with a dog' }
];

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (id) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', id);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});


