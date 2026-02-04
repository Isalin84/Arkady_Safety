import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { playClick } from '@/utils/sound'
import { getSeasonState, setSeasonState, markExploreOpened, markExploreSeasonSelected, type Season } from '@/utils/storage'
import content from '@/data/content.json'
import { ScrollReveal } from './ui'

interface SafeStartState {
  id: string
  name: string
  icon: string
  anti_dote: string[]
}

interface WinterModuleProps {
  data: SafeStartState[]
}

const seasons: { id: Season; label: string; icon: string }[] = [
  { id: 'snow', label: 'Снегопад', icon: '❄️' },
  { id: 'thaw', label: 'Оттепель', icon: '💧' },
  { id: 'frost', label: 'Мороз', icon: '🧊' },
]

export default function WinterModule({ data }: WinterModuleProps) {
  const [selectedSeason, setSelectedSeason] = useState<Season>('snow')
  const [expandedState, setExpandedState] = useState<string | null>(null)

  const winterScenarios = content.winter_scenarios as Record<Season, {
    title: string
    icon: string
    tips: string[]
  }>

  useEffect(() => {
    setSelectedSeason(getSeasonState())
  }, [])

  const handleSeasonChange = (season: Season) => {
    playClick()
    setSelectedSeason(season)
    setSeasonState(season)
    // Track selected season for scoring
    markExploreSeasonSelected(season)
  }

  const toggleState = (id: string) => {
    playClick()
    const wasExpanded = expandedState === id
    setExpandedState(wasExpanded ? null : id)
    // Track opened Safe Start state for scoring (only when opening)
    if (!wasExpanded) {
      markExploreOpened('safeStartStates', id)
    }
  }

  const currentScenario = winterScenarios[selectedSeason]

  return (
    <section id="winter-section" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="section-title text-center">Зима и входные зоны</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Выберите погодные условия и получите актуальные советы
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto mt-8">
          {/* Season toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-brand-gray rounded-full p-1">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  onClick={() => handleSeasonChange(season.id)}
                  className={cn(
                    'px-4 py-2 rounded-full transition-all duration-200',
                    'font-body text-sm md:text-base',
                    'focus:outline-none focus:ring-2 focus:ring-brand-wine/30',
                    selectedSeason === season.id
                      ? 'bg-brand-wine text-white shadow-md'
                      : 'text-brand-charcoal hover:bg-white/50'
                  )}
                >
                  <span className="mr-1">{season.icon}</span>
                  <span className="hidden sm:inline">{season.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Season tips */}
          <div className="card p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{currentScenario.icon}</span>
              <h3 className="font-heading text-2xl text-brand-wine-dark">
                {currentScenario.title}
              </h3>
            </div>
            
            <ul className="space-y-3">
              {currentScenario.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-sky/50 flex items-center justify-center text-sm text-brand-teal flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-brand-charcoal leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TODO: Добавить скетч IMG-02 */}
          {/* Промпт: "Black and white pencil sketch, winter industrial walkway with small ice patches,
          worker walking with short steps and hands free (not in pockets), subtle second simplified
          silhouette in the background with hands in pockets crossed out by a simple X symbol (no text),
          no logos, clean line art, transparent background, 4:3" */}

          {/* Safe Start states */}
          <div className="mt-12">
            <h3 className="font-heading text-2xl text-brand-wine-dark text-center mb-6">
              Safe Start: управляй своим состоянием
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((state) => {
                const isExpanded = expandedState === state.id
                
                return (
                  <button
                    key={state.id}
                    onClick={() => toggleState(state.id)}
                    className={cn(
                      'card text-left transition-all',
                      isExpanded && 'ring-2 ring-brand-wine/30'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{state.icon}</span>
                      <span className="font-heading text-xl text-brand-wine-dark">
                        {state.name}
                      </span>
                    </div>
                    
                    <div className={cn(
                      'overflow-hidden transition-all duration-accordion',
                      isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    )}>
                      <div className="pt-3 border-t border-brand-gray">
                        <p className="text-sm text-brand-charcoal/60 mb-2">Антидот:</p>
                        <ul className="space-y-1">
                          {state.anti_dote.map((item, i) => (
                            <li key={i} className="text-sm text-brand-charcoal flex items-start gap-2">
                              <span className="text-brand-forest">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {!isExpanded && (
                      <p className="text-xs text-brand-charcoal/40 mt-2">
                        Нажми для советов
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* TODO: Добавить пиктограммы IMG-03 */}
          {/* Промпт: "Black and white pencil sketch icon row, four circular icons aligned horizontally:
          1) eye (look around), 2) slippery surface and stairs with warning exclamation icons (identify risk),
          3) worker in PPE climbing stairs clearly holding a handrail (do safely), 4) circle with the word 'ВСЕГДА',
          clean line art, no logos, no background texture, solid background as required, 21:9" */}
        </div>
      </div>
    </section>
  )
}
