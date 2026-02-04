import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";

type SplitType = "chars" | "words" | "lines" | "words, chars";
type TagType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

interface SplitTextProps {
  text: string;
  tag?: TagType;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitType;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  tag: Tag = "p",
  className = "",
  delay = 50,
  duration = 0.8,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-50px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  const elements = useMemo((): Array<{ char: string; key: string; addSpace?: boolean }> => {
    if (splitType === "chars" || splitType === "words, chars") {
      return text.split("").map((char, i) => ({
        char: char === " " ? "\u00A0" : char,
        key: `char-${i}`,
      }));
    } else if (splitType === "words") {
      return text.split(" ").map((word, i) => ({
        char: word,
        key: `word-${i}`,
        addSpace: i < text.split(" ").length - 1,
      }));
    } else {
      return text.split("\n").map((line, i) => ({
        char: line,
        key: `line-${i}`,
      }));
    }
  }, [text, splitType]);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const chars = containerRef.current?.querySelectorAll(".split-char");
            if (chars) {
              gsap.fromTo(
                chars,
                from,
                {
                  ...to,
                  duration,
                  ease,
                  stagger: delay / 1000,
                  onComplete: onLetterAnimationComplete,
                }
              );
            }
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [delay, duration, ease, from, to, threshold, rootMargin, onLetterAnimationComplete]);

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ textAlign }}
    >
      {elements.map((el) => (
        <span
          key={el.key}
          className="split-char inline-block"
          style={{ opacity: 0 }}
        >
          {el.char}
          {"addSpace" in el && el.addSpace && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
