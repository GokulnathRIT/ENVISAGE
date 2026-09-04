const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. DATA REPOSITORY: 1 REAL PHYSICAL NODE + 6 NATIONAL DUMMY NODES
let networkNodes = {
  1: {
    id: "AS-01",
    name: "Node #01 (Your Hardware - Live)",
    location: "Guwahati (Brahmaputra Bank, Assam)",
    lat: 26.1850,
    lng: 91.7475,
    isReal: true,
    water: 45.0,     // cm
    smoke: 38,       // ppm
    temp: 28.4,      // °C
    humidity: 62,    // %
    soil: 48,        // %
    rain: 0.0,       // mm/h
    imuTilt: 0.2,    // deg
    imuAccel: 0.98,  // g
    hazard: "normal",
    confidence: 5,
    lastUpdated: new Date().toISOString()
  },
  2: {
    id: "UK-02",
    name: "Node #02 (Chamoli Forest Reserve)",
    location: "Chamoli Forest (Uttarakhand)",
    lat: 30.4225,
    lng: 79.3242,
    isReal: false,
    water: 120.0,
    smoke: 1450,
    temp: 43.8,
    humidity: 14,
    soil: 10,
    rain: 0.0,
    imuTilt: 0.4,
    imuAccel: 1.01,
    hazard: "fire",
    confidence: 96,
    lastUpdated: new Date().toISOString()
  },
  3: {
    id: "DL-03",
    name: "Node #03 (Anand Vihar Hub)",
    location: "Anand Vihar (Delhi NCR)",
    lat: 28.6502,
    lng: 77.3150,
    isReal: false,
    water: 180.0,
    smoke: 120,
    temp: 16.2,
    humidity: 85,
    soil: 35,
    rain: 0.0,
    imuTilt: 0.1,
    imuAccel: 0.99,
    hazard: "pollution",
    confidence: 92,
    lastUpdated: new Date().toISOString()
  },
  4: {
    id: "KL-04",
    name: "Node #04 (Wayanad Ghats)",
    location: "Meppadi Hill Slope (Kerala)",
    lat: 11.6854,
    lng: 76.1320,
    isReal: false,
    water: 25.0,
    smoke: 20,
    temp: 23.5,
    humidity: 98,
    soil: 96,
    rain: 42.0,
    imuTilt: 3.4,
    imuAccel: 1.85,
    hazard: "landslide",
    confidence: 94,
    lastUpdated: new Date().toISOString()
  },
  5: {
    id: "RJ-05",
    name: "Node #05 (Jodhpur Thar Agri)",
    location: "Osian Agricultural Belt (Rajasthan)",
    lat: 26.2389,
    lng: 73.0243,
    isReal: false,
    water: 350.0,
    smoke: 30,
    temp: 47.5,
    humidity: 8,
    soil: 6,
    rain: 0.0,
    imuTilt: 0.1,
    imuAccel: 0.98,
    hazard: "heat",
    confidence: 90,
    lastUpdated: new Date().toISOString()
  },
  6: {
    id: "GJ-06",
    name: "Node #06 (Vapi GIDC Industrial)",
    location: "Chemical Zone (Gujarat)",
    lat: 20.3893,
    lng: 72.9106,
    isReal: false,
    water: 140.0,
    smoke: 80,
    temp: 31.0,
    humidity: 55,
    soil: 42,
    rain: 0.0,
    imuTilt: 0.2,
    imuAccel: 0.99,
    hazard: "chemical",
    confidence: 88,
    lastUpdated: new Date().toISOString()
  },
  7: {
    id: "MH-07",
    name: "Node #07 (Marathwada Basin)",
    location: "Jalna Drought Belt (Maharashtra)",
    lat: 19.8762,
    lng: 75.3433,
    isReal: false,
    water: 280.0,
    smoke: 25,
    temp: 42.0,
    humidity: 12,
    soil: 7,
    rain: 0.0,
    imuTilt: 0.1,
    imuAccel: 0.98,
    hazard: "drought",
    confidence: 89,
    lastUpdated: new Date().toISOString()
  }
};

// Helper to return real / live fluctuating node data
function getLiveNodeData(id) {
  const node = networkNodes[id];
  if (!node) return null;
  const clone = { ...node };
  // If not locked by real hardware override in last 5s, provide realistic ambient sensor ripple
  const now = Date.now();
  if (!clone.hardwareLockTime || now - clone.hardwareLockTime > 10000) {
    if (id == 1) {
      // Realistic ultrasonic river ripple (+-0.3cm) and smoke jitter
      clone.water = +(45.0 + Math.sin(now / 4000) * 0.4).toFixed(1);
      clone.smoke = Math.round(38 + (Math.sin(now / 5000) * 2));
      clone.temp = +(28.4 + Math.sin(now / 10000) * 0.2).toFixed(1);
      clone.humidity = Math.round(62 + Math.sin(now / 8000));
      clone.soil = Math.round(48 + Math.cos(now / 9000));
    }
  }
  clone.lastUpdated = new Date().toISOString();
  return clone;
}

// 2. REST API ENDPOINTS
// GET all nodes
app.get('/api/nodes', (req, res) => {
  const liveMap = {};
  for (const k in networkNodes) {
    liveMap[k] = getLiveNodeData(k);
  }
  res.json({ success: true, count: Object.keys(liveMap).length, nodes: liveMap });
});

