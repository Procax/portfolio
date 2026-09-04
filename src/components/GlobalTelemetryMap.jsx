import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import { useSound } from './SoundEngine';
import SlotCounter from './SlotCounter';

// Tech Nodes across the globe (Lat, Lon)
const NODES = [
  { id: 'blr', name: 'Bengaluru / India', code: 'BLR_CORE', lat: 12.9716, lon: 77.5946, primary: true, region: 'Asia-South' },
  { id: 'tyo', name: 'Tokyo', code: 'TYO_RELAY', lat: 35.6762, lon: 139.6503, region: 'Asia-East' },
  { id: 'lon', name: 'London', code: 'LON_RELAY', lat: 51.5074, lon: -0.1278, region: 'Europe-West' },
  { id: 'sfo', name: 'San Francisco', code: 'SFO_RELAY', lat: 37.7749, lon: -122.4194, region: 'Americas-West' },
  { id: 'fra', name: 'Frankfurt', code: 'FRA_RELAY', lat: 50.1109, lon: 8.6821, region: 'Europe-Central' },
  { id: 'sin', name: 'Singapore', code: 'SIN_RELAY', lat: 1.3521, lon: 103.8198, region: 'Asia-SE' },
  { id: 'nyc', name: 'New York', code: 'NYC_RELAY', lat: 40.7128, lon: -74.0060, region: 'Americas-East' },
];

// Active transmission links between Bengaluru Core and other hubs
const ARCS = [
  { from: 'blr', to: 'tyo' },
  { from: 'blr', to: 'lon' },
  { from: 'blr', to: 'sfo' },
  { from: 'blr', to: 'fra' },
  { from: 'blr', to: 'sin' },
  { from: 'blr', to: 'nyc' },
];

// Convert Lat/Lon to 3D Cartesian coordinates on unit sphere
function latLonToVector3(lat, lon, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}

// Rotate vector around X and Y axes
function rotatePoint(point, rotX, rotY) {
  // Rotate around Y axis
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;

  // Rotate around X axis
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  return { x: x1, y: y2, z: z2 };
}

