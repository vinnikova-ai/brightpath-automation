import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Bot, Workflow, Sparkles, Zap, Clock, TrendingDown, Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexora — AI & Automation Agency" },
      { name: "description", content: "We build AI assistants and automations that eliminate manual work and scale your business." },
      { property: "og:title", content: "Nexora — AI & Automation Agency" },
      { property: "og:description", content: "AI assistants, workflow automation and smart bots that cut manual work by up to 80%." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[image:var(--gradient-glow)]" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl font-semibold tracking-tight">nexora<span className="text-primary">.ai</span></span>
        <a href="#calc" className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">Get estimate</a>
      </header>
      <Hero />
      <Benchmark />
      <LeadForm />
      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">© 2026 Nexora AI Agency</footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 text-center md:pt-28">
      <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
        <Sparkles className="h-3.5 w-3.5 text-primary" /> AI systems shipped in 14 days
      </div>
      <h1 className="font-display mx-auto max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
        Replace manual work with <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">intelligent automation</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
        We design and deploy LLM assistants, workflow automations and smart bots that cut operational costs by up to 80% — so your team focuses on growth.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="#calc" className="group inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-8 py-4 font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
          Calculate my automation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a href="#features" className="px-6 py-4 text-sm text-muted-foreground hover:text-foreground">See how it works</a>
      </div>
      <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-4 border-t border-border pt-10">
        {[["120+", "automations live"], ["80%", "less manual work"], ["14 days", "to launch"]].map(([v, l]) => (
          <div key={l}><div className="font-display text-2xl font-semibold sm:text-4xl">{v}</div><div className="mt-1 text-xs text-muted-foreground sm:text-sm">{l}</div></div>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Bot, title: "LLM Assistants", text: "Custom AI agents trained on your knowledge base handle support, sales and internal queries 24/7." },
  { icon: Workflow, title: "Workflow Automation", text: "Connect CRMs, sheets and messengers. Data flows between tools without a single copy-paste." },
  { icon: Zap, title: "Smart Bots & Landings", text: "Conversion-focused pages and Telegram bots that qualify leads and book calls automatically." },
];

const rows = [
  ["Lead processing", "4 h / day", "5 min / day"],
  ["Customer support replies", "2 h response", "Instant"],
  ["Reporting & data entry", "10 h / week", "Automated"],
  ["Operational cost", "100%", "~20%"],
];

function Benchmark() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-center text-3xl font-semibold tracking-tight sm:text-5xl">Manual work, benchmarked</h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">How AI tools transform everyday operations.</p>
      <div className="mt-14 overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur">
        <div className="grid grid-cols-3 border-b border-border px-4 py-4 text-xs uppercase tracking-wider text-muted-foreground sm:px-8">
          <span>Process</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Manual</span><span className="flex items-center gap-1 text-primary"><TrendingDown className="h-3.5 w-3.5" /> With AI</span>
        </div>
        {rows.map(([p, m, a]) => (
          <div key={p} className="grid grid-cols-3 border-b border-border px-4 py-5 text-sm last:border-0 sm:px-8 sm:text-base">
            <span className="font-medium">{p}</span><span className="text-muted-foreground line-through decoration-destructive/60">{m}</span><span className="font-semibold text-primary">{a}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="group rounded-3xl border border-border bg-card/60 p-8 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]">
            <div className="mb-6 inline-flex rounded-2xl bg-[image:var(--gradient-primary)] p-3 text-primary-foreground"><Icon className="h-6 w-6" /></div>
            <h3 className="font-display text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const tasks = [
  { label: "Внедрить LLM/ИИ-ассистента", price: "от 150 000 ₽", days: "14–21 день" },
  { label: "Автоматизировать рутину", price: "от 90 000 ₽", days: "7–14 дней" },
  { label: "Создать умный лендинг/бота", price: "от 60 000 ₽", days: "5–10 дней" },
];

const schema = z.object({
  name: z.string().trim().min(1, "Введите имя").max(100, "Слишком длинное имя"),
  contact: z.string().trim().min(3, "Укажите Telegram или Email").max(255, "Слишком длинный контакт")
    .refine((v) => /^@?[a-zA-Z0-9_]{4,32}$/.test(v) || z.string().email().safeParse(v).success, "Неверный формат Telegram или Email"),
});

function LeadForm() {
  const [step, setStep] = useState(0);
  const [task, setTask] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [progress, setProgress] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ name, contact });
    if (!r.success) {
      const errs: { name?: string; contact?: string } = {};
      r.error.issues.forEach((i) => ((errs as Record<string, string>)[String(i.path[0])] = i.message));
      return setErrors(errs);
    }
    setErrors({});
    setStep(2);
    setProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 4;
      setProgress(p);
      if (p >= 100) { clearInterval(t); setStep(3); }
    }, 70);
  };

  const pct = step === 0 ? 33 : step === 1 ? 66 : 100;

  return (
    <section id="calc" className="relative z-10 mx-auto max-w-2xl px-6 py-24">
      <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-[var(--shadow-glow)] backdrop-blur sm:p-10">
        <h2 className="font-display text-center text-2xl font-semibold tracking-tight sm:text-4xl">Рассчитать стоимость автоматизации</h2>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-[image:var(--gradient-primary)] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        {step === 0 && (
          <div className="mt-8">
            <p className="mb-4 text-sm text-muted-foreground">Шаг 1 из 2</p>
            <h3 className="mb-5 text-lg font-medium">Какую задачу нужно решить?</h3>
            <div className="grid gap-3">
              {tasks.map((t, i) => (
                <button key={t.label} type="button" onClick={() => { setTask(i); setStep(1); }}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all hover:border-primary hover:bg-secondary ${task === i ? "border-primary bg-secondary" : "border-border"}`}>
                  {t.label}<ArrowRight className="h-4 w-4 text-primary" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={submit} className="mt-8 grid gap-4" noValidate>
            <p className="text-sm text-muted-foreground">Шаг 2 из 2 · {task !== null && tasks[task]!.label}</p>
            <div>
              <label className="mb-2 block text-sm">Имя</label>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Как к вам обращаться?"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary" />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm">Telegram / Email</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={255} placeholder="@username или name@mail.ru"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary" />
              {errors.contact && <p className="mt-1 text-sm text-destructive">{errors.contact}</p>}
            </div>
            <div className="mt-2 flex gap-3">
              <button type="button" onClick={() => setStep(0)} className="rounded-full border border-border px-5 py-3 text-sm hover:bg-secondary">Назад</button>
              <button type="submit" className="flex-1 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02]">Получить решение</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="mt-10 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 font-medium">Анализируем задачу и рассчитываем стоимость…</p>
            <p className="mt-2 text-sm text-muted-foreground">{progress < 40 ? "Оцениваем объём работ" : progress < 80 ? "Подбираем ИИ-инструменты" : "Формируем предложение"} · {progress}%</p>
          </div>
        )}

        {step === 3 && task !== null && (
          <div className="mt-8 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-[image:var(--gradient-primary)] p-3 text-primary-foreground"><Check className="h-6 w-6" /></div>
            <h3 className="text-xl font-semibold">{name}, расчёт готов!</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border p-4"><div className="text-sm text-muted-foreground">Стоимость</div><div className="font-display mt-1 text-2xl font-semibold text-primary">{tasks[task]!.price}</div></div>
              <div className="rounded-2xl border border-border p-4"><div className="text-sm text-muted-foreground">Срок запуска</div><div className="font-display mt-1 text-2xl font-semibold">{tasks[task]!.days}</div></div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Мы свяжемся с вами по контакту {contact} в течение 1 часа с детальным решением.</p>
            <button onClick={() => { setStep(0); setTask(null); setName(""); setContact(""); }} className="mt-6 text-sm text-primary hover:underline">Новый расчёт</button>
          </div>
        )}
      </div>
    </section>
  );
}
