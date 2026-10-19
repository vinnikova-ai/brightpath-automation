import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { LiquidBackdrop } from "@/components/liquid-backdrop";
import { Button } from "@/components/ui/button";
import { AutomationAdvisor } from "@/components/automation-advisor";
import { ArrowRight, Bot, Workflow, Sparkles, Zap, Clock, TrendingDown, Check, Loader2, Send, Mail } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexora — агентство ИИ-автоматизации" },
      { name: "description", content: "Внедряем ИИ-ассистентов и автоматизации, которые убирают ручной труд и масштабируют бизнес." },
      { property: "og:title", content: "Nexora — агентство ИИ-автоматизации" },
      { property: "og:description", content: "LLM-ассистенты, автоматизация процессов и умные боты — до 80% меньше ручной работы." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Index() {
  return (
    <div className="liquid-page min-h-screen overflow-x-hidden bg-background text-foreground">
      <LiquidBackdrop />
      <header className="liquid-readable relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <span className="font-display text-xl font-semibold tracking-tight">nexora<span className="text-primary">.ai</span></span>
        <Button asChild variant="outline" className="liquid-glass h-auto whitespace-normal rounded-full border border-border px-4 py-2 text-center text-sm hover:bg-secondary"><a href="#calc">Рассчитать стоимость</a></Button>
      </header>
      <Hero />
      <Benchmark />
      <AutomationAdvisor />
      <LeadForm />
      <footer className="liquid-glass relative z-10 border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-lg font-bold tracking-tight">Vinnikova<span className="text-primary">.AI</span></p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-foreground/80">Связаться со мной:</span>
            <a href="https://t.me/vinnikova_ai" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-md hover:shadow-primary/20">
              <Send className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
              Telegram <span className="text-muted-foreground transition-colors duration-300 group-hover:text-primary/80">(@vinnikova_ai)</span>
            </a>
            <span aria-hidden className="hidden text-border sm:inline">|</span>
            <a href="mailto:vinnikova-ai@yandex.ru" className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-md hover:shadow-primary/20">
              <Mail className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
              Email <span className="text-muted-foreground transition-colors duration-300 group-hover:text-primary/80">(vinnikova-ai@yandex.ru)</span>
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            © 2026 Vinnikova.AI. Проект разработан в качестве демонстрационного MVP-кейса комплексной ИИ-автоматизации для инженерного портфолио.
          </p>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline">Исходный код полностью открыт на GitHub</a>
            <span className="text-border">|</span>
            <a href="https://career.habr.com" target="_blank" rel="noreferrer" className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline">ИТ-витрина на Хабр Карьере</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function Hero() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="liquid-readable reveal relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 text-center md:pt-28">
      <div className="liquid-glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" /> ИИ-системы под ключ за 14 дней
      </div>
      <h1 className="font-display mx-auto max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
        Замените рутинную работу <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">интеллектуальной автоматизацией</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
        Проектируем и запускаем LLM-ассистентов, автоматизацию процессов и умных ботов, которые снижают операционные расходы до 80% — чтобы ваша команда занималась ростом.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild className="group h-auto whitespace-normal rounded-full bg-[image:var(--gradient-primary)] px-8 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"><a href="#calc">
          Рассчитать автоматизацию <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a></Button>
        <a href="#features" className="px-6 py-4 text-sm text-muted-foreground hover:text-foreground">Как это работает</a>
      </div>
      <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-4 border-t border-border pt-10">
        {[["120+", "запущенных автоматизаций"], ["80%", "меньше ручного труда"], ["14 дней", "до запуска"]].map(([v, l]) => (
          <div key={l}><div className="font-display text-2xl font-semibold sm:text-4xl">{v}</div><div className="mt-1 text-xs text-muted-foreground sm:text-sm">{l}</div></div>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Bot, title: "LLM-ассистенты", text: "ИИ-агенты, обученные на вашей базе знаний, закрывают вопросы поддержки, продаж и внутренние запросы 24/7." },
  { icon: Workflow, title: "Автоматизация процессов", text: "Соединяем CRM, таблицы и мессенджеры. Данные ходят между инструментами без единого копирования." },
  { icon: Zap, title: "Умные боты и лендинги", text: "Конверсионные страницы и Telegram-боты, которые квалифицируют лиды и записывают на созвон автоматически." },
];

const rows = [
  ["Обработка лидов", "4 ч / день", "5 мин / день"],
  ["Ответы в поддержке", "2 ч ожидания", "Мгновенно"],
  ["Отчёты и ввод данных", "10 ч / неделя", "Автоматически"],
  ["Операционные расходы", "100%", "~20%"],
];

function Benchmark() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="features" ref={ref} className="liquid-readable reveal relative z-10 mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-center text-3xl font-semibold tracking-tight sm:text-5xl">Рутина в цифрах</h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">Как ИИ-инструменты меняют повседневные операции.</p>
      <div className="liquid-glass mt-14 overflow-hidden rounded-3xl border border-border">
        <div className="grid grid-cols-3 border-b border-border px-4 py-4 text-xs uppercase tracking-wider text-muted-foreground sm:px-8">
          <span>Процесс</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Вручную</span><span className="flex items-center gap-1 text-primary"><TrendingDown className="h-3.5 w-3.5" /> С ИИ</span>
        </div>
        {rows.map(([p, m, a]) => (
          <div key={p} className="grid grid-cols-3 border-b border-border px-4 py-5 text-sm last:border-0 sm:px-8 sm:text-base">
            <span className="font-medium">{p}</span><span className="text-muted-foreground line-through decoration-destructive/60">{m}</span><span className="font-semibold text-primary">{a}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="liquid-glass group rounded-3xl border border-border p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]">
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
  const ref = useReveal<HTMLElement>();
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
    <section id="calc" ref={ref} className="reveal relative z-10 mx-auto max-w-2xl px-6 py-24">
      <div className="liquid-glass rounded-3xl border border-border p-6 sm:p-10">
        <h2 className="font-display text-center text-2xl font-semibold tracking-tight sm:text-4xl">Рассчитать стоимость автоматизации</h2>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-[image:var(--gradient-primary)] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        {step === 0 && (
          <div key="s0" className="animate-step mt-8">
            <p className="mb-4 text-sm text-muted-foreground">Шаг 1 из 2</p>
            <h3 className="mb-5 text-lg font-medium">Какую задачу нужно решить?</h3>
            <div className="grid gap-3">
              {tasks.map((t, i) => (
                <Button key={t.label} variant="ghost" type="button" onClick={() => { setTask(i); setStep(1); }}
                  className={`h-auto whitespace-normal justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-all hover:border-primary hover:bg-secondary ${task === i ? "border-primary bg-secondary" : "border-border"}`}>
                  {t.label}<ArrowRight className="h-4 w-4 text-primary" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <form key="s1" onSubmit={submit} className="animate-step mt-8 grid gap-4" noValidate>
            <p className="text-sm text-muted-foreground">Шаг 2 из 2 · {task !== null && tasks[task]?.label}</p>
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
              <Button variant="outline" type="button" onClick={() => setStep(0)} className="h-auto rounded-full border border-border px-5 py-3 text-sm hover:bg-secondary">Назад</Button>
              <Button type="submit" className="h-auto flex-1 whitespace-normal rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02]">Получить решение</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div key="s2" className="animate-step mt-10 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 font-medium">Анализируем задачу и рассчитываем стоимость…</p>
            <p className="mt-2 text-sm text-muted-foreground">{progress < 40 ? "Оцениваем объём работ" : progress < 80 ? "Подбираем ИИ-инструменты" : "Формируем предложение"} · {progress}%</p>
          </div>
        )}

        {step === 3 && task !== null && (
          <div key="s3" className="animate-step mt-8 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-[image:var(--gradient-primary)] p-3 text-primary-foreground"><Check className="h-6 w-6" /></div>
            <h3 className="text-xl font-semibold">{name}, расчёт готов!</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border p-4"><div className="text-sm text-muted-foreground">Стоимость</div><div className="font-display mt-1 text-2xl font-semibold text-primary">{tasks[task]?.price}</div></div>
              <div className="rounded-2xl border border-border p-4"><div className="text-sm text-muted-foreground">Срок запуска</div><div className="font-display mt-1 text-2xl font-semibold">{tasks[task]?.days}</div></div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Мы свяжемся с вами по контакту {contact} в течение 1 часа с детальным решением.</p>
            <Button variant="link" onClick={() => { setStep(0); setTask(null); setName(""); setContact(""); }} className="mt-6 text-sm text-primary hover:underline">Новый расчёт</Button>
          </div>
        )}
      </div>
    </section>
  );
}
