import { AcademyCrest } from "@/components/layout/AcademyCrest";
import { ProgressIndicator } from "@/components/layout/ProgressIndicator";
import { exams } from "@/data/exams";
import { useGameProgress } from "@/hooks/useGameProgress";
import { Badge } from "@/components/ui/badge";

export function AcademyHeader({ kicker }: { kicker?: string }) {
  const { state } = useGameProgress();
  const passed = state.completedExamIds.length;

  return (
    <header className="academy-header flex shrink-0 flex-col gap-2 py-2.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <AcademyCrest className="size-9 shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-none text-ink sm:text-xl">
              Академия новогоднего волшебства
            </p>
            <p className="mt-1 text-[11px] tracking-[0.16em] text-festive uppercase">
              {kicker ?? "Электронная деканатская"}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="hidden h-7 border-gold/40 px-3 text-burgundy sm:inline-flex">
          Сдано {passed} из {exams.length}
        </Badge>
      </div>
      <ProgressIndicator />
    </header>
  );
}
