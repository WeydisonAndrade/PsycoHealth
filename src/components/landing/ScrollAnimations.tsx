"use client";

import { useEffect } from "react";

/** Intersection Observer e smooth scroll — comportamento do legacy/index.html */
export function ScrollAnimations() {
  useEffect(() => {
    const root = document.querySelector(".legacy-home");
    if (!root) return;

    document.querySelectorAll('.legacy-home a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.08 }
    );

    document.querySelectorAll(".legacy-home .animate-on-scroll").forEach((el) => {
      el.classList.add("is-visible");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