export default function GlobalTelemetryMap() {
  const { activeThemeConfig } = useTheme();
  const { playClick, playHover } = useSound();
  const canvasRef = useRef(null);

  // Interaction & Rotation state
  const rotationRef = useRef({ x: 0.25, y: -1.2, targetX: 0.25, targetY: -1.2, autoRotate: true });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const shockwavesRef = useRef([]);

  // Active selected node
  const [selectedNode, setSelectedNode] = useState(NODES[0]);

  // Live Local Time in IST
  const [istTime, setIstTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Battery / Power Sensor
  const [powerStatus, setPowerStatus] = useState({ level: 98, charging: true, text: 'NOMINAL // GRID_SYNC' });
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        const updateBattery = () => {
          setPowerStatus({
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            text: battery.charging ? 'AC_CHARGING // OPTIMAL' : 'DISCHARGING // BATTERY_CELL',
          });
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }
  }, []);

  // Interactive Reaction Counters (persisted in localStorage)
  const [reactions, setReactions] = useState(() => {
    try {
      const saved = localStorage.getItem('cyber_pings_telemetry');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { ping: 148, hype: 94, recruiter: 42, coffee: 63 };
  });

  // Recent Event Transmission Log
  const [eventLogs, setEventLogs] = useState([
    { id: 1, time: 'SYS_BOOT', text: 'Global orbital telemetry online. 7 relays locked.' },
    { id: 2, time: 'SYNC_OK', text: 'Encrypted mesh heartbeat acknowledged by Tokyo relay.' },
    { id: 3, time: 'LATENCY', text: 'Primary node (Bengaluru) ping resolved to 18ms.' },
  ]);

  // Generate uniform Fibonacci sphere dots
  const sphereDots = useMemo(() => {
    const count = 260;
    const dots = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      dots.push({ x, y, z });
    }
    return dots;
  }, []);

  // Convert nodes to 3D vectors
  const nodeVectors = useMemo(() => {
    return NODES.map((node) => ({
      ...node,
      vec: latLonToVector3(node.lat, node.lon, 1),
    }));
  }, []);

  // Center rotation on a specific node
  const focusNode = useCallback((node) => {
    setSelectedNode(node);
    if (playClick) playClick();
    const vec = latLonToVector3(node.lat, node.lon, 1);
    // Calculate target rotation to bring this vector to face the camera (+Z)
    const targetY = -Math.atan2(vec.x, vec.z);
    const targetX = Math.asin(vec.y);
    rotationRef.current.targetX = targetX;
    rotationRef.current.targetY = targetY;
    rotationRef.current.autoRotate = false;

    // Resume auto rotation after 6 seconds
    setTimeout(() => {
      rotationRef.current.autoRotate = true;
    }, 6000);
  }, [playClick]);

  // Handle reaction button click
  const handleReaction = (type, label, emoji) => {
    if (playClick) playClick();

    // Increment count
    setReactions((prev) => {
      const updated = { ...prev, [type]: (prev[type] || 0) + 1 };
      try {
        localStorage.setItem('cyber_pings_telemetry', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Add shockwave animation to globe from Bengaluru Core
    shockwavesRef.current.push({
      start: performance.now(),
      duration: 1800,
      color: activeThemeConfig?.colorHex || '#00f2fe',
    });

    // Append to live event log
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setEventLogs((prev) => [
      {
        id: Date.now(),
        time: now,
        text: `BROADCAST: ${emoji} ${label} dispatched to Global Mesh Network!`,
      },
      ...prev.slice(0, 4),
    ]);
  };

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const primaryColor = activeThemeConfig?.colorHex || '#00f2fe';
    const accentColor = activeThemeConfig?.accentHex || '#38bdf8';

    const render = (time) => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const sphereRadius = Math.min(width, height) * 0.38;

      // Update rotation
      const rot = rotationRef.current;
      if (rot.autoRotate && !isDraggingRef.current) {
        rot.y += 0.0035;
      }
      // Smooth interpolation toward target if focused
      rot.x += (rot.targetX - rot.x) * 0.05;
      rot.y += (rot.targetY - rot.y) * 0.05;

      // 1. Draw outer ambient atmosphere glow
      const atmGrad = ctx.createRadialGradient(cx, cy, sphereRadius * 0.8, cx, cy, sphereRadius * 1.25);
      atmGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      atmGrad.addColorStop(0.7, `${primaryColor}15`);
      atmGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = atmGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Sphere Boundary Ring
      ctx.strokeStyle = `${primaryColor}30`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Equatorial & Latitude Rings
      [-0.45, 0, 0.45].forEach((latOffset) => {
        ctx.beginPath();
        const rLat = Math.cos(latOffset * Math.PI) * sphereRadius;
        const yLat = Math.sin(latOffset * Math.PI) * sphereRadius;
        ctx.ellipse(cx, cy - yLat, rLat, rLat * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `${primaryColor}14`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 4. Render Fibonacci Sphere Dots
      sphereDots.forEach((dot) => {
        const rotated = rotatePoint(dot, rot.x, rot.y);
        const screenX = cx + rotated.x * sphereRadius;
        const screenY = cy - rotated.y * sphereRadius;

        // Depth cueing
        const isFront = rotated.z > 0;
        const alpha = isFront ? 0.25 + rotated.z * 0.65 : 0.08 + (rotated.z + 1) * 0.1;
        const size = isFront ? 1.2 + rotated.z * 1.1 : 0.9;

        ctx.fillStyle = isFront ? primaryColor : `${primaryColor}60`;
        ctx.globalAlpha = Math.max(0.04, alpha);
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 5. Draw Orbital Curved Transmission Arcs
      ARCS.forEach((arc, i) => {
        const fromNode = nodeVectors.find((n) => n.id === arc.from);
        const toNode = nodeVectors.find((n) => n.id === arc.to);
        if (!fromNode || !toNode) return;

        const p1 = rotatePoint(fromNode.vec, rot.x, rot.y);
        const p2 = rotatePoint(toNode.vec, rot.x, rot.y);

        // Only draw arc if at least one node is partially facing the front
        if (p1.z < -0.3 && p2.z < -0.3) return;

        const sx1 = cx + p1.x * sphereRadius;
        const sy1 = cy - p1.y * sphereRadius;
        const sx2 = cx + p2.x * sphereRadius;
        const sy2 = cy - p2.y * sphereRadius;

        // Midpoint lifted outwards in 3D
        const mid3D = {
          x: (fromNode.vec.x + toNode.vec.x) * 0.68,
          y: (fromNode.vec.y + toNode.vec.y) * 0.68,
          z: (fromNode.vec.z + toNode.vec.z) * 0.68,
        };
        const rotMid = rotatePoint(mid3D, rot.x, rot.y);
        const mx = cx + rotMid.x * (sphereRadius * 1.22);
        const my = cy - rotMid.y * (sphereRadius * 1.22);

        // Draw Arc Line
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.quadraticCurveTo(mx, my, sx2, sy2);
        ctx.strokeStyle = `${accentColor}55`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Flying Data Packet along the curve
        const progress = ((time * 0.0008 + i * 0.22) % 1);
        // Quadratic bezier formula: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const t = progress;
        const pktX = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * mx + t * t * sx2;
        const pktY = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * my + t * t * sy2;

        ctx.fillStyle = primaryColor;
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pktX, pktY, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 6. Draw Active Node Pins & Pulsing Radar Rings
      nodeVectors.forEach((node) => {
        const rotated = rotatePoint(node.vec, rot.x, rot.y);
        if (rotated.z < -0.15) return; // Behind the globe

        const screenX = cx + rotated.x * sphereRadius;
        const screenY = cy - rotated.y * sphereRadius;

        const isPrimary = node.primary;
        const isSelected = selectedNode?.id === node.id;
        const baseColor = isPrimary ? '#34d399' : primaryColor;

        // Expanding pulse ring
        const pulse = (time * 0.002 + node.lat) % 1;
        ctx.strokeStyle = baseColor;
        ctx.globalAlpha = Math.max(0, 1 - pulse) * (rotated.z > 0 ? 0.8 : 0.3);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 4 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Solid Node Beacon Pin
        ctx.fillStyle = isSelected ? '#ffffff' : baseColor;
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = isSelected ? 12 : 6;
        ctx.beginPath();
        ctx.arc(screenX, screenY, isPrimary ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label for primary or selected node
        if (isPrimary || isSelected || rotated.z > 0.4) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = isSelected ? '#ffffff' : baseColor;
          ctx.fillText(node.code, screenX + 7, screenY + 3);
        }
      });

      // 7. Render Shockwaves from Broadcast Reactions
      const now = performance.now();
      shockwavesRef.current = shockwavesRef.current.filter((sw) => {
        const elapsed = now - sw.start;
        if (elapsed > sw.duration) return false;
        const progress = elapsed / sw.duration;
        const waveRadius = sphereRadius * (0.2 + progress * 0.95);
        const waveAlpha = (1 - progress) * 0.7;

        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = waveAlpha;
        ctx.beginPath();
        ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        return true;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [sphereDots, nodeVectors, activeThemeConfig, selectedNode]);

  // Drag-to-rotate event listeners on Canvas
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    rotationRef.current.autoRotate = false;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMouseRef.current.x;
    const deltaY = e.clientY - lastMouseRef.current.y;

    rotationRef.current.y += deltaX * 0.007;
    rotationRef.current.x = Math.max(-1.1, Math.min(1.1, rotationRef.current.x + deltaY * 0.007));
    rotationRef.current.targetX = rotationRef.current.x;
    rotationRef.current.targetY = rotationRef.current.y;

    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      rotationRef.current.autoRotate = true;
    }, 4000);
  };

  // Touch support for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      rotationRef.current.autoRotate = false;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMouseRef.current.x;
    const deltaY = e.touches[0].clientY - lastMouseRef.current.y;

    rotationRef.current.y += deltaX * 0.008;
    rotationRef.current.x = Math.max(-1.1, Math.min(1.1, rotationRef.current.x + deltaY * 0.008));
    rotationRef.current.targetX = rotationRef.current.x;
    rotationRef.current.targetY = rotationRef.current.y;

    lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16" id="telemetry">
      {/* Section Header */}
      <div className="reveal-on-scroll flex flex-col items-center text-center gap-2 mb-10">
        <div className="font-mono text-xs text-cyber-cyan tracking-widest uppercase flex items-center gap-2">
          <span>{"// "}<SlotCounter value="05" />{". GLOBAL_TELEMETRY"}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight cyber-glitch-tear cursor-pointer">
          World Telemetry &amp; Presence
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-cyber-blue to-cyber-cyan rounded-full mt-1"></div>
        <p className="text-on-surface-variant font-mono text-xs sm:text-sm mt-2 max-w-lg">
          Active orbital signal relays, real-time node presence &amp; interactive mesh broadcast
        </p>
      </div>

      {/* Main Telemetry Deck Bento */}
      <div className="reveal-on-scroll rounded-3xl bg-surface-container/70 border border-outline-variant hover:border-cyber-cyan/40 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(0,242,254,0.18)]">
        {/* Subtle Ambient Glow Orbs */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyber-cyan/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-cyber-blue/10 blur-[100px] pointer-events-none"></div>

        {/* Top Telemetry Diagnostic HUD Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-outline-variant/60 font-mono text-xs gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-semibold">CORE_NODE: BENGALURU [IND-BLR-01]</span>
            <span className="hidden sm:inline text-on-surface-variant">| 12.9716° N, 77.5946° E</span>
          </div>

          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="flex items-center gap-1.5 text-cyber-cyan">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>{istTime || '14:30:00'} IST</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-300">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>{powerStatus.level}% [{powerStatus.text}]</span>
            </span>
          </div>
        </div>

        {/* Grid: Left = 3D Globe Canvas, Right = Node Controls & Broadcast Station */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Holographic Globe Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={440}
                height={440}
                className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              />

              {/* Holographic HUD Overlays on Canvas Corners */}
              <div className="absolute top-2 left-2 font-mono text-[10px] text-cyber-cyan/70 bg-surface-dim/80 px-2 py-1 rounded border border-cyber-cyan/20 pointer-events-none">
                3D_ORBITAL_RADAR // 60 FPS
              </div>
              <div className="absolute bottom-2 left-2 font-mono text-[10px] text-on-surface-variant/70 bg-surface-dim/80 px-2 py-1 rounded border border-outline-variant/40 pointer-events-none">
                ROTATE: DRAG // PIN: CLICK
              </div>
            </div>

            {/* Current Active Focused Node Status Pill */}
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/80 border border-cyber-cyan/30 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan"></span>
              <span className="text-white">FOCUSED: <span className="text-cyber-cyan font-bold">{selectedNode.name}</span> ({selectedNode.code})</span>
              <span className="text-on-surface-variant text-[10px]">{selectedNode.region}</span>
            </div>
          </div>

          {/* Right Column: Node Relays & Live Reaction Broadcast Deck */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Global Relay Nodes Selector */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-xs text-cyber-cyan uppercase tracking-wider flex items-center justify-between">
                <span>Select Orbit Relay</span>
                <span className="text-on-surface-variant text-[11px]">7 Nodes Active</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {NODES.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => focusNode(node)}
                      onMouseEnter={playHover}
                      className={`p-2.5 rounded-xl font-mono text-xs text-left transition-all border flex flex-col gap-0.5 ${
                        isSelected
                          ? 'bg-cyber-cyan/15 border-cyber-cyan text-white shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                          : 'bg-surface-container-high/60 border-outline-variant/60 text-on-surface-variant hover:border-cyber-cyan/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate">{node.name}</span>
                        {node.primary && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-cyber-blue">{node.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Broadcast Reaction Transmitters (Live Feedback) */}
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/60">
              <div className="font-mono text-xs text-cyber-cyan uppercase tracking-wider flex items-center justify-between">
                <span>Broadcast Reaction Ping</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  READY
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                {/* 1. Network Ping */}
                <button
                  onClick={() => handleReaction('ping', 'NETWORK_PING', '⚡')}
                  className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant hover:border-cyber-cyan text-white flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="flex items-center gap-1.5 text-cyber-cyan font-semibold">
                    <span>⚡</span> PING
                  </span>
                  <span className="text-on-surface-variant text-[11px] group-hover:text-white">
                    <SlotCounter value={reactions.ping} />
                  </span>
                </button>

                {/* 2. Hyped */}
                <button
                  onClick={() => handleReaction('hype', 'HYPED_BEACON', '🔥')}
                  className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant hover:border-amber-400 text-white flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <span>🔥</span> HYPED
                  </span>
                  <span className="text-on-surface-variant text-[11px] group-hover:text-white">
                    <SlotCounter value={reactions.hype} />
                  </span>
                </button>

                {/* 3. Recruiter Ping */}
                <button
                  onClick={() => handleReaction('recruiter', 'RECRUITER_SCOUT', '💼')}
                  className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant hover:border-emerald-400 text-white flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span>💼</span> SCOUT
                  </span>
                  <span className="text-on-surface-variant text-[11px] group-hover:text-white">
                    <SlotCounter value={reactions.recruiter} />
                  </span>
                </button>

                {/* 4. Coffee */}
                <button
                  onClick={() => handleReaction('coffee', 'DEV_FUEL', '☕')}
                  className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant hover:border-purple-400 text-white flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
                    <span>☕</span> COFFEE
                  </span>
                  <span className="text-on-surface-variant text-[11px] group-hover:text-white">
                    <SlotCounter value={reactions.coffee} />
                  </span>
                </button>
              </div>
            </div>

            {/* Rolling Terminal Transmission Event Log */}
            <div className="rounded-xl bg-surface-dim/95 border border-outline-variant/80 p-3.5 font-mono text-[11px] flex flex-col gap-1.5 text-on-surface-variant">
              <div className="text-[10px] text-cyber-blue uppercase tracking-wider flex items-center justify-between pb-1 border-b border-outline-variant/40">
                <span>[TELEMETRY_LOG_STREAM]</span>
                <span className="text-cyber-cyan">REALTIME</span>
              </div>
              {eventLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-tight">
                  <span className="text-cyber-cyan shrink-0">[{log.time}]</span>
                  <span className="text-on-surface truncate">{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

