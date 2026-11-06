import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BookOpen, Check } from "lucide-react";
import { congratulationStudentLabels } from "@/data/congratulationWords";
import {
  assignCongratulationWords,
  readCongratulationSlots,
  subscribeCongratulation,
  type CongratulationSet,
  type CongratulationSlots,
} from "@/lib/congratulationAssignments";
import { prefersReducedMotion } from "@/lib/motion";
import { Button } from "@/components/ui/button";

const sparkColors = ["#D7AD62", "#F3D48A", "#B52E43", "#31745A"];

function useCongratulationSlots(): CongratulationSlots {
  const [slots, setSlots] = useState<CongratulationSlots>(() => readCongratulationSlots());

  useEffect(() => subscribeCongratulation(setSlots), []);

  return slots;
}

function WordCard({
  label,
  savedWords,
  onReceive,
}: {
  label: string;
  savedWords: CongratulationSet | null;
  onReceive: () => CongratulationSet | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<Array<HTMLLIElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [pending, setPending] = useState<CongratulationSet | null>(savedWords);
  const [revealed, setRevealed] = useState(Boolean(savedWords));
  const [busy, setBusy] = useState(false);
  const words = pending ?? savedWords;

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (savedWords) return;
    timelineRef.current?.kill();
    const card = cardRef.current;
    if (card) gsap.set(card, { clearProps: "boxShadow" });
    setBusy(false);
    setRevealed(false);
    setPending(null);
  }, [savedWords]);

  useEffect(() => {
    if (!busy) return;
    const frame = window.requestAnimationFrame(() => playReveal());
    return () => window.cancelAnimationFrame(frame);
  }, [busy]);

  function receive() {
    if (busy || revealed || savedWords) return;
    const next = onReceive();
    if (!next) return;
    setPending(next);
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }
    setBusy(true);
  }

  function playReveal() {
    const card = cardRef.current;
    const book = bookRef.current;
    const sparks = sparkRef.current?.querySelectorAll<HTMLElement>("[data-spark]");
    const pulse = pulseRef.current;
    const lines = wordsRef.current.filter((line): line is HTMLLIElement => line !== null);
    if (!card || !book || !sparks || !pulse || lines.length !== 5) {
      setBusy(false);
      setRevealed(true);
      return;
    }

    timelineRef.current?.kill();
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set([card, book, ...lines], { clearProps: "transform,boxShadow,filter" });
        setBusy(false);
        setRevealed(true);
      },
    });
    timelineRef.current = timeline;
    timeline
      .set(lines, { autoAlpha: 0, y: 8 })
      .to(book, { scale: 1.16, filter: "drop-shadow(0 0 8px rgba(215,173,98,0.95))", duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0)
      .fromTo(sparks, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.04 }, 0.05)
      .to(sparks, { autoAlpha: 0, duration: 0.25 }, 0.7)
      .fromTo(pulse, { autoAlpha: 0.85, scale: 0.96 }, { autoAlpha: 0, scale: 1.04, duration: 0.7, ease: "power2.out" }, 0.1)
      .to(card, { boxShadow: "0 0 0 2px rgba(215,173,98,0.95), 0 8px 20px rgba(73,59,53,0.08)", duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.05)
      .to(lines, { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.17, ease: "power2.out" }, 0.55)
      .to(card, { boxShadow: "0 8px 20px rgba(73,59,53,0.08)", duration: 0.25, ease: "power2.inOut" }, 1.6);
  }

  return (
    <div
      ref={cardRef}
      data-word-card
      className="word-card relative min-w-0 overflow-hidden rounded-2xl border border-gold/40 bg-white/70 px-2.5 py-2 shadow-[0_8px_20px_rgba(73,59,53,0.08)]"
    >
      <span ref={pulseRef} className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[#D7AD62] opacity-0" />
      <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-1">
        <div className="flex items-center gap-1.5">
          <div ref={bookRef} className="relative grid size-5 shrink-0 place-items-center text-[#7D263C]">
            <div ref={sparkRef} className="pointer-events-none absolute top-1/2 left-1/2 size-0">
              {sparkColors.concat(sparkColors).map((color, index) => {
                const angle = (index / 8) * Math.PI * 2;
                return (
                  <span
                    key={`${color}-${index}`}
                    data-spark
                    className="pointer-events-none absolute size-1.5 rounded-full opacity-0"
                    style={{
                      backgroundColor: color,
                      left: `${Math.cos(angle) * 14}px`,
                      top: `${Math.sin(angle) * 14}px`,
                    }}
                  />
                );
              })}
            </div>
            <BookOpen className="relative size-4" aria-hidden="true" />
          </div>
          <p className="font-display text-sm leading-none text-burgundy sm:text-base">{label}</p>
        </div>
        <div className="relative min-h-0">
          <ol className="list-decimal space-y-0.5 pl-5 text-sm leading-tight text-[#3A241C]">
            {Array.from({ length: 5 }, (_, index) => (
              <li
                key={index}
                ref={(node) => {
                  wordsRef.current[index] = node;
                }}
                style={{ opacity: revealed ? 1 : 0 }}
              >
                {words?.[index] ?? "\u00a0"}
              </li>
            ))}
          </ol>
          {!busy && !revealed ? (
            <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-2 text-center text-sm leading-snug text-[#493B35]">
              Слова ещё не выданы
            </p>
          ) : null}
        </div>
        <div className="flex h-8 items-center justify-center">
          {revealed ? (
            <span className="inline-flex items-center gap-1 text-[12px] leading-none text-[#31745A]">
              <Check className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Слова получены</span>
            </span>
          ) : (
            <Button type="button" variant="gold" size="sm" className="h-8 w-full px-2 text-sm" disabled={busy} onClick={receive}>
              Получить 5 слов
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AbsurdWordsGenerator() {
  const slots = useCongratulationSlots();

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
      {congratulationStudentLabels.map((label, index) => (
        <WordCard key={label} label={label} savedWords={slots[index]} onReceive={() => assignCongratulationWords(index)} />
      ))}
    </div>
  );
}

export { useCongratulationSlots };
