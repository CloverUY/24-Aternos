// ===== EXPRESS SERVER (Render port binding) =====
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
    host: 'Gabriela25615-qpMy.aternos.me',  // Replace with your Minecraft server address (no quotes)
    port: 31387,                  // Replace with your Minecraft server port (number)
    username: 'Clown',     // Your bot's username
    version: false                // auto-detect version
  });

  bot.once('spawn', () => {
    console.log('Bot spawned successfully!');

    // Start continuous sprint and jump
    bot.setControlState('sprint', true);

    // Jump continuously without error by toggling jump ON every second
    setInterval(() => {
      if (bot.entity) bot.setControlState('jump', true);
    }, 1000);

    // Look around randomly every 5 seconds
    setInterval(() => {
      if (bot.entity) {
        const yaw = Math.random() * 2 * Math.PI;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, true);
      }
    }, 5000);

    // Send chat message every 5-10 minutes randomly
    const messages = [
      "Hey everyone!",
      "What's up?",
      "How's it going?",
      "Anyone online?",
      "Just chilling here.",
      "This server is cool!",
      "Gotta keep moving!",
      "Is anyone around?"
    ];
    function chatLoop() {
      if (bot.entity) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        bot.chat(msg);
      }
      setTimeout(chatLoop, (5 + Math.random() * 5) * 60 * 1000);
    }
    chatLoop();
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => {
    console.log('Bot error:', err);
  });

  bot.on('kicked', reason => {
    console.log('Bot kicked:', reason);
  });
}

createBot();
