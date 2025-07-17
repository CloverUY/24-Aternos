const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');

// === CONFIGURE YOUR SETTINGS ===
const BOT_USERNAME = 'Clown'; // Change this to your bot's name
const SERVER_HOST = 'Gabriela25615-qpMy.aternos.me'; // Your Aternos server address
const SERVER_PORT = 31387; // Default Minecraft port
const VERSION = '1.21.7'; // Match the version your Aternos server is using

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: VERSION,
  });

  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    console.log('✅ Bot spawned and is alive!');

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    // Wander around randomly to avoid idle
    setInterval(() => {
      const x = bot.entity.position.x + (Math.random() * 10 - 5);
      const z = bot.entity.position.z + (Math.random() * 10 - 5);
      const y = bot.entity.position.y;
      const goal = new goals.GoalNear(Math.floor(x), Math.floor(y), Math.floor(z), 2);
      bot.pathfinder.setGoal(goal, true);
    }, 10000); // Every 10 seconds

    // Jump occasionally
    setInterval(() => {
      if (bot.entity.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 5000);

    // Say something every 4 minutes
    setInterval(() => {
      bot.chat('Still here!');
    }, 240000);
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log('❌ Bot kicked:', reason);
    reconnect();
  });

  bot.on('end', () => {
    console.log('🔁 Bot disconnected. Reconnecting...');
    reconnect();
  });

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err);
  });
}

// 🔁 Reconnect after 100ms
function reconnect() {
  setTimeout(createBot, 100);
}

createBot();
