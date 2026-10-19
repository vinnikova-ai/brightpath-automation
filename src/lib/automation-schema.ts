import { z } from "zod";

export const automationInput = z.object({
  description: z.string().trim().min(20, "Опишите задачу подробнее — минимум 20 символов.").max(3000, "Описание должно быть не длиннее 3000 символов."),
}).strict();

export function sameOriginRequest(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export type ScenarioEvent = { type: "text" | "reasoning" | "error" | "done"; text?: string };