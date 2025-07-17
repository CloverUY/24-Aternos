const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'yourserver.aternos.me', // <== Replace with your Aternos IP
    port: 25565,
    username: 'Clown',             // <== Any name not already in use
    version: false,                // auto-detect server version
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('[✅] Bot spawned.');
    const mcData = require('minecraft-data')(bot.version);
    const movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements);

    startMovementLoop();
    startJumpLoop();
    startChatLoop();
    antiAfkTick();
  });

  bot.on('end', () => {
    console.log('[⚠️] Bot was kicked. Reconnecting in 5s...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => {
    console.log('[❌] Error:', err.message);
  });
}

// === Move around randomly ===
function startMovementLoop() {
  const directions = [
    new Vec3(1, 0, 0),
    new Vec3(-1, 0, 0),
    new Vec3(0, 0, 1),
    new Vec3(0, 0, -1),
  ];

  setInterval(() => {
    if (!bot.entity) return;
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const pos = bot.entity.position.offset(dir.x * 4, 0, dir.z * 4);
    bot.pathfinder.setGoal(new goals.GoalBlock(pos.x, pos.y, pos.z));
  }, 8000 + Math.random() * 4000);
}

// === Random jumping every few seconds ===
function startJumpLoop() {
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 6000 + Math.random() * 4000);
}

// === Periodic random messages ===
function startChatLoop() {
  const messages = [
    'I love Minecraft!',
    'Still here 😎',
    'Who wants to trade?',
    'Farming some blocks...',
    'Haha!',
  ];

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
  }, 4 * 60 * 1000); // Every 4 minutes
}

// === Raw packet spam (anti-kick failsafe) ===
function antiAfkTick() {
  setInterval(() => {
    if (!bot._client || !bot.entity) return;

    const pos = bot.entity.position;
    bot._client.write('position', {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      yaw: bot.entity.yaw,
      pitch: bot.entity.pitch,
      onGround: true,
    });
  }, 15000); // Send every 15s
}

createBot();
