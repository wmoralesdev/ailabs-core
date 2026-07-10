function MainGridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="main-grid-dots absolute inset-0 opacity-24 motion-reduce:opacity-20" />
      <div className="main-grid-dots main-grid-dots-glow absolute inset-0" />
    </div>
  )
}

export { MainGridBackground }
