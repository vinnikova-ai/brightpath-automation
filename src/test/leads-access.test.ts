import { describe, expect, it } from "vitest";

// Checks the live backend: anonymous visitors may only submit leads, never read or change them.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const endpoint = `${url}/rest/v1/leads`;
const headers = { apikey: key ?? "", "Content-Type": "application/json" };

describe.skipIf(!url || !key)("Leads table access for anonymous visitors", () => {
  it("cannot read leads", async () => {
    const res = await fetch(`${endpoint}?select=*`, { headers });
    expect(res.status).toBe(401);
  });
  it("cannot update leads", async () => {
    const res = await fetch(`${endpoint}?name=eq.x`, { method: "PATCH", headers, body: JSON.stringify({ name: "y" }) });
    expect(res.status).toBe(401);
  });
  it("cannot delete leads", async () => {
    const res = await fetch(`${endpoint}?name=eq.x`, { method: "DELETE", headers });
    expect(res.status).toBe(401);
  });
  it("rejects a name longer than 100 characters", async () => {
    const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({ task: "Автоматизировать рутину", name: "a".repeat(101), contact: "a@b.co" }) });
    expect(res.ok).toBe(false);
  });
  it("rejects a contact that is not Telegram or Email", async () => {
    const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({ task: "Автоматизировать рутину", name: "x", contact: "not a contact" }) });
    expect(res.ok).toBe(false);
  });
  it("rejects a task outside the form options", async () => {
    const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({ task: "spam", name: "x", contact: "a@b.co" }) });
    expect(res.ok).toBe(false);
  });
});
