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
    username: "24ATERNOSBOT",
    version: false
  });

  bot.on('login', function () {
    bot.chat('/reginster 123123123 123123123');
    bot.chat('/login 123123123 123123123');
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

  bot.on('spawn', function () {
    bot.chat('Bot > Spawned');
  });

  bot.on('death', function () {
    bot.chat('Bot > I died, respawn');
  });

  bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn));
  bot.on('error', err => console.log(err));
  bot.on('end', createBot);
}

createBot();
