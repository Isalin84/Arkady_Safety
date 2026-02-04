import { useState, useEffect } from 'react'
import { ChevronRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { playClick, playSuccess, playError } from '@/utils/sound'
import { getQuizState, setQuizState, type QuizState } from '@/utils/storage'
import { CountUp, ScrollReveal } from './ui'

interface QuizOption {
  id: string
  text: string
}

interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  answer: string
  explain: string
  habit: string
}

interface QuizProps {
  data: QuizQuestion[]
}

export default function Quiz({ data }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completed, setCompleted] = useState(false)

  const currentQuestion = data[currentIndex]
  const totalQuestions = data.length

  // Load saved state
  useEffect(() => {
    const saved = getQuizState()
    if (saved) {
      setAnswers(saved.answers)
      setCurrentIndex(saved.currentQuestion)
      setCompleted(saved.completed)
    }
  }, [])

  // Save state on change
  useEffect(() => {
    const state: QuizState = {
      answers,
      currentQuestion: currentIndex,
      completed,
      score: completed ? calculateScore() : undefined
    }
    setQuizState(state)
  }, [answers, currentIndex, completed])

  const calculateScore = () => {
    let correct = 0
    data.forEach(q => {
      if (answers[q.id] === q.answer) {
        correct++
      }
    })
    return Math.round((correct / totalQuestions) * 100)
  }

  const getWrongHabits = () => {
    return data
      .filter(q => answers[q.id] !== q.answer)
      .map(q => q.habit)
      .slice(0, 3)
  }

  const handleSelectAnswer = (optionId: string) => {
    if (showExplanation) return
    
    playClick()
    setSelectedAnswer(optionId)
  }

  const handleConfirm = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === currentQuestion.answer
    
    if (isCorrect) {
      playSuccess()
    } else {
      playError()
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer
    }))
    setShowExplanation(true)
  }

  const handleNext = () => {
    playClick()
    
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
      playSuccess()
    }
  }

  const resetQuiz = () => {
    playClick()
    setCurrentIndex(0)
    setAnswers({})
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCompleted(false)
  }

  const scrollToChecklist = () => {
    playClick()
    document.getElementById('checklist-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Results view
  if (completed) {
    const score = calculateScore()
    const wrongHabits = getWrongHabits()

    return (
      <section id="quiz-section" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className={cn(
              'rounded-brand p-8',
              score >= 80 ? 'bg-brand-mint/30' : score >= 50 ? 'bg-yellow-50' : 'bg-brand-peach/30'
            )}>
              {score >= 80 ? (
                <CheckCircle2 className="w-20 h-20 mx-auto mb-4 text-brand-forest" />
              ) : (
                <XCircle className="w-20 h-20 mx-auto mb-4 text-brand-wine" />
              )}

              <h2 className="section-title">Квиз завершён!</h2>
              
              <p className="text-4xl font-heading text-brand-wine-dark mb-4">
                <CountUp from={0} to={score} duration={1.2} />%
              </p>
              
              <p className="text-brand-charcoal/80 mb-6">
                Правильных ответов: {Object.values(answers).filter((a, i) => a === data[i]?.answer).length} из {totalQuestions}
              </p>

              {wrongHabits.length > 0 && (
                <div className="bg-white/50 rounded-brand p-6 text-left mb-6">
                  <h4 className="font-bold text-brand-charcoal mb-3">
                    3 привычки на неделю:
                  </h4>
                  <ul className="space-y-3">
                    {wrongHabits.map((habit, i) => (
                      <li key={i} className="flex items-start gap-3 text-brand-charcoal/80">
                        <span className="w-6 h-6 rounded-full bg-brand-wine text-white flex items-center justify-center text-sm flex-shrink-0">
                          {i + 1}
                        </span>
                        {habit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={resetQuiz} className="btn-primary">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Пройти заново
                </button>
                <button onClick={scrollToChecklist} className="btn-secondary">
                  К чек-листу
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Quiz view
  return (
    <section id="quiz-section" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="section-title text-center">Мини-квиз</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Проверьте свои знания — 8 вопросов, ~2 минуты
          </p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto mt-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-brand-charcoal/60 mb-2">
              <span>Вопрос {currentIndex + 1} из {totalQuestions}</span>
              <span>{Math.round((currentIndex / totalQuestions) * 100)}%</span>
            </div>
            <div className="h-2 bg-brand-gray rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-wine transition-all duration-300"
                style={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="card p-6">
            <h3 className="font-heading text-xl text-brand-wine-dark mb-6">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id
                const isCorrect = option.id === currentQuestion.answer
                const showCorrect = showExplanation && isCorrect
                const showWrong = showExplanation && isSelected && !isCorrect

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectAnswer(option.id)}
                    disabled={showExplanation}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 rounded-brand text-left',
                      'touch-target transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-brand-wine/30',
                      'border-2',
                      showCorrect && 'bg-brand-mint/30 border-brand-forest',
                      showWrong && 'bg-brand-peach/30 border-brand-wine',
                      !showExplanation && isSelected && 'bg-brand-sky/30 border-brand-teal',
                      !showExplanation && !isSelected && 'bg-white border-transparent hover:border-brand-gray',
                      showExplanation && !showCorrect && !showWrong && 'bg-white border-transparent opacity-50'
                    )}
                  >
                    <span className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                      'border-2 font-bold text-sm',
                      showCorrect && 'bg-brand-forest border-brand-forest text-white',
                      showWrong && 'bg-brand-wine border-brand-wine text-white',
                      !showExplanation && isSelected && 'bg-brand-teal border-brand-teal text-white',
                      !showExplanation && !isSelected && 'border-brand-charcoal/30 text-brand-charcoal/60'
                    )}>
                      {option.id.toUpperCase()}
                    </span>
                    
                    <span className="text-brand-charcoal leading-relaxed pt-0.5">
                      {option.text}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="bg-brand-cream rounded-brand p-4 mb-6">
                <p className="text-brand-charcoal">
                  <strong>Объяснение:</strong> {currentQuestion.explain}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              {!showExplanation ? (
                <button
                  onClick={handleConfirm}
                  disabled={!selectedAnswer}
                  className={cn(
                    'btn-primary',
                    !selectedAnswer && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Проверить
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  {currentIndex < totalQuestions - 1 ? (
                    <>
                      Далее
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </>
                  ) : (
                    'Завершить'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
