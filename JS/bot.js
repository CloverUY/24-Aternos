// ===== EXPRESS SERVER (to keep Render alive) =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER SETUP =====
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data')('1.21.2'); // pick closest stable version

const SERVER_HOST = 'Gabriela25615-qpMy.aternos.me';
const SERVER_PORT = 31387;
const VERSION = '1.21.2'; // adjusted to match minecraft-data version
const BOT_USERNAME = 'Clown';

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: VERSION
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log(`[${new Date().toLocaleTimeString()}] Bot spawned successfully!`);

    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    startKeepAliveChat();
    startRandomMovement();
  });

  bot.on('end', () => {
    console.log(`[${new Date().toLocaleTimeString()}] Bot disconnected. Reconnecting in 100ms...`);
    setTimeout(createBot, 100);
  });

  bot.on('error', (err) => {
    console.error(`[ERROR] ${err.message}`);
  });

  bot.on('kicked', (reason) => {
    console.warn(`[KICKED] Reason: ${reason}. Reconnecting...`);
    setTimeout(createBot, 100);
  });
}

function startKeepAliveChat() {
  const messages = [
    "Still here!",
    "Just hanging out!",
    "Anyone around?",
    "Bot is alive!",
    "Keepin' it moving!",
  ];

  setInterval(() => {
    if (bot && bot.chat && bot.entity) {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      bot.chat(msg);
      console.log(`[${new Date().toLocaleTimeString()}] Sent chat: "${msg}"`);
    }
  }, 5 * 60 * 1000);
}

function startRandomMovement() {
  const { GoalNear } = goals;

  setInterval(() => {
    if (!bot.entity || !bot.entity.position) return;

    const x = bot.entity.position.x + (Math.random() * 10 - 5);
    const y = bot.entity.position.y;
    const z = bot.entity.position.z + (Math.random() * 10 - 5);

    bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));

    bot.setControlState('sprint', true);
    bot.setControlState('jump', true);
    setTimeout(() => {
      bot.setControlState('jump', false);
    }, 400);
  }, 10000);
}

createBot();
