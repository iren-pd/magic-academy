import { useEffect, useRef, useState } from "react";
import { resolveAsset } from "@/data/assets";
import { animateStamp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ApprovedStamp({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const src = resolveAsset("approved-stamp.webp");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const context = animateStamp(ref.current);
    return () => context?.revert();
  }, []);

  return (
    <div ref={ref} className={cn("mx-auto w-28", className)}>
      {src && !failed ? (
        <img src={src} alt="ЗАЧТЕНО" className="h-auto w-full object-contain" onError={() => setFailed(true)} />
      ) : (
        <svg viewBox="0 0 160 160" className="h-auto w-full" role="img" aria-label="ЗАЧТЕНО">
          <circle cx="80" cy="80" r="68" fill="none" stroke="#8d2a3a" strokeWidth="6" />
          <circle cx="80" cy="80" r="56" fill="none" stroke="#e2c48a" strokeWidth="2" />
          <path d="M80 28 L84 42 H98 L87 50 L91 64 L80 56 L69 64 L73 50 L62 42 H76 Z" fill="#e2c48a" />
          <text
            x="80"
            y="104"
            textAnchor="middle"
            fill="#8d2a3a"
            fontFamily="Manrope, sans-serif"
            fontSize="22"
            fontWeight="700"
            letterSpacing="1"
          >
            ЗАЧТЕНО
          </text>
        </svg>
      )}
    </div>
  );
}
