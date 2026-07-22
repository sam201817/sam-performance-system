import { useMemo, useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { BodyMetricForm } from '../components/body/BodyMetricForm'
import { BodyMetricHistoryCard } from '../components/body/BodyMetricHistoryCard'
import { BodyMetricSummaryCard } from '../components/body/BodyMetricSummaryCard'
import { MetricTrend } from '../components/body/MetricTrend'
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
      setFormState({ entryId: todayEntry.id, title: 'Update Today Check-in' })
      return
    }

    setFormState({ entryId: null, title: 'New Body Check-in' })
  }

  function openEditForm(entryId: string) {
    setFormState({ entryId, title: 'Edit Check-in' })
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
          <h1 className="body-composition__title">Body Composition</h1>
          <p className="body-composition__subtitle">
            Track weight, body fat, muscle, and waist over time.
          </p>
        </header>

        {history.entries.length === 0 ? (
          <p className="body-composition__empty" role="status">
            No body check-ins yet. Add your first measurement to start building trends.
          </p>
        ) : (
          <BodyMetricSummaryCard summary={summary} />
        )}

        <button
          type="button"
          className="body-composition__primary sps-action-primary"
          onClick={openTodayForm}
        >
          {todayEntry ? 'Update Today' : 'Add Check-in Today'}
        </button>

        <MetricTrend
          selectedMetric={selectedMetric}
          trend={trend}
          onMetricChange={setSelectedMetric}
        />

        <section className="body-composition__history" aria-label="Recent check-ins">
          <h2 className="body-composition__section-title">Recent Check-ins</h2>
          {history.entries.length === 0 ? (
            <p className="body-composition__empty" role="status">
              Your recent check-ins will appear here.
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
