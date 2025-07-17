const mineflayer = require('mineflayer');
const http = require('http'); // Prevent Render port timeout

// Prevent Render port timeout
http.createServer((_, res) => res.end("Bot running")).listen(process.env.PORT || 3000);

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'yourserver.aternos.me', // Replace with your Aternos server
    port: 25565,
    username: '24ATERNOSBOT', // Use a Minecraft account
    version: false
  });

  bot.on('login', () => {
    console.log("✅ Bot logged in!");

    // Simulate real player movement
    startMovementLoop();
  });

  bot.on('end', () => {
    console.log("⚠️ Disconnected. Reconnecting in 30 seconds...");
    setTimeout(createBot, 30000);
  });

  bot.on('error', err => {
    console.log("❌ Error:", err.message);
  });
}

// Move + Jump + Sprint Randomly
function startMovementLoop() {
  const directions = ['forward', 'back', 'left', 'right'];

  setInterval(() => {
    // Pick a random direction
    const dir = directions[Math.floor(Math.random() * directions.length)];

    // Start moving, sprinting, and jumping
    bot.setControlState('sprint', true);
    bot.setControlState(dir, true);
    bot.setControlState('jump', true);

    // Random movement time
    const moveTime = 1000 + Math.random() * 2000;

    setTimeout(() => {
      bot.setControlState(dir, false);
      bot.setControlState('jump', false);
      bot.setControlState('sprint', false);
    }, moveTime);
  }, 4000); // Loop every few seconds
}

createBot();
