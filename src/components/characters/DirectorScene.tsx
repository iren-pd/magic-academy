import { CharacterPortrait } from "@/components/characters/CharacterPortrait";
import { cn } from "@/lib/utils";

export function DirectorScene({ className, stage = false }: { className?: string; stage?: boolean }) {
  return (
    <div data-enter="left" className={cn("h-full min-h-0 w-full [container-type:size]", className)}>
      <CharacterPortrait characterId="director" priority stage={stage} />
    </div>
  );
}
