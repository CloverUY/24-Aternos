// ======= EXPRESS SERVER FOR RENDER =======
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ======= MINEFLAYER BOT SETUP =======
const mineflayer = require('mineflayer');

console.log('Starting...');

function createBot() {
  const bot = mineflayer.createBot({
    host: "Gabriela25615-qpMy.aternos.me",
    port: "31387",
    username: "24/7 Bot",
    version: false
  });

  bot.on('login', () => {
    bot.chat('/reginster 123123123 123123123');
    bot.chat('/login 123123123 123123123');
  });

  bot.on('spawn', () => {
    bot.chat('Bot > Spawned');

    // === Anti-AFK Movement ===
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
    }, 10000); // jump every 10 seconds
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    switch (message) {
      case ';start':
        bot.chat('24 ATERNOS > Bot started! - Made By Fortcote');
        bot.setControlState('forward', true);
        bot.setControlState('jump', true);
        bot.setControlState('sprint', true);
        break;
      case ';stop':
        bot.chat('24 ATERNOS > Bot stopped! - Made By Fortcote');
        bot.clearControlStates();
        break;
    }
  });

  bot.on('death', () => {
    bot.chat('Bot > I died, respawn');
  });

  bot.on('kicked', (reason, loggedIn) => console.log('Kicked:', reason));
  bot.on('error', err => console.log('Error:', err));
  bot.on('end', createBot); // Auto-restart
}

createBot();
