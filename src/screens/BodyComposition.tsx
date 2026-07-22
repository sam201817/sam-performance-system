import { useMemo, useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { BodyMetricForm } from '../components/body/BodyMetricForm'
import { BodyMetricHistoryCard } from '../components/body/BodyMetricHistoryCard'
import { BodyMetricSummaryCard } from '../components/body/BodyMetricSummaryCard'
import { MetricTrend } from '../components/body/MetricTrend'
import { EmptyState } from '../components/ui/EmptyState'
import { InfoBanner } from '../components/ui/InfoBanner'
import { PageHeader } from '../components/ui/PageHeader'
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
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null)
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
    setSaveFeedback(t('messages.bodySaved'))
  }

  const editingEntry = formState
    ? formState.entryId
      ? history.entries.find((entry) => entry.id === formState.entryId) ?? null
      : null
    : null

  return (
    <>
      <main className="body-composition screen-shell">
        <PageHeader
          title={t('bodyComposition.title')}
          subtitle={t('bodyComposition.subtitle')}
        />

        {saveFeedback ? (
          <InfoBanner message={saveFeedback} onDismiss={() => setSaveFeedback(null)} />
        ) : null}

        {history.entries.length === 0 ? (
          <EmptyState
            icon="body"
            title={t('emptyStates.bodyTitle')}
            description={t('emptyStates.bodyDescription')}
            actionLabel={t('emptyStates.bodyAction')}
            onAction={openTodayForm}
          />
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

        {history.entries.length > 0 ? (
          <section className="body-composition__history" aria-label={t('bodyComposition.recentCheckIns')}>
            <h2 className="body-composition__section-title sps-title">{t('bodyComposition.recentCheckIns')}</h2>
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
          </section>
        ) : null}
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />

      {formState && (
        <BodyMetricForm
          title={formState.title}
          entry={editingEntry}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </>
  )
}
