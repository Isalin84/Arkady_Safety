import { useEffect, useRef, useMemo } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

interface AuroraProps {
  colorStops?: [string, string, string];
  speed?: number;
  blend?: number;
  amplitude?: number;
  className?: string;
}

const vertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uBlend;
  uniform float uAmplitude;
  
  varying vec2 vUv;
  
  void main() {
    float time = uTime * 0.5;
    
    // Create smooth aurora waves
    float wave1 = sin(vUv.x * 3.0 + time) * 0.5 + 0.5;
    float wave2 = sin(vUv.x * 2.0 - time * 0.7 + 1.0) * 0.5 + 0.5;
    float wave3 = sin(vUv.x * 4.0 + time * 0.5 + 2.0) * 0.5 + 0.5;
    
    // Vertical gradient for aurora effect
    float vertGrad = smoothstep(0.0, 1.0, vUv.y);
    
    // Combine waves with amplitude
    float aurora = (wave1 + wave2 + wave3) / 3.0 * uAmplitude;
    aurora *= vertGrad;
    
    // Mix colors
    vec3 color = mix(uColor1, uColor2, wave1);
    color = mix(color, uColor3, wave2 * 0.5);
    
    // Apply blend factor
    float alpha = aurora * uBlend;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
}

export default function Aurora({
  colorStops = ["#3A29FF", "#FF94B4", "#FF3232"],
  speed = 1.0,
  blend = 0.5,
  amplitude = 1.0,
  className = "",
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null);
  const frameRef = useRef<number>(0);

  const colors = useMemo(
    () => colorStops.map((hex) => hexToRgb(hex)),
    [colorStops]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Initialize renderer
    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    container.appendChild(gl.canvas);

    // Create geometry and program
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new Color(...colors[0]) },
        uColor2: { value: new Color(...colors[1]) },
        uColor3: { value: new Color(...colors[2]) },
        uBlend: { value: blend },
        uAmplitude: { value: amplitude },
      },
      transparent: true,
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });

    // Resize handler
    const resize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width, height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Animation loop
    let startTime = performance.now();
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      program.uniforms.uTime.value = elapsed * speed;
      renderer.render({ scene: mesh });
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [colors, speed, blend, amplitude]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
