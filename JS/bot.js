const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'Gabriela25615-qpMy.aternos.me', // replace with your server
  port: 31387,
  username: '24ATERNOSBOT', // use a unique name
});

function randomMovement() {
  const actions = ['forward', 'back', 'left', 'right'];
  const action = actions[Math.floor(Math.random() * actions.length)];

  bot.setControlState('jump', true);
  bot.setControlState('sprint', true);
  bot.setControlState(action, true);

  setTimeout(() => {
    bot.setControlState('jump', false);
    bot.setControlState('sprint', false);
    bot.setControlState(action, false);
  }, 3000); // move for 3 seconds
}

function randomLook() {
  const yaw = Math.random() * Math.PI * 2;
  const pitch = Math.random() * 0.5 - 0.25;
  bot.look(yaw, pitch, true);
}

// Loop actions
function startBehaviorLoop() {
  setInterval(() => {
    randomMovement();
    randomLook();
  }, 10000); // move every 10 seconds

  setInterval(() => {
    bot.chat('I am not AFK!');
  }, 5 * 60 * 1000); // chat every 5 minutes
}

bot.on('spawn', () => {
  console.log('Bot spawned!');
  startBehaviorLoop();
});

bot.on('end', () => {
  console.log('Bot disconnected. Reconnecting in 30s...');
  setTimeout(() => process.exit(1), 30000);
});

bot.on('error', err => {
  console.error('Bot error:', err);
});
