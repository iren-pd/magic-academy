import { publicAsset } from "@/lib/publicAsset";
import type { ExamDefinition } from "@/types/game";

/** The painted classroom used by every exam that does not set its own background. */
export const DEFAULT_EXAM_BACKGROUND = "assets/backgrounds/academy-classroom.jpg";

export function resolveExamBackground(exam: Pick<ExamDefinition, "backgroundImage"> | undefined): string {
  const path = (exam?.backgroundImage ?? DEFAULT_EXAM_BACKGROUND).replace(/^\//, "");
  return publicAsset(path);
}

/**
 * Ответы вечеринки меняются здесь.
 * Рецепты, ингредиенты и физические прятки задаются отдельно — в этот файл
 * попадут только те слова и коды, которые группа должна ввести на сайте.
 *
 * Экзамен 1:  validation.digits — красный, синий, жёлтый, зелёный
 * Экзамен 3:  validation.answers (порядок важен, если orderMatters: true)
 * Экзамен 5:  validation.answers — можно добавить несколько допустимых вариантов
 * Экзамен 6:  validation.answers
 * Экзамен 7:  validation.answers
 * Экзамен 8:  validation.answers или замените type на "NUMERIC_CODE"
 * Допуск:     src/data/specialActivity.ts
 */
export const exams: readonly ExamDefinition[] = [
  {
    id: "accuracy",
    number: 1,
    department: "Кафедра меткости заклинаний",
    professorId: "professor-accuracy",
    backgroundImage: "assets/backgrounds/academy-accuracy.png",
    instructions: [
      "Найдите под новогодней ёлкой упакованный подарок от кафедры.",
      "Распакуйте его — внутри вас ждёт готовая ёлка из стаканчиков.",
      "Забрасывайте шарики для пинг-понга в стаканчики и найдите четыре цветные цифры.",
      "Введите каждую цифру в поле соответствующего цвета.",
    ],
    validation: {
      type: "COLOR_DIGITS",
      digits: {
        red: "3",
        blue: "7",
        yellow: "1",
        green: "9",
      },
    },
  },
  {
    id: "wrapping",
    number: 2,
    department: "Кафедра подаркоупаковывания",
    professorId: "professor-wrapping",
    backgroundImage: "assets/backgrounds/academy-wrapping.png",
    instructions: [
      "Каждый студент выбирает себе один предмет для упаковки.",
      "Упакуйте свои предметы как угодно! Бумага, скотч и банты уже подготовлены.",
      "Когда все трое закончат, подтвердите выполнение экзамена.",
    ],
    validation: { type: "TIMED_COMPLETION", durationMs: 3 * 60 * 1000 },
  },
  {
    id: "alchemy",
    number: 3,
    department: "Кафедра праздничной алхимии",
    professorId: "professor-alchemy",
    backgroundImage: "assets/backgrounds/academy-alchemy.png",
    instructions: [
      "Каждый студент призывает свой ингредиент и разгадывает загадку.",
      "Приготовьте три разных съедобных зелья, используя полученные ингредиенты.",
      "Придумайте каждому зелью название и введите все три названия при сдаче экзамена.",
    ],
    validation: {
      type: "THREE_TEXT_ANSWERS",
      labels: ["Первое зелье", "Второе зелье", "Третье зелье"],
      answers: ["зелье одно", "зелье два", "зелье три"],
      orderMatters: true,
    },
  },
  {
    id: "literature",
    number: 4,
    department: "Кафедра праздничной словесности",
    professorId: "professor-literature",
    instructions: [
      "У каждого студента свой набор из пяти слов, который вы можете получить ниже.",
      "По очереди произнесите новогоднее поздравление и используйте все пять слов. Чем торжественнее нелепость, тем спокойнее кафедра.",
      "После произнесения всех речей или если прошло три минуты, подтвердите, что речи произнесены.",
    ],
    validation: { type: "TIMED_COMPLETION", durationMs: 3 * 60 * 1000 },
  },
  {
    id: "cartography",
    number: 5,
    department: "Картография невозможных помещений",
    professorId: "professor-cartography",
    backgroundImage: "assets/backgrounds/academy-cartography.png",
    instructions: [
      "Возьмите карту вашей квартиры.",
      "Обычные места подписаны нелепыми именами.",
      "Найдите спрятанные фрагменты ответа.",
      "Соедините их и впишите секретную фразу.",
    ],
    validation: { type: "SECRET_PHRASE", answers: ["Есть установка весело встретить Новый год!"] },
  },
  {
    id: "physiognomy",
    number: 6,
    department: "Кафедра магической физиономистики",
    professorId: "professor-physiognomy",
    backgroundImage: "assets/backgrounds/academy-physiognomy.png",
    instructions: [
      "Каждый студент занимает место за своей ширмой.",
      "Не глядя на собственную работу, на ощупь соберите лицо своего персонажа.",
      "Когда все три портрета готовы и прошло не менее трёх минут, подтвердите выполнение экзамена.",
    ],
    validation: { type: "TIMED_COMPLETION", durationMs: 3 * 60 * 1000 },
  },
  {
    id: "intuition",
    number: 7,
    department: "Кафедра экспериментальной интуиции",
    professorId: "professor-intuition",
    instructions: [
      "Перед вами вешалка или стойка: предметы висят на лентах.",
      "Перережьте ленты ножницами.",
      "Один предмет прячет кодовое слово.",
      "Шутки и маленькие призы можно оставить себе.",
    ],
    validation: { type: "SECRET_WORD", answers: ["удача"] },
  },
  {
    id: "elements",
    number: 8,
    department: "Кафедра управления стихиями",
    professorId: "professor-elements",
    instructions: [
      "Перед вами ряд примерно из восьми–десяти свечей.",
      "Одним выдохом задуйте столько, сколько получится.",
      "Каждая свеча связана с небольшим призом.",
      "Секрет открывается у последней или предпоследней свечи.",
      "Впишите его здесь.",
    ],
    safetyNote:
      "Здесь открытый огонь. Уберите волосы, шарфы, декор и всё, что легко загорается. Не подпускайте животных, держите воду рядом и не оставляйте свечи без присмотра.",
    validation: { type: "SECRET_WORD", answers: ["выдох"] },
  },
];

export type ExamId = (typeof exams)[number]["id"];

export function getExam(index: number): ExamDefinition | undefined {
  return exams[index];
}

export function examIndexById(id: string): number {
  return exams.findIndex((exam) => exam.id === id);
}
