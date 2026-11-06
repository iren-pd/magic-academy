import { useState } from "react";
import { DirectorStandIn } from "@/components/characters/DirectorStandIn";
import { ProfessorStandIn } from "@/components/characters/ProfessorStandIn";
import { resolveAsset } from "@/data/assets";
import { getCharacter } from "@/data/characters";
import { cn } from "@/lib/utils";
import type { CharacterId } from "@/types/game";

const assetFile: Record<CharacterId, string> = {
  director: "director.webp",
  "professor-accuracy": "professor-accuracy.webp",
  "professor-wrapping": "professor-wrapping.webp",
  "professor-alchemy": "professor-alchemy.webp",
  "professor-literature": "professor-literature.webp",
  "professor-cartography": "professor-cartography.webp",
  "professor-physiognomy": "professor-physiognomy.webp",
  "professor-intuition": "professor-intuition.webp",
  "professor-elements": "professor-elements.webp",
};

export function CharacterPortrait({
  characterId,
  className,
  priority = false,
  stage = false,
  caption = true,
}: {
  characterId: CharacterId;
  className?: string;
  priority?: boolean;
  stage?: boolean;
  caption?: boolean;
}) {
  const character = getCharacter(characterId);
  const src = resolveAsset(assetFile[characterId]);
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const directorFallback = characterId === "director" && !showImage;

  return (
    <figure className={cn("grid h-full min-h-0 place-items-center", stage && "place-items-end", className)}>
      <div
        className={cn(
          "relative mx-auto h-full max-h-full",
          stage
            ? "overflow-visible"
            : "overflow-hidden rounded-[1.6rem] border border-gold/50 bg-[#fffaf3] shadow-[0_18px_40px_rgba(125,38,60,0.12)]",
        )}
        style={{
          width: "min(100cqw, calc(100cqh * 3 / 4))",
          height: "min(100cqh, calc(100cqw * 4 / 3))",
        }}
      >
        {showImage ? (
          <img
            src={src ?? undefined}
            alt={`${character.name}, ${character.title}`}
            className={cn("relative z-10 h-full w-full", stage ? "object-contain object-bottom" : "object-cover")}
            fetchPriority={priority ? "high" : "auto"}
            onError={() => setFailed(true)}
          />
        ) : directorFallback ? (
          <DirectorStandIn />
        ) : (
          <ProfessorStandIn character={character} />
        )}
        {caption ? <figcaption
          className={cn(
            "portrait-caption absolute inset-x-0 bottom-0 z-20 px-4 pt-8 pb-3",
            stage
              ? "bg-gradient-to-t from-[#f7f0e5] via-[#f7f0e5cc] to-transparent"
              : "bg-gradient-to-t from-[#fff6ea] via-[#fff6eacc] to-transparent",
          )}
        >
          <p className="font-display text-xl leading-none text-burgundy">{character.name}</p>
          <p className="mt-1 text-xs text-ink/70">{character.title}</p>
        </figcaption> : null}
      </div>
    </figure>
  );
}
