// localStorage keys
const KEYS = {
  MUTE: 'stf_mute',
  CHECKLIST: 'stf_checklist_state',
  QUIZ: 'stf_quiz_state',
  HAZARD: 'stf_hazard_state',
  SEASON: 'stf_season',
  LAST_VISIT: 'stf_last_visit',
} as const

// Mute state
export function getMuteState(): boolean {
  const value = localStorage.getItem(KEYS.MUTE)
  // По умолчанию звук выключен (согласно ТЗ)
  return value === null ? true : value === 'true'
}

export function setMuteState(muted: boolean): void {
  localStorage.setItem(KEYS.MUTE, String(muted))
}

// Checklist state
export interface ChecklistState {
  checked: string[]
  completed: boolean
  result?: 'green' | 'yellow' | 'red'
}

export function getChecklistState(): ChecklistState | null {
  const value = localStorage.getItem(KEYS.CHECKLIST)
  return value ? JSON.parse(value) : null
}

export function setChecklistState(state: ChecklistState): void {
  localStorage.setItem(KEYS.CHECKLIST, JSON.stringify(state))
}

// Quiz state
export interface QuizState {
  answers: Record<string, string>
  currentQuestion: number
  completed: boolean
  score?: number
}

export function getQuizState(): QuizState | null {
  const value = localStorage.getItem(KEYS.QUIZ)
  return value ? JSON.parse(value) : null
}

export function setQuizState(state: QuizState): void {
  localStorage.setItem(KEYS.QUIZ, JSON.stringify(state))
}

// Hazard spotting state
export interface HazardState {
  found: string[]
  completed: boolean
}

export function getHazardState(): HazardState | null {
  const value = localStorage.getItem(KEYS.HAZARD)
  return value ? JSON.parse(value) : null
}

export function setHazardState(state: HazardState): void {
  localStorage.setItem(KEYS.HAZARD, JSON.stringify(state))
}

// Season selection
export type Season = 'snow' | 'thaw' | 'frost'

export function getSeasonState(): Season {
  const value = localStorage.getItem(KEYS.SEASON)
  return (value as Season) || 'snow'
}

export function setSeasonState(season: Season): void {
  localStorage.setItem(KEYS.SEASON, season)
}

// Last visit
export function updateLastVisit(): void {
  localStorage.setItem(KEYS.LAST_VISIT, new Date().toISOString())
}

export function getLastVisit(): string | null {
  return localStorage.getItem(KEYS.LAST_VISIT)
}

// Reset all progress
export function resetAllProgress(): void {
  Object.values(KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}
