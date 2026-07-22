export const SESSION_ID = 'full-body-rebuild-v1'

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  weight: string
  rest?: string
  notes?: string
}

export interface WorkoutSession {
  id: string
  title: string
  duration: string
  exercises: Exercise[]
}

export const TODAY_WORKOUT: WorkoutSession = {
  id: SESSION_ID,
  title: '全身基礎重建',
  duration: '55 分鐘',
  exercises: [
    {
      id: 'goblet-squat',
      name: 'Goblet Squat',
      sets: 3,
      reps: '10',
      weight: '24 kg',
      rest: '90 秒',
      notes: '保持核心收緊，膝蓋對準腳尖方向。',
    },
    {
      id: 'romanian-deadlift',
      name: 'Romanian Deadlift',
      sets: 3,
      reps: '10',
      weight: '40 kg',
      rest: '90 秒',
      notes: '髖部後推，感受後側鏈拉伸。',
    },
    {
      id: 'split-squat',
      name: 'Split Squat',
      sets: 3,
      reps: '8',
      weight: '16 kg',
      rest: '60 秒',
    },
    {
      id: 'pallof-press',
      name: 'Pallof Press',
      sets: 3,
      reps: '12',
      weight: '15 kg',
      rest: '45 秒',
      notes: '抵抗旋轉，保持軀幹穩定。',
    },
    {
      id: 'seated-cable-row',
      name: 'Seated Cable Row',
      sets: 3,
      reps: '12',
      weight: '45 kg',
      rest: '60 秒',
    },
    {
      id: 'incline-dumbbell-press',
      name: 'Incline Dumbbell Press',
      sets: 3,
      reps: '10',
      weight: '14 kg',
      rest: '75 秒',
    },
    {
      id: 'farmer-carry',
      name: 'Farmer Carry',
      sets: 3,
      reps: '40 公尺',
      weight: '24 kg',
      rest: '60 秒',
      notes: '肩帶下沉，步伐穩定，不聳肩。',
    },
  ],
}
