import { ReactNode, CSSProperties, useMemo } from "react";

interface GradientTextProps {
  children: ReactNode;
  colors?: string[];
  animationSpeed?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function GradientText({
  children,
  colors = ["#9D3339", "#450D1B", "#9D3339"],
  animationSpeed = 3,
  className = "",
  as: Component = "span",
}: GradientTextProps) {
  const gradientStyle = useMemo<CSSProperties>(() => {
    const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;
    return {
      backgroundImage: gradient,
      backgroundSize: `${colors.length * 100}% 100%`,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: `gradient-shift ${animationSpeed}s ease-in-out infinite`,
    };
  }, [colors, animationSpeed]);

  return (
    <>
      <style>
        {`
          @keyframes gradient-shift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
      <Component className={`inline-block ${className}`} style={gradientStyle}>
        {children}
      </Component>
    </>
  );
}
