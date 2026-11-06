import { useEffect, useRef, type ReactNode } from "react";
import { animateScene } from "@/lib/motion";

export function SceneTransition({
  sceneKey,
  exam = false,
  welcome = false,
  children,
}: {
  sceneKey: string;
  exam?: boolean;
  welcome?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const context = animateScene(element);
    return () => context.revert();
  }, [sceneKey]);

  return (
    <div
      ref={ref}
      data-scene-root
      key={sceneKey}
      className={
        exam
          ? "flex w-full flex-col px-6 sm:px-8 lg:px-10"
          : welcome
            ? "relative flex h-full min-h-0 w-full flex-col"
            : "mx-auto flex h-full min-h-0 w-full max-w-[1180px] flex-col px-4 sm:px-6 lg:px-8"
      }
    >
      {children}
    </div>
  );
}
