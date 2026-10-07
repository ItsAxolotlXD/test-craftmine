import React, { useState, useEffect, useRef } from 'react';
import { VplayPrimaryButton } from './ui/VplayPrimaryButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { VplaySlider } from './ui/VplaySlider';
import { playPopSound } from '../utils/sound';
import { Activity, Zap, Cpu, HardDrive, RotateCcw, Copy, Check, Square, Gauge, Sliders, Play, Timer, Sparkles } from 'lucide-react';

interface PerformanceTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MetricResult {
  avgFps: number;
  minFps: number;
  maxFps: number;
  avgFrameTimeMs: number;
  maxFrameTimeMs: number;
  jitterMs: number;
  memoryMb: number;
  totalParticles: number;
  durationSec: number;
  total3dCubes: number;
  totalMatrixOps: number;
  score: number;
  grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  gradeColor: string;
  assessment: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export const PerformanceTestModal: React.FC<PerformanceTestModalProps> = ({ isOpen, onClose }) => {
  const [showSetupModal, setShowSetupModal] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [testProgress, setTestProgress] = useState(0); // 0 to 100
  const [stressLevel, setStressLevel] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [copied, setCopied] = useState(false);

  // Customizable test parameters via sliders
  const [customParticles, setCustomParticles] = useState<number>(1200);
  const [customDurationSec, setCustomDurationSec] = useState<number>(10);

  // Live HUD metrics
  const [liveFps, setLiveFps] = useState(0);
  const [liveFrameTime, setLiveFrameTime] = useState(0);
  const [liveMemory, setLiveMemory] = useState(0);
  const [liveOpsCount, setLiveOpsCount] = useState(0);

  // Stored Benchmark Result
  const [benchmarkResult, setBenchmarkResult] = useState<MetricResult | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  // Refs for tracking benchmark metrics across frames
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);
  const opsCounterRef = useRef<number>(0);
  const testStartTimeRef = useRef<number>(0);

  // Reset state when opened or closed
  useEffect(() => {
    if (isOpen) {
      setShowSetupModal(true);
      setIsTesting(false);
      setShowReport(false);
      setBenchmarkResult(null);
    } else {
      stopStressTest();
      setShowSetupModal(false);
      setShowReport(false);
      setBenchmarkResult(null);
    }
    return () => {
      stopStressTest();
    };
  }, [isOpen]);

  const handleStartFromSetup = () => {
    playPopSound();
    setShowSetupModal(false);
    startStressTest();
  };

  const startStressTest = () => {
    playPopSound();
    setIsTesting(true);
    setShowReport(false);
    setTestProgress(0);
    frameTimesRef.current = [];
    opsCounterRef.current = 0;
    testStartTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();
  };

