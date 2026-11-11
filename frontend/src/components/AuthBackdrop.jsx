// src/components/AuthBackdrop.jsx
// Decorative full-bleed background for auth pages (Login/Register):
// soft pink gradient, a simple skyline silhouette along the bottom,
// and a heartbeat/heart accent - recreating the mockup's illustrated feel
// using CSS/SVG rather than a custom illustration asset.

export default function AuthBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blush via-white to-brand-rose" />

      {/* Skyline silhouette along the bottom, evoking Peshawar's forts/minarets */}
      <svg
        className="absolute bottom-0 left-0 w-full text-red-200/70"
        viewBox="0 0 1400 220"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,220 L0,140 L40,140 L40,100 L60,100 L60,140 L100,140 L100,60 L120,60 L120,40 L140,40 L140,60 L160,60 L160,140 L220,140 L220,90 L240,70 L260,90 L260,140 L320,140 L320,110 L340,110 L340,80 L360,80 L360,110 L380,110 L380,140 L460,140 L460,50 L480,50 L480,20 L500,20 L500,50 L520,50 L520,140 L600,140 L600,100 L620,100 L620,140 L700,140 L700,70 L720,50 L740,70 L740,140 L820,140 L820,110 L840,110 L840,80 L860,80 L860,110 L880,110 L880,140 L960,140 L960,40 L980,40 L980,10 L1000,10 L1000,40 L1020,40 L1020,140 L1100,140 L1100,90 L1120,70 L1140,90 L1140,140 L1220,140 L1220,100 L1240,100 L1240,140 L1400,140 L1400,220 Z" />
      </svg>

      {/* Small decorative heart + heartbeat line accent, top-right style flourish */}
      <svg
        className="absolute top-24 right-16 w-24 h-16 text-brand-red/40 hidden md:block"
        viewBox="0 0 100 60"
        fill="none"
      >
        <path
          d="M20 30 C20 15, 40 15, 40 30 C40 15, 60 15, 60 30 C60 45, 40 55, 40 55 C40 55, 20 45, 20 30 Z"
          fill="currentColor"
        />
        <path
          d="M0 40 L25 40 L32 25 L40 50 L48 30 L55 40 L100 40"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
