import { useState } from "react";
import { ProfessorStandIn } from "@/components/characters/ProfessorStandIn";
import { resolveAsset } from "@/data/assets";
import { getCharacter } from "@/data/characters";
import { publicAsset } from "@/lib/publicAsset";
import { cn } from "@/lib/utils";
import type { ProfessorId } from "@/types/game";

const webpFile: Record<ProfessorId, string> = {
  "professor-accuracy": "professor-accuracy.webp",
  "professor-wrapping": "professor-wrapping.webp",
  "professor-alchemy": "professor-alchemy.webp",
  "professor-literature": "professor-literature.webp",
  "professor-cartography": "professor-cartography.webp",
  "professor-physiognomy": "professor-physiognomy.webp",
  "professor-intuition": "professor-intuition.webp",
  "professor-elements": "professor-elements.webp",
};

function professorSource(professorId: ProfessorId): string | null {
  if (professorId === "professor-accuracy") return publicAsset("assets/characters/professor-accuracy.png");
  if (professorId === "professor-wrapping") return publicAsset("assets/characters/professor-wrapping.png");
  if (professorId === "professor-alchemy") return publicAsset("assets/characters/professor-alchemy.png");
  if (professorId === "professor-literature") return publicAsset("assets/characters/professor-eloquence.png");
  if (professorId === "professor-cartography") return publicAsset("assets/characters/professor-cartography.png");
  if (professorId === "professor-physiognomy") return publicAsset("assets/characters/professor-physiognomy.png");
  return resolveAsset(webpFile[professorId]);
}

export function ProfessorScene({ professorId }: { professorId: ProfessorId }) {
  const character = getCharacter(professorId);
  const src = professorSource(professorId);
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <figure
      data-enter="left"
      className={cn(
        "pointer-events-none relative z-10 mx-auto w-full min-w-0 max-w-full lg:absolute lg:left-0 lg:mx-0 lg:h-auto lg:w-[calc((100%-clamp(24px,3vw,56px))*0.42)]",
        professorId === "professor-literature" || professorId === "professor-cartography" || professorId === "professor-physiognomy"
          ? "lg:bottom-0"
          : "lg:bottom-[-1.5vh]",
        showImage ? "lg:[aspect-ratio:1312/1199]" : "lg:[aspect-ratio:3/4]",
      )}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={`${character.name}, ${character.title}`}
          className="block h-auto max-h-[40vh] w-auto max-w-full object-contain object-left-bottom lg:h-full lg:max-h-none lg:w-full"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="h-[min(40vh,320px)] w-[min(72vw,280px)] lg:h-full lg:w-full">
          <ProfessorStandIn character={character} />
        </div>
      )}
      <figcaption
        className={cn(
          "absolute bottom-2 left-2 z-10 max-w-[16.5rem] rounded-2xl border border-[#D7AD62] bg-[rgba(255,248,236,0.96)] px-3 py-1.5 shadow-[0_8px_20px_rgba(73,59,53,0.12)] lg:left-3",
          professorId === "professor-alchemy"
            ? "lg:bottom-[22%] lg:max-w-[13rem]"
            : professorId === "professor-literature"
              ? "lg:bottom-[18%] lg:max-w-[12.5rem]"
              : "lg:bottom-[3vh]",
        )}
      >
        <p className="font-display text-sm leading-none text-[#6D2637]">{character.name}</p>
        <p className="mt-1 text-[11px] leading-tight text-[#493B35]">{character.title}</p>
      </figcaption>
    </figure>
  );
}
