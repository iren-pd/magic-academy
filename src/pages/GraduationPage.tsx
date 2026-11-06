import { useEffect, useRef } from "react";
import { DirectorScene } from "@/components/characters/DirectorScene";
import { AcademyCrest } from "@/components/layout/AcademyCrest";
import { useGameProgress } from "@/hooks/useGameProgress";
import { animateEntrance } from "@/lib/motion";
import { Button } from "@/components/ui/button";

const riddle = `Я не расту, но каждый год становлюсь наряднее.
На моих ветвях хранятся тайны,
а у моих ног появляются чудеса`;

export function GraduationPage() {
  const { resetAllProgress } = useGameProgress();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const context = animateEntrance(element);
    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex h-full min-h-0 flex-col py-3 lg:py-4">
      <main id="main" className="grad-grid grid min-h-0 flex-1 grid-rows-[minmax(0,32%)_minmax(0,1fr)] gap-3 lg:grid-rows-1 lg:grid-cols-[minmax(160px,30%)_minmax(0,1fr)] lg:gap-8">
        <DirectorScene />
        <section data-enter="right" className="grad-copy flex min-h-0 flex-col justify-center gap-3 overflow-hidden">
          <div className="flex items-center gap-3">
            <AcademyCrest className="size-10" />
            <p className="text-[11px] tracking-[0.2em] text-festive uppercase">Торжественный выпуск</p>
          </div>
          <h1 className="grad-title font-display text-3xl leading-none text-ink sm:text-5xl">ПОЗДРАВЛЯЕМ, ВЫПУСКНИКИ!</h1>
          <div data-enter="fade" className="space-y-1.5 text-sm leading-snug text-ink/85 sm:text-base">
            <p>Все восемь экзаменов успешно сданы.</p>
            <p>
              Государственная комиссия Академии новогоднего волшебства признала вашу группу условно пригодной к
              осуществлению праздничной магии.
            </p>
            <p>Дипломы снова лежат не там, где их искала канцелярия. Последняя подсказка ведёт к ним.</p>
          </div>
          <blockquote data-enter="up" className="glass-panel rounded-2xl px-4 py-3 sm:px-5">
            <p className="text-[11px] tracking-[0.18em] text-festive uppercase">Где дипломы</p>
            <p className="mt-2 font-display text-xl leading-snug whitespace-pre-line text-ink sm:text-2xl">{riddle}</p>
            <p className="mt-2 text-xs leading-snug text-ink/70 sm:text-sm">
              Дипломы спрятаны на ветвях новогодней ёлки или у её ног. Дальше заданий нет.
            </p>
          </blockquote>
          <Button type="button" variant="gold" size="academy" className="w-fit" onClick={resetAllProgress}>
            К началу
          </Button>
        </section>
      </main>
    </div>
  );
}
