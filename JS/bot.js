const mineflayer = require('mineflayer');

let bot;
let reconnectTimeout = null;
let currentActivity = null;
let activityTimeout = null;

// === BOT SETTINGS ===
const config = {
  host: "Gabriela25615-qpMy.aternos.me",
  port: 31387,
  username: "AFK_Bot",
  version: "1.21.7"
};

// === REALISTIC PLAYER BEHAVIORS ===
const activities = [
  'explore',
  'idle',
  'jump_around',
  'sprint_walk',
  'look_around',
  'dig_random',
  'build_simple'
];

const chatMessages = [
  "Anyone online?",
  "Nice day today",
  "Building something cool",
  "Just exploring",
  "Hey everyone!",
  "How's it going?",
  "Love this server",
  "What's everyone up to?",
  "Beautiful landscape here",
  "Anyone want to team up?"
];

function createBot() {
  bot = mineflayer.createBot(config);

  bot.once('spawn', () => {
    console.log("✅ Bot spawned successfully!");
    
    // Start realistic player behavior
    startRealisticBehavior();
    
    // Random chat messages (less frequent, more natural)
    setInterval(() => {
      if (Math.random() < 0.15) { // 15% chance every 3-8 minutes
        const message = chatMessages[Math.floor(Math.random() * chatMessages.length)];
        bot.chat(message);
      }
    }, (Math.random() * 5 + 3) * 60 * 1000); // 3-8 minutes
  });

  // === ERROR HANDLING ===
  bot.on('error', (err) => {
    console.error("❌ Bot error:", err);
    reconnect();
  });

  bot.on('end', () => {
    console.warn("🔁 Bot disconnected — reconnecting in 10 seconds...");
    reconnect();
  });

  // === RESPOND TO CHAT (MORE REALISTIC) ===
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    
    // Random chance to respond to chat
    if (Math.random() < 0.3) {
      setTimeout(() => {
        const responses = [
          "Hey there!",
          "What's up?",
          "Nice!",
          "Cool!",
          "Agreed",
          "Sounds good",
          "I'm just exploring",
          "Same here"
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        bot.chat(response);
      }, Math.random() * 3000 + 1000); // 1-4 second delay
    }
  });
}

function startRealisticBehavior() {
  // Main activity loop - changes activity every 30 seconds to 3 minutes
  function changeActivity() {
    if (!bot || !bot.entity) return;
    
    // Stop current activity
    stopAllMovement();
    
    // Pick new random activity
    currentActivity = activities[Math.floor(Math.random() * activities.length)];
    console.log(`🎯 Starting activity: ${currentActivity}`);
    
    // Execute the activity
    executeActivity(currentActivity);
    
    // Schedule next activity change
    const nextChange = Math.random() * 150000 + 30000; // 30 seconds to 3 minutes
    activityTimeout = setTimeout(changeActivity, nextChange);
  }
  
  // Start the activity cycle
  changeActivity();
  
  // Subtle movements every 10-20 seconds to prevent AFK detection
  setInterval(() => {
    if (!bot || !bot.entity) return;
    
    // Random small movements
    if (Math.random() < 0.7) {
      const smallYaw = (Math.random() - 0.5) * 0.5;
      const smallPitch = (Math.random() - 0.5) * 0.3;
      bot.look(bot.entity.yaw + smallYaw, bot.entity.pitch + smallPitch, true);
    }
    
    // Random mouse movement simulation
    if (Math.random() < 0.3) {
      bot.activateItem(); // Right click
    }
  }, Math.random() * 10000 + 10000); // 10-20 seconds
}

function executeActivity(activity) {
  if (!bot || !bot.entity) return;
  
  switch (activity) {
    case 'explore':
      exploreMovement();
      break;
    case 'idle':
      idleBehavior();
      break;
    case 'jump_around':
      jumpAroundBehavior();
      break;
    case 'sprint_walk':
      sprintWalkBehavior();
      break;
    case 'look_around':
      lookAroundBehavior();
      break;
    case 'dig_random':
      digRandomBehavior();
      break;
    case 'build_simple':
      buildSimpleBehavior();
      break;
  }
}

function exploreMovement() {
  if (!bot || !bot.entity) return;
  
  const duration = Math.random() * 20000 + 10000; // 10-30 seconds
  const interval = setInterval(() => {
    if (!bot || !bot.entity) return;
    
    // Random direction
    const yaw = Math.random() * Math.PI * 2;
    bot.look(yaw, 0, true);
    
    // Walk forward with occasional sprinting
    bot.setControlState('forward', true);
    if (Math.random() < 0.4) {
      bot.setControlState('sprint', true);
    }
    
    // Random jumping while walking
    if (Math.random() < 0.3) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
    }
    
    // Change direction every 2-5 seconds
    setTimeout(() => {
      if (Math.random() < 0.5) {
        bot.setControlState('forward', false);
        bot.setControlState('sprint', false);
      }
    }, Math.random() * 3000 + 2000);
    
  }, Math.random() * 3000 + 2000);
  
  setTimeout(() => {
    clearInterval(interval);
    stopAllMovement();
  }, duration);
}

