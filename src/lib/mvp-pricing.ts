// MVP price list shown in the calculator; the database re-checks totals against the same numbers.
export const MVP_BASE = { label: "Разработка асинхронного ядра бота (aiogram 3)", price: 30000 } as const;

export const MVP_ADDONS = [
  { id: "database", label: "Интеграция базы данных SQLite & SQLAlchemy ORM", price: 20000 },
  { id: "ai", label: "Подключение ИИ-аналитики (API Anthropic Claude / LLM)", price: 25000 },
  { id: "webapp", label: "Проектирование визуального интерфейса Telegram Web App", price: 35000 },
] as const;

export type AddonId = (typeof MVP_ADDONS)[number]["id"];

export function mvpTotal(selected: readonly AddonId[]) {
  return MVP_ADDONS.reduce<number>((sum, addon) => (selected.includes(addon.id) ? sum + addon.price : sum), MVP_BASE.price);
}

/** "110000" → "110 000 ₽" with non-breaking spaces; deterministic on server and browser. */
export function formatRub(value: number) {
  return `${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}\u00a0₽`;
}

/** Add-ons pre-checked after the quiz, keyed by the task the visitor picked. */
export const QUIZ_PRESETS: Record<string, AddonId[]> = {
  "Внедрить LLM/ИИ-ассистента": ["database", "ai"],
  "Автоматизировать рутину": ["database"],
  "Создать умный лендинг/бота": ["webapp"],
};

export function presetForTask(task: string): AddonId[] {
  return QUIZ_PRESETS[task] ?? [];
}
