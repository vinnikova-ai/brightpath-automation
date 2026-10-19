import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { automationInput, type ScenarioEvent } from "@/lib/automation-schema";

export function AutomationAdvisor() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [stopped, setStopped] = useState(false);
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => active.current?.abort(), []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (active.current) return;
    const parsed = automationInput.safeParse({ description });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Опишите задачу."); return; }
    const controller = new AbortController();
    active.current = controller;
    setBusy(true); setStopped(false); setError(""); setResult(""); setReasoning("");
    try {
      const response = await fetch("/api/public/automation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: controller.signal });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? "Не удалось связаться с ИИ. Попробуйте позже.");
      }
      if (!response.body) throw new Error("Ответ ИИ недоступен.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let terminal = false;
      while (true) {
        const chunk = await reader.read();
        buffer += decoder.decode(chunk.value, { stream: !chunk.done });
        const lines = buffer.split("\n"); buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const item = JSON.parse(line) as ScenarioEvent;
          if (item.type === "text") setResult(value => value + (item.text ?? ""));
          if (item.type === "reasoning") setReasoning(value => value + (item.text ?? ""));
          if (item.type === "error") { terminal = true; setError(item.text ?? "Ответ ИИ недоступен."); }
          if (item.type === "done") terminal = true;
        }
        if (chunk.done) break;
      }
      if (!terminal) throw new Error("Соединение прервалось до завершения сценария.");
    } catch (failure) {
      if (controller.signal.aborted) setStopped(true);
      else setError(failure instanceof Error ? failure.message : "Не удалось получить сценарий.");
    } finally { active.current = null; setBusy(false); }
  }

  return (
    <section id="scenario" className="relative z-10 mx-auto max-w-3xl px-6 pb-12 pt-16">
      <div className="liquid-glass rounded-lg border border-border p-6 sm:p-10">
        <div className="mb-4 flex items-center gap-2 text-sm text-primary"><Sparkles className="size-4" /> ИИ-консультант</div>
        <h2 className="font-display text-2xl font-semibold sm:text-4xl">Ваш сценарий автоматизации</h2>
        <form onSubmit={submit} className="mt-7 grid gap-4">
          <label htmlFor="automation-description" className="text-sm font-medium">Какой процесс хотите автоматизировать?</label>
          <Textarea id="automation-description" value={description} onChange={e => setDescription(e.target.value)} maxLength={3000} disabled={busy} placeholder="Например: заявки приходят в Telegram, менеджер переносит их в CRM и вручную отправляет клиенту ответ…" className="min-h-36 resize-y bg-background/70 leading-relaxed" aria-describedby="scenario-privacy" />
          <div className="flex justify-between gap-4 text-xs text-muted-foreground"><span id="scenario-privacy">Не указывайте пароли и персональные данные клиентов.</span><span className="shrink-0">{description.length}/3000</span></div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={busy} className="h-auto whitespace-normal bg-[image:var(--gradient-primary)] px-6 py-3 text-primary-foreground">{busy ? <Loader2 className="animate-spin" /> : <Sparkles />} {busy ? "Подбираем сценарий…" : "Предложить сценарий"}</Button>
            {busy && <Button type="button" variant="outline" className="h-auto" onClick={() => active.current?.abort()}><Square /> Остановить</Button>}
          </div>
        </form>
        {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
        {stopped && <p role="status" className="mt-5 text-sm text-muted-foreground">Генерация остановлена.</p>}
        {busy && !result && <p role="status" className="mt-6 text-sm text-muted-foreground">Анализируем ваш процесс…</p>}
        {reasoning && <details className="mt-6 text-sm text-muted-foreground"><summary className="cursor-pointer">Анализ задачи</summary><p className="mt-3 whitespace-pre-wrap leading-relaxed">{reasoning}</p></details>}
        {result && <div className="mt-7 border-t border-border pt-6"><h3 className="mb-4 font-display text-xl font-semibold">Предложенный сценарий</h3><div data-testid="scenario-result" className="whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{result}</div>{!busy && !stopped && !error && <><p className="mt-5 text-xs text-muted-foreground">Предварительная рекомендация ИИ, не коммерческое предложение.</p><Button asChild variant="link" className="mt-3 h-auto px-0"><a href="#calc">Рассчитать стоимость <ArrowRight /></a></Button></>}</div>}
      </div>
    </section>
  );
}