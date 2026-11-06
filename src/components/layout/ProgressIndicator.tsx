import { exams } from "@/data/exams";
import { useGameProgress } from "@/hooks/useGameProgress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ProgressIndicator() {
  const { state } = useGameProgress();
  const passed = new Set(state.completedExamIds);

  return (
    <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Ход экзаменов">
      {exams.map((exam, index) => {
        const complete = passed.has(exam.id);
        const current = state.screen === "exam" && state.currentExamIndex === index;
        const specialBridge = state.screen === "special" && index === 6;
        return (
          <li key={exam.id} className="flex flex-1 items-center gap-1.5 sm:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  tabIndex={0}
                  aria-current={current ? "step" : undefined}
                  aria-label={`${exam.department}${complete ? ", сдано" : current ? ", сейчас" : ""}`}
                  className={cn(
                    "block h-2.5 w-full rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold",
                    complete ? "bg-evergreen" : current ? "bg-festive" : "bg-burgundy/15",
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>{exam.department}</TooltipContent>
            </Tooltip>
            {specialBridge ? <span className="sr-only">Дальше поиск допуска</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
