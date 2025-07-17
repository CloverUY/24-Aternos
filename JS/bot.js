// ===== EXPRESS SERVER TO KEEP RENDER PORT OPEN =====
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// ===== MINEFLAYER & BASIC BOT SETUP =====
const mineflayer = require('mineflayer');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Gabriela25615-qpMy.aternos.me', // <-- replace this (e.g., 'Gabriela25615-qpMy.aternos.me')
    port: 31387,       // <-- replace this (e.g., 31387)
    username: 'Clown',     // <-- your bot's username
    version: false
  });

  bot.once('spawn', () => {
    console.log('Bot spawned successfully!');

    // Start bot actions
    startSprintAndJump();
    startRandomMovement();
    startRandomChat();
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot kicked:', reason);
  });
}

// --- Sprint and jump forever to avoid AFK kick ---
function startSprintAndJump() {
  if (!bot || !bot.entity) return;

  bot.setControlState('sprint', true);

  setInterval(() => {
    if (!bot.entity) return;
    bot.setControlState('jump', true);
  }, 1000);

  bot.setControlState('jump', true);
}

// --- Random movement every few seconds ---
function startRandomMovement() {
  setInterval(() => {
    if (!bot.entity) return;
    // Random strafe left/right or forward/backward
    const directions = ['forward', 'back', 'left', 'right', null];
    directions.forEach(dir => bot.setControlState(dir, false)); // reset all controls

    const move = directions[Math.floor(Math.random() * directions.length)];
    if (move) {
      bot.setControlState(move, true);
      console.log('Moving:', move);
    }
  }, 5000);
}

// --- Chat random messages every 5-10 minutes ---
function startRandomChat() {
  const messages = [
    "Hey everyone!",
    "What's up?",
    "How's it going?",
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
    console.log('Sent chat message:', msg);
    setTimeout(sendChat, (5 + Math.random() * 5) * 60 * 1000);
  }

  sendChat();
}

createBot();
