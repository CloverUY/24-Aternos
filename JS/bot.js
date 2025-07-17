// ===== EXPRESS SERVER (to keep Render happy) =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER SETUP =====
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const SERVER_HOST = 'Gabriela25615-qpMy.aternos.me'; // Your Aternos server address
const SERVER_PORT = 31387;                           // Your Aternos server port
const VERSION = '1.21.7';                            // Your Minecraft server version
const BOT_USERNAME = 'Clown';                        // Your bot's username

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: VERSION,
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log(`[${new Date().toLocaleTimeString()}] Bot spawned successfully!`);

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

// Sends a chat message every 5 minutes to avoid idle kick
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
  }, 5 * 60 * 1000); // every 5 minutes
}

// Random movement every 10 seconds to simulate player activity
function startRandomMovement() {
  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);
  const { GoalNear } = goals;

  setInterval(() => {
    if (!bot.entity || !bot.entity.position) return;

    const x = bot.entity.position.x + (Math.random() * 10 - 5);
    const y = bot.entity.position.y;
    const z = bot.entity.position.z + (Math.random() * 10 - 5);

    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));

    // Sprint and jump to mimic real player activity
    bot.setControlState('sprint', true);
    bot.setControlState('jump', true);
    setTimeout(() => {
      bot.setControlState('jump', false);
    }, 400); // jump for 0.4 seconds
  }, 10000); // every 10 seconds
}

createBot();
