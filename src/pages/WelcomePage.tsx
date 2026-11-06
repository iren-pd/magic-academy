import { useEffect, useRef } from "react";
import { AcademyCrest } from "@/components/layout/AcademyCrest";
import { useGameProgress } from "@/hooks/useGameProgress";
import { publicAsset } from "@/lib/publicAsset";
import { animateEntrance } from "@/lib/motion";
import { Button } from "@/components/ui/button";

const directorSrc = publicAsset("assets/characters/director.png");

export function WelcomePage() {
  const { startFirstExam } = useGameProgress();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const context = animateEntrance(element);
    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative flex h-full min-h-0 flex-col overflow-hidden lg:block">
      <figure
        data-enter="up"
        className="pointer-events-none relative z-10 mx-auto h-[38vh] w-auto max-w-[92vw] lg:absolute lg:bottom-[-1.5vh] lg:left-0 lg:mx-0 lg:h-auto lg:w-[min(48vw,calc(78vh*1312/1199))] lg:max-w-none xl:w-[calc(86vh*1312/1199)]"
        style={{ aspectRatio: "1312 / 1199" }}
      >
        <img
          src={directorSrc}
          alt="Альберт Снегов, директор академии"
          className="h-full w-full object-contain object-left-bottom"
        />
        <figcaption className="absolute bottom-[4vh] left-3 w-max max-w-[calc(100%-1.5rem)] rounded-full border border-[#D7AD62] bg-[rgba(255,248,236,0.96)] px-4 py-1.5 text-center text-sm whitespace-nowrap text-[#6D2637] shadow-[0_8px_20px_rgba(73,59,53,0.12)] lg:bottom-[6vh] lg:left-6">
          Альберт Снегов · Директор Академии
        </figcaption>
      </figure>
      <main
        id="main"
        className="relative z-20 flex min-h-0 flex-1 items-end px-4 pt-3 pb-4 lg:absolute lg:inset-0 lg:grid lg:items-center lg:px-0 lg:pt-0 lg:pb-0 lg:grid-cols-[min(calc(48vw+2.75rem),calc(78vh*1312/1199+2.75rem))_minmax(0,37.5rem)_minmax(1rem,1fr)] xl:grid-cols-[calc(86vh*1312/1199+3.25rem)_minmax(0,37.5rem)_minmax(1.5rem,1fr)]"
      >
        <div aria-hidden="true" className="hidden lg:block" />
        <section
          data-enter="fade"
          className="flex w-full min-w-0 min-h-0 flex-col justify-center rounded-[1.75rem] border border-[#D7AD62] bg-[rgba(255,248,236,0.96)] px-6 py-6 text-[#493B35] shadow-[0_18px_40px_rgba(73,59,53,0.14)] sm:px-8 sm:py-7"
        >
          <AcademyCrest className="size-11" />
          <p className="mt-3 text-[11px] tracking-[0.24em] text-[#6D2637] uppercase sm:text-xs">
            Академия новогоднего волшебства
          </p>
          <h1 className="mt-2 font-display text-4xl leading-[0.95] text-[#6D2637] sm:text-5xl">Ну что, будущие волшебники?</h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed sm:text-lg">
            О, вы всё-таки добрались! Замечательно. Преподаватели уже потеряли надежду. Восемь кафедр ждут вас.
            Постарайтесь хотя бы ничего не взорвать!
          </p>
          <Button type="button" variant="gold" size="academy" className="mt-6 w-fit" onClick={startFirstExam}>
            Начать обучение
          </Button>
        </section>
      </main>
    </div>
  );
}
