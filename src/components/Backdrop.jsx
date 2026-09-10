export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* nebulosas cálidas */}
      <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.84_0.165_82/12%),transparent_65%)]" />
      <div className="absolute -right-52 top-1/3 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.8_0.13_190/8%),transparent_65%)]" />
      <div className="absolute -bottom-56 left-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.12_55/9%),transparent_65%)]" />

      {/* retícula técnica */}
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black_30%,transparent_100%)]" />

      {/* texturas CRT */}
      <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
      <div className="absolute inset-0 bg-scanlines opacity-40" />

      {/* viñeta */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_40%,transparent_55%,oklch(0.07_0.008_90)_100%)]" />
    </div>
  )
}
