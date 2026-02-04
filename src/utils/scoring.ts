import content from '@/data/content.json'
import {
  getQuizState,
  getChecklistState,
  getHazardState,
  getExploreState,
} from './storage'

// Point values
const POINTS = {
  QUIZ_CORRECT: 10,
  HAZARD_FOUND: 10,
  HAZARD_ALL_BONUS: 10,
  CHECKLIST_ITEM: 2,
  CHECKLIST_COMPLETED_BONUS: 5,
  EXPLORE_ITEM: 1, // per habit/risk/control/safeStartState/season opened
} as const

// Rank thresholds (percentage)
const RANKS = [
  { minPercent: 100, title: 'Эксперт по контролю рисков' },
  { minPercent: 80, title: 'Профи' },
  { minPercent: 50, title: 'Уверенный практик' },
  { minPercent: 0, title: 'Новичок' },
] as const

export interface SectionScore {
  earned: number
  max: number
  label: string
}

export interface ScoreResult {
  earnedPoints: number
  maxPoints: number
  percent: number
  rankTitle: string
  sections: {
    quiz: SectionScore
    hazard: SectionScore
    checklist: SectionScore
    explore: SectionScore
  }
}

function getRankTitle(percent: number): string {
  for (const rank of RANKS) {
    if (percent >= rank.minPercent) {
      return rank.title
    }
  }
  return RANKS[RANKS.length - 1].title
}

export function calculateScore(): ScoreResult {
  // --- Quiz ---
  const quizQuestions = content.quiz
  const quizState = getQuizState()
  let quizEarned = 0
  if (quizState?.answers) {
    quizQuestions.forEach((q) => {
      if (quizState.answers[q.id] === q.answer) {
        quizEarned += POINTS.QUIZ_CORRECT
      }
    })
  }
  const quizMax = quizQuestions.length * POINTS.QUIZ_CORRECT

  // --- Hazard Spotting ---
  const hazardHotspots = content.hazard_spotting.hotspots
  const hazardState = getHazardState()
  const hazardFoundCount = hazardState?.found?.length ?? 0
  const hazardAllFound = hazardFoundCount === hazardHotspots.length
  const hazardEarned =
    hazardFoundCount * POINTS.HAZARD_FOUND +
    (hazardAllFound ? POINTS.HAZARD_ALL_BONUS : 0)
  const hazardMax =
    hazardHotspots.length * POINTS.HAZARD_FOUND + POINTS.HAZARD_ALL_BONUS

  // --- Checklist ---
  const checklistItems = content.checklist
  const checklistState = getChecklistState()
  const checklistCheckedCount = checklistState?.checked?.length ?? 0
  const checklistCompleted = checklistState?.completed ?? false
  const checklistEarned =
    checklistCheckedCount * POINTS.CHECKLIST_ITEM +
    (checklistCompleted ? POINTS.CHECKLIST_COMPLETED_BONUS : 0)
  const checklistMax =
    checklistItems.length * POINTS.CHECKLIST_ITEM +
    POINTS.CHECKLIST_COMPLETED_BONUS

  // --- Explore (educational clicks) ---
  const exploreState = getExploreState()

  // Available totals from content
  const totalHabits = content.arkady.habits.length
  const totalRisks = content.risks.length
  const totalControls = content.controls.length
  const totalSafeStartStates = content.safe_start_states.length
  const totalSeasons = 3 // snow, thaw, frost

  const exploreMax =
    (totalHabits + totalRisks + totalControls + totalSafeStartStates + totalSeasons) *
    POINTS.EXPLORE_ITEM

  const exploreEarned =
    (exploreState.arkadyHabits.length +
      exploreState.risks.length +
      exploreState.controls.length +
      exploreState.safeStartStates.length +
      exploreState.seasons.length) *
    POINTS.EXPLORE_ITEM

  // --- Totals ---
  const earnedPoints = quizEarned + hazardEarned + checklistEarned + exploreEarned
  const maxPoints = quizMax + hazardMax + checklistMax + exploreMax
  const percent = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0
  const rankTitle = getRankTitle(percent)

  return {
    earnedPoints,
    maxPoints,
    percent,
    rankTitle,
    sections: {
      quiz: { earned: quizEarned, max: quizMax, label: 'Квиз' },
      hazard: { earned: hazardEarned, max: hazardMax, label: 'Найди опасности' },
      checklist: { earned: checklistEarned, max: checklistMax, label: 'Чек-лист' },
      explore: { earned: exploreEarned, max: exploreMax, label: 'Обучение' },
    },
  }
}
