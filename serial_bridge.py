"""
PRITHVI-RAKSHAK: UNIVERSAL HARDWARE AUTO-SCANNER & BRIDGE
Auto-detects active ESP32 COM port (COM7, COM8, etc.) and streams telemetry to localhost:5000
"""
import time
import json
import urllib.request
import serial
import serial.tools.list_ports

BAUD = 115200
API_URL = 'http://localhost:5000/api/telemetry'

def post_telemetry(payload):
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(API_URL, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=1) as response:
            pass
    except Exception:
        pass

def find_candidate_ports():
    ports = [p.device for p in serial.tools.list_ports.comports()]
    # Prioritize COM8, then COM7, then any other
    priority = []
    if 'COM8' in ports: priority.append('COM8')
    if 'COM7' in ports: priority.append('COM7')
    for p in ports:
        if p not in priority: priority.append(p)
    return priority

print("[+] Hardware Universal Auto-Bridge Initialized.")

while True:
    candidate_ports = find_candidate_ports()
    if not candidate_ports:
        print("[!] No COM ports detected. Waiting...")
        time.sleep(2)
        continue

    for port in candidate_ports:
        try:
            print(f"[+] Trying connection to {port}...")
            ser = serial.Serial(port, BAUD, timeout=1)
            ser.dtr = True
            ser.rts = True
            time.sleep(0.2)
            
            start_time = time.time()
            found_data = False
            
            while time.time() - start_time < 2.5:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                if line:
                    if line.startswith('{') or "cm" in line or "Distance" in line or "PRITHVI" in line:
                        found_data = True
                        break
            
            if found_data:
                print(f"[OK] Live ESP32-S3 Stream Established on {port}!")
                while True:
                    raw_line = ser.readline().decode('utf-8', errors='ignore').strip()
                    if not raw_line:
                        continue
                    
                    if raw_line.startswith('{'):
                        try:
                            telemetry = json.loads(raw_line)
                            if telemetry.get('type') == 'TELEMETRY':
                                post_telemetry(telemetry)
                                w = telemetry.get('water')
                                s = telemetry.get('smoke')
                                tg = telemetry.get('toxicGas')
                                soil = telemetry.get('soil')
                                print(f"[LIVE] Water: {w} cm | Smoke: {s} ppm | ToxicGas: {tg} ppm | Soil: {soil}%")
                        except json.JSONDecodeError:
                            pass
                    elif "cm" in raw_line or "Distance" in raw_line:
                        import re
                        m = re.search(r'([\d\.]+)\s*cm', raw_line)
                        if m:
                            w = float(m.group(1))
                            post_telemetry({'nodeId': 1, 'water': w})
                            print(f"[LIVE] Water (raw): {w} cm")
            else:
                ser.close()
        except serial.SerialException:
            time.sleep(1)
        except Exception:
            time.sleep(1)
            
    time.sleep(1)
