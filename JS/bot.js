const mineflayer = require('mineflayer');
const express = require('express');

// === WEB SERVER FOR RENDER ===
const app = express();
const PORT = process.env.PORT || 3000;

let bot;
let reconnectTimeout = null;
let currentActivity = 'Starting...';
let activityTimeout = null;
let connectionAttempts = 0;
let lastConnectTime = Date.now();
let isReconnecting = false;

app.get('/', (req, res) => {
  res.send(`
    <h1>🤖 Minecraft AFK Bot Status</h1>
    <p><strong>Bot Status:</strong> ${bot && bot.entity ? 'Online & Spawned' : 'Offline'}</p>
    <p><strong>Server:</strong> ${config.host}:${config.port}</p>
    <p><strong>Username:</strong> ${config.username}</p>
    <p><strong>Current Activity:</strong> ${currentActivity}</p>
    <p><strong>Connection Attempts:</strong> ${connectionAttempts}</p>
    <p><strong>Uptime:</strong> ${Math.floor(process.uptime())} seconds</p>
    <p><strong>Last Connect:</strong> ${new Date(lastConnectTime).toLocaleTimeString()}</p>
  `);
});

app.get('/status', (req, res) => {
  res.json({
    botOnline: bot && bot.entity ? true : false,
    server: `${config.host}:${config.port}`,
    username: config.username,
    currentActivity: currentActivity,
    connectionAttempts: connectionAttempts,
    uptime: Math.floor(process.uptime()),
    lastConnectTime: lastConnectTime
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// === IMPROVED BOT SETTINGS ===
const config = {
  host: "Gabriela25615-qpMy.aternos.me",
  port: 31387,
  username: "AFK_Bot",
  version: "1.21.7",
  // Add connection stability options
  hideErrors: false,
  keepAlive: true,
  checkTimeoutInterval: 30000, // 30 seconds
  auth: 'offline' // For cracked servers
};

// === REALISTIC BEHAVIORS (LESS INTENSIVE) ===
const activities = [
  'explore_slow',
  'idle_long',
  'look_around',
  'small_movements',
  'pause'
];

const chatMessages = [
  "hey",
  "anyone online?",
  "nice server",
  "hello",
  "how's everyone doing?",
  "good to be here",
  "love this place"
];

let movementInterval = null;
let lookInterval = null;
let chatInterval = null;

function createBot() {
  if (isReconnecting) return;
  
  connectionAttempts++;
  isReconnecting = true;
  
  console.log(`🔄 Connection attempt #${connectionAttempts}`);
  
  try {
    bot = mineflayer.createBot(config);
    
    // === CONNECTION EVENTS ===
    bot.on('login', () => {
      console.log('📝 Logged in successfully');
      lastConnectTime = Date.now();
    });
    
    bot.once('spawn', () => {
      console.log("✅ Bot spawned successfully!");
      isReconnecting = false;
      
      // Wait longer before starting activities to avoid immediate kicks
      setTimeout(() => {
        if (bot && bot.entity) {
          console.log("🎮 Starting improved behaviors...");
          startImprovedBehavior();
        }
      }, 10000); // Wait 10 seconds instead of 3
    });
    
    // === BETTER ERROR HANDLING ===
    bot.on('error', (err) => {
      console.error(`❌ Bot error: ${err.message}`);
      
      // Don't spam reconnects for certain errors
      if (err.message.includes('EPIPE') || err.message.includes('ECONNRESET')) {
        console.log('🔌 Connection lost, will reconnect...');
      }
      
      cleanupAndReconnect();
    });
    
    bot.on('end', (reason) => {
      console.warn(`🔁 Bot disconnected (${reason || 'unknown'}) — reconnecting...`);
      cleanupAndReconnect();
    });
    
    bot.on('kicked', (reason) => {
      let kickReason = 'Unknown';
      if (typeof reason === 'string') {
        kickReason = reason;
      } else if (reason && reason.text) {
        kickReason = reason.text;
      } else if (reason && reason.toString) {
        kickReason = reason.toString();
      }
      console.warn(`⚠️ Bot was kicked: ${kickReason}`);
      cleanupAndReconnect();
    });
    
    // === HEALTH CHECK ===
    bot.on('health', () => {
      if (bot.health <= 0) {
        console.log('💀 Bot died, respawning...');
        setTimeout(() => bot.respawn(), 2000);
      }
    });
    
    // === SIMPLE CHAT RESPONSES ===
    bot.on('chat', (username, message) => {
      if (username === bot.username) return;
      
      // Less frequent responses to avoid spam
      if (Math.random() < 0.2) {
        setTimeout(() => {
          const responses = ["hey", "hi", "hello", "sup", "nice", "cool"];
          const response = responses[Math.floor(Math.random() * responses.length)];
          safeChat(response);
        }, Math.random() * 4000 + 2000); // 2-6 second delay
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to create bot:', error);
    cleanupAndReconnect();
  }
}

function startImprovedBehavior() {
  if (!bot || !bot.entity) return;
  
  console.log('🎮 Starting improved behaviors...');
  
  // Main activity loop - less frequent changes
  function changeActivity() {
    if (!bot || !bot.entity) return;
    
    stopAllMovement();
    
    // Start with safer activities
    const safeActivities = ['idle_long', 'look_around', 'pause'];
    currentActivity = safeActivities[Math.floor(Math.random() * safeActivities.length)];
    console.log(`🎯 Activity: ${currentActivity}`);
    
    executeImprovedActivity(currentActivity);
    
    // Change activity every 2-5 minutes (longer intervals)
    activityTimeout = setTimeout(changeActivity, Math.random() * 180000 + 120000);
  }
  
  // Anti-AFK movements (very subtle and delayed)
  setTimeout(() => {
    if (!bot || !bot.entity) return;
    
    movementInterval = setInterval(() => {
      if (!bot || !bot.entity) return;
      
      // Tiny mouse movements
      if (Math.random() < 0.6) { // Reduced frequency
        const currentYaw = bot.entity.yaw;
        const currentPitch = bot.entity.pitch;
        const smallYaw = currentYaw + (Math.random() - 0.5) * 0.1; // Even smaller movements
        const smallPitch = currentPitch + (Math.random() - 0.5) * 0.05;
        
        try {
          bot.look(smallYaw, smallPitch, true);
        } catch (e) {
          // Ignore look errors
        }
      }
    }, Math.random() * 20000 + 20000); // 20-40 seconds instead of 15-30
  }, 30000); // Wait 30 seconds before starting movements
  
  // Occasional chat (very rare and delayed)
  setTimeout(() => {
    if (!bot || !bot.entity) return;
    
    chatInterval = setInterval(() => {
      if (!bot || !bot.entity) return;
      
      if (Math.random() < 0.05) { // 5% chance instead of 10%
        const message = chatMessages[Math.floor(Math.random() * chatMessages.length)];
        safeChat(message);
      }
    }, Math.random() * 600000 + 600000); // 10-20 minutes instead of 5-10
  }, 60000); // Wait 1 minute before starting chat
  
  changeActivity();
}

function executeImprovedActivity(activity) {
  if (!bot || !bot.entity) return;
  
  switch (activity) {
    case 'explore_slow':
      exploreSlowly();
      break;
    case 'idle_long':
      idleLonger();
      break;
    case 'look_around':
      lookAroundSlowly();
      break;
    case 'small_movements':
      smallMovements();
      break;
    case 'pause':
      pauseActivity();
      break;
  }
}

function exploreSlowly() {
  if (!bot || !bot.entity) return;
  
  let moveCount = 0;
  const maxMoves = Math.floor(Math.random() * 5) + 3; // 3-8 moves
  
  const interval = setInterval(() => {
    if (!bot || !bot.entity || moveCount >= maxMoves) {
      clearInterval(interval);
      stopAllMovement();
      return;
    }
    
    // Random direction
    const yaw = Math.random() * Math.PI * 2;
    try {
      bot.look(yaw, 0, true);
      
      // Walk forward for 2-4 seconds
      bot.setControlState('forward', true);
      
      setTimeout(() => {
        if (bot) {
          bot.setControlState('forward', false);
          // Small pause between moves
          setTimeout(() => {
            moveCount++;
          }, Math.random() * 2000 + 1000);
        }
      }, Math.random() * 2000 + 2000);
      
    } catch (e) {
      clearInterval(interval);
      stopAllMovement();
    }
  }, Math.random() * 4000 + 3000);
}

function idleLonger() {
  // Just look around very slowly
  let lookCount = 0;
  const maxLooks = Math.floor(Math.random() * 3) + 2;
  
  const interval = setInterval(() => {
    if (!bot || !bot.entity || lookCount >= maxLooks) {
      clearInterval(interval);
      return;
    }
    
    try {
      const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.5;
      const pitch = (Math.random() - 0.5) * 0.3;
      bot.look(yaw, pitch, true);
      lookCount++;
    } catch (e) {
      clearInterval(interval);
    }
  }, Math.random() * 5000 + 3000);
}

function lookAroundSlowly() {
  if (!bot || !bot.entity) return;
  
  let lookCount = 0;
  const maxLooks = Math.floor(Math.random() * 4) + 2;
  
  const interval = setInterval(() => {
    if (!bot || !bot.entity || lookCount >= maxLooks) {
      clearInterval(interval);
      return;
    }
    
    try {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * 0.8;
      bot.look(yaw, pitch, true);
      lookCount++;
    } catch (e) {
      clearInterval(interval);
    }
  }, Math.random() * 3000 + 2000);
}

function smallMovements() {
  if (!bot || !bot.entity) return;
  
  // Just a few small steps
  let stepCount = 0;
  const maxSteps = Math.floor(Math.random() * 3) + 1;
  
  const interval = setInterval(() => {
    if (!bot || !bot.entity || stepCount >= maxSteps) {
      clearInterval(interval);
      stopAllMovement();
      return;
    }
    
    try {
      bot.setControlState('forward', true);
      setTimeout(() => {
        if (bot) {
          bot.setControlState('forward', false);
          stepCount++;
        }
      }, Math.random() * 1000 + 500);
    } catch (e) {
      clearInterval(interval);
      stopAllMovement();
    }
  }, Math.random() * 2000 + 1500);
}

function pauseActivity() {
  // Do nothing for a while - sometimes players just stand still
  currentActivity = 'paused';
  setTimeout(() => {
    currentActivity = 'idle';
  }, Math.random() * 30000 + 20000);
}

function safeChat(message) {
  if (!bot || !bot.entity) return;
  
  try {
    bot.chat(message);
  } catch (e) {
    console.log('Chat failed:', e.message);
  }
}

function stopAllMovement() {
  if (!bot) return;
  
  try {
    bot.setControlState('forward', false);
    bot.setControlState('back', false);
    bot.setControlState('left', false);
    bot.setControlState('right', false);
    bot.setControlState('jump', false);
    bot.setControlState('sprint', false);
    bot.setControlState('sneak', false);
  } catch (e) {
    // Ignore movement errors
  }
}

function cleanupAndReconnect() {
  if (reconnectTimeout) return; // Already reconnecting
  
  isReconnecting = true;
  currentActivity = 'Reconnecting...';
  
  // Clear all intervals
  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }
  if (lookInterval) {
    clearInterval(lookInterval);
    lookInterval = null;
  }
  if (chatInterval) {
    clearInterval(chatInterval);
    chatInterval = null;
  }
  if (activityTimeout) {
    clearTimeout(activityTimeout);
    activityTimeout = null;
  }
  
  // Stop all movement
  stopAllMovement();
  
  // Reconnect with exponential backoff
  const delay = Math.min(connectionAttempts * 2000, 30000) + Math.random() * 5000;
  console.log(`⏳ Reconnecting in ${Math.floor(delay/1000)} seconds...`);
  
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    createBot();
  }, delay);
}

// Start the bot
createBot();