export type AlchemyIngredient = {
  id: string;
  title: string;
  riddle: string;
  answer: string;
  emoji?: string;
};

/**
 * Съедобные загадки кафедры алхимии.
 * Студенты видят title и riddle. Поле answer — только для организатора.
 */
export const alchemyIngredients: readonly AlchemyIngredient[] = [
  {
    id: "milk",
    title: "Лунная роса",
    riddle: "Белее зимнего снега, течёт, но не ручей. Часто гостит в чашке с кофе.",
    answer: "Молоко",
    emoji: "🥛",
  },
  {
    id: "mandarin",
    title: "Солнечная сфера",
    riddle: "Под оранжевой бронёй скрываю дольки зимнего солнца.",
    answer: "Мандарин",
    emoji: "🍊",
  },
  {
    id: "honey",
    title: "Золото лесных тружениц",
    riddle: "Меня собирают крылатые работницы. Я сладок без сахара.",
    answer: "Мёд",
    emoji: "🍯",
  },
  {
    id: "orange",
    title: "Огненный шар",
    riddle: "Круглый цитрус в яркой кожуре, пахну солнцем посреди зимы.",
    answer: "Апельсин",
    emoji: "🟠",
  },
  {
    id: "lemon",
    title: "Кислая искра",
    riddle: "Жёлтый цитрус, от которого щурятся даже смелые.",
    answer: "Лимон",
    emoji: "🍋",
  },
  {
    id: "ginger",
    title: "Жгучий корень",
    riddle: "Узловатый корешок. В чае согреваю, в печенье щиплюсь.",
    answer: "Имбирь",
    emoji: "🫚",
  },
  {
    id: "mint",
    title: "Прохладный лист",
    riddle: "Зелёный листок, от которого во рту становится свежо, как после снега.",
    answer: "Мята",
    emoji: "🌿",
  },
];

export const alchemyStudentLabels = ["Студент I", "Студент II", "Студент III"] as const;

const byId = new Map(alchemyIngredients.map((item) => [item.id, item]));

export function findAlchemyIngredient(id: string | null): AlchemyIngredient | null {
  if (!id) return null;
  return byId.get(id) ?? null;
}
