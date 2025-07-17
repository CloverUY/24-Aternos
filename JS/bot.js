const mineflayer = require('mineflayer');
const express = require('express');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const app = express();

// ✅ Web server for Render/UptimeRobot
app.get('/', (req, res) => res.send('Bot is running.'));
app.listen(10000, () => {
  console.log('Web server on port 10000');
});

// ✅ Configuration
const BOT_USERNAME = 'YourBotUsername'; // Use a valid Minecraft username (non-premium works)
const SERVER_HOST = 'yourserver.aternos.me'; // Replace with your Aternos IP
const SERVER_PORT = 25565; // Aternos default
const VERSION = false; // false = auto-detect version

let bot;
let reconnectAttempts = 0;

// ✅ Anti-AFK logic
function startAntiAFK() {
  let chatInterval = 1000 * 60 * 5; // 5 minutes
  let moveInterval = 1000 * 30;     // every 30 seconds

  setInterval(() => {
    const msg = ["Still here!", "I'm not AFK!", "All good!", "Staying online!", "😉"][Math.floor(Math.random() * 5)];
    bot.chat(msg);
  }, chatInterval);

  setInterval(() => {
    const dx = Math.floor(Math.random() * 3) - 1;
    const dz = Math.floor(Math.random() * 3) - 1;
    const pos = bot.entity.position.offset(dx, 0, dz);
    bot.lookAt(pos);
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 1000);
  }, moveInterval);
}

// ✅ Bot creation logic
function createBot() {
  reconnectAttempts++;
  console.log(`Creating bot (attempt ${reconnectAttempts})...`);

  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: VERSION,
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    reconnectAttempts = 0;
    console.log('✅ Bot spawned successfully!');
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
    startAntiAFK();
  });

  // Handle disconnection
  bot.on('end', () => {
    console.log('⚠️ Disconnected — reconnecting in 5 seconds…');
    setTimeout(createBot, 5000);
  });

  // Handle login errors
  bot.on('error', err => {
    console.error('❌ Bot error:', err);
    setTimeout(createBot, 5000);
  });

  // Handle kicks
  bot.on('kicked', reason => {
    console.warn('⛔ Kicked from server:', reason);
    setTimeout(createBot, 5000);
  });
}

// ✅ Start the bot
createBot();
