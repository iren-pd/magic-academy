import type { CharacterProfile } from "@/types/game";

function PropMark({ prop }: { prop: CharacterProfile["portrait"]["prop"] }) {
  switch (prop) {
    case "wand":
      return (
        <g>
          <path d="M300 250 L346 190" stroke="#d7ad62" strokeWidth="5" strokeLinecap="round" />
          <path d="M346 190 L336 176 L356 182 L346 164 L340 182 L324 176 Z" fill="#f3e2b8" />
        </g>
      );
    case "orb":
      return (
        <g>
          <circle cx="328" cy="250" r="26" fill="#31745a" />
          <circle cx="318" cy="240" r="8" fill="#f7f0e5" opacity="0.55" />
        </g>
      );
    case "ribbon":
      return (
        <path
          d="M292 214 C330 200 348 246 312 268 C286 286 330 320 356 300"
          fill="none"
          stroke="#d7ad62"
          strokeWidth="6"
          strokeLinecap="round"
        />
      );
    case "flask":
      return (
        <g>
          <path d="M312 214 H340 L336 236 L354 278 C356 292 300 292 302 278 L320 236 Z" fill="#d7efe4" stroke="#31745a" strokeWidth="3" />
          <path d="M308 262 H348" stroke="#31745a" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case "quill":
      return <path d="M330 300 C348 250 372 214 356 186 C338 210 328 246 322 300 Z" fill="#f7f0e5" stroke="#d7ad62" strokeWidth="3" />;
    case "map":
      return (
        <g>
          <rect x="292" y="220" width="72" height="56" rx="6" fill="#fffaf3" stroke="#d7ad62" strokeWidth="3" />
          <path d="M304 246 C320 236 336 258 354 244" fill="none" stroke="#7d263c" strokeWidth="2" />
        </g>
      );
    case "masks":
      return (
        <g>
          <ellipse cx="314" cy="236" rx="16" ry="20" fill="#fffaf3" stroke="#d7ad62" strokeWidth="3" />
          <ellipse cx="348" cy="252" rx="16" ry="20" fill="#fffaf3" stroke="#b52e43" strokeWidth="3" />
        </g>
      );
    case "pendulum":
      return (
        <g>
          <path d="M332 196 V268" stroke="#d7ad62" strokeWidth="3" />
          <circle cx="332" cy="286" r="14" fill="#b52e43" stroke="#d7ad62" strokeWidth="3" />
        </g>
      );
    case "flame":
      return <path d="M332 200 C354 236 360 258 332 292 C304 258 312 234 332 200 Z" fill="#e7a15a" />;
    default:
      return null;
  }
}

export function ProfessorStandIn({ character }: { character: CharacterProfile }) {
  const spec = character.portrait;
  const hairBump = spec.hairStyle === "bun" ? 18 : spec.hairStyle === "wild" ? 28 : spec.hairStyle === "balding" ? 0 : 12;

  return (
    <svg viewBox="0 0 420 720" className="h-full w-full drop-shadow-[0_18px_30px_rgba(125,38,60,0.16)]" role="img" aria-label={`${character.name}, ${character.title}`}>
      <ellipse cx="190" cy="676" rx="108" ry="16" fill="#7d263c" opacity="0.12" />
      <path
        d="M96 340 C62 430 58 560 86 650 H292 C324 560 316 430 278 340 C236 392 138 392 96 340 Z"
        fill={spec.robe}
      />
      <path d="M118 360 C132 470 128 560 118 640 H168 C176 540 164 440 150 360 Z" fill={spec.robeShadow} opacity="0.35" />
      <path d="M108 348 C150 390 230 390 274 348 C250 378 132 378 108 348 Z" fill={spec.furCollar ? "#fffaf3" : spec.lining} />
      <circle cx="168" cy="470" r="6" fill="#d7ad62" />
      <circle cx="190" cy="498" r="6" fill="#d7ad62" />
      <circle cx="214" cy="470" r="6" fill="#d7ad62" />
      <path d="M86 650 H292 C286 668 262 678 190 678 C118 678 94 668 86 650 Z" fill="#fffaf3" />
      <circle cx="188" cy="248" r="62" fill={spec.skin} />
      <path
        d={`M128 250 C118 ${150 - hairBump} 150 ${96 - hairBump} 188 108 C230 ${78 - hairBump} 268 130 252 250 C230 210 150 206 128 250 Z`}
        fill={spec.hair}
      />
      {spec.beardStyle === "none" ? null : (
        <path
          d={
            spec.beardStyle === "short"
              ? "M140 286 C156 314 176 324 188 324 C200 324 220 314 236 286 C214 304 162 304 140 286 Z"
              : "M132 270 C124 330 150 392 188 408 C226 392 252 330 244 270 C220 310 156 310 132 270 Z"
          }
          fill={spec.beard}
        />
      )}
      {spec.glasses === "none" ? null : (
        <g fill="none" stroke="#d7ad62" strokeWidth="3">
          <circle cx="166" cy="246" r="16" />
          <circle cx="214" cy="246" r="16" />
          <path d="M182 246 H198" />
        </g>
      )}
      <PropMark prop={spec.prop} />
    </svg>
  );
}
