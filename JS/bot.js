// ===== EXPRESS SERVER (fix Render port binding) =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER BOT SETUP =====
const mineflayer = require('mineflayer');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Gabriela25615-qpMy.aternos.me',  // <-- Your server address here
    port: 31387,                            // <-- Your server port here (number, no quotes)
    username: 'Clown',               // <-- Your bot username
    version: false
  });

  bot.once('spawn', () => {
    console.log('Bot spawned, starting actions...');
    startMoving();
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

// --- Moves forward forever, turns randomly if stuck ---
function startMoving() {
  bot.setControlState('forward', true);

  let stuckCounter = 0;
  let lastPosition = bot.entity.position.clone();

  setInterval(() => {
    if (!bot.entity) return;

    // Check if stuck (position didn't change significantly)
    const dist = bot.entity.position.distanceTo(lastPosition);
    if (dist < 0.1) {
      stuckCounter++;
      // Random turn
      const turnLeft = Math.random() < 0.5;
      bot.setControlState('left', turnLeft);
      bot.setControlState('right', !turnLeft);
      setTimeout(() => {
        bot.setControlState('left', false);
        bot.setControlState('right', false);
      }, 1000);
    } else {
      stuckCounter = 0;
      bot.setControlState('left', false);
      bot.setControlState('right', false);
    }
    lastPosition = bot.entity.position.clone();
  }, 2000);
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

// --- Chat randomly every 5-10 minutes ---
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

// --- Sprint and jump forever ---
function startSprintAndJumpForever() {
  bot.setControlState('sprint', true);

  // Jump continuously
  setInterval(() => {
    if (!bot.entity) return;
    bot.setControlState('jump', true);
  }, 1000);

  // Also ensure jump is ON immediately
  bot.setControlState('jump', true);
}

createBot();