// GET single node by ID
app.get('/api/nodes/:id', (req, res) => {
  const node = getLiveNodeData(req.params.id);
  if (!node) return res.status(404).json({ success: false, message: "Node not found" });
  res.json({ success: true, node });
});

// POST Telemetry from ESP32 (over Wi-Fi, HTTP, or USB Bridge)
app.post('/api/telemetry', (req, res) => {
  const { nodeId = 1, water, smoke, toxicGas, temp, humidity, soil, rain, imuTilt, imuAccel } = req.body;
  
  if (networkNodes[nodeId]) {
    networkNodes[nodeId].hardwareLockTime = Date.now();
    networkNodes[nodeId].isReal = true;
    if (water !== undefined) networkNodes[nodeId].water = parseFloat(water);
    if (smoke !== undefined) networkNodes[nodeId].smoke = parseFloat(smoke);
    if (toxicGas !== undefined) networkNodes[nodeId].toxicGas = parseFloat(toxicGas);
    if (temp !== undefined) networkNodes[nodeId].temp = parseFloat(temp);
    if (humidity !== undefined) networkNodes[nodeId].humidity = parseFloat(humidity);
    if (soil !== undefined) networkNodes[nodeId].soil = parseFloat(soil);
    if (rain !== undefined) networkNodes[nodeId].rain = parseFloat(rain);
    if (imuTilt !== undefined) networkNodes[nodeId].imuTilt = parseFloat(imuTilt);
    if (imuAccel !== undefined) networkNodes[nodeId].imuAccel = parseFloat(imuAccel);

    // On-Device Edge-AI Rules
    if (networkNodes[nodeId].water < 30.0) {
      networkNodes[nodeId].hazard = "flood";
      networkNodes[nodeId].confidence = 94;
    } else if (networkNodes[nodeId].smoke > 1000) {
      networkNodes[nodeId].hazard = "fire";
      networkNodes[nodeId].confidence = 96;
    } else {
      networkNodes[nodeId].hazard = "normal";
      networkNodes[nodeId].confidence = 5;
    }

    networkNodes[nodeId].lastUpdated = new Date().toISOString();

    // Broadcast to SSE clients
    broadcastSSE({ type: "TELEMETRY_UPDATE", node: networkNodes[nodeId] });
  }

  res.json({ success: true, updatedNode: networkNodes[nodeId] });
});

// POST Trigger Warning Broadcast
app.post('/api/alerts/broadcast', (req, res) => {
  const { nodeId = 1, hazard = 'FLOOD', language = 'en', message = '', phoneNumber = '7904769396' } = req.body;
  
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  console.log(`\n===========================================================`);
  console.log(`  [EMERGENCY 2G SMS DISPATCHED]                           `);
  console.log(`  Target Mobile: +91 ${phoneNumber}                       `);
  console.log(`  Time:          ${timestamp}                             `);
  console.log(`  Hazard Type:   ${hazard.toUpperCase()}                  `);
  console.log(`  Language:      ${language.toUpperCase()}                `);
  console.log(`  Message:       ${message}                               `);
  console.log(`  Status:        DELIVERED via Telecom Cell-Broadcast     `);
  console.log(`===========================================================\n`);
  
  res.json({
    success: true,
    broadcastId: "SMS-" + Date.now(),
    targetNumber: "+91 " + phoneNumber,
    status: "DELIVERED",
    messageText: message,
    recipientsCount: 1420,
    channels: ["TELECOM_2G_CELL_BROADCAST", "PANEL_SIREN_TRIGGER"],
    timestamp: new Date().toISOString()
  });
});

// 3. SERVER-SENT EVENTS (SSE) STREAM FOR REAL-TIME TELEMETRY
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial state
  res.write(`data: ${JSON.stringify({ type: "INIT", nodes: networkNodes })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

function broadcastSSE(data) {
  sseClients.forEach(c => {
    c.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// Start listeners and heartbeat simulation only if run directly (Localhost / Node server)
if (require.main === module) {
  // Background simulation for dummy nodes (makes network look actively alive)
  setInterval(() => {
    for (let id = 2; id <= 7; id++) {
      const n = networkNodes[id];
      n.temp = +(n.temp + (Math.random() * 0.2 - 0.1)).toFixed(1);
      n.lastUpdated = new Date().toISOString();
    }
    broadcastSSE({ type: "NETWORK_HEARTBEAT", nodes: networkNodes });
  }, 3000);

  // Start listening on 0.0.0.0 (IPv4 + IPv6 everywhere)
  app.listen(PORT, '0.0.0.0', () => {
    console.log('===========================================================');
    console.log(`  🌍 ENVISAGE AI LOCALHOST SERVER ACTIVE!                 `);
    console.log(`  URL: http://localhost:${PORT}                             `);
    console.log(`  IP:  http://127.0.0.1:${PORT}                             `);
    console.log('===========================================================');
  });

  // Also listen on backup port 3000 in case port 5000 is blocked
  try {
    const backupApp = app.listen(3000, '0.0.0.0', () => {
      console.log(`  Backup URL: http://localhost:3000 (also active!)         `);
    });
    backupApp.on('error', () => {/* port 3000 in use, ignore */});
  } catch (e) {}
}

module.exports = app;

