const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');

// === CONFIGURATION ===
const SERVER_HOST = 'your-server.aternos.me'; // replace with your actual Aternos IP
const SERVER_PORT = 25565; // usually 25565
const MINECRAFT_VERSION = '1.21.7';
const BOT_USERNAME = 'AntiAFK_Bot';

// === GLOBAL BOT INSTANCE ===
let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: MINECRAFT_VERSION,
    pingInterval: 10000,
    keepAlive: true,
    keepAliveTimeout: 60000
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('✅ Bot spawned successfully.');

    const data = mcData(bot.version);
    const defaultMove = new Movements(bot, data);
    bot.pathfinder.setMovements(defaultMove);

    // Begin anti-AFK behavior
    simulateMovement();
    periodicChat();
    startManualKeepAlive();
  });

  bot.on('end', () => {
    console.log('🔁 Bot disconnected — reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });

  bot.on('kicked', reason => {
    console.log('🔄 Bot was kicked:', reason);
    setTimeout(createBot, 10000);
  });

  bot.on('error', err => {
    console.error('❌ Bot error:', err.message);
  });
}

// === PREVENT TIMEOUT ERROR (Extra KeepAlive) ===
function startManualKeepAlive() {
  setInterval(() => {
    try {
      bot._client.write('keep_alive', {
        keepAliveId: BigInt(Date.now())
      });
    } catch (err) {
      console.log('⚠️ Manual keepalive error:', err.message);
    }
  }, 15000); // every 15 seconds
}

// === SIMULATE RANDOM MOVEMENT ===
function simulateMovement() {
  const actions = ['jump', 'forward', 'back', 'left', 'right', 'sprint'];
  setInterval(() => {
    const action = actions[Math.floor(Math.random() * actions.length)];

    if (['forward', 'back', 'left', 'right', 'sprint'].includes(action)) {
      bot.setControlState(action, true);
      setTimeout(() => bot.setControlState(action, false), 1000);
    } else if (action === 'jump') {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);
    }
  }, 4000);
}

// === SEND CHAT EVERY 5 MINUTES ===
function periodicChat() {
  const messages = [
    "I'm not AFK 😎",
    "Just chillin'...",
    "Don't kick me!",
    "Still active here!",
    "Keeping server alive!"
  ];
  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
  }, 300000); // 5 minutes
}

createBot();
