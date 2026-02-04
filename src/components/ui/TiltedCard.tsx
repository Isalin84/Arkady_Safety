import { useRef, useState, ReactNode, CSSProperties } from "react";

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  transitionSpeed?: number;
  glare?: boolean;
  glareMaxOpacity?: number;
  disabled?: boolean;
}

export default function TiltedCard({
  children,
  className = "",
  maxTilt = 15,
  scale = 1.02,
  perspective = 1000,
  transitionSpeed = 400,
  glare = true,
  glareMaxOpacity = 0.2,
  disabled = false,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const tiltX = (mouseY / (rect.height / 2)) * -maxTilt;
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt;

    setTilt({ x: tiltX, y: tiltY });

    // Calculate glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  const cardStyle: CSSProperties = {
    perspective: `${perspective}px`,
    transformStyle: "preserve-3d",
  };

  const innerStyle: CSSProperties = {
    transform: isHovered
      ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${scale})`
      : "rotateX(0deg) rotateY(0deg) scale(1)",
    transition: isHovered
      ? `transform ${transitionSpeed / 2}ms ease-out`
      : `transform ${transitionSpeed}ms ease-out`,
    transformStyle: "preserve-3d",
    position: "relative",
    overflow: "hidden",
  };

  const glareStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glareMaxOpacity}), transparent 50%)`,
    opacity: isHovered ? 1 : 0,
    transition: `opacity ${transitionSpeed}ms ease-out`,
    pointerEvents: "none",
    borderRadius: "inherit",
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={innerStyle}>
        {children}
        {glare && <div style={glareStyle} />}
      </div>
    </div>
  );
}
