import { describe, expect, it } from "vitest";
import { automationInput, sameOriginRequest } from "@/lib/automation-schema";

describe("Automation requests", () => {
  it("accepts a real process description", () => {
    expect(automationInput.parse({ description: "Заявки из Telegram вручную переносим в CRM." }).description).toContain("CRM");
  });
  it("rejects empty descriptions", () => {
    expect(automationInput.safeParse({ description: "   " }).success).toBe(false);
  });
  it("rejects unbounded input", () => {
    expect(automationInput.safeParse({ description: "a".repeat(3001) }).success).toBe(false);
  });
  it("rejects cross-origin calls", () => {
    expect(sameOriginRequest(new Request("https://nexora.example/api/public/automation", { headers: { origin: "https://other.example" } }))).toBe(false);
    expect(sameOriginRequest(new Request("https://nexora.example/api/public/automation", { headers: { origin: "https://nexora.example" } }))).toBe(true);
  });
});