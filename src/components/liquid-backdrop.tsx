/** Decorative CSS-only mesh: no pointer listeners or animation render loop. */
export function LiquidBackdrop() {
  return (
    <div className="liquid-backdrop" aria-hidden="true">
      <div className="liquid-mesh liquid-mesh-cyan" />
      <div className="liquid-mesh liquid-mesh-blue" />
      <div className="liquid-mesh liquid-mesh-violet" />
      <div className="liquid-mesh liquid-mesh-sheen" />
      <div className="liquid-backdrop-tint" />
    </div>
  );
}