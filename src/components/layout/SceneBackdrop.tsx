import { useState, type ReactNode } from "react";
import { FestiveHall } from "@/components/layout/FestiveHall";
import { MagicalParticles } from "@/components/layout/MagicalParticles";
import { resolveAsset } from "@/data/assets";
import { publicAsset } from "@/lib/publicAsset";
import { cn } from "@/lib/utils";

const scenes = {
  welcome: { file: "academy-welcome.webp", className: "academy-sky-welcome", density: "festive" },
  classroom: { file: "academy-classroom.webp", className: "academy-sky", density: "calm" },
  graduation: { file: "academy-graduation.webp", className: "academy-sky-graduation", density: "festive" },
  exam: { file: null, className: "bg-[#1a120c]", density: "calm" },
} as const;

const examBackground = publicAsset("assets/backgrounds/academy-classroom.jpg");
const welcomeBackground = publicAsset("assets/backgrounds/academy-welcome.png");

export function SceneBackdrop({
  scene,
  examBackgroundUrl,
  children,
}: {
  scene: keyof typeof scenes;
  examBackgroundUrl?: string;
  children: ReactNode;
}) {
  const config = scenes[scene];
  const src = config.file ? resolveAsset(config.file) : null;
  const [failed, setFailed] = useState(false);
  const examScene = scene === "exam";
  const welcomeScene = scene === "welcome";
  const paintedBackground = examScene ? (examBackgroundUrl ?? examBackground) : welcomeScene ? welcomeBackground : null;

  return (
    <div className={cn("relative h-svh", examScene ? "overflow-x-hidden overflow-y-auto" : "overflow-hidden", config.className)}>
      {paintedBackground ? (
        <div
          aria-hidden="true"
          className={cn("pointer-events-none bg-cover bg-center bg-no-repeat", examScene ? "fixed inset-0" : "absolute inset-0")}
          style={{ backgroundImage: `url("${paintedBackground}")` }}
        />
      ) : null}
      {src && !failed ? (
        <img
          src={src}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : null}
      {examScene || welcomeScene ? null : <FestiveHall tree />}
      {examScene || welcomeScene ? null : <div className="academy-vignette pointer-events-none absolute inset-0" />}
      <MagicalParticles density={config.density} />
      <div className={cn("relative z-10", examScene ? "min-h-full" : "h-full")}>{children}</div>
    </div>
  );
}
