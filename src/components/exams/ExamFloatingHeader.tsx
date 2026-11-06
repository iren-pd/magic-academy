import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { AcademyHeader } from "@/components/layout/AcademyHeader";
import { prefersReducedMotion } from "@/lib/motion";

const SHOW_MS = 3000;
const LEAVE_MS = 500;

export function ExamFloatingHeader({ examId, kicker }: { examId: string; kicker: string }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const timerRef = useRef<number | null>(null);
  const insideRef = useRef(false);
  const focusRef = useRef(false);
  const stickRef = useRef(false);
  const suppressRef = useRef(false);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [inert, setInert] = useState(true);

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function conceal() {
    const element = headerRef.current;
    clearTimer();
    openRef.current = false;
    setOpen(false);
    if (!element) return;
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(element, {
      y: -40,
      yPercent: -100,
      autoAlpha: 0,
      duration: prefersReducedMotion() ? 0 : 0.4,
      ease: "power2.in",
      overwrite: "auto",
      onComplete: () => setInert(true),
    });
  }

  function reveal(holdMs: number | null) {
    const element = headerRef.current;
    clearTimer();
    setInert(false);
    setOpen(true);
    openRef.current = true;
    if (!element) return;
    const hidden = (gsap.getProperty(element, "autoAlpha") as number) < 0.98;
    if (hidden) {
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(element, {
        y: 0,
        yPercent: 0,
        autoAlpha: 1,
        duration: prefersReducedMotion() ? 0 : 0.52,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
    if (holdMs != null && !stickRef.current && !insideRef.current && !focusRef.current) {
      timerRef.current = window.setTimeout(() => {
        if (stickRef.current || insideRef.current || focusRef.current) return;
        conceal();
      }, holdMs);
    }
  }

  function enterZone() {
    if (suppressRef.current) return;
    insideRef.current = true;
    reveal(null);
  }

  function scheduleLeave() {
    if (stickRef.current || focusRef.current || insideRef.current) return;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      if (insideRef.current || stickRef.current || focusRef.current) return;
      conceal();
    }, LEAVE_MS);
  }

  function leaveZone() {
    insideRef.current = false;
    scheduleLeave();
  }

  useLayoutEffect(() => {
    const element = headerRef.current;
    if (element) gsap.set(element, { y: -40, yPercent: -100, autoAlpha: 0 });
    reveal(SHOW_MS);

    function onMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const target = event.target;
      const overHeader = target instanceof Node && element?.contains(target) === true;
      if (suppressRef.current) {
        if (event.clientY > 22 && !overHeader) suppressRef.current = false;
        return;
      }
      if (event.clientY <= 22 || overHeader) {
        insideRef.current = true;
        const visible = element != null && (gsap.getProperty(element, "autoAlpha") as number) > 0.98;
        if (openRef.current && visible) {
          clearTimer();
          return;
        }
        reveal(null);
        return;
      }
      if (insideRef.current) {
        insideRef.current = false;
        scheduleLeave();
      }
    }

    function onLeaveWindow(event: PointerEvent) {
      if (event.relatedTarget != null) return;
      insideRef.current = false;
      scheduleLeave();
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onLeaveWindow);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeaveWindow);
      clearTimer();
      tweenRef.current?.kill();
    };
    // The header remounts with each exam, so the entrance runs once per exam.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const shell = (
    <>
      <button
        type="button"
        className="fixed top-0 left-1/2 z-40 h-5 -translate-x-1/2 rounded-b-xl border border-t-0 border-[#D7AD62] bg-[rgba(255,248,236,0.96)] px-3 text-[11px] leading-none text-[#7D263C] shadow-[0_8px_16px_rgba(73,59,53,0.12)]"
        aria-label={open ? "Скрыть прогресс экзаменов" : "Показать прогресс экзаменов"}
        aria-expanded={open}
        aria-controls="exam-progress-header"
        onPointerEnter={enterZone}
        onPointerLeave={leaveZone}
        onClick={() => {
          if (openRef.current) {
            stickRef.current = false;
            suppressRef.current = true;
            insideRef.current = false;
            conceal();
            return;
          }
          stickRef.current = true;
          reveal(null);
        }}
      >
        {open ? "Скрыть прогресс" : "Прогресс"}
      </button>
      <div
        ref={headerRef}
        id="exam-progress-header"
        {...(inert ? { inert: true } : {})}
        aria-hidden={!open}
        className="fixed top-4 right-6 left-6 z-30 rounded-2xl bg-[#f7f0e5]/92 px-3 opacity-0 shadow-[0_18px_40px_rgba(73,59,53,0.16)] backdrop-blur-md lg:top-6 lg:right-8 lg:left-8"
        onPointerEnter={enterZone}
        onPointerLeave={leaveZone}
        onFocusCapture={() => {
          focusRef.current = true;
          reveal(null);
        }}
        onBlurCapture={(event) => {
          const next = event.relatedTarget;
          if (next instanceof Node && event.currentTarget.contains(next)) return;
          window.setTimeout(() => {
            const active = document.activeElement;
            if (active instanceof Node && headerRef.current?.contains(active)) return;
            focusRef.current = false;
            scheduleLeave();
          }, 0);
        }}
      >
        <AcademyHeader kicker={kicker} />
      </div>
    </>
  );

  return createPortal(shell, document.body);
}
