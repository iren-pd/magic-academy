import type { ExamDefinition } from "@/types/game";

export function ExamInstructions({ exam }: { exam: ExamDefinition }) {
  return (
    <div className="exam-instructions rounded-2xl border border-[#D7AD62]/70 bg-white/60 px-4 py-3.5 sm:px-5 sm:py-4">
      <p className="text-[12px] tracking-[0.18em] text-[#7D263C] uppercase sm:text-[13px]">Как проходит экзамен</p>
      <ol className="mt-3 space-y-2.5">
        {exam.instructions.map((step, index) => (
          <li key={step} className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3">
            <span className="font-display text-xl leading-6 text-[#B52E43]">{index + 1}</span>
            <span className="min-w-0 text-[clamp(1rem,1.05vw,1.125rem)] leading-6 text-[#3A241C]">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
