const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');
const SERVER = {
  host: 'your-server-name.aternos.me', // Replace with your Aternos IP
  port: 25565,
  version: '1.21.7'
};
const BOT_USERNAME = 'AntiAFK_Bot';

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER.host,
    port: SERVER.port,
    username: BOT_USERNAME,
    version: SERVER.version,
    pingInterval: 10000,
    keepAlive: true,
    keepAliveTimeout: 120000
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('✅ Bot spawned successfully.');

    const data = mcData(bot.version);
    const defaultMove = new Movements(bot, data);
    bot.pathfinder.setMovements(defaultMove);

    simulateActivity();
    chatLoop();

    // 🛡 Manual Keepalive Backup (prevents timeout)
    setInterval(() => {
      try {
        bot._client.write('keep_alive', { keepAliveId: BigInt(Date.now()) });
      } catch (err) {
        console.log('⚠️ Manual keepalive failed:', err.message);
      }
    }, 15000);
  });

  bot.on('end', () => {
    console.log('🔁 Bot disconnected — reconnecting in 10s...');
    setTimeout(createBot, 10000);
  });

  bot.on('kicked', reason => {
    console.log('🔄 Kicked from server:', reason);
    setTimeout(createBot, 10000);
  });

  bot.on('error', err => {
    console.error('❌ Bot error:', err);
  });
}

// 🔁 Simulate random movement forever
function simulateActivity() {
  const movements = ['jump', 'forward', 'back', 'left', 'right', 'sprint'];
  setInterval(() => {
    const action = movements[Math.floor(Math.random() * movements.length)];
    switch (action) {
      case 'jump':
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
        break;
      case 'forward':
      case 'back':
      case 'left':
      case 'right':
        bot.setControlState(action, true);
        setTimeout(() => bot.setControlState(action, false), 1000);
        break;
      case 'sprint':
        bot.setControlState('sprint', true);
        setTimeout(() => bot.setControlState('sprint', false), 2000);
        break;
    }
  }, 5000);
}

// 💬 Say something every 5 minutes
function chatLoop() {
  setInterval(() => {
    const phrases = [
      "Still here!",
      "Grinding logs...",
      "Nope, not AFK!",
      "Bot online 🚀",
      "I'm keeping this server alive 😎"
    ];
    const msg = phrases[Math.floor(Math.random() * phrases.length)];
    bot.chat(msg);
  }, 300000); // Every 5 minutes
}

createBot();
