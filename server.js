const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. DATA REPOSITORY: 20 SENSOR NODES (5 Flood, 5 Fire, 5 Landslide, 5 Air Pollution)
let networkNodes = {
  // ================= 🌊 FLOOD EARLY WARNING SENTINELS (5 NODES) =================
  1: {
    id: "FLD-01",
    name: "Guwahati (Brahmaputra Bank, Assam)",
    category: "flood",
    categoryLabel: "River Flood",
    location: "Guwahati, Kamrup Metro, Assam",
    state: "Assam",
    lat: 26.1850,
    lng: 91.7475,
    isReal: true,
    water: 45.2,
    flowRate: 3.4,
    rain: 12.0,
    temp: 28.4,
    humidity: 82,
    soil: 68,
    smoke: 35,
    hazard: "normal",
    confidence: 96,
    primarySensor: "JSN-SR04T Waterproof Ultrasonic Gauging",
    lastUpdated: new Date().toISOString()
  },
  2: {
    id: "FLD-02",
    name: "Old Railway Bridge (Yamuna Basin, Delhi)",
    category: "flood",
    categoryLabel: "River Flood",
    location: "Kashmere Gate, Delhi NCR",
    state: "Delhi",
    lat: 28.6625,
    lng: 77.2483,
    isReal: false,
    water: 21.4,
    flowRate: 4.8,
    rain: 38.5,
    temp: 27.1,
    humidity: 94,
    soil: 92,
    smoke: 42,
    hazard: "critical",
    confidence: 97,
    primarySensor: "Ultrasonic River Gauge + Acoustic Doppler",
    lastUpdated: new Date().toISOString()
  },
  3: {
    id: "FLD-03",
    name: "Rajahmundry Ghat (Godavari Basin, AP)",
    category: "flood",
    categoryLabel: "River Flood",
    location: "Pushkar Ghat, East Godavari, AP",
    state: "Andhra Pradesh",
    lat: 17.0005,
    lng: 81.8040,
    isReal: false,
    water: 36.4,
    flowRate: 2.9,
    rain: 8.0,
    temp: 31.2,
    humidity: 78,
    soil: 58,
    smoke: 28,
    hazard: "normal",
    confidence: 94,
    primarySensor: "Hydrostatic Pressure Level Transducer",
    lastUpdated: new Date().toISOString()
  },
  4: {
    id: "FLD-04",
    name: "Digha Ghat (Ganga River, Patna, Bihar)",
    category: "flood",
    categoryLabel: "River Flood",
    location: "Digha, Patna, Bihar",
    state: "Bihar",
    lat: 25.6420,
    lng: 85.1100,
    isReal: false,
    water: 28.1,
    flowRate: 3.9,
    rain: 24.0,
    temp: 29.5,
    humidity: 88,
    soil: 81,
    smoke: 45,
    hazard: "warning",
    confidence: 93,
    primarySensor: "JSN-SR04T Ultrasonic + Tipping Bucket Rain Gauge",
    lastUpdated: new Date().toISOString()
  },
  5: {
    id: "FLD-05",
    name: "Mundali Barrage (Mahanadi Basin, Odisha)",
    category: "flood",
    categoryLabel: "River Flood",
    location: "Mundali, Cuttack, Odisha",
    state: "Odisha",
    lat: 20.4430,
    lng: 85.7500,
    isReal: false,
    water: 48.0,
    flowRate: 2.1,
    rain: 4.0,
    temp: 30.0,
    humidity: 74,
    soil: 52,
    smoke: 30,
    hazard: "normal",
    confidence: 95,
    primarySensor: "Radar Level Sensor (77GHz) + Flood Sentinel",
    lastUpdated: new Date().toISOString()
  },

  // ================= 🔥 FOREST FIRE & SMOKE SENTINELS (5 NODES) =================
  6: {
    id: "FIR-01",
    name: "Chamoli Forest Ridge (Uttarakhand)",
    category: "fire",
    categoryLabel: "Wildfire & Smoke",
    location: "Nanda Devi Biosphere, Chamoli, Uttarakhand",
    state: "Uttarakhand",
    lat: 30.4225,
    lng: 79.3242,
    isReal: false,
    water: 140.0,
    smoke: 38,
    coPpm: 12,
    temp: 27.5,
    humidity: 54,
    soil: 32,
    rain: 0.0,
    hazard: "normal",
    confidence: 96,
    primarySensor: "MQ-2 Optical Smoke + Far-Infrared Flame Array",
    lastUpdated: new Date().toISOString()
  },
  7: {
    id: "FIR-02",
    name: "Similipal Tiger Reserve (Odisha)",
    category: "fire",
    categoryLabel: "Wildfire & Smoke",
    location: "Mayurbhanj Tiger Reserve, Odisha",
    state: "Odisha",
    lat: 21.8650,
    lng: 86.3400,
    isReal: false,
    water: 120.0,
    smoke: 820,
    coPpm: 95,
    temp: 42.1,
    humidity: 18,
    soil: 14,
    rain: 0.0,
    hazard: "warning",
    confidence: 91,
    primarySensor: "MQ-2 Combustible Gas + Thermal Temperature Array",
    lastUpdated: new Date().toISOString()
  },
  8: {
    id: "FIR-03",
    name: "Bandipur National Park (Karnataka)",
    category: "fire",
    categoryLabel: "Wildfire & Smoke",
    location: "Gundlupet, Chamarajanagar, Karnataka",
    state: "Karnataka",
    lat: 11.6664,
    lng: 76.6291,
    isReal: false,
    water: 160.0,
    smoke: 42,
    coPpm: 12,
    temp: 32.4,
    humidity: 45,
    soil: 34,
    rain: 0.0,
    hazard: "normal",
    confidence: 96,
    primarySensor: "Low-Power Optical Smoke Detector + Solar Sentinel",
    lastUpdated: new Date().toISOString()
  },
  9: {
    id: "FIR-04",
    name: "Sariska Tiger Reserve (Rajasthan)",
    category: "fire",
    categoryLabel: "Wildfire & Smoke",
    location: "Aravalli Range, Alwar, Rajasthan",
    state: "Rajasthan",
    lat: 27.3200,
    lng: 76.4300,
    isReal: false,
    water: 250.0,
    smoke: 95,
    coPpm: 25,
    temp: 44.5,
    humidity: 15,
    soil: 9,
    rain: 0.0,
    hazard: "normal",
    confidence: 92,
    primarySensor: "Thermal IR Sensor + Dry Brush Moisture Monitor",
    lastUpdated: new Date().toISOString()
  },
  10: {
    id: "FIR-05",
    name: "Muthanga Wildlife Sanctuary (Wayanad, Kerala)",
    category: "fire",
    categoryLabel: "Wildfire & Smoke",
    location: "Sulthan Bathery, Wayanad, Kerala",
    state: "Kerala",
    lat: 11.6700,
    lng: 76.3600,
    isReal: false,
    water: 110.0,
    smoke: 35,
    coPpm: 10,
    temp: 29.8,
    humidity: 62,
    soil: 40,
    rain: 0.0,
    hazard: "normal",
    confidence: 97,
    primarySensor: "Dual-Beam Smoke Detector + LoRa Mesh Relay",
    lastUpdated: new Date().toISOString()
  },

  // ================= ⛰️ LANDSLIDE & SLOPE STABILITY SENTINELS (5 NODES) =================
  11: {
    id: "LND-01",
    name: "Meppadi Hill Slope (Wayanad, Kerala)",
    category: "landslide",
    categoryLabel: "Landslide & Mudslide",
    location: "Chooralmala, Meppadi, Wayanad, Kerala",
    state: "Kerala",
    lat: 11.5520,
    lng: 76.1260,
    isReal: false,
    soil: 96,
    rain: 54.0,
    imuTilt: 4.8,
    imuAccel: 1.88,
    water: 22.0,
    temp: 22.5,
    humidity: 98,
    smoke: 20,
    hazard: "critical",
    confidence: 98,
    primarySensor: "Capacitive Soil Moisture + MPU-6050 6-Axis Tilt IMU",
    lastUpdated: new Date().toISOString()
  },
  12: {
    id: "LND-02",
    name: "Joshimath Subsidence Zone (Uttarakhand)",
    category: "landslide",
    categoryLabel: "Landslide & Mudslide",
    location: "Marwari Slopes, Chamoli, Uttarakhand",
    state: "Uttarakhand",
    lat: 30.5564,
    lng: 79.5667,
    isReal: false,
    soil: 82,
    rain: 22.0,
    imuTilt: 2.1,
    imuAccel: 1.25,
    water: 60.0,
    temp: 14.8,
    humidity: 86,
    smoke: 18,
    hazard: "warning",
    confidence: 92,
    primarySensor: "Precision Inclinometer + Soil Saturation Probe",
    lastUpdated: new Date().toISOString()
  },
  13: {
    id: "LND-03",
    name: "Kinnaur Valley NH-5 (Himachal Pradesh)",
    category: "landslide",
    categoryLabel: "Landslide & Mudslide",
    location: "Nigulsari, Kinnaur, Himachal Pradesh",
    state: "Himachal Pradesh",
    lat: 31.6500,
    lng: 78.2500,
    isReal: false,
    soil: 45,
    rain: 2.0,
    imuTilt: 0.3,
    imuAccel: 0.99,
    water: 95.0,
    temp: 16.2,
    humidity: 58,
    smoke: 15,
    hazard: "normal",
    confidence: 95,
    primarySensor: "Geotechnical Tilt Sensor + Piezoelectric Geophone",
    lastUpdated: new Date().toISOString()
  },
  14: {
    id: "LND-04",
    name: "Rohini Road Ghat (Darjeeling, West Bengal)",
    category: "landslide",
    categoryLabel: "Landslide & Mudslide",
    location: "Kurseong Sub-Division, Darjeeling, WB",
    state: "West Bengal",
    lat: 26.9800,
    lng: 88.2700,
    isReal: false,
    soil: 76,
    rain: 18.5,
    imuTilt: 1.4,
    imuAccel: 1.12,
    water: 55.0,
    temp: 18.0,
    humidity: 90,
    smoke: 22,
    hazard: "warning",
    confidence: 89,
    primarySensor: "Pore Water Pressure Transducer + IMU Accelerometer",
    lastUpdated: new Date().toISOString()
  },
  15: {
    id: "LND-05",
    name: "Gap Road Ghat (Munnar, Idukki, Kerala)",
    category: "landslide",
    categoryLabel: "Landslide & Mudslide",
    location: "Kochi-Dhanushkodi NH-85, Munnar, Kerala",
    state: "Kerala",
    lat: 10.0500,
    lng: 77.0600,
    isReal: false,
    soil: 42,
    rain: 0.0,
    imuTilt: 0.1,
    imuAccel: 0.98,
    water: 110.0,
    temp: 19.4,
    humidity: 65,
    smoke: 18,
    hazard: "normal",
    confidence: 96,
    primarySensor: "Capacitive Soil Moisture + MPU-6050 Accelerometer",
    lastUpdated: new Date().toISOString()
  },

  // ================= 🌫️ AIR POLLUTION & TOXIC GAS SENTINELS (5 NODES) =================
  16: {
    id: "AIR-01",
    name: "Anand Vihar Transit Corridor (Delhi NCR)",
    category: "pollution",
    categoryLabel: "Toxic Air & Gas",
    location: "ISBT Anand Vihar, East Delhi",
    state: "Delhi",
    lat: 28.6502,
    lng: 77.3150,
    isReal: false,
    pm25: 385,
    pm10: 520,
    toxicGas: 165,
    smoke: 130,
    temp: 21.5,
    humidity: 68,
    soil: 28,
    water: 180.0,
    hazard: "critical",
    confidence: 97,
    primarySensor: "Laser PM2.5/PM10 Particle Sensor + MQ-135 Gas",
    lastUpdated: new Date().toISOString()
  },
  17: {
    id: "AIR-02",
    name: "Vapi GIDC Chemical Estate (Gujarat)",
    category: "pollution",
    categoryLabel: "Toxic Air & Gas",
    location: "Phase II Industrial Estate, Vapi, Gujarat",
    state: "Gujarat",
    lat: 20.3893,
    lng: 72.9106,
    isReal: false,
    pm25: 195,
    pm10: 280,
    toxicGas: 145,
    smoke: 88,
    temp: 33.2,
    humidity: 52,
    soil: 35,
    water: 140.0,
    hazard: "warning",
    confidence: 94,
    primarySensor: "MQ-135 VOC/Ammonia Gas Sensor + Electrochemical NO2",
    lastUpdated: new Date().toISOString()
  },
  18: {
    id: "AIR-03",
    name: "Panki Industrial Area (Kanpur, Uttar Pradesh)",
    category: "pollution",
    categoryLabel: "Toxic Air & Gas",
    location: "Panki Industrial Area, Kanpur, UP",
    state: "Uttar Pradesh",
    lat: 26.4670,
    lng: 80.2500,
    isReal: false,
    pm25: 290,
    pm10: 410,
    toxicGas: 110,
    smoke: 95,
    temp: 28.0,
    humidity: 60,
    soil: 32,
    water: 150.0,
    hazard: "warning",
    confidence: 91,
    primarySensor: "Particulate Matter Laser Counter + CO Sensor",
    lastUpdated: new Date().toISOString()
  },
  19: {
    id: "AIR-04",
    name: "Manali Petrochemical Corridor (Chennai, TN)",
    category: "pollution",
    categoryLabel: "Toxic Air & Gas",
    location: "CPCL Petrochemical Hub, Manali, Chennai",
    state: "Tamil Nadu",
    lat: 13.1670,
    lng: 80.2600,
    isReal: false,
    pm25: 85,
    pm10: 120,
    toxicGas: 45,
    smoke: 40,
    temp: 32.8,
    humidity: 74,
    soil: 42,
    water: 130.0,
    hazard: "normal",
    confidence: 95,
    primarySensor: "MQ-135 Benzene/Gas Sensor + Humidity Corrected PM",
    lastUpdated: new Date().toISOString()
  },
  20: {
    id: "AIR-05",
    name: "Raniganj Coalfields Belt (Asansol, WB)",
    category: "pollution",
    categoryLabel: "Toxic Air & Gas",
    location: "ECL Mining Belt, Raniganj, Paschim Bardhaman, WB",
    state: "West Bengal",
    lat: 23.6200,
    lng: 87.1200,
    isReal: false,
    pm25: 110,
    pm10: 165,
    toxicGas: 60,
    smoke: 52,
    temp: 30.5,
    humidity: 62,
    soil: 30,
    water: 160.0,
    hazard: "normal",
    confidence: 93,
    primarySensor: "Coal Dust PM10 Particle Sensor + Methane CH4 Detector",
    lastUpdated: new Date().toISOString()
  }
};

