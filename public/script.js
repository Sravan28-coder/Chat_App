const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = `${new Date(msg.timestamp).toLocaleTimeString()} - ${msg.text}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
