// ===== EXPRESS SERVER (Render port binding) =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER SETUP =====
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Gabriela25615-qpMy.aternos.me',
    port: 31387,
    username: 'Clown',
    version: '1.21.7'  // Exact version to match your server
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('Bot spawned successfully!');

    const data = mcData(bot.version);
    const defaultMove = new Movements(bot, data);
    bot.pathfinder.setMovements(defaultMove);

    // Wander randomly near current position
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
      bot.once('path_update', (r) => {
        if (r.status === 'noPath') setTimeout(wander, 1000);
      });
    }
    wander();

    // Sprint and jump forever to prevent AFK kick
    bot.setControlState('sprint', true);
    setInterval(() => {
      if (bot.entity) bot.setControlState('jump', true);
    }, 1000);

    // Look around randomly every 5 seconds
    setInterval(() => {
      if (!bot.entity) return;
      const yaw = Math.random() * 2 * Math.PI;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);
    }, 5000);

    // Chat randomly every 5-10 minutes to simulate player
    const messages = [
      "Hey everyone!",
      "What's up?",
      "How's it going?",
      "Anyone online?",
      "Just chilling here.",
      "This server is cool!",
      "Gotta keep moving!",
      "Is anyone around?"
    ];
    function chatLoop() {
      if (!bot.entity) return;
      const msg = messages[Math.floor(Math.random() * messages.length)];
      bot.chat(msg);
      setTimeout(chatLoop, (5 + Math.random() * 5) * 60 * 1000);
    }
    chatLoop();
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 100ms...');
    setTimeout(createBot, 100);
  });

  bot.on('error', err => console.log('Bot error:', err));
  bot.on('kicked', reason => console.log('Bot kicked:', reason));
}

createBot();
