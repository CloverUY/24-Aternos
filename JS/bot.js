// ===== EXPRESS SERVER (fix Render port binding) =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER & PATHFINDER SETUP =====
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const minecraftData = require('minecraft-data');
const Vec3 = require('vec3');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Gabriela25615-qpMy.aternos.me',  // <-- Your server address here
    port: 31387,                             // <-- Your server port here (number, no quotes)
    username: '24ATERNOSBOT',                // <-- Your bot username
    version: false
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    const mcData = minecraftData(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    startWandering();
    startRandomLook();
    startRandomChat();
    startSprintAndJumpForever();
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('Bot error:', err));
  bot.on('kicked', reason => console.log('Bot kicked:', reason));
}

// --- Movement: Wander randomly within 20x20 area around current pos ---
function startWandering() {
  function wander() {
    if (!bot.entity) return;

    const x = bot.entity.position.x + (Math.random() * 20 - 10);
    const y = bot.entity.position.y;
    const z = bot.entity.position.z + (Math.random() * 20 - 10);

    const goal = new GoalNear(x, y, z, 1);
    bot.pathfinder.setGoal(goal);

    function onGoalReached() {
      bot.removeListener('goal_reached', onGoalReached);
      setTimeout(wander, 1000 + Math.random() * 2000);
    }
    bot.on('goal_reached', onGoalReached);

    function onPathUpdate(r) {
      if (r.status === 'noPath') {
        bot.pathfinder.setGoal(null);
        setTimeout(wander, 1000);
      }
    }
    bot.once('path_update', onPathUpdate);
  }

  wander();
}

// --- Randomly look around every 5 seconds ---
function startRandomLook() {
  setInterval(() => {
    if (!bot.entity) return;
    const yaw = Math.random() * 2 * Math.PI;
    const pitch = Math.random() - 0.5;
    bot.look(yaw, pitch, true);
  }, 5000);
}

// --- Chat randomly every 5-10 minutes to simulate player ---
function startRandomChat() {
  const messages = [
    "Hey everyone!",
    "What’s up?",
    "How’s it going?",
    "Anyone around?",
    "Just chilling here.",
    "This server is cool!",
    "Gotta keep moving!",
    "Is anyone online?"
  ];

  function sendChat() {
    if (!bot.entity) return;
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
    setTimeout(sendChat, (5 + Math.random() * 5) * 60 * 1000);
  }

  sendChat();
}

// --- Sprint and jump FOREVER (prevents idle kicks) ---
function startSprintAndJumpForever() {
  bot.setControlState('sprint', true);

  // Jump key pressed continuously every second
  setInterval(() => {
    if (!bot.entity) return;
    bot.setControlState('jump', true);
  }, 1000);

  // Make sure jump is ON immediately
  bot.setControlState('jump', true);
}

createBot();
