import { useMemo, useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { BodyMetricForm } from '../components/body/BodyMetricForm'
import { BodyMetricHistoryCard } from '../components/body/BodyMetricHistoryCard'
import { BodyMetricSummaryCard } from '../components/body/BodyMetricSummaryCard'
import { MetricTrend } from '../components/body/MetricTrend'
import { useTranslation } from '../hooks/useTranslation'
import type { BodyCompositionProps } from '../types/workout'
import { buildBodyMetricSummary, buildMetricTrendData } from '../utils/bodyMetricCalculations'
import { findEntryForDate } from '../utils/bodyMetricStorage'
import './BodyComposition.css'

export function BodyComposition({
  history,
  activeTab,
  onNavigate,
  onSaveEntry,
  onDeleteEntry,
}: BodyCompositionProps) {
  const { t } = useTranslation()
  const [selectedMetric, setSelectedMetric] = useState<
    'weightKg' | 'bodyFatPercent' | 'muscleMassKg' | 'waistCm'
  >('weightKg')
  const [formState, setFormState] = useState<{
    entryId: string | null
    title: string
  } | null>(null)

  const summary = useMemo(
    () => buildBodyMetricSummary(history.entries),
    [history.entries],
  )
  const trend = useMemo(
    () => buildMetricTrendData(history.entries, selectedMetric),
    [history.entries, selectedMetric],
  )
  const todayEntry = useMemo(() => findEntryForDate(history), [history])

  function openTodayForm() {
    if (todayEntry) {
      setFormState({ entryId: todayEntry.id, title: t('bodyComposition.updateCheckIn') })
      return
    }

    setFormState({ entryId: null, title: t('bodyComposition.newCheckIn') })
  }

  function openEditForm(entryId: string) {
    setFormState({ entryId, title: t('bodyComposition.editCheckIn') })
  }

  function closeForm() {
    setFormState(null)
  }

  function handleSave(values: Parameters<typeof onSaveEntry>[0]) {
    onSaveEntry(values, formState?.entryId ?? null)
    closeForm()
  }

  const editingEntry = formState
    ? formState.entryId
      ? history.entries.find((entry) => entry.id === formState.entryId) ?? null
      : null
    : null

  return (
    <>
      <main className="body-composition screen-shell">
        <header className="body-composition__header">
          <h1 className="body-composition__title">{t('bodyComposition.title')}</h1>
          <p className="body-composition__subtitle">{t('bodyComposition.subtitle')}</p>
        </header>

        {history.entries.length === 0 ? (
          <p className="body-composition__empty" role="status">
            {t('bodyComposition.empty')}
          </p>
        ) : (
          <BodyMetricSummaryCard summary={summary} />
        )}

        <button
          type="button"
          className="body-composition__primary sps-action-primary"
          onClick={openTodayForm}
        >
          {todayEntry ? t('bodyComposition.updateToday') : t('bodyComposition.addToday')}
        </button>

        <MetricTrend
          selectedMetric={selectedMetric}
          trend={trend}
          onMetricChange={setSelectedMetric}
        />

        <section className="body-composition__history" aria-label={t('bodyComposition.recentCheckIns')}>
          <h2 className="body-composition__section-title">{t('bodyComposition.recentCheckIns')}</h2>
          {history.entries.length === 0 ? (
            <p className="body-composition__empty" role="status">
              {t('bodyComposition.empty')}
            </p>
          ) : (
            <div className="body-composition__history-list">
              {history.entries.map((entry) => (
                <BodyMetricHistoryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={openEditForm}
                  onDelete={onDeleteEntry}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />

      {formState && (
        <BodyMetricForm
          entry={editingEntry}
          title={formState.title}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </>
  )
}
