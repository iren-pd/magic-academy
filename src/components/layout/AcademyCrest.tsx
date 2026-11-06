import { useState } from "react";
import { resolveAsset } from "@/data/assets";
import { cn } from "@/lib/utils";

export function AcademyCrest({ className }: { className?: string }) {
  const src = resolveAsset("academy-crest.webp");
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt="Герб Академии новогоднего волшебства"
        className={cn("object-contain", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <svg viewBox="0 0 80 80" className={cn(className)} role="img" aria-label="Герб Академии новогоднего волшебства">
      <defs>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6e7c4" />
          <stop offset="100%" stopColor="#b8925a" />
        </linearGradient>
      </defs>
      <path
        d="M40 6 L66 16 V38 C66 54 54 66 40 74 C26 66 14 54 14 38 V16 Z"
        fill="#b52e43"
        stroke="url(#crest-gold)"
        strokeWidth="3"
      />
      <path d="M40 22 L44 34 H56 L46 42 L50 54 L40 46 L30 54 L34 42 L24 34 H36 Z" fill="url(#crest-gold)" />
    </svg>
  );
}
