const mineflayer = require('mineflayer');

console.log('Starting...');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'Gabriela25615-qpMy.aternos.me',
    port: 31387,
    username: '24ATERNOSBOT',
    version: false
  });

  bot.on('login', () => {
    console.log('Bot logged in');
    keepMoving();
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 30 seconds...');
    setTimeout(createBot, 30000);
  });

  bot.on('error', err => {
    console.error('Error:', err);
  });

  function keepMoving() {
    if (!bot.entity) return;

    // Move forward, jump randomly, sprint randomly
    setInterval(() => {
      if (!bot.entity) return;
      bot.setControlState('forward', true);
      bot.setControlState('jump', Math.random() > 0.7);
      bot.setControlState('sprint', Math.random() > 0.5);
    }, 3000);
  }
}

createBot();
