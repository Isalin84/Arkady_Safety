import { useState, useEffect } from 'react'
import { Check, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { playClick, playSuccess } from '@/utils/sound'
import { 
  getChecklistState, 
  setChecklistState, 
  type ChecklistState 
} from '@/utils/storage'
import content from '@/data/content.json'

interface ChecklistItem {
  id: string
  text: string
  risk_category: string
}

interface ChecklistProps {
  data: ChecklistItem[]
}

type ResultType = 'green' | 'yellow' | 'red'

const resultConfig: Record<ResultType, { 
  color: string
  bg: string
  icon: typeof CheckCircle2
  title: string
  description: string
}> = {
  green: {
    color: 'text-brand-forest',
    bg: 'bg-brand-mint/30',
    icon: CheckCircle2,
    title: 'Отлично!',
    description: 'Вы хорошо подготовлены к безопасному передвижению.'
  },
  yellow: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    icon: AlertTriangle,
    title: 'Есть над чем поработать',
    description: 'Обратите внимание на отмеченные пункты — это ваши зоны роста.'
  },
  red: {
    color: 'text-brand-wine',
    bg: 'bg-brand-peach/30',
    icon: XCircle,
    title: 'Требуется внимание',
    description: 'Рекомендуем пересмотреть свои привычки перед выходом.'
  }
}

export default function Checklist({ data }: ChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<ResultType | null>(null)

  const thresholds = content.checklist_thresholds
  const recommendations = content.checklist_recommendations as Record<string, string>

  // Load saved state
  useEffect(() => {
    const saved = getChecklistState()
    if (saved) {
      setChecked(new Set(saved.checked))
      if (saved.completed && saved.result) {
        setShowResult(true)
        setResult(saved.result)
      }
    }
  }, [])

  // Save state on change
  useEffect(() => {
    const state: ChecklistState = {
      checked: Array.from(checked),
      completed: showResult,
      result: result || undefined
    }
    setChecklistState(state)
  }, [checked, showResult, result])

  const toggleItem = (id: string) => {
    playClick()
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const calculateResult = () => {
    // Count unchecked items as risks
    const uncheckedCount = data.length - checked.size
    
    let resultType: ResultType
    if (uncheckedCount >= thresholds.red) {
      resultType = 'red'
    } else if (uncheckedCount >= thresholds.yellow) {
      resultType = 'yellow'
    } else {
      resultType = 'green'
    }

    setResult(resultType)
    setShowResult(true)
    playSuccess()
  }

  const resetChecklist = () => {
    playClick()
    setChecked(new Set())
    setShowResult(false)
    setResult(null)
  }

  // Get unique risk categories for unchecked items
  const getRecommendations = () => {
    const uncheckedCategories = new Set(
      data
        .filter(item => !checked.has(item.id))
        .map(item => item.risk_category)
    )
    
    return Array.from(uncheckedCategories)
      .slice(0, 3)
      .map(cat => recommendations[cat])
      .filter(Boolean)
  }

  const progress = (checked.size / data.length) * 100

  return (
    <section id="checklist-section" className="py-16 md:py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">1‑минутная проверка</h2>
        <p className="section-subtitle text-center max-w-2xl mx-auto">
          Отметьте пункты, которые вы выполняете перед выходом
        </p>

        <div className="max-w-2xl mx-auto mt-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-brand-charcoal/60 mb-2">
              <span>Прогресс</span>
              <span>{checked.size}/{data.length}</span>
            </div>
            <div className="h-2 bg-brand-gray rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-forest transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist items */}
          {!showResult && (
            <div className="space-y-3">
              {data.map((item) => {
                const isChecked = checked.has(item.id)
                
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 rounded-brand text-left',
                      'touch-target transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-brand-wine/30',
                      isChecked 
                        ? 'bg-brand-mint/30 border-2 border-brand-forest/30' 
                        : 'bg-white border-2 border-transparent hover:border-brand-gray'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5',
                      'border-2 transition-colors',
                      isChecked 
                        ? 'bg-brand-forest border-brand-forest' 
                        : 'border-brand-charcoal/30'
                    )}>
                      {isChecked && <Check className="w-4 h-4 text-white" />}
                    </div>
                    
                    <span className={cn(
                      'text-brand-charcoal leading-relaxed transition-opacity',
                      isChecked && 'opacity-70'
                    )}>
                      {item.text}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Result */}
          {showResult && result && (
            <div className={cn(
              'rounded-brand p-6 text-center',
              resultConfig[result].bg
            )}>
              {(() => {
                const Icon = resultConfig[result].icon
                return <Icon className={cn('w-16 h-16 mx-auto mb-4', resultConfig[result].color)} />
              })()}
              
              <h3 className={cn('font-heading text-2xl mb-2', resultConfig[result].color)}>
                {resultConfig[result].title}
              </h3>
              
              <p className="text-brand-charcoal/80 mb-6">
                {resultConfig[result].description}
              </p>

              {/* Recommendations */}
              {result !== 'green' && (
                <div className="bg-white/50 rounded-brand p-4 mb-6 text-left">
                  <h4 className="font-bold text-brand-charcoal mb-3">
                    Рекомендации на основе ваших ответов:
                  </h4>
                  <ul className="space-y-2">
                    {getRecommendations().map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-brand-charcoal/80">
                        <span className="text-brand-wine">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-6">
            {!showResult ? (
              <button
                onClick={calculateResult}
                className="btn-primary"
              >
                Показать результат
              </button>
            ) : (
              <button
                onClick={resetChecklist}
                className="btn-secondary"
              >
                Пройти заново
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