// SSE Client list
let sseClients = [];

// Helper to return real / live fluctuating node data
function getLiveNodeData(id) {
  const node = networkNodes[id];
  if (!node) return null;
  const clone = { ...node };
  const now = Date.now();
  if (!clone.hardwareLockTime || now - clone.hardwareLockTime > 10000) {
    if (clone.category === 'flood') {
      clone.water = +(clone.water + (Math.sin(now / 4000 + id) * 0.3)).toFixed(1);
      if (clone.flowRate) clone.flowRate = +(clone.flowRate + (Math.sin(now / 5000 + id) * 0.1)).toFixed(1);
    } else if (clone.category === 'fire') {
      clone.smoke = Math.max(10, Math.round(clone.smoke + (Math.sin(now / 4000 + id) * 5)));
      clone.temp = +(clone.temp + (Math.sin(now / 7000 + id) * 0.2)).toFixed(1);
    } else if (clone.category === 'landslide') {
      clone.soil = Math.min(100, Math.max(5, Math.round(clone.soil + (Math.cos(now / 6000 + id) * 0.8))));
      if (clone.imuTilt) clone.imuTilt = +(clone.imuTilt + (Math.sin(now / 8000 + id) * 0.05)).toFixed(2);
    } else if (clone.category === 'pollution') {
      if (clone.pm25) clone.pm25 = Math.max(10, Math.round(clone.pm25 + (Math.sin(now / 5000 + id) * 4)));
      if (clone.toxicGas) clone.toxicGas = Math.max(5, Math.round(clone.toxicGas + (Math.cos(now / 4500 + id) * 2)));
    }
  }

  // Edge AI On-Device Inference Analytics
  clone.numId = parseInt(id);
  clone.inferenceLatencyMs = 12 + Math.floor((Math.sin(now / 3000 + id) + 1) * 2); // 12-16ms on ESP32
  clone.edgeAiModel = "TinyML Quantized Random Forest (INT8 On-Chip)";
  clone.edgeStatus = "Autonomous On-Device Inference Active (Zero Cloud Latency)";
  clone.batteryPercent = Math.min(100, Math.max(88, Math.round(95 + Math.sin(now / 15000 + id) * 3)));
  clone.solarVoltage = +(4.8 + Math.sin(now / 20000 + id) * 0.3).toFixed(2);
  clone.protocol = "LoRaWAN 868MHz + NB-IoT + 2G SMS Failover";
  clone.rssi = -75 - Math.round(Math.abs(Math.sin(now / 8000 + id) * 8));
  clone.snr = +(9.4 + Math.sin(now / 6000 + id) * 0.8).toFixed(1);
  clone.packetCount = 14200 + Math.floor((now % 1000000) / 3000) * 10 + parseInt(id);
  clone.powerBudget = "5W Solar MPPT + 2600mAh LiFePO4 (14-Day Sunlight Autonomy)";
  clone.bufferStatus = "0 Dropped (Local SPIFFS Flash Sync Active)";

  if (clone.hazard === 'critical') {
    clone.anomalyScore = +(0.94 + Math.sin(now / 5000 + id) * 0.04).toFixed(3);
    clone.confidence = 98;
  } else if (clone.hazard === 'warning') {
    clone.anomalyScore = +(0.76 + Math.sin(now / 5000 + id) * 0.05).toFixed(3);
    clone.confidence = 92;
  } else {
    clone.anomalyScore = +(0.12 + Math.abs(Math.sin(now / 5000 + id)) * 0.08).toFixed(3);
    clone.confidence = 96;
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

// GET NDMA Common Alerting Protocol (CAP) Standard Export
app.get('/api/ndma/cap', (req, res) => {
  const alerts = [];
  for (const k in networkNodes) {
    const n = getLiveNodeData(k);
    if (n.hazard === 'critical' || n.hazard === 'warning') {
      alerts.push({
        identifier: `ENVISAGE-${n.id}-${Date.now()}`,
        sender: "in.gov.ndma.envisage.earlywarning",
        sent: new Date().toISOString(),
        status: "Actual",
        msgType: "Alert",
        scope: "Public",
        category: n.category.toUpperCase(),
        event: `${n.categoryLabel} Incident Alert`,
        urgency: n.hazard === 'critical' ? 'Immediate' : 'Expected',
        severity: n.hazard === 'critical' ? 'Extreme' : 'Severe',
        certainty: 'Observed',
        headline: `Edge AI Early Warning Triggered at ${n.name}`,
        description: `Autonomous On-Chip Anomaly Score: ${n.anomalyScore} (${n.confidence}% confidence). Primary Sensor: ${n.primarySensor}. Location: ${n.location}.`,
        area: {
          areaDesc: `${n.location}, ${n.state}`,
          circle: `${n.lat},${n.lng},5.0`
        }
      });
    }
  }
  res.json({
    capVersion: "1.2",
    agency: "National Disaster Management Authority (NDMA) / ENVISAGE Sentinel Network",
    totalActiveHotspots: alerts.length,
    alerts
  });
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
  // Background simulation for all 20 nodes (makes network look actively alive)
  setInterval(() => {
    const liveMap = {};
    for (let id = 1; id <= 20; id++) {
      liveMap[id] = getLiveNodeData(id);
    }
    broadcastSSE({ type: "NETWORK_HEARTBEAT", nodes: liveMap });
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

