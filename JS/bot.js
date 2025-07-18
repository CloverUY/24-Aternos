// ===== EXPRESS SERVER (Render compatibility) =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER BOT SETUP =====
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');

const SERVER = {
  host: 'Gabriela25615-qpMy.aternos.me',
  port: 31387,
  version: '1.21.7'
};
const BOT_USERNAME = 'Clown';

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER.host,
    port: SERVER.port,
    username: BOT_USERNAME,
    version: SERVER.version
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('Bot spawned successfully!');

    const data = mcData(bot.version);
    const movements = new Movements(bot, data);
    bot.pathfinder.setMovements(movements);

    wander();
    keepActive();
    chatLoop();
  });

  bot.on('end', () => {
    console.log('Bot disconnected — reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', err => {
    console.error('Bot error:', err);
  });

  bot.on('kicked', reason => {
    console.error('Bot kicked:', reason);
    setTimeout(createBot, 10000);
  });
}

function wander() {
  if (!bot.entity) return;
  const { x, y, z } = bot.entity.position;
  const goal = new GoalNear(
    x + (Math.random() * 10 - 5),
    y,
    z + (Math.random() * 10 - 5),
    1
  );
  bot.pathfinder.setGoal(goal);

  bot.once('goal_reached', () => setTimeout(wander, 1000));
  bot.once('path_update', result => {
    if (result.status === 'noPath') setTimeout(wander, 1000);
  });
}

function keepActive() {
  bot.setControlState('sprint', true);
  setInterval(() => {
    if (bot.entity) bot.setControlState('jump', true);
  }, 1000);
}

function chatLoop() {
  const messages = [
    "Still here!", "Anyone around?", "Bot checking in...", "Living the bot life!"
  ];
  setInterval(() => {
    if (bot.entity) {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      bot.chat(msg);
      console.log('Sent chat message:', msg);
    }
  }, 5 * 60 * 1000); // every 5 minutes
}

createBot();
