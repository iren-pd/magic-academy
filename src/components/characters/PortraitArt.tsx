import type { PortraitSpec } from "@/types/game";

function Hair({ spec }: { spec: PortraitSpec }) {
  const fill = spec.hair;
  if (spec.hairStyle === "bun") {
    return (
      <g>
        <path d="M128 150 C120 96 168 78 196 92 C214 70 250 92 246 140 C230 118 196 112 180 128 C150 110 132 124 128 150Z" fill={fill} />
        <circle cx="214" cy="108" r="22" fill={fill} />
        <circle cx="214" cy="108" r="8" fill="#e2c48a" opacity="0.8" />
      </g>
    );
  }
  if (spec.hairStyle === "streak") {
    return (
      <g>
        <path d="M124 158 C118 104 156 78 180 86 C206 70 248 104 236 160 C214 128 196 124 180 136 C156 120 136 132 124 158Z" fill={fill} />
        <path d="M198 92 C210 118 206 150 198 168" fill="none" stroke="#f4efe6" strokeWidth="8" strokeLinecap="round" />
      </g>
    );
  }
  if (spec.hairStyle === "wild") {
    return (
      <g fill={fill}>
        <path d="M126 150 C110 96 150 64 180 78 C214 52 258 96 236 158 C214 120 150 116 126 150Z" />
        <path d="M132 112 L118 78 L150 100Z" />
        <path d="M176 86 L174 54 L198 84Z" />
        <path d="M214 90 L236 58 L232 104Z" />
      </g>
    );
  }
  if (spec.hairStyle === "balding") {
    return (
      <g fill={fill}>
        <path d="M122 168 C116 140 132 124 150 128 C146 112 168 108 176 124 C176 124 170 150 160 156 C140 150 128 160 122 168Z" />
        <path d="M238 168 C244 140 228 124 210 128 C214 112 192 108 184 124 C184 124 190 150 200 156 C220 150 232 160 238 168Z" />
      </g>
    );
  }
  return (
    <path
      d="M122 162 C114 108 150 74 180 82 C214 68 252 108 238 164 C220 132 206 126 180 136 C150 124 134 136 122 162Z"
      fill={fill}
    />
  );
}

function Beard({ spec }: { spec: PortraitSpec }) {
  if (spec.beardStyle === "none") return null;
  if (spec.beardStyle === "short") {
    return (
      <path
        d="M138 196 C146 214 166 222 180 222 C194 222 214 214 222 196 C210 208 196 212 180 212 C164 212 150 208 138 196Z"
        fill={spec.beard}
      />
    );
  }
  return (
    <path
      d="M128 188 C124 230 146 286 180 302 C214 286 236 230 232 188 C214 214 196 226 180 226 C164 226 146 214 128 188Z"
      fill={spec.beard}
    />
  );
}

function Glasses({ spec }: { spec: PortraitSpec }) {
  if (spec.glasses === "none") return null;
  if (spec.glasses === "monocle") {
    return (
      <g fill="none" stroke="#e2c48a" strokeLinecap="round">
        <circle cx="156" cy="168" r="16" strokeWidth="3" />
        <path d="M146 182 C136 198 128 206 118 214" strokeWidth="1.6" />
      </g>
    );
  }
  if (spec.glasses === "goggles") {
    return (
      <g>
        <path d="M118 160 H242" stroke="#d5dedb" strokeWidth="4" strokeLinecap="round" />
        <circle cx="150" cy="164" r="18" fill="rgba(186, 224, 214, 0.38)" stroke="#e7f1ee" strokeWidth="3" />
        <circle cx="210" cy="164" r="18" fill="rgba(186, 224, 214, 0.38)" stroke="#e7f1ee" strokeWidth="3" />
      </g>
    );
  }
  if (spec.glasses === "half-moon") {
    return (
      <g fill="none" stroke="#e2c48a" strokeWidth="3" strokeLinecap="round">
        <path d="M132 170 Q150 190 168 170" />
        <path d="M192 170 Q210 190 228 170" />
        <path d="M168 170 H192" />
      </g>
    );
  }
  const tilt = spec.glasses === "crooked" ? 8 : 0;
  return (
    <g transform={`rotate(${tilt} 180 168)`} fill="none" stroke="#e2c48a" strokeWidth="3">
      <circle cx="150" cy="168" r="16" />
      <circle cx="210" cy="168" r="16" />
      <path d="M166 168 H194" />
    </g>
  );
}

