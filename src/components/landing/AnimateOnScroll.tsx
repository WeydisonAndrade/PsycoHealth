"use client";

import { useEffect, useRef } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3;
}

/** Revela filhos suavemente quando entram na viewport (Intersection Observer). */
export function AnimateOnScroll({ children, className = "", delay }: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay ? `delay-${delay}` : "";

  return (
    <div ref={ref} className={`animate-on-scroll ${delayClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