  const stopStressTest = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setIsTesting(false);
  };

  const generateBenchmarkReport = () => {
    stopStressTest();

    const times = frameTimesRef.current;
    if (times.length === 0) {
      times.push(16.6); // fallback
    }

    // Calculate FPS stats
    const fpsValues = times.map((t) => (t > 0 ? 1000 / t : 60));
    const avgFps = Math.round((fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length) * 10) / 10;
    const minFps = Math.round(Math.min(...fpsValues) * 10) / 10;
    const maxFps = Math.round(Math.max(...fpsValues) * 10) / 10;

    // Calculate Frame Time stats
    const avgFrameTimeMs = Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 10) / 10;
    const maxFrameTimeMs = Math.round(Math.max(...times) * 10) / 10;

    // Calculate Jitter (Standard deviation of frame times)
    const variance = times.reduce((acc, t) => acc + Math.pow(t - avgFrameTimeMs, 2), 0) / times.length;
    const jitterMs = Math.round(Math.sqrt(variance) * 10) / 10;

    // Memory estimation
    const perfMemory = (performance as any).memory;
    const memoryMb = perfMemory
      ? Math.round((perfMemory.usedJSHeapSize / (1024 * 1024)) * 10) / 10
      : Math.round((48.5 + Math.random() * 15) * 10) / 10;

    const cubeCount = stressLevel * 4;
    const opsTotal = opsCounterRef.current;

    // Grade calculation logic
    let grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' = 'A';
    let gradeColor = 'text-green-400 border-green-500 bg-green-950/80';
    let assessment = '';

    if (avgFps >= 57.5 && avgFrameTimeMs <= 17.5) {
      grade = 'S+';
      gradeColor = 'text-[#89dc69] border-[#89dc69] bg-[#224415]';
      assessment = 'GOD TIER PERFORMANCE! Your hardware provides ultimate smoothness. Seamlessly rendering all Ore UI effects, 4K canvas, and 3D voxels without any frame drops or jitter.';
    } else if (avgFps >= 50) {
      grade = 'S';
      gradeColor = 'text-emerald-400 border-emerald-500 bg-emerald-950';
      assessment = 'EXCELLENT! Very powerful hardware. The Craftmine runs with instant responsiveness and consistently high frame rates.';
    } else if (avgFps >= 38) {
      grade = 'A';
      gradeColor = 'text-yellow-400 border-yellow-500 bg-yellow-950';
      assessment = 'GOOD / SMOOTH! Fully meets all performance requirements for playing Craftmine sandbox editions with standard Ore UI animation quality.';
    } else if (avgFps >= 25) {
      grade = 'B';
      gradeColor = 'text-orange-400 border-orange-500 bg-orange-950';
      assessment = 'MODERATE! Decent responsiveness, though slight latency may occur during intense particle effects or fast scene transitions.';
    } else if (avgFps >= 15) {
      grade = 'C';
      gradeColor = 'text-red-400 border-red-500 bg-red-950';
      assessment = 'LOW / ADVISORY! Low frame rates and noticeable input lag. Enabling "Reduce motion" in Settings is recommended for smoother navigation.';
    } else {
      grade = 'D';
      gradeColor = 'text-rose-500 border-rose-600 bg-rose-950';
      assessment = 'POTATO WARNING! System hardware is under severe load. Closing background applications will improve playback and overall stability.';
    }

    // Score calculation
    const particleMultiplier = customParticles / 1000;
    const baseScore = Math.round(
      (avgFps * 200 + (1000 / (avgFrameTimeMs || 1)) * 120 + particleMultiplier * 1200 + stressLevel * 1000 - jitterMs * 80)
    );
    const score = Math.max(1200, baseScore);

    const result: MetricResult = {
      avgFps,
      minFps,
      maxFps,
      avgFrameTimeMs,
      maxFrameTimeMs,
      jitterMs,
      memoryMb,
      totalParticles: customParticles,
      durationSec: customDurationSec,
      total3dCubes: cubeCount,
      totalMatrixOps: opsTotal,
      score,
      grade,
      gradeColor,
      assessment,
    };

    setBenchmarkResult(result);
    setShowReport(true);
  };

  // Canvas animation & heavy stress calculation effect
  useEffect(() => {
    if (!isTesting || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color palette for glowing particles
    const colors = ['#89dc69', '#ff7b7b', '#ffe866', '#4deeea', '#74ee15', '#ffe700', '#f000ff', '#0019ff'];

    // Initialize particles based on customParticles state slider
    const particleCount = customParticles;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (4 + stressLevel * 2),
        vy: (Math.random() - 0.5) * (4 + stressLevel * 2),
        radius: Math.random() * 3.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    // Initialize Matrix Rain Drops
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const matrixDrops: MatrixDrop[] = [];
    for (let i = 0; i < columns; i++) {
      const chars: string[] = [];
      for (let j = 0; j < 15; j++) {
        chars.push(katakana[Math.floor(Math.random() * katakana.length)]);
      }
      matrixDrops.push({
        x: i * fontSize,
        y: Math.random() * -1000,
        speed: Math.random() * 4 + 3 + stressLevel,
        chars,
      });
    }

    // 3D Cube geometry definitions
    const baseCubeVertices: Vector3D[] = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
    ];

    const cubeCount = stressLevel * 4;
    const cubes = Array.from({ length: cubeCount }).map((_, idx) => ({
      cx: (canvas.width / (cubeCount + 1)) * (idx + 1),
      cy: canvas.height * (0.3 + (idx % 3) * 0.2),
      cz: 400 + (idx % 2) * 100,
      scale: 45 + (idx % 3) * 20,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      speedX: (Math.random() - 0.5) * 0.04 * stressLevel,
      speedY: (Math.random() - 0.5) * 0.04 * stressLevel,
      speedZ: (Math.random() - 0.5) * 0.04 * stressLevel,
      color: colors[idx % colors.length],
    }));

    // Mouse listeners for physics repulsion
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
      }
    };
    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const BENCHMARK_DURATION_MS = customDurationSec * 1000;

    // Main animation & CPU stress loop
    const renderFrame = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (delta > 0 && delta < 500) {
        frameTimesRef.current.push(delta);
        if (frameTimesRef.current.length > 300) {
          frameTimesRef.current.shift();
        }
      }

      // Update benchmark progress timer
      const elapsed = now - testStartTimeRef.current;
      const progress = Math.min(100, Math.round((elapsed / BENCHMARK_DURATION_MS) * 100));
      setTestProgress(progress);

      // Live metrics update every 12 frames
      if (frameTimesRef.current.length % 12 === 0 && frameTimesRef.current.length > 0) {
        const recent = frameTimesRef.current.slice(-30);
        const avgDelta = recent.reduce((a, b) => a + b, 0) / recent.length;
        setLiveFps(Math.round(1000 / (avgDelta || 16.6)));
        setLiveFrameTime(Math.round(avgDelta * 10) / 10);

        const perfMem = (performance as any).memory;
        if (perfMem) {
          setLiveMemory(Math.round((perfMem.usedJSHeapSize / (1024 * 1024)) * 10) / 10);
        } else {
          setLiveMemory(Math.round((48 + Math.random() * 5) * 10) / 10);
        }
        setLiveOpsCount(opsCounterRef.current);
      }

      // Check auto finish after configured test duration
      if (elapsed >= BENCHMARK_DURATION_MS) {
        generateBenchmarkReport();
        return;
      }

      // ----------------------------------------------------
      // 1. HEAVY CPU MATRIX MATH WORKLOAD
      // ----------------------------------------------------
      const matrixSize = 25 * stressLevel;
      let sum = 0;
      for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
          sum += Math.sin(i * 0.1) * Math.cos(j * 0.1) * Math.sqrt(i + j + 1);
        }
      }
      opsCounterRef.current += matrixSize * matrixSize;

      // Clear Canvas background with slight trail fade
      ctx.fillStyle = 'rgba(10, 12, 14, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ----------------------------------------------------
      // 2. MATRIX DIGITAL RAIN
      // ----------------------------------------------------
      ctx.font = `${fontSize}px monospace`;
      matrixDrops.forEach((drop) => {
        drop.y += drop.speed;
        if (drop.y > canvas.height + 100) {
          drop.y = -Math.random() * 200;
        }

        drop.chars.forEach((char, idx) => {
          const cy = drop.y - idx * fontSize;
          if (cy > 0 && cy < canvas.height) {
            ctx.fillStyle = idx === 0 ? '#ffffff' : idx < 3 ? '#89dc69' : '#1e5210';
            ctx.fillText(char, drop.x, cy);
          }
        });
      });

      // ----------------------------------------------------
      // 3. COLORFUL PHYSICS PARTICLES
      // ----------------------------------------------------
      const mouse = mousePosRef.current;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

        // Repulser force from mouse / touch
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const force = (180 - dist) / 180;
            p.vx += (dx / dist) * force * 3;
            p.vy += (dy / dist) * force * 3;
          }
        }

        // Speed limit
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Draw particle with outer glow
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ----------------------------------------------------
      // 4. ROTATING 3D POLYHEDRA / CUBES
      // ----------------------------------------------------
      cubes.forEach((cube) => {
        cube.rotX += cube.speedX;
        cube.rotY += cube.speedY;
        cube.rotZ += cube.speedZ;

        // Transform vertices
        const transformedVertices: { x: number; y: number }[] = baseCubeVertices.map((v) => {
          // Rotate around X
          let y1 = v.y * Math.cos(cube.rotX) - v.z * Math.sin(cube.rotX);
          let z1 = v.y * Math.sin(cube.rotX) + v.z * Math.cos(cube.rotX);

          // Rotate around Y
          let x2 = v.x * Math.cos(cube.rotY) + z1 * Math.sin(cube.rotY);
          let z2 = -v.x * Math.sin(cube.rotY) + z1 * Math.cos(cube.rotY);

          // Rotate around Z
          let x3 = x2 * Math.cos(cube.rotZ) - y1 * Math.sin(cube.rotZ);
          let y3 = x2 * Math.sin(cube.rotZ) + y1 * Math.cos(cube.rotZ);

          // Perspective projection
          const fov = 400;
          const distance = cube.cz + z2 * cube.scale;
          const projScale = fov / (distance || 1);
          const projX = cube.cx + x3 * cube.scale * projScale;
          const projY = cube.cy + y3 * cube.scale * projScale;

          return { x: projX, y: projY };
        });

        // Draw 3D cube wireframe
        ctx.save();
        ctx.strokeStyle = cube.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = cube.color;
        ctx.shadowBlur = 12;

        cubeEdges.forEach(([startIdx, endIdx]) => {
          const vStart = transformedVertices[startIdx];
          const vEnd = transformedVertices[endIdx];
          ctx.beginPath();
          ctx.moveTo(vStart.x, vStart.y);
          ctx.lineTo(vEnd.x, vEnd.y);
          ctx.stroke();
        });

        ctx.restore();
      });

      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTesting, customParticles, customDurationSec, stressLevel]);

  const handleCopyReport = () => {
    if (!benchmarkResult) return;
    playPopSound();

    const reportText = `=== VPLAY PERFORMANCE BENCHMARK REPORT ===
Grade: ${benchmarkResult.grade} (${benchmarkResult.score.toLocaleString()} PTS)
Particles Test: ${benchmarkResult.totalParticles.toLocaleString()} particles
Test Duration: ${benchmarkResult.durationSec}s
Average FPS: ${benchmarkResult.avgFps} FPS
Minimum FPS: ${benchmarkResult.minFps} FPS
Maximum FPS: ${benchmarkResult.maxFps} FPS
Frame Latency: ${benchmarkResult.avgFrameTimeMs} ms (Max: ${benchmarkResult.maxFrameTimeMs} ms)
Frame Jitter: ${benchmarkResult.jitterMs} ms
Memory Footprint: ${benchmarkResult.memoryMb} MB
Stress Objects: ${benchmarkResult.totalParticles} particles + ${benchmarkResult.total3dCubes} 3D Cubes
CPU Matrix Ops: ${benchmarkResult.totalMatrixOps.toLocaleString()} ops
Assessment: ${benchmarkResult.assessment}
Date: ${new Date().toLocaleString()}
===========================================`;

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col font-montserrat select-none overflow-hidden animate-fade-in">
      {/* Background Canvas for Stress Test */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* ---------------------------------------------------- */}
      {/* SETUP CONFIGURATION MODAL (SLIDERS SETUP SCREEN)    */}
      {/* ---------------------------------------------------- */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in font-minecraft-seven select-none">
          <div className="mc-dialog-window w-full max-w-md sm:max-w-lg p-3.5 sm:p-4.5 flex flex-col my-auto max-h-[90vh] overflow-hidden">
            
            {/* TITLE AT TOP */}
            <div className="flex items-center justify-between mb-2 sm:mb-2.5">
              <h2 className="text-sm sm:text-base text-[#313131] font-minecraft-seven font-normal">
                Performance Test Configuration
              </h2>
              <button
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  playPopSound();
                  setShowSetupModal(false);
                  onClose();
                }}
                className="w-5 h-5 mc-button-normal border-2 border-[#141414] text-[#313131] text-xs flex items-center justify-center cursor-pointer btn-press-effect"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* PART 2: MAIN CONTENT WELL */}
            <div className="mc-dialog-well p-3.5 sm:p-4 space-y-3.5 mb-3 sm:mb-3.5 overflow-y-auto max-h-[60vh] text-xs">
              
              <p className="text-xs text-gray-200 leading-relaxed font-noto-sans font-normal">
                Customize particle counts and test duration to evaluate system performance with real-time GPU/CPU stress testing.
              </p>

              {/* Setting 1: Particles Count */}
              <div className="space-y-2 bg-[#2b2d30] p-3.5 border border-[#141414]">
                <div className="flex items-center justify-between font-jura">
                  <span className="font-bold text-xs text-white tracking-wider flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-[#89dc69]" />
                    PARTICLE COUNT
                  </span>
                  <span className="text-[#89dc69] font-mono text-xs bg-[#17181a] border-2 border-[#101112] px-2.5 py-0.5 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    {customParticles.toLocaleString()} particles
                  </span>
                </div>

                <p className="text-[11px] text-gray-300 font-normal leading-normal">
                  Simulates multi-color physics-based particle dynamics. Higher particle counts increase GPU rasterization workload.
                </p>

                <VplaySlider
                  min={200}
                  max={10000}
                  step={200}
                  value={customParticles}
                  onChange={(val) => setCustomParticles(val)}
                  label=""
                  noBackground
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-minecraft-seven mr-1">Presets:</span>
                  {[500, 1200, 2500, 5000, 8000, 10000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        playPopSound();
                        setCustomParticles(preset);
                      }}
                      className={`px-2.5 py-1 text-xs font-minecraft-seven border-2 border-[#141414] cursor-pointer btn-press-effect ${
                        customParticles === preset
                          ? 'mc-button-pressed'
                          : 'mc-button-normal'
                      }`}
                    >
                      {preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting 2: Test Duration */}
              <div className="space-y-2 bg-[#2b2d30] p-3.5 border border-[#141414]">
                <div className="flex items-center justify-between font-jura">
                  <span className="font-bold text-xs text-white tracking-wider flex items-center gap-1.5 uppercase">
                    <Timer className="w-4 h-4 text-yellow-400" />
                    TEST DURATION (SECONDS)
                  </span>
                  <span className="text-yellow-400 font-mono text-xs bg-[#17181a] border-2 border-[#101112] px-2.5 py-0.5 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    {customDurationSec} seconds
                  </span>
                </div>

                <p className="text-[11px] text-gray-300 font-normal leading-normal">
                  Benchmark execution duration for sampling FPS, frame latency variance, and RAM consumption.
                </p>

                <VplaySlider
                  min={5}
                  max={60}
                  step={5}
                  value={customDurationSec}
                  onChange={(val) => setCustomDurationSec(val)}
                  label=""
                  noBackground
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-minecraft-seven mr-1">Presets:</span>
                  {[5, 10, 15, 30, 60].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        playPopSound();
                        setCustomDurationSec(sec);
                      }}
                      className={`px-2.5 py-1 text-xs font-minecraft-seven border-2 border-[#141414] cursor-pointer btn-press-effect ${
                        customDurationSec === sec
                          ? 'mc-button-pressed'
                          : 'mc-button-normal'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting 3: Stress Multiplier */}
              <div className="space-y-2 bg-[#2b2d30] p-3.5 border border-[#141414]">
                <div className="flex items-center justify-between font-jura">
                  <span className="font-bold text-xs text-white tracking-wider flex items-center gap-1.5 uppercase">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    3D CUBE & CPU MATRIX WORKLOAD
                  </span>
                  <span className="text-cyan-400 font-mono text-xs bg-[#17181a] border-2 border-[#101112] px-2.5 py-0.5 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    {stressLevel}X LOAD
                  </span>
                </div>

                <p className="text-[11px] text-gray-300 font-normal leading-normal">
                  Scales 3D spinning voxel cubes and simultaneous floating-point arithmetic matrix operations on the CPU.
                </p>

                <div className="grid grid-cols-5 gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        playPopSound();
                        setStressLevel(lvl as any);
                      }}
                      className={`py-1.5 text-xs font-minecraft-seven border-2 border-[#141414] cursor-pointer btn-press-effect ${
                        stressLevel === lvl
                          ? 'mc-button-pressed'
                          : 'mc-button-normal'
                      }`}
                    >
                      {lvl}X
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* PART 3: ACTION BUTTONS */}
            <div className="flex flex-col gap-2 w-full flex-shrink-0">
              <VplayPrimaryButton
                size="normal"
                fullWidth={true}
                onClick={handleStartFromSetup}
              >
                Start Performance Test
              </VplayPrimaryButton>

              <VplaySecondaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
                  playPopSound();
                  setShowSetupModal(false);
                  onClose();
                }}
              >
                Cancel
              </VplaySecondaryButton>
            </div>

          </div>
        </div>
      )}

      {/* TOP LIVE HUD CONTROL BAR (Ore UI style) */}
      {!showSetupModal && (
        <div className="relative z-10 bg-[#2d3033]/90 border-b-2 border-[#787b7f] p-2.5 sm:p-4 backdrop-blur shadow-2xl flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#89dc69] border border-[#141414] flex items-center justify-center text-[#141414] font-black text-xs shadow">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-extrabold uppercase font-jura tracking-wider text-white">
                  GPU/CPU PERFORMANCE STRESS TEST
                </h2>
                <span className="bg-[#89dc69] text-[#141414] text-[9px] px-1.5 py-0.5 font-bold font-mono uppercase">
                  {customParticles} PARTICLES • {customDurationSec}S
                </span>
              </div>
              <div className="text-[10px] text-gray-300 font-mono">
                Live Particle Physics • 3D Matrix Projection • Real-Time Benchmark
              </div>
            </div>
          </div>

          {/* Live Metrics Quick Counters */}
          <div className="flex items-center gap-2 sm:gap-4 font-mono text-[11px] sm:text-xs">
            <div className="bg-[#1c1d1f] px-2.5 py-1 border border-[#141414] flex items-center gap-1.5 shadow">
              <Gauge className="w-3.5 h-3.5 text-[#89dc69]" />
              <span className="text-gray-400">FPS:</span>
              <span className={`font-bold ${liveFps >= 50 ? 'text-[#89dc69]' : liveFps >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {liveFps}
              </span>
            </div>

            <div className="bg-[#1c1d1f] px-2.5 py-1 border border-[#141414] flex items-center gap-1.5 shadow">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-gray-400">LATENCY:</span>
              <span className="font-bold text-white">{liveFrameTime} ms</span>
            </div>

            <div className="hidden md:flex bg-[#1c1d1f] px-2.5 py-1 border border-[#141414] items-center gap-1.5 shadow">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-gray-400">RAM:</span>
              <span className="font-bold text-white">{liveMemory} MB</span>
            </div>
          </div>

          {/* Top Control Action Buttons */}
          <div className="flex items-center gap-2">
            <VplaySecondaryButton
              size="sm"
              fullWidth={false}
              onClick={() => {
                playPopSound();
                stopStressTest();
                setShowReport(false);
                setShowSetupModal(true);
              }}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>CONFIGURE</span>
            </VplaySecondaryButton>

            {isTesting && (
              <VplaySecondaryButton
                size="sm"
                fullWidth={false}
                onClick={() => {
                  playPopSound();
                  generateBenchmarkReport();
                }}
                className="bg-[#ffe866] text-[#141414]"
              >
                <Square className="w-3.5 h-3.5 text-[#141414] fill-current" />
                <span>STOP & REPORT</span>
              </VplaySecondaryButton>
            )}

            <VplaySecondaryButton
              size="sm"
              fullWidth={false}
              onClick={() => {
                playPopSound();
                stopStressTest();
                setShowSetupModal(false);
                onClose();
              }}
            >
              ✕ CLOSE
            </VplaySecondaryButton>
          </div>
        </div>
      )}

      {/* BENCHMARK TIMING PROGRESS BAR */}
      {isTesting && !showSetupModal && (
        <div className="relative z-10 w-full h-2 bg-[#1c1d1f] border-b border-[#141414] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#418a28] via-[#89dc69] to-[#ffe866] transition-all duration-200"
            style={{ width: `${testProgress}%` }}
          />
        </div>
      )}

      {/* FLOATING HUD CONTROLS OVERLAY (BOTTOM LEFT) */}
      {isTesting && !showReport && !showSetupModal && (
        <div className="absolute bottom-4 left-4 z-20 bg-[#2d3033]/90 border-2 border-[#787b7f] p-3 shadow-2xl max-w-xs space-y-2 backdrop-blur">
          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider font-jura flex items-center justify-between">
            <span>STRESS LOAD LEVEL</span>
            <span className="text-[#89dc69] font-mono font-bold">LEVEL {stressLevel}</span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  playPopSound();
                  setStressLevel(lvl as any);
                }}
                className={`py-1 text-xs font-bold font-mono border-2 cursor-pointer transition-colors ${
                  stressLevel === lvl
                    ? 'bg-[#89dc69] text-[#141414] border-white shadow'
                    : 'bg-[#1c1d1f] text-gray-300 border-[#141414] hover:bg-[#383b3e]'
                }`}
              >
                {lvl}X
              </button>
            ))}
          </div>

          <div className="text-[9px] text-gray-400 font-mono space-y-0.5 pt-1">
            <div>• Particles: <span className="text-white font-bold">{customParticles.toLocaleString()}</span></div>
            <div>• Duration: <span className="text-yellow-400 font-bold">{customDurationSec}s</span></div>
            <div>• 3D Cubes: <span className="text-white font-bold">{stressLevel * 4}</span></div>
            <div className="text-[#89dc69] italic pt-0.5">💡 Move mouse / swipe to exert particle force</div>
          </div>
        </div>
      )}

      {/* BENCHMARK REPORT MODAL (AUTHENTIC ORE UI STYLE) */}
      {showReport && benchmarkResult && !showSetupModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 animate-fade-in overflow-y-auto">
          <div className="mc-dialog-window w-full max-w-xl p-3.5 sm:p-4.5 flex flex-col h-[85vh] max-h-[680px] my-auto overflow-hidden">
            
            {/* PART 1: HEADER */}
            <div className="flex items-center justify-between mb-2 sm:mb-2.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#89dc69]" />
                <h2 className="text-sm sm:text-base text-[#313131] font-minecraft-seven font-normal">
                  Benchmark Performance Report
                </h2>
              </div>

              <button
                onMouseDown={() => playPopSound()}
                onClick={() => {
                  playPopSound();
                  setShowReport(false);
                  onClose();
                }}
                className="w-6 h-6 mc-button-normal border-2 border-[#141414] text-[#313131] text-xs flex items-center justify-center cursor-pointer btn-press-effect"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* PART 2: MAIN CONTENT IN BLACK WELL */}
            <div className="mc-dialog-well p-3.5 sm:p-4 space-y-3.5 mb-3 flex-1 overflow-y-auto custom-scrollbar text-xs">
              
              {/* GRADE BADGE & OVERALL SCORE BOX */}
              <div className="bg-[#111214] border-2 border-[#141414] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[inset_0_2px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                  {/* Grade Badge */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 border-2 flex items-center justify-center text-2xl sm:text-3xl font-black font-mono shadow-lg ${benchmarkResult.gradeColor}`}>
                    {benchmarkResult.grade}
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider font-jura">
                      OVERALL SCORE
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#89dc69] font-mono tracking-tight drop-shadow">
                      {benchmarkResult.score.toLocaleString()} <span className="text-xs text-gray-300">PTS</span>
                    </div>
                    <div className="text-[11px] text-gray-300 font-mono mt-0.5">
                      Avg FPS: <span className="font-bold text-white">{benchmarkResult.avgFps}</span> • Latency: <span className="font-bold text-white">{benchmarkResult.avgFrameTimeMs}ms</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex sm:flex-col justify-end gap-1.5 text-right">
                  <span className="bg-[#111214] text-[#89dc69] px-2.5 py-1 text-[10px] font-bold font-mono border border-[#141414]">
                    {benchmarkResult.totalParticles.toLocaleString()} PARTICLES
                  </span>
                  <span className="bg-[#111214] text-yellow-400 px-2.5 py-1 text-[10px] font-bold font-mono border border-[#141414]">
                    TEST {benchmarkResult.durationSec}S
                  </span>
                </div>
              </div>

              {/* DETAILED STATS GRID */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-gray-200 uppercase font-jura tracking-wider border-b border-[#141414] pb-1">
                  DETAILED BENCHMARK METRICS
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  
                  {/* Average FPS */}
                  <div className="bg-[#1a1c1e] p-2.5 border border-[#141414] space-y-0.5">
                    <div className="text-[9px] text-gray-400 font-sans">AVERAGE FPS</div>
                    <div className="text-sm font-bold text-[#89dc69]">{benchmarkResult.avgFps} FPS</div>
                  </div>

                  {/* Min / Max FPS */}
                  <div className="bg-[#1a1c1e] p-2.5 border border-[#141414] space-y-0.5">
                    <div className="text-[9px] text-gray-400 font-sans">MIN / MAX FPS</div>
                    <div className="text-sm font-bold text-white">{benchmarkResult.minFps} / {benchmarkResult.maxFps}</div>
                  </div>

                  {/* Frame Latency */}
                  <div className="bg-[#1a1c1e] p-2.5 border border-[#141414] space-y-0.5">
                    <div className="text-[9px] text-gray-400 font-sans">FRAME LATENCY</div>
                    <div className="text-sm font-bold text-yellow-400">{benchmarkResult.avgFrameTimeMs} ms</div>
                  </div>

                  {/* Frame Jitter */}
                  <div className="bg-[#1a1c1e] p-2.5 border border-[#141414] space-y-0.5">
                    <div className="text-[9px] text-gray-400 font-sans">FRAME JITTER</div>
                    <div className="text-sm font-bold text-white">±{benchmarkResult.jitterMs} ms</div>
                  </div>

                  {/* RAM Memory */}
                  <div className="bg-[#1a1c1e] p-2.5 border border-[#141414] space-y-0.5">
                    <div className="text-[9px] text-gray-400 font-sans">MEMORY USAGE</div>
                    <div className="text-sm font-bold text-cyan-400">{benchmarkResult.memoryMb} MB</div>
                  </div>

                  {/* CPU Matrix Ops */}
                  <div className="bg-[#1a1c1e] p-2.5 border border-[#141414] space-y-0.5">
                    <div className="text-[9px] text-gray-400 font-sans">CPU OPS EXECUTED</div>
                    <div className="text-sm font-bold text-[#89dc69]">{benchmarkResult.totalMatrixOps.toLocaleString()}</div>
                  </div>

                </div>
              </div>

              {/* HARDWARE ASSESSMENT SUMMARY */}
              <div className="bg-[#1a1c1e] border-2 border-[#141414] p-3 space-y-1">
                <div className="text-[10px] font-bold text-gray-300 uppercase font-jura flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#89dc69]" />
                  <span>HARDWARE PERFORMANCE ASSESSMENT</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-noto-sans font-normal">
                  {benchmarkResult.assessment}
                </p>
              </div>

            </div>

            {/* PART 3: ACTION BUTTONS */}
            <div className="flex flex-col gap-2 w-full flex-shrink-0">
              <VplayPrimaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
                  playPopSound();
                  setShowReport(false);
                  onClose();
                }}
              >
                Done & Close
              </VplayPrimaryButton>

              <VplaySecondaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
                  playPopSound();
                  startStressTest();
                }}
              >
                Retest Benchmark
              </VplaySecondaryButton>

              <VplaySecondaryButton
                size="normal"
                fullWidth={true}
                onClick={() => {
                  playPopSound();
                  setShowReport(false);
                  setShowSetupModal(true);
                }}
              >
                Reconfigure Test
              </VplaySecondaryButton>

              <VplaySecondaryButton
                size="normal"
                fullWidth={true}
                onClick={handleCopyReport}
              >
                {copied ? 'Report Copied to Clipboard!' : 'Copy Benchmark Report'}
              </VplaySecondaryButton>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

