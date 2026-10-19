import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/automation")({
  server: { handlers: { POST: async ({ request }) => {
    const { recommendAutomation } = await import("@/lib/ai/automation.server");
    return recommendAutomation(request);
  } } },
});