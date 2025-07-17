const mineflayer = require('mineflayer');
const http = require('http');

// === ⛏️ Fill in your Aternos server details ===
const HOST = 'your-server-name.aternos.me'; // e.g., 'gabriel.aternos.me'
const PORT = 25565; // Usually 25565 unless Aternos gives something else
const USERNAME = 'YourBotName'; // Use any unused name like 'NotAFKBot42'

// === 🛰️ Uptime Robot ping responder (for Render) ===
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running.');
}).listen(process.env.PORT || 3000);

// === 🚀 Start the bot ===
function createBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
  });

  // === ✅ When bot joins the server
  bot.on('spawn', () => {
    console.log('✅ Bot joined and spawned.');

    // Begin acting like a real player
    simulateMovement(bot);
    chatLoop(bot);
  });

  // === 🛑 Error handling and reconnect
  bot.on('error', (err) => {
    console.error('❌ Bot error:', err);
  });

  bot.on('end', () => {
    console.log('⚠️ Disconnected. Reconnecting in 30 seconds...');
    setTimeout(createBot, 30_000);
  });
}

// === 🤖 Simulate human-like movement
function simulateMovement(bot) {
  const directions = ['forward', 'back', 'left', 'right'];

  setInterval(() => {
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * 0.4;

    bot.setControlState('sprint', true);
    bot.setControlState('jump', true);
    bot.setControlState(dir, true);
    bot.look(yaw, pitch, true);

    setTimeout(() => {
      bot.setControlState('sprint', false);
      bot.setControlState('jump', false);
      bot.setControlState(dir, false);
    }, 3000); // Move for 3 seconds
  }, 10_000); // Every 10 seconds
}

// === 💬 Chat every 5 minutes
function chatLoop(bot) {
  const messages = [
    "Just mining away! ⛏️",
    "Haha not AFK!",
    "Anyone need help? 😄",
    "Still here, still active.",
    "Love this server!",
    "This bot never sleeps 😴🚫"
  ];

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
  }, 5 * 60 * 1000); // Every 5 minutes
}

// 🚀 Launch it
createBot();
