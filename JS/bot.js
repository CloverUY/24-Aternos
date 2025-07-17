// Express server to keep Render awake
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server on port ${PORT}`));

// Mineflayer bot setup
const mineflayer = require('mineflayer');
const {
  pathfinder,
  Movements,
  goals: { GoalNear }
} = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');

const server = {
  host: 'Gabriela25615-qpMy.aternos.me',
  port: 31387,
  version: '1.21.7'
};
const BOT_USERNAME = 'Clown';
let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: server.host,
    port: server.port,
    username: BOT_USERNAME,
    version: server.version
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('Bot spawned successfully!');

    const data = mcData(bot.version);
    const movements = new Movements(bot, data);
    bot.pathfinder.setMovements(movements);

    wander();
    activityLoop();
    chatLoop();
  });

  bot.on('end', () => {
    console.log('Disconnected — reconnecting in 100 ms…');
    setTimeout(createBot, 100);
  });

  bot.on('error', err => console.error('Bot error:', err));
  bot.on('kicked', reason => {
    console.error('Kicked:', reason);
    setTimeout(createBot, 100);
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
  bot.once('path_update', r => r.status === 'noPath' && setTimeout(wander, 1000));
}

function activityLoop() {
  bot.setControlState('sprint', true);
  setInterval(() => bot.setControlState('jump', true), 1000);
}

function chatLoop() {
  const phrases = [
    'Still here!', 'Anyone around?', 'Bot checking in...', 'Living the bot life!'
  ];
  setInterval(() => {
    if (bot.entity) {
      const msg = phrases[Math.floor(Math.random() * phrases.length)];
      bot.chat(msg);
      console.log('Sent chat:', msg);
    }
  }, 5 * 60 * 1000);
}

createBot();
