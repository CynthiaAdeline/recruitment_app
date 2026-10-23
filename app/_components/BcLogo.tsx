export default function BcLogo({ size = 32, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: size, height: size, borderRadius: Math.round(size * 0.25),
        background: "linear-gradient(135deg, #7dd3fc, #38bdf8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: size * 0.38, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>BC</span>
      </div>
      <span style={{ fontWeight: 700, fontSize: size * 0.5, color: dark ? "#fff" : "#0f172a", letterSpacing: "-0.3px" }}>BrightCore</span>
    </div>
  );
}
