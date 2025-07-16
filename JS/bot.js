// ======= EXPRESS SERVER FOR RENDER =======
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ======= MINEFLAYER BOT SETUP =======
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const Vec3 = require('vec3');
console.log('Starting...');

function createBot() {
  const bot = mineflayer.createBot({
    host: "Gabriela25615-qpMy.aternos.me",
    port: 31387,
    username: "24ATERNOSBOT",
    version: false
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('Spawned. Starting foolproof anti-AFK.');
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    startAntiAFK(bot);
  });

  bot.on('login', () => {
    bot.chat('/register 123123123 123123123');
    bot.chat('/login 123123123 123123123');
  });

  bot.on('death', () => {
    console.log("Bot died. Will respawn.");
  });

  bot.on('end', () => {
    console.log("Bot disconnected. Reconnecting in 30s.");
    clearInterval(afkInterval);
    setTimeout(createBot, 30000);
  });

  bot.on('kicked', reason => {
    console.log("Kicked:", reason);
  });

  bot.on('error', err => {
    console.error("Error:", err);
  });
}

let afkInterval = null;

function startAntiAFK(bot) {
  afkInterval = setInterval(() => {
    const dx = Math.floor(Math.random() * 10) - 5;
    const dz = Math.floor(Math.random() * 10) - 5;
    const pos = bot.entity.position.offset(dx, 0, dz);
    bot.pathfinder.setGoal(new goals.GoalBlock(pos.x, pos.y, pos.z));

    // Random look
    bot.look(Math.random() * 2 * Math.PI, Math.random() * 0.5 - 0.25, true);

    // Swing arm sometimes
    if (Math.random() < 0.3) {
      bot.swingArm();
    }

    // Occasionally chat like a player
    if (Math.random() < 0.1) {
      const messages = [
        "lol",
        "bruh",
        "this server cool",
        "just chillin",
        "anyone trading?",
        "xD"
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      bot.chat(msg);
    }

  }, 15000); // Every 15 seconds
}

createBot();
