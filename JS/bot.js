const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

let bot;
let movementInterval = null;
let lookInterval = null;
let jumpInterval = null;

const config = {
  host: "Gabriela25615-qpMy.aternos.me",
  port: 31387,
  username: "AFK_Bot",
  version: false, // Your specified version
  auth: 'offline'
};

app.get('/', (req, res) => {
  res.send(`<h1>🤖 AFK Bot Status</h1><p>Status: ${bot && bot.entity ? 'Online' : 'Offline'}</p>`);
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

function createBot() {
  bot = mineflayer.createBot(config);

  bot.once('spawn', () => {
    console.log("✅ Bot spawned!");

    startAntiAFKBehavior();
  });

  bot.on('end', () => {
    console.warn("🔁 Bot disconnected. Reconnecting...");
    reconnect();
  });

  bot.on('error', (err) => {
    console.error("❌ Bot error:", err.message);
    reconnect();
  });
}

function startAntiAFKBehavior() {
  // Random walking
  movementInterval = setInterval(() => {
    if (!bot || !bot.entity) return;

    const directions = ['forward', 'back', 'left', 'right'];
    const dir = directions[Math.floor(Math.random() * directions.length)];

    bot.setControlState(dir, true);
    setTimeout(() => bot.setControlState(dir, false), Math.random() * 2000 + 1000);
  }, Math.random() * 5000 + 3000);

  // Random looking
  lookInterval = setInterval(() => {
    if (!bot || !bot.entity) return;

    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * 1.5;

    try {
      bot.look(yaw, pitch, true);
    } catch (e) {
      console.log("Look error:", e.message);
    }
  }, Math.random() * 4000 + 2000);

  // Occasional jumping
  jumpInterval = setInterval(() => {
    if (!bot || !bot.entity) return;

    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, Math.random() * 8000 + 4000);
}

function reconnect() {
  clearInterval(movementInterval);
  clearInterval(lookInterval);
  clearInterval(jumpInterval);

  setTimeout(() => {
    createBot();
  }, 5000);
}

createBot();