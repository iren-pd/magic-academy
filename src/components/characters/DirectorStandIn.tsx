export function DirectorStandIn() {
  return (
    <svg viewBox="0 0 420 640" className="h-full w-full" role="img" aria-label="Альберт Снегов, директор академии">
      <defs>
        <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d64558" />
          <stop offset="55%" stopColor="#b52e43" />
          <stop offset="100%" stopColor="#7d263c" />
        </linearGradient>
        <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#efe4d4" />
        </linearGradient>
        <radialGradient id="face" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffe0c4" />
          <stop offset="100%" stopColor="#e2b08a" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#7d263c" floodOpacity="0.18" />
        </filter>
      </defs>
      <ellipse cx="210" cy="590" rx="120" ry="18" fill="#7d263c" opacity="0.12" />
      <g filter="url(#soft)">
        <path d="M118 300 C90 360 78 470 96 560 H324 C342 470 330 360 302 300 C270 340 150 340 118 300 Z" fill="url(#coat)" />
        <path d="M150 318 C168 360 168 430 156 500 H196 C206 420 198 350 186 312 Z" fill="#f7f0e5" opacity="0.18" />
        <path d="M108 318 C78 300 70 360 92 390 C70 410 78 470 112 470 C96 410 110 350 140 330 Z" fill="url(#coat)" />
        <path d="M312 318 C342 300 350 360 328 390 C350 410 342 470 308 470 C324 410 310 350 280 330 Z" fill="url(#coat)" />
        <path d="M126 292 C150 330 270 330 294 292 C300 314 286 336 210 344 C134 336 120 314 126 292 Z" fill="url(#fur)" />
        <path d="M96 548 H324 C318 566 300 574 210 574 C120 574 102 566 96 548 Z" fill="url(#fur)" />
        <circle cx="168" cy="430" r="7" fill="#d7ad62" />
        <circle cx="210" cy="446" r="7" fill="#d7ad62" />
        <circle cx="252" cy="430" r="7" fill="#d7ad62" />
        <path d="M168 250 C150 210 168 150 210 142 C252 150 270 210 252 250 C244 230 176 230 168 250 Z" fill="#f7f4ef" />
        <ellipse cx="210" cy="214" rx="58" ry="66" fill="url(#face)" />
        <path d="M156 230 C150 280 168 318 210 324 C252 318 270 280 264 230 C246 268 174 268 156 230 Z" fill="#f7f4ef" />
        <path d="M188 214 C196 210 204 214 206 220" fill="none" stroke="#7d263c" strokeWidth="3" strokeLinecap="round" />
        <path d="M214 220 C216 214 224 210 232 214" fill="none" stroke="#7d263c" strokeWidth="3" strokeLinecap="round" />
        <circle cx="196" cy="222" r="3" fill="#3a241c" />
        <circle cx="224" cy="222" r="3" fill="#3a241c" />
        <path d="M176 214 H216" fill="none" stroke="#d7ad62" strokeWidth="3" />
        <path d="M204 214 H244" fill="none" stroke="#d7ad62" strokeWidth="3" />
        <circle cx="176" cy="214" r="12" fill="none" stroke="#d7ad62" strokeWidth="3" />
        <circle cx="244" cy="214" r="12" fill="none" stroke="#d7ad62" strokeWidth="3" />
        <path d="M198 248 C206 256 218 256 226 248" fill="none" stroke="#b52e43" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="176" cy="236" rx="8" ry="5" fill="#e7a08a" opacity="0.7" />
        <ellipse cx="246" cy="236" rx="8" ry="5" fill="#e7a08a" opacity="0.7" />
      </g>
    </svg>
  );
}