function Prop({ spec }: { spec: PortraitSpec }) {
  switch (spec.prop) {
    case "wand":
      return (
        <g>
          <path d="M262 250 L300 188" stroke="#e2c48a" strokeWidth="4" strokeLinecap="round" />
          <path d="M300 188 L292 176 L308 180 L300 164 L296 180 L284 176 Z" fill="#f6e7c4" />
        </g>
      );
    case "orb":
      return (
        <g>
          <circle cx="286" cy="250" r="22" fill="#31745a" stroke="#d7ad62" strokeWidth="3" />
          <circle cx="278" cy="242" r="7" fill="#f7f0e5" opacity="0.7" />
        </g>
      );
    case "ribbon":
      return (
        <g fill="none" stroke="#f3e2bc" strokeWidth="4" strokeLinecap="round">
          <path d="M268 220 C300 210 312 250 286 262 C262 274 292 300 314 286" />
          <path d="M286 248 C274 236 270 228 278 216" />
        </g>
      );
    case "flask":
      return (
        <g>
          <path d="M276 214 H296 L292 232 L308 268 C310 278 270 278 272 268 L288 232 Z" fill="#d5efe4" stroke="#e7f6f1" strokeWidth="2" />
          <path d="M274 258 H306" stroke="#7dcea0" strokeWidth="8" strokeLinecap="round" />
          <circle cx="286" cy="248" r="3" fill="#f6e7c4" />
        </g>
      );
    case "quill":
      return (
        <g>
          <path d="M286 292 C300 250 318 220 306 196 C292 214 286 240 280 292Z" fill="#f7f1e6" />
          <path d="M286 292 L278 308" stroke="#e2c48a" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "map":
      return (
        <g>
          <path d="M250 230 H318 V292 H250 Z" fill="#f3e6c8" stroke="#c4a36a" strokeWidth="2" />
          <path d="M258 250 C274 242 286 262 304 248 C310 258 300 274 284 270 C270 278 260 266 258 250Z" fill="none" stroke="#6e2433" strokeWidth="2" />
          <circle cx="292" cy="258" r="3" fill="#8d2a3a" />
        </g>
      );
    case "masks":
      return (
        <g>
          <circle cx="270" cy="246" r="14" fill="#f7f1e6" stroke="#e2c48a" strokeWidth="2" />
          <circle cx="300" cy="258" r="14" fill="#f7f1e6" stroke="#8d2a3a" strokeWidth="2" />
          <path d="M264 250 Q270 254 276 250" fill="none" stroke="#2c2116" strokeWidth="1.4" />
          <path d="M294 262 Q300 258 306 264" fill="none" stroke="#2c2116" strokeWidth="1.4" />
        </g>
      );
    case "pendulum":
      return (
        <g>
          <path d="M292 210 V268" stroke="#e2c48a" strokeWidth="2" />
          <circle cx="292" cy="278" r="10" fill="#8d2a3a" stroke="#f6e7c4" strokeWidth="2" />
        </g>
      );
    case "flame":
      return (
        <g>
          <path d="M292 214 C306 236 312 250 292 276 C272 250 278 234 292 214Z" fill="#e7a15a" />
          <path d="M292 236 C300 248 300 258 292 266 C284 256 286 246 292 236Z" fill="#f6e7c4" />
        </g>
      );
    default:
      return null;
  }
}

export function PortraitArt({ spec }: { spec: PortraitSpec }) {
  const eyeY = 166;
  const pupil = spec.pupilShift;
  const mouthY = spec.beardStyle === "full" ? 198 : 204;
  return (
    <svg viewBox="0 0 360 440" className="h-full w-full" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`glow-${spec.robe.replace("#", "")}`} cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor={spec.glow} stopOpacity="0.85" />
          <stop offset="70%" stopColor="#10241f" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0c1816" stopOpacity="0.05" />
        </radialGradient>
        <linearGradient id={`robe-${spec.robe.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={spec.robe} />
          <stop offset="100%" stopColor={spec.robeShadow} />
        </linearGradient>
      </defs>
      <rect width="360" height="440" fill="#fff6ea" />
      <rect width="360" height="440" fill={`url(#glow-${spec.robe.replace("#", "")})`} />
      <ellipse cx="180" cy="404" rx="92" ry="14" fill="rgba(0,0,0,0.28)" />
      <path
        d="M108 250 C96 330 104 392 150 410 H210 C256 392 264 330 252 250 C214 276 146 276 108 250Z"
        fill={`url(#robe-${spec.robe.replace("#", "")})`}
      />
      <path d="M118 268 C104 300 112 348 136 362 L128 286Z" fill={spec.robeShadow} />
      <path d="M242 268 C256 300 248 348 224 362 L232 286Z" fill={spec.robeShadow} />
      {spec.furCollar ? (
        <path d="M118 252 C140 286 220 286 242 252 C230 276 180 292 130 274 C122 268 118 260 118 252Z" fill="#f7f4ef" />
      ) : (
        <path d="M126 258 C150 280 210 280 234 258 C210 274 150 274 126 258Z" fill={spec.lining} opacity="0.85" />
      )}
      {spec.embroidery ? (
        <g fill="none" stroke={spec.lining} strokeWidth="2" opacity="0.9">
          <path d="M180 292 V378" />
          <path d="M180 318 l-10 8 10 8 10-8z" />
        </g>
      ) : null}
      <path d="M164 214 H196 L190 246 H170Z" fill={spec.skin} />
      <circle cx="180" cy="164" r="58" fill={spec.skin} />
      <Hair spec={spec} />
      <Beard spec={spec} />
      <path d="M176 162 C178 176 184 176 186 164" fill="none" stroke="#c8927a" strokeWidth="2" strokeLinecap="round" />
      <g>
        <ellipse cx={150} cy={eyeY} rx={spec.narrowed ? 8 : 9} ry={spec.narrowed ? 3.2 : 5} fill="#f8f4ee" />
        <ellipse cx={210} cy={eyeY} rx={spec.narrowed ? 8 : 9} ry={spec.narrowed ? 3.2 : 5} fill="#f8f4ee" />
        <circle cx={152 + pupil} cy={eyeY + 0.5} r="2.3" fill="#3a2a22" />
        <circle cx={208 + pupil} cy={eyeY + 0.5} r="2.3" fill="#3a2a22" />
        <circle cx={154 + pupil} cy={eyeY - 1} r="0.8" fill="#fff" />
        <circle cx={210 + pupil} cy={eyeY - 1} r="0.8" fill="#fff" />
      </g>
      <path
        d={`M138 ${148 - spec.browLift} Q150 ${142 - spec.browLift} 164 150`}
        fill="none"
        stroke="#6d5346"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={`M196 150 Q212 ${140 + spec.browLift * 0.2} 224 ${148 + spec.browLift * 0.15}`}
        fill="none"
        stroke="#6d5346"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={`M164 ${mouthY} Q180 ${mouthY + 8 + spec.smile * 6} 196 ${mouthY - spec.smile * 2}`}
        fill="none"
        stroke="#a56a5c"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <Glasses spec={spec} />
      <Prop spec={spec} />
    </svg>
  );
}
