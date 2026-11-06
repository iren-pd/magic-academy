import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

const particles = [
  { left: "6%", top: "18%", size: 3 },
  { left: "14%", top: "72%", size: 2 },
  { left: "22%", top: "30%", size: 4 },
  { left: "31%", top: "84%", size: 2 },
  { left: "48%", top: "12%", size: 3 },
  { left: "58%", top: "68%", size: 2 },
  { left: "67%", top: "24%", size: 4 },
  { left: "76%", top: "78%", size: 3 },
  { left: "84%", top: "16%", size: 2 },
  { left: "91%", top: "48%", size: 3 },
  { left: "38%", top: "42%", size: 2 },
  { left: "52%", top: "88%", size: 3 },
];

export function MagicalParticles({ density = "calm" }: { density?: "calm" | "festive" }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = density === "festive" ? particles : particles.slice(0, 7);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const dots = root.querySelectorAll<HTMLElement>("[data-particle]");
    const context = gsap.context(() => {
      dots.forEach((dot, index) => {
        gsap.to(dot, {
          y: -18 - (index % 4) * 8,
          x: (index % 2 === 0 ? 1 : -1) * (6 + (index % 3) * 4),
          opacity: 0.35 + (index % 3) * 0.15,
          duration: 3.2 + (index % 4) * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.18,
        });
      });
    }, root);
    return () => context.revert();
  }, [density]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {visible.map((particle) => (
        <span
          key={`${particle.left}-${particle.top}`}
          data-particle
          className="absolute rounded-full bg-gold"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: 0.8,
            boxShadow: "0 0 12px rgba(215, 173, 98, 0.9)",
          }}
        />
      ))}
    </div>
  );
}
