const mineflayer = require('mineflayer');

let bot;
let reconnectTimeout = null;

// === BOT SETTINGS ===
const config = {
  host: "Gabriela25615-qpMy.aternos.me", // ✅ CHANGE THIS to your Aternos server
  port: 31387,
  username: "AFK_Bot",            // Optional: change bot name
  version: "1.21.7"
};

function createBot() {
  bot = mineflayer.createBot(config);

  bot.once('spawn', () => {
    console.log("✅ Bot spawned successfully!");

    // === Anti-AFK Movement + Chat ===
    setInterval(() => {
      if (!bot || !bot.entity) return;

      const yaw = Math.random() * Math.PI * 2;
      const pitch = Math.random() * 0.5 - 0.25;

      bot.look(yaw, pitch, true);
      bot.setControlState('forward', true);

      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('jump', true);
        setTimeout(() => {
          bot.setControlState('jump', false);
        }, 300);
      }, 1000);

      // Optional: Send chat every 5 mins
      if (Math.random() < 0.3) {
        bot.chat("I'm not AFK!");
      }

    }, 60 * 1000); // Every 60 seconds
  });

  // === Reconnect on error/disconnect ===
  bot.on('error', (err) => {
    console.error("❌ Bot error:", err);
    reconnect();
  });

  bot.on('end', () => {
    console.warn("🔁 Bot disconnected — reconnecting in 10 seconds...");
    reconnect();
  });
}

function reconnect() {
  if (reconnectTimeout) return; // Prevent multiple reconnects
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    createBot();
  }, 10 * 1000); // 10 seconds
}

createBot();
