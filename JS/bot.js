const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');
const express = require('express');

// === Web Server for Render/UptimeRobot ===
const app = express();
app.get('/', (req, res) => res.send('🤖 Bot is running!'));
app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 Web server running...');
});

// === Bot Setup ===
const SERVER_HOST = 'Gabriela25615-qpMy.aternos.me';
const SERVER_PORT = 31387;
const MINECRAFT_VERSION = '1.21.7';
const BOT_USERNAME = 'Clown'; // Change if needed

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: MINECRAFT_VERSION,
  });

  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    console.log('✅ Bot joined the server!');

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    // === Random Walking to Prevent Idle ===
    setInterval(() => {
      const pos = bot.entity.position;
      const x = pos.x + Math.floor(Math.random() * 6 - 3);
      const z = pos.z + Math.floor(Math.random() * 6 - 3);
      const y = pos.y;
      bot.pathfinder.setGoal(new goals.GoalNear(x, y, z, 1));
    }, 10000);

    // === Occasional Jumping ===
    setInterval(() => {
      if (bot.entity.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 7000);

    // === Chat to Avoid Detection ===
    setInterval(() => {
      bot.chat('Still online!');
    }, 240000); // every 4 mins
  });

  bot.on('kicked', (reason) => {
    console.log('❌ Kicked:', reason);
    reconnect();
  });

  bot.on('end', () => {
    console.log('🔁 Disconnected. Reconnecting...');
    reconnect();
  });

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err);
  });
}

function reconnect() {
  setTimeout(createBot, 100); // reconnect in 0.1 sec
}

createBot();
