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
    port: 31387,               // Number type preferred here
    username: "24ATERNOSBOT",
    version: false
  });

  bot.on('login', () => {
    bot.chat('/reginster 123123123 123123123'); // Note: Check spelling — should this be /register?
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

  bot.on('spawn', () => {
    bot.chat('Bot > Spawned');
    // Start the random movement loop
    startRandomMovement(bot);
  });

  bot.on('death', () => {
    bot.chat('Bot > I died, respawn');
  });

  bot.on('kicked', (reason, loggedIn) => console.log('Kicked:', reason, loggedIn));
  bot.on('error', err => console.log('Error:', err));
  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting...');
    setTimeout(createBot, 30000); // Reconnect after 30 seconds
  });
}

// Function to control random movement, sprinting, and jumping
function startRandomMovement(bot) {
  function randomMovement() {
    const moves = ['forward', 'back', 'left', 'right'];
    const actions = [];

    bot.clearControlStates();

    // Choose 1-3 random directions to walk
    const walkCount = Math.floor(Math.random() * 3) + 1;
    const chosenMoves = moves.sort(() => 0.5 - Math.random()).slice(0, walkCount);
    chosenMoves.forEach(move => actions.push(move));

    // 50% chance to sprint
    if (Math.random() < 0.5) bot.setControlState('sprint', true);

    // Set walking directions
    actions.forEach(action => bot.setControlState(action, true));

    // 30% chance to jump once
    if (Math.random() < 0.3) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }

    // Stop movement after 3-6 seconds randomly
    setTimeout(() => bot.clearControlStates(), 3000 + Math.random() * 3000);
  }

  // Run randomMovement every 10 seconds to keep bot active
  randomMovement();
  setInterval(randomMovement, 10000);
}

createBot();
