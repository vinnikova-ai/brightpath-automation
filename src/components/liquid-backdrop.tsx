import { useEffect, useRef } from "react";

/** CSS animates the mesh; only visibility changes need a browser listener. */
export function LiquidBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const syncVisibility = () => {
      ref.current?.toggleAttribute("data-paused", document.hidden);
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  return (
    <div ref={ref} className="liquid-backdrop" aria-hidden="true">
      <div className="liquid-mesh liquid-mesh-cyan" />
      <div className="liquid-mesh liquid-mesh-blue" />
      <div className="liquid-mesh liquid-mesh-violet" />
      <div className="liquid-mesh liquid-mesh-sheen" />
      <div className="liquid-backdrop-tint" />
    </div>
  );
}