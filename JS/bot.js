// ======= EXPRESS SERVER FOR RENDER =======
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ======= MINEFLAYER BOT SETUP =======
const mineflayer = require('mineflayer');

console.log('Starting bot...');

function createBot() {
  const bot = mineflayer.createBot({
    host: "Gabriela25615-qpMy.aternos.me", // Replace with your server address
    port: 31387,                            // Use number, not string
    username: "Clown",
    version: false
  });

  bot.on('login', () => {
    console.log('Bot logged in');
    // Example login commands, adjust if needed
    bot.chat('/register 123123123 123123123');
    bot.chat('/login 123123123 123123123');
  });

  bot.on('spawn', () => {
    console.log('Bot spawned, starting movement');
    bot.setControlState('forward', true);
    bot.setControlState('jump', true);
    bot.setControlState('sprint', true);

    // Repeat jump every 1 second to simulate player jumping
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 1000);

    // Send chat message every 5 minutes to avoid idle kick
    setInterval(() => {
      bot.chat('I am still here!');
    }, 5 * 60 * 1000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    if (message === ';start') {
      bot.chat('Bot started! Sprinting and jumping now.');
      bot.setControlState('forward', true);
      bot.setControlState('jump', true);
      bot.setControlState('sprint', true);
    } else if (message === ';stop') {
      bot.chat('Bot stopped.');
      bot.clearControlStates();
    }
  });

  bot.on('death', () => {
    bot.chat('I died, respawning...');
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason);
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err);
  });

  bot.on('end', () => {
    console.log('Bot disconnected, reconnecting in 30 seconds...');
    setTimeout(createBot, 30000);
  });
}

createBot();
