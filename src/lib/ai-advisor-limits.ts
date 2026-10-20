// Visitor-facing rules for the AI advisor: request quota and friendly error text.
export const ADVISOR_REQUEST_LIMIT = 5;
export const ADVISOR_WINDOW_SECONDS = 60 * 60;

function minutesWord(n: number) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "минуту";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "минуты";
  return "минут";
}

export function rateLimitMessage(retryAfterSeconds: number) {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return `Вы уже отправили ${ADVISOR_REQUEST_LIMIT} запросов за последний час. Попробуйте снова через ${minutes} ${minutesWord(minutes)} или напишите нам в Telegram.`;
}

/** Maps an AI service status to a plain Russian phrase; upstream technical text is never shown. */
export function friendlyAiError(status?: number) {
  if (status === 429) return "ИИ-консультант сейчас перегружен. Попробуйте ещё раз через минуту.";
  if (status === 402 || status === 403) return "ИИ-консультант временно недоступен. Напишите нам в Telegram — подберём сценарий вручную.";
  if (status === 400) return "Не получилось обработать это описание. Попробуйте сформулировать задачу иначе.";
  if (status && status >= 500) return "Сервис ИИ временно не отвечает. Попробуйте чуть позже.";
  return "Не удалось подобрать сценарий. Попробуйте позже.";
}
