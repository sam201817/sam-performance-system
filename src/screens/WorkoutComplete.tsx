import { Card } from '../components/Card'
import type { WorkoutCompleteProps } from '../types/workout'
import './WorkoutComplete.css'

export function WorkoutComplete({ summary, onReturnHome }: WorkoutCompleteProps) {
  const {
    totalExercises,
    completedExercises,
    totalCompletedSets,
    durationMinutes,
  } = summary

  return (
    <main className="workout-complete screen-shell">
      <Card className="workout-complete__card">
        <div className="workout-complete__icon" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="rgba(184,217,38,0.25)"
              strokeWidth="1.5"
            />
            <path
              d="M14 24l7 7 13-14"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="workout-complete__title">訓練完成</h1>
        <p className="workout-complete__message">
          今日 {totalExercises} 個動作訓練已結束。
        </p>

        <dl className="workout-complete__stats">
          <div className="workout-complete__stat">
            <dt>完成動作</dt>
            <dd>
              {completedExercises} / {totalExercises}
            </dd>
          </div>
          <div className="workout-complete__stat">
            <dt>完成組數</dt>
            <dd>{totalCompletedSets}</dd>
          </div>
          {durationMinutes !== null && (
            <div className="workout-complete__stat">
              <dt>訓練時間</dt>
              <dd>{durationMinutes} 分鐘</dd>
            </div>
          )}
        </dl>

        <p className="workout-complete__submessage">身體記得，明天繼續。</p>

        <button
          type="button"
          className="workout-complete__button sps-action-primary"
          onClick={onReturnHome}
        >
          返回首頁
        </button>
      </Card>
    </main>
  )
}
