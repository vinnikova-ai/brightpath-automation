import { useEffect, useRef } from "react";

/** Stage coordinates: panels and the SVG grid share one 1440×900 space so nodes sit exactly on panel corners. */
const W = 1440;
const H = 900;
const SKEW = 22;
const T = Math.tan((SKEW * Math.PI) / 180);

type Tone = "cyan" | "blue" | "teal";
const panels: { x: number; y: number; w: number; h: number; tone: Tone }[] = [
  { x: 150, y: 170, w: 400, h: 220, tone: "cyan" },
  { x: 470, y: 90, w: 520, h: 290, tone: "blue" },
  { x: 880, y: 190, w: 420, h: 240, tone: "teal" },
  { x: 320, y: 380, w: 360, h: 160, tone: "teal" },
  { x: 770, y: 420, w: 380, h: 170, tone: "cyan" },
  { x: 1110, y: 70, w: 250, h: 140, tone: "blue" },
  { x: 20, y: 330, w: 190, h: 120, tone: "blue" },
];

type Node = { x: number; y: number; group: number };
const nodes: Node[] = panels.flatMap((p, i) => {
  const s = (p.h / 2) * T;
  return [
    { x: p.x + s, y: p.y, group: i },
    { x: p.x + p.w + s, y: p.y, group: i },
    { x: p.x + p.w - s, y: p.y + p.h, group: i },
    { x: p.x - s, y: p.y + p.h, group: i },
  ];
});
const extras: [number, number][] = [
  [80, 90], [330, 60], [700, 30], [1010, 40], [1370, 260], [1260, 520],
  [1040, 660], [600, 640], [220, 600], [60, 520], [1400, 640], [880, 760],
];
extras.forEach(([x, y], i) => nodes.push({ x, y, group: 100 + i }));

const dist = (a: Node, b: Node) => Math.hypot(a.x - b.x, a.y - b.y);
const edges: [Node, Node][] = [];
const seen = new Set<string>();
nodes.forEach((a, i) => {
  nodes
    .map((b, j) => ({ b, j }))
    .filter(({ b, j }) => j !== i && b.group !== a.group)
    .sort((m, n) => dist(a, m.b) - dist(a, n.b))
    .slice(0, 2)
    .forEach(({ b, j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    });
});

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

/** Decorative light tech backdrop: CSS-only motion, paused while the tab is hidden. */
export function TechBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const syncVisibility = () => ref.current?.toggleAttribute("data-paused", document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return (
    <div ref={ref} className="tech-backdrop" aria-hidden="true">
      <div className="tech-glow tech-glow-1" />
      <div className="tech-glow tech-glow-2" />
      <div className="tech-glow tech-glow-3" />
      <div className="tech-glow tech-glow-4" />
      <div className="tech-stage">
        {panels.map((p, i) => (
          <div
            key={i}
            className={`tech-panel tech-panel-${p.tone}`}
            style={{ left: pct(p.x, W), top: pct(p.y, H), width: pct(p.w, W), height: pct(p.h, H) }}
          />
        ))}
        <svg className="tech-grid" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <radialGradient id="tech-node-halo">
              <stop offset="0%" stopColor="var(--tech-node)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--tech-node)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="tech-lines">
            {edges.map(([a, b], i) => (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            ))}
          </g>
          {nodes.map((n, i) => (
            <g key={i}>
              <circle className={`tech-halo ${i % 3 === 0 ? "tech-halo-twinkle" : ""}`} style={{ animationDelay: `${-(i % 7) * 0.9}s` }} cx={n.x} cy={n.y} r={11} fill="url(#tech-node-halo)" />
              <circle className="tech-node" cx={n.x} cy={n.y} r={n.group >= 100 ? 2.4 : 3.2} />
            </g>
          ))}
        </svg>
      </div>
      <div className="tech-veil" />
    </div>
  );
}
