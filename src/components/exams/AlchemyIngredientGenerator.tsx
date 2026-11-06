import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Check, FlaskConical } from "lucide-react";
import { alchemyStudentLabels, findAlchemyIngredient } from "@/data/alchemyIngredients";
import { assignAlchemyIngredient, readAlchemySlots, subscribeAlchemy, type AlchemySlots } from "@/lib/alchemyAssignments";
import { prefersReducedMotion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const sparkColors = ["#D7AD62", "#31745A", "#B52E43"];

function useAlchemySlots(): AlchemySlots {
  const [slots, setSlots] = useState<AlchemySlots>(() => readAlchemySlots());

  useEffect(() => subscribeAlchemy(setSlots), []);

  return slots;
}

function IngredientCard({
  label,
  savedId,
  onSummon,
}: {
  label: string;
  savedId: string | null;
  onSummon: () => string | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const flaskRef = useRef<HTMLDivElement>(null);
  const swirlRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const riddleRef = useRef<HTMLQuoteElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(savedId);
  const [revealed, setRevealed] = useState(Boolean(savedId));
  const [busy, setBusy] = useState(false);
  const ingredient = findAlchemyIngredient(pendingId);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (savedId) return;
    timelineRef.current?.kill();
    const card = cardRef.current;
    if (card) gsap.set(card, { clearProps: "transform,boxShadow" });
    setBusy(false);
    setRevealed(false);
    setPendingId(null);
  }, [savedId]);

  useEffect(() => {
    if (!busy) return;
    const frame = window.requestAnimationFrame(() => playReveal());
    return () => window.cancelAnimationFrame(frame);
  }, [busy]);

  function summon() {
    if (busy || savedId || revealed) return;
    const id = onSummon();
    if (!id) return;
    setPendingId(id);
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }
    setBusy(true);
  }

  function playReveal() {
    const card = cardRef.current;
    const flask = flaskRef.current;
    const swirl = swirlRef.current;
    const pulse = pulseRef.current;
    const title = titleRef.current;
    const riddle = riddleRef.current;
    if (!card || !flask || !swirl || !pulse || !title || !riddle) {
      setBusy(false);
      setRevealed(true);
      return;
    }

    const sparks = swirl.querySelectorAll<HTMLElement>("[data-spark]");
    const lines = riddle.querySelectorAll<HTMLElement>("[data-line]");
    timelineRef.current?.kill();
    const timeline = gsap.timeline({
      onComplete: () => {
        if (card) gsap.set(card, { clearProps: "transform" });
        setBusy(false);
        setRevealed(true);
      },
    });
    timelineRef.current = timeline;

    timeline
      .set([title, ...lines], { autoAlpha: 0, y: 10, scale: 0.94 })
      .to(card, { y: -6, boxShadow: "0 0 28px rgba(215,173,98,0.55)", duration: 0.3, ease: "power2.out" }, 0)
      .to(flask, { rotation: 16, duration: 0.45, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.3)
      .to(swirl, { rotation: 210, duration: 0.9, ease: "power1.inOut" }, 0.3)
      .fromTo(sparks, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, stagger: 0.05 }, 0.3)
      .to(sparks, { autoAlpha: 0, duration: 0.3 }, 1)
      .fromTo(pulse, { autoAlpha: 0.7, scale: 0.4 }, { autoAlpha: 0, scale: 1.8, duration: 0.7, ease: "power2.out" }, 0.45)
      .to(title, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }, 1.15)
      .to(lines, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }, 1.28)
      .to(card, { y: 0, boxShadow: "0 8px 20px rgba(73,59,53,0.08)", duration: 0.28, ease: "power2.inOut" }, 1.65);
  }

  const lines = ingredient?.riddle.split(/(?<=\.)\s+/).filter(Boolean) ?? [];

  const showIngredient = Boolean(ingredient) && revealed;

  return (
    <Card
      ref={cardRef}
      size="sm"
      data-alchemy-card
      className="alchemy-card relative min-w-0 gap-0 overflow-visible border border-[#D7AD62] bg-[rgba(255,248,236,0.96)] py-0 text-[#493B35] shadow-[0_8px_20px_rgba(73,59,53,0.08)] ring-[#D7AD62]/80"
    >
      <CardContent className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-1 px-2.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <div ref={flaskRef} className="relative grid size-5 shrink-0 place-items-center text-[#31745A]">
            <span ref={pulseRef} className="pointer-events-none absolute size-6 rounded-full border border-[#D7AD62] opacity-0" />
            <div ref={swirlRef} className="pointer-events-none absolute top-1/2 left-1/2 size-0">
              {sparkColors.concat(sparkColors).map((color, index) => {
                const angle = (index / 6) * Math.PI * 2;
                return (
                  <span
                    key={`${color}-${index}`}
                    data-spark
                    className="pointer-events-none absolute size-1.5 rounded-full opacity-0"
                    style={{
                      backgroundColor: color,
                      left: `${Math.cos(angle) * 12}px`,
                      top: `${Math.sin(angle) * 12}px`,
                    }}
                  />
                );
              })}
            </div>
            <FlaskConical className="relative size-4" aria-hidden="true" />
          </div>
          <CardTitle className="font-display text-[15px] leading-[1.3] text-[#7D263C]">{label}</CardTitle>
        </div>
        <div className="min-h-0" aria-hidden={Boolean(ingredient) && !revealed}>
          <p
            ref={titleRef}
            className="font-display text-[17px] leading-[1.3] text-[#7D263C]"
            style={{ opacity: !ingredient || revealed ? 1 : 0 }}
          >
            {ingredient ? `${ingredient.emoji ? `${ingredient.emoji} ` : "✨ "}${ingredient.title}` : "Ингредиент ещё не призван"}
          </p>
          <blockquote ref={riddleRef} className="mt-1 text-[15px] leading-[1.35] text-[#3A241C]">
            {(ingredient ? lines : ["\u00a0"]).map((line) => (
              <span key={line} data-line className="block" style={{ opacity: showIngredient ? 1 : 0 }}>
                {line}
              </span>
            ))}
          </blockquote>
        </div>
        <div className="flex h-8 items-center justify-center">
          {revealed ? (
            <span className="inline-flex items-center gap-1 text-[12px] leading-none text-[#31745A]">
              <Check className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Ингредиент получен</span>
            </span>
          ) : (
            <Button
              type="button"
              variant="gold"
              size="sm"
              className="h-8 w-full px-2 text-sm"
              disabled={busy}
              onClick={summon}
            >
              Призвать ингредиент
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AlchemyIngredientGenerator() {
  const slots = useAlchemySlots();

  return (
    <section className="alchemy-distributor" aria-labelledby="alchemy-distributor-title">
      <h2 id="alchemy-distributor-title" className="font-display text-lg leading-none text-[#7D263C]">
        Алхимический распределитель
      </h2>
      <p className="mt-1 text-[15px] leading-[1.35] text-[#493B35]">
        Профессор Искрин приготовил три загадки. Каждому студенту — по одному главному ингредиенту.
      </p>
      <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-3">
        {alchemyStudentLabels.map((label, index) => (
          <IngredientCard
            key={label}
            label={label}
            savedId={slots[index] ?? null}
            onSummon={() => assignAlchemyIngredient(index)}
          />
        ))}
      </div>
    </section>
  );
}

export { useAlchemySlots };
