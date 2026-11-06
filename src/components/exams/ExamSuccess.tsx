import { ApprovedStamp } from "@/components/layout/ApprovedStamp";
import { Button } from "@/components/ui/button";

export function ExamSuccess({
  nextLabel,
  onNext,
  pending = false,
}: {
  nextLabel: string;
  onNext: () => void;
  pending?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <ApprovedStamp />
      <p className="font-display text-3xl text-ink">Экзамен сдан</p>
      <p className="max-w-sm text-sm leading-relaxed text-ink/75">
        Группа записана в ведомость. Можно переходить дальше.
      </p>
      <Button type="button" variant="gold" size="academy" onClick={onNext} disabled={pending}>
        {nextLabel}
      </Button>
    </div>
  );
}
