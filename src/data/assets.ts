const discovered = import.meta.glob(
  [
    "../../public/assets/**/*.webp",
    "../../public/assets/**/*.png",
    "!../../public/assets/backgrounds/academy-welcome.png",
    "!../../public/assets/backgrounds/academy-accuracy.png",
    "!../../public/assets/backgrounds/academy-wrapping.png",
    "!../../public/assets/backgrounds/academy-alchemy.png",
    "!../../public/assets/backgrounds/academy-cartography.png",
    "!../../public/assets/backgrounds/academy-physiognomy.png",
    "!../../public/assets/characters/director.png",
    "!../../public/assets/characters/professor-accuracy.png",
    "!../../public/assets/characters/professor-wrapping.png",
    "!../../public/assets/characters/professor-alchemy.png",
    "!../../public/assets/characters/professor-eloquence.png",
    "!../../public/assets/characters/professor-cartography.png",
    "!../../public/assets/characters/professor-physiognomy.png",
    "../../public/assets/**/*.jpg",
    "!../../public/assets/backgrounds/academy-classroom.jpg",
    "../../public/assets/**/*.jpeg",
    "../../public/assets/**/*.svg",
  ],
  { eager: true, import: "default", query: "?url" },
);

const urlsByFile = new Map<string, string>();

for (const [path, url] of Object.entries(discovered)) {
  const fileName = path.split("/").pop();
  if (fileName && typeof url === "string") {
    urlsByFile.set(fileName, url);
  }
}

export const expectedAssets = {
  characters: [
    "director.webp",
    "professor-accuracy.webp",
    "professor-wrapping.webp",
    "professor-alchemy.webp",
    "professor-literature.webp",
    "professor-cartography.webp",
    "professor-physiognomy.webp",
    "professor-intuition.webp",
    "professor-elements.webp",
  ],
  backgrounds: ["academy-welcome.webp", "academy-classroom.jpg", "academy-graduation.webp"],
  decorations: ["academy-crest.webp", "approved-stamp.webp"],
} as const;

export function resolveAsset(fileName: string): string | null {
  return urlsByFile.get(fileName) ?? null;
}
