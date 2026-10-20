import { describe, expect, it } from "vitest";
import { ADVISOR_REQUEST_LIMIT, ADVISOR_WINDOW_SECONDS, friendlyAiError, rateLimitMessage } from "@/lib/ai-advisor-limits";

describe("AI advisor limits", () => {
  it("allows 5 requests per hour from one address", () => {
    expect(ADVISOR_REQUEST_LIMIT).toBe(5);
    expect(ADVISOR_WINDOW_SECONDS).toBe(3600);
  });
  it("tells the visitor in Russian how many minutes to wait", () => {
    expect(rateLimitMessage(61)).toContain("через 2 минуты");
    expect(rateLimitMessage(25 * 60)).toContain("через 25 минут");
    expect(rateLimitMessage(30)).toContain("через 1 минуту");
  });
  it("never passes technical AI service text to visitors", () => {
    for (const status of [400, 402, 403, 429, 500, 503, undefined]) {
      expect(friendlyAiError(status)).toMatch(/^[А-ЯЁ]/);
      expect(friendlyAiError(status)).not.toMatch(/gateway|error|credits/i);
    }
  });
});
