export function CarbonScene({ compact = false }: { compact?: boolean }) {
  return <div className={`orbital-stage relative ${compact ? "h-48" : "h-[24rem] sm:h-[29rem]"}`} aria-hidden="true">
    <div className="ring ring-one" /><div className="ring ring-two" /><div className="ring ring-three" />
    <div className="orbital-core absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 sm:h-40 sm:w-40">
      <div className="cube absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2"><span className="cube-face" /><span className="cube-face" /><span className="cube-face" /><span className="cube-face" /><span className="cube-face" /><span className="cube-face" /></div>
      <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_35%_28%,#efffc9,#c8ff00_38%,#3c4e00_72%)] shadow-[0_0_70px_rgba(200,255,0,.55)]" />
    </div>
  </div>;
}
