const snow = [
  { left: "4%", delay: "0s", duration: "11s", size: 6 },
  { left: "12%", delay: "1.4s", duration: "13s", size: 4 },
  { left: "21%", delay: "0.6s", duration: "9s", size: 5 },
  { left: "33%", delay: "2.1s", duration: "12s", size: 3 },
  { left: "46%", delay: "0.2s", duration: "14s", size: 5 },
  { left: "58%", delay: "1.8s", duration: "10s", size: 4 },
  { left: "69%", delay: "0.9s", duration: "12s", size: 6 },
  { left: "78%", delay: "2.6s", duration: "9s", size: 3 },
  { left: "88%", delay: "1.1s", duration: "13s", size: 5 },
  { left: "95%", delay: "0.4s", duration: "11s", size: 4 },
];

export function FestiveHall({ tree = true }: { tree?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hall-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7c9a2" />
            <stop offset="100%" stopColor="#c9a37a" />
          </linearGradient>
          <linearGradient id="hall-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d7e7f4" />
            <stop offset="100%" stopColor="#f7f3ea" />
          </linearGradient>
          <radialGradient id="ornament-red" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f2c2c8" />
            <stop offset="45%" stopColor="#b52e43" />
            <stop offset="100%" stopColor="#7d263c" />
          </radialGradient>
          <radialGradient id="ornament-gold" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff6df" />
            <stop offset="50%" stopColor="#d7ad62" />
            <stop offset="100%" stopColor="#a7843e" />
          </radialGradient>
        </defs>
        <rect x="70" y="70" width="250" height="390" rx="120" fill="url(#hall-sky)" />
        <rect x="1120" y="70" width="250" height="390" rx="120" fill="url(#hall-sky)" />
        <rect x="90" y="90" width="210" height="350" rx="100" fill="#f4fbff" opacity="0.55" />
        <rect x="1140" y="90" width="210" height="350" rx="100" fill="#f4fbff" opacity="0.55" />
        <path d="M150 430 C170 360 190 330 210 250 C230 330 250 360 270 430" fill="#31745a" />
        <path d="M175 390 C190 340 205 320 220 270 C235 320 250 340 265 390" fill="#3d8a6c" />
        <path d="M1200 440 C1225 350 1250 310 1275 230 C1300 310 1325 350 1350 440" fill="#245c46" />
        <path d="M1230 400 C1250 340 1268 315 1285 260 C1305 315 1322 340 1340 400" fill="#31745a" />
        <ellipse cx="210" cy="250" rx="18" ry="8" fill="#fff" opacity="0.8" />
        <ellipse cx="1275" cy="230" rx="22" ry="9" fill="#fff" opacity="0.85" />
        <path d="M0 760 C240 700 480 820 720 760 C980 700 1220 820 1440 740 L1440 900 L0 900 Z" fill="url(#hall-floor)" />
        <path d="M0 790 C300 750 520 830 760 785 C1040 730 1240 820 1440 770" fill="none" stroke="#d7ad62" strokeOpacity="0.35" />
        {tree ? (
          <g transform="translate(360 240)">
            <rect x="68" y="390" width="28" height="70" rx="6" fill="#7d263c" />
            <path d="M82 40 L150 170 H14 Z" fill="#245c46" />
            <path d="M82 120 L168 250 H-4 Z" fill="#31745a" />
            <path d="M82 210 L186 360 H-22 Z" fill="#3d8a6c" />
            <circle cx="48" cy="150" r="12" fill="url(#ornament-red)" />
            <circle cx="112" cy="188" r="11" fill="url(#ornament-gold)" />
            <circle cx="70" cy="250" r="13" fill="url(#ornament-red)" />
            <circle cx="126" cy="300" r="12" fill="url(#ornament-gold)" />
            <circle cx="40" cy="320" r="10" fill="url(#ornament-gold)" />
            <path d="M82 18 L90 40 H74 Z" fill="#d7ad62" />
          </g>
        ) : null}
        <path d="M40 78 H1400" fill="none" stroke="#31745a" strokeWidth="10" strokeLinecap="round" />
        <g fill="#d7ad62">
          <circle cx="160" cy="78" r="7" />
          <circle cx="280" cy="78" r="7" />
          <circle cx="400" cy="78" r="7" />
          <circle cx="520" cy="78" r="7" />
          <circle cx="640" cy="78" r="7" />
          <circle cx="760" cy="78" r="7" />
          <circle cx="880" cy="78" r="7" />
          <circle cx="1000" cy="78" r="7" />
          <circle cx="1120" cy="78" r="7" />
          <circle cx="1240" cy="78" r="7" />
        </g>
      </svg>
      {snow.map((flake) => (
        <span
          key={flake.left}
          className="academy-snowflake absolute top-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}
