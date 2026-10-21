import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { leadContactSchema } from "@/lib/lead-schema";
import { MVP_ADDONS, MVP_BASE, formatRub, mvpTotal, presetForTask, type AddonId } from "@/lib/mvp-pricing";

export type QuizResult = { task: string; name: string; contact: string; id: number };

export function MvpCalculator({ quiz }: { quiz: QuizResult | null }) {
  const section = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<AddonId[]>([]);
  const [fromQuiz, setFromQuiz] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<{ name?: string; contact?: string; form?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const total = mvpTotal(selected);

  useEffect(() => {
    if (!quiz) return;
    setSelected(presetForTask(quiz.task));
    setFromQuiz(true);
    setName(quiz.name);
    setContact(quiz.contact);
    setSent(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => section.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 1400);
    return () => window.clearTimeout(timer);
  }, [quiz]);

  const toggle = (id: AddonId, on: boolean) => {
    setSent(false);
    setSelected(current => (on ? [...new Set([...current, id])] : current.filter(x => x !== id)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const r = leadContactSchema.safeParse({ name, contact });
    if (!r.success) {
      const errs: { name?: string; contact?: string } = {};
      r.error.issues.forEach(i => ((errs as Record<string, string>)[String(i.path[0])] = i.message));
      return setErrors(errs);
    }
    setErrors({});
    setSending(true);
    const modules = MVP_ADDONS.filter(a => selected.includes(a.id)).map(a => a.id);
    const { error } = await supabase.from("concept_requests").insert({ name: r.data.name, contact: r.data.contact, modules, total: mvpTotal(modules) });
    setSending(false);
    if (error) {
      return setErrors({
        form: error.message.includes("concept_rate_limited")
          ? "Заявка на концепт с этим контактом уже отправлена. Попробуйте снова через 10 минут."
          : "Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз.",
      });
    }
    setSent(true);
    setFormOpen(false);
  };

  return (
    <section id="pricing" ref={section} className="relative z-10 mx-auto max-w-2xl scroll-mt-6 px-6 pb-24">
      <div className="liquid-glass rounded-3xl border border-border p-6 sm:p-10">
        <div className="mb-3 flex items-center gap-2 text-sm text-primary"><Sparkles className="h-4 w-4" /> Калькулятор MVP</div>
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-4xl">Соберите свой Telegram-бот</h2>
        <p className="mt-3 text-sm text-muted-foreground">Отметьте нужные модули — стоимость пересчитается сразу.</p>
        {fromQuiz && <p role="status" className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">Мы отметили модули по вашему ответу в квизе. Их можно изменить.</p>}

        <div className="mt-7 grid gap-3">
          <div className="flex items-start gap-4 rounded-2xl border border-primary/40 bg-secondary/40 px-5 py-4">
            <Checkbox checked disabled aria-label={MVP_BASE.label} className="mt-0.5 h-5 w-5 rounded-md disabled:opacity-100" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{MVP_BASE.label}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Базовый модуль, входит всегда</p>
            </div>
            <span className="shrink-0 font-display font-semibold">{formatRub(MVP_BASE.price)}</span>
          </div>
          {MVP_ADDONS.map(addon => {
            const on = selected.includes(addon.id);
            return (
              <label key={addon.id} htmlFor={`addon-${addon.id}`} className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-5 py-4 transition-all duration-300 hover:border-primary/60 ${on ? "border-primary bg-secondary/40" : "border-border"}`}>
                <Checkbox id={`addon-${addon.id}`} checked={on} onCheckedChange={v => toggle(addon.id, v === true)} className="mt-0.5 h-5 w-5 rounded-md" />
                <span className="min-w-0 flex-1 font-medium">{addon.label}</span>
                <span className={`shrink-0 font-display font-semibold transition-colors ${on ? "text-primary" : "text-muted-foreground"}`}>+{formatRub(addon.price)}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border bg-background/40 px-5 py-5">
          <div>
            <p className="text-sm text-muted-foreground">Итоговая стоимость MVP</p>
            <p data-testid="mvp-total" aria-live="polite" className="font-display mt-1 text-3xl font-semibold tracking-tight sm:text-4xl"><span key={total} className="animate-step inline-block">{formatRub(total)}</span></p>
          </div>
          {!formOpen && !sent && (
            <Button type="button" onClick={() => setFormOpen(true)} className="h-auto whitespace-normal rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02]">
              Оставить заявку на концепт
            </Button>
          )}
        </div>

        {formOpen && (
          <form onSubmit={submit} noValidate className="animate-step mt-6 grid gap-4">
            <div>
              <label htmlFor="concept-name" className="mb-2 block text-sm">Имя</label>
              <input id="concept-name" value={name} onChange={e => setName(e.target.value)} maxLength={100} placeholder="Как к вам обращаться?" className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary" />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="concept-contact" className="mb-2 block text-sm">Telegram / Email</label>
              <input id="concept-contact" value={contact} onChange={e => setContact(e.target.value)} maxLength={255} placeholder="@username или name@mail.ru" className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary" />
              {errors.contact && <p className="mt-1 text-sm text-destructive">{errors.contact}</p>}
            </div>
            {errors.form && <p role="alert" className="text-sm text-destructive">{errors.form}</p>}
            <div className="flex gap-3">
              <Button variant="outline" type="button" disabled={sending} onClick={() => setFormOpen(false)} className="h-auto rounded-full border border-border px-5 py-3 text-sm hover:bg-secondary">Отмена</Button>
              <Button type="submit" disabled={sending} className="h-auto flex-1 whitespace-normal rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 font-medium text-primary-foreground">
                {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Отправляем…</> : `Отправить заявку · ${formatRub(total)}`}
              </Button>
            </div>
          </form>
        )}

        {sent && (
          <div role="status" className="animate-step mt-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>Заявка на концепт за {formatRub(total)} отправлена. Мы свяжемся с вами по контакту {contact} в течение 1 часа.</span>
          </div>
        )}
      </div>
    </section>
  );
}
