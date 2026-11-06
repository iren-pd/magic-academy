import gsap from "gsap";

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateEntrance(scope: Element): gsap.Context {
  return gsap.context(() => {
    const nodes = scope.querySelectorAll<HTMLElement>("[data-enter]");
    if (prefersReducedMotion()) {
      gsap.set(nodes, { autoAlpha: 1, x: 0, y: 0 });
      return;
    }

    const left = scope.querySelectorAll("[data-enter='left']");
    const right = scope.querySelectorAll("[data-enter='right']");
    const up = scope.querySelectorAll("[data-enter='up']");
    const fade = scope.querySelectorAll("[data-enter='fade']");

    if (left.length > 0) {
      gsap.fromTo(
        left,
        { autoAlpha: 0, x: -36 },
        { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 },
      );
    }
    if (right.length > 0) {
      gsap.fromTo(
        right,
        { autoAlpha: 0, x: 32 },
        { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 },
      );
    }
    if (up.length > 0) {
      gsap.fromTo(
        up,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out", stagger: 0.08, delay: 0.08 },
      );
    }
    if (fade.length > 0) {
      gsap.fromTo(
        fade,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.07, delay: 0.12 },
      );
    }
  }, scope);
}

export function animateScene(scope: Element): gsap.Context {
  return gsap.context(() => {
    if (prefersReducedMotion()) {
      gsap.set(scope, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.fromTo(scope, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" });
  }, scope);
}

export function shakeElement(element: Element | null): void {
  if (!element || prefersReducedMotion()) return;
  gsap.killTweensOf(element);
  gsap.fromTo(
    element,
    { x: 0 },
    {
      x: 8,
      duration: 0.07,
      yoyo: true,
      repeat: 5,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.set(element, { x: 0 });
      },
    },
  );
}

export function animateStamp(element: Element | null): gsap.Context | null {
  if (!element) return null;
  return gsap.context(() => {
    if (prefersReducedMotion()) {
      gsap.set(element, { autoAlpha: 1, scale: 1, rotate: -8 });
      return;
    }
    gsap.fromTo(
      element,
      { autoAlpha: 0, scale: 1.7, rotate: -22 },
      { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.55, ease: "back.out(1.7)" },
    );
  }, element);
}
