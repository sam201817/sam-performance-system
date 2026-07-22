import './BrandHeader.css'

export function BrandHeader() {
  return (
    <header className="brand-header">
      <div className="brand-header__text">
        <span className="brand-header__mark">SPS</span>
        <span className="brand-header__name">SAM PERFORMANCE SYSTEM</span>
      </div>
      <button type="button" className="brand-header__profile" aria-label="個人設定">
        S
      </button>
    </header>
  )
}
