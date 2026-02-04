import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: boolean;
  scale?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "-50px",
  delay = 0,
  duration = 0.6,
  distance = 30,
  direction = "up",
  blur = true,
  scale = 1,
  once = true,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasAnimated.current) return;
            hasAnimated.current = true;
            setIsVisible(true);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const getTransform = (): string => {
    if (isVisible) return "translate(0, 0)";
    
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`;
      case "down":
        return `translateY(-${distance}px)`;
      case "left":
        return `translateX(${distance}px)`;
      case "right":
        return `translateX(-${distance}px)`;
      default:
        return `translateY(${distance}px)`;
    }
  };

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: `${getTransform()} scale(${isVisible ? 1 : scale})`,
    filter: blur && !isVisible ? "blur(10px)" : "blur(0px)",
    transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s, filter ${duration}s ease-out ${delay}s`,
  };

  return (
    <div ref={elementRef} className={className} style={style}>
      {children}
    </div>
  );
}