function idleBehavior() {
  if (!bot || !bot.entity) return;
  
  // Just look around slowly
  const interval = setInterval(() => {
    if (!bot || !bot.entity) return;
    
    const yaw = bot.entity.yaw + (Math.random() - 0.5) * 0.8;
    const pitch = (Math.random() - 0.5) * 0.6;
    bot.look(yaw, pitch, true);
    
    // Occasional small movements
    if (Math.random() < 0.2) {
      bot.setControlState('forward', true);
      setTimeout(() => bot.setControlState('forward', false), 1000);
    }
  }, Math.random() * 3000 + 2000);
  
  setTimeout(() => clearInterval(interval), Math.random() * 15000 + 10000);
}

function jumpAroundBehavior() {
  if (!bot || !bot.entity) return;
  
  const interval = setInterval(() => {
    if (!bot || !bot.entity) return;
    
    // Random direction
    const yaw = Math.random() * Math.PI * 2;
    bot.look(yaw, 0, true);
    
    // Jump and move
    bot.setControlState('jump', true);
    bot.setControlState('forward', true);
    
    setTimeout(() => {
      bot.setControlState('jump', false);
      bot.setControlState('forward', false);
    }, 800);
    
  }, Math.random() * 2000 + 1000);
  
  setTimeout(() => {
    clearInterval(interval);
    stopAllMovement();
  }, Math.random() * 10000 + 5000);
}

function sprintWalkBehavior() {
  if (!bot || !bot.entity) return;
  
  const yaw = Math.random() * Math.PI * 2;
  bot.look(yaw, 0, true);
  
  bot.setControlState('forward', true);
  bot.setControlState('sprint', true);
  
  // Change direction occasionally
  const interval = setInterval(() => {
    if (!bot || !bot.entity) return;
    
    const newYaw = bot.entity.yaw + (Math.random() - 0.5) * 1.5;
    bot.look(newYaw, 0, true);
    
    // Random jump while sprinting
    if (Math.random() < 0.4) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
    }
  }, Math.random() * 3000 + 2000);
  
  setTimeout(() => {
    clearInterval(interval);
    stopAllMovement();
  }, Math.random() * 15000 + 10000);
}

function lookAroundBehavior() {
  if (!bot || !bot.entity) return;
  
  const interval = setInterval(() => {
    if (!bot || !bot.entity) return;
    
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * 1.2;
    bot.look(yaw, pitch, true);
    
    // Occasional inventory opening simulation
    if (Math.random() < 0.1) {
      bot.activateItem();
    }
  }, Math.random() * 2000 + 1000);
  
  setTimeout(() => clearInterval(interval), Math.random() * 8000 + 5000);
}

function digRandomBehavior() {
  if (!bot || !bot.entity) return;
  
  // Look down and simulate digging
  bot.look(bot.entity.yaw, Math.PI / 4, true);
  
  const interval = setInterval(() => {
    if (!bot || !bot.entity) return;
    
    // Simulate digging motion
    bot.activateItem();
    
    // Small movements while "digging"
    if (Math.random() < 0.3) {
      const smallYaw = bot.entity.yaw + (Math.random() - 0.5) * 0.3;
      bot.look(smallYaw, Math.PI / 4, true);
    }
  }, Math.random() * 1000 + 500);
  
  setTimeout(() => {
    clearInterval(interval);
    bot.look(bot.entity.yaw, 0, true); // Look forward again
  }, Math.random() * 8000 + 3000);
}

function buildSimpleBehavior() {
  if (!bot || !bot.entity) return;
  
  const interval = setInterval(() => {
    if (!bot || !bot.entity) return;
    
    // Look around as if placing blocks
    const yaw = bot.entity.yaw + (Math.random() - 0.5) * 1.0;
    const pitch = (Math.random() - 0.3) * 0.8;
    bot.look(yaw, pitch, true);
    
    // Simulate placing blocks
    bot.activateItem();
    
    // Small movements
    if (Math.random() < 0.4) {
      bot.setControlState('forward', true);
      setTimeout(() => bot.setControlState('forward', false), 800);
    }
  }, Math.random() * 1500 + 1000);
  
  setTimeout(() => clearInterval(interval), Math.random() * 12000 + 8000);
}

function stopAllMovement() {
  if (!bot) return;
  
  bot.setControlState('forward', false);
  bot.setControlState('back', false);
  bot.setControlState('left', false);
  bot.setControlState('right', false);
  bot.setControlState('jump', false);
  bot.setControlState('sprint', false);
  bot.setControlState('sneak', false);
}

function reconnect() {
  if (reconnectTimeout) return;
  
  // Clear any existing timeouts
  if (activityTimeout) {
    clearTimeout(activityTimeout);
    activityTimeout = null;
  }
  
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    createBot();
  }, 10 * 1000);
}

createBot();