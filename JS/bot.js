// ===== EXPRESS SERVER FOR RENDER =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER BOT SETUP =====
const mineflayer = require('mineflayer');

console.log('Starting...');

function createBot() {
  const bot = mineflayer.createBot({
    host: "Gabriela25615-qpMy.aternos.me", // your Aternos host
    port: 31387, // your Aternos port
    username: "24ATERNOSBOT",
    version: false
  });

  bot.once('spawn', () => {
    bot.chat('Bot > Spawned and walking forward!');
    bot.setControlState('forward', true);
    bot.setControlState('jump', true); // Optional: jump to simulate activity
  });

  bot.on('login', () => {
    bot.chat('/register 123123123 123123123');
    bot.chat('/login 123123123');
  });

  bot.on('death', () => {
    console.log('Bot died, waiting to respawn.');
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason);
  });

  bot.on('error', (err) => {
    console.log('Error:', err);
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 30 seconds...');
    setTimeout(createBot, 30000);
  });
}

createBot();
