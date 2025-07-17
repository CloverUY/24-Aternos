// ===== EXPRESS SERVER (fix Render port binding) =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER SETUP =====
const mineflayer = require('mineflayer');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Gabriela25615-qpMy.aternos.me', // <--- REPLACE with your server address
    port: 31387,                          // <--- REPLACE with your server port (number)
    username: '24ATERNOSBOT',             // <--- Your bot username
    version: false
  });

  bot.once('spawn', () => {
    console.log('Bot spawned, starting actions...');

    // Sprint forever
    bot.setControlState('sprint', true);

    // Jump every second to avoid AFK kicks
    setInterval(() => {
      if (!bot.entity) return;
      bot.setControlState('jump', true);
    }, 1000);

    // Move forward continuously
    bot.setControlState('forward', true);

    // Randomly look around every 10 seconds
    setInterval(() => {
      if (!bot.entity) return;
      const yaw = Math.random() * 2 * Math.PI;
      const pitch = Math.random() - 0.5;
      bot.look(yaw, pitch, true);
    }, 10000);

    // Chat every 5-10 minutes
    const messages = [
      "Hey everyone!",
      "What’s up?",
      "How’s it going?",
      "Anyone around?",
      "Just chilling here.",
      "This server is cool!",
      "Gotta keep moving!",
      "Is anyone online?"
    ];
    function sendChat() {
      if (!bot.entity) return;
      const msg = messages[Math.floor(Math.random() * messages.length)];
      bot.chat(msg);
      setTimeout(sendChat, (5 + Math.random() * 5) * 60 * 1000);
    }
    sendChat();
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => console.log('Bot error:', err));
  bot.on('kicked', (reason) => console.log('Bot kicked:', reason));
}

createBot();
