import { useTranslation } from '../hooks/useTranslation'
import './BrandHeader.css'

type BrandHeaderProps = {
  onOpenProfile: () => void
}

export function BrandHeader({ onOpenProfile }: BrandHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="brand-header">
      <div className="brand-header__text">
        <span className="brand-header__mark">SPS</span>
        <span className="brand-header__name">{t('common.brandName')}</span>
      </div>
      <button
        type="button"
        className="brand-header__profile"
        aria-label={t('common.openProfile')}
        onClick={onOpenProfile}
      >
        S
      </button>
    </header>
  )
}
