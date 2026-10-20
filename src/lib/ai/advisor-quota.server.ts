import { ADVISOR_REQUEST_LIMIT, ADVISOR_WINDOW_SECONDS } from "../ai-advisor-limits";

function clientAddress(request: Request) {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
}

async function hashAddress(address: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`vinnikova-ai-advisor:${address}`));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

/** Records one advisor request for the caller's address; returns null when allowed, otherwise seconds to wait. */
export async function consumeAdvisorQuota(request: Request): Promise<{ allowed: true } | { allowed: false; retryAfter: number } | { error: true }> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("consume_ai_advisor_quota", {
      _client_key: await hashAddress(clientAddress(request)),
      _limit: ADVISOR_REQUEST_LIMIT,
      _window_seconds: ADVISOR_WINDOW_SECONDS,
    });
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row) { console.error("Advisor quota check failed", error?.message); return { error: true }; }
    return row.allowed ? { allowed: true } : { allowed: false, retryAfter: row.retry_after_seconds };
  } catch (failure) {
    console.error("Advisor quota check failed", failure);
    return { error: true };
  }
}
