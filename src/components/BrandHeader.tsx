import { useTranslation } from '../hooks/useTranslation'
import './BrandHeader.css'

export function BrandHeader() {
  const { t } = useTranslation()

  return (
    <header className="brand-header">
      <div className="brand-header__text">
        <span className="brand-header__mark">SPS</span>
        <span className="brand-header__name">{t('common.brandName')}</span>
      </div>
      <button type="button" className="brand-header__profile" aria-label="個人設定">
        S
      </button>
    </header>
  )
}
