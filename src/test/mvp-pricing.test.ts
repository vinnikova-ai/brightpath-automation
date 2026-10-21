import { describe, expect, it } from "vitest";
import { formatRub, mvpTotal, presetForTask } from "@/lib/mvp-pricing";

const plain = (s: string) => s.replace(/\u00a0/g, " ");

describe("MVP price calculator", () => {
  it("starts at the 30 000 ₽ base price with no add-ons", () => {
    expect(mvpTotal([])).toBe(30000);
    expect(plain(formatRub(mvpTotal([])))).toBe("30 000 ₽");
  });
  it("adds 20 000 ₽ for the SQLite database", () => {
    expect(mvpTotal(["database"])).toBe(50000);
  });
  it("adds 25 000 ₽ for AI analytics", () => {
    expect(mvpTotal(["ai"])).toBe(55000);
  });
  it("adds 35 000 ₽ for the Telegram Web App", () => {
    expect(mvpTotal(["webapp"])).toBe(65000);
  });
  it("totals 110 000 ₽ with everything selected", () => {
    expect(plain(formatRub(mvpTotal(["database", "ai", "webapp"])))).toBe("110 000 ₽");
  });
  it("pre-selects AI analytics after the AI assistant quiz answer", () => {
    expect(presetForTask("Внедрить LLM/ИИ-ассистента")).toContain("ai");
    expect(presetForTask("Создать умный лендинг/бота")).toEqual(["webapp"]);
  });
});
