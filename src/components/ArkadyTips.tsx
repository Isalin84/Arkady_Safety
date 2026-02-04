import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { playClick } from '@/utils/sound'
import { markExploreOpened } from '@/utils/storage'
import { ScrollReveal } from './ui'

interface Habit {
  id: string
  title: string
  body: string
  icon: string
}

interface ArkadyTipsProps {
  data: {
    intro: string
    videoUrl?: string
    habits: Habit[]
  }
}

export default function ArkadyTips({ data }: ArkadyTipsProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    playClick()
    const wasOpen = openId === id
    setOpenId(wasOpen ? null : id)
    // Track opened habit for scoring (only when opening, not closing)
    if (!wasOpen) {
      markExploreOpened('arkadyHabits', id)
    }
  }

  return (
    <section id="arkady-tips" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="section-title text-center">Советы Аркадия</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Узнай, как избежать спотыканий, поскальзываний и падений от руководителя смены Аркадия
            Петровича.
          </p>
        </ScrollReveal>

        {/* Video */}
        <ScrollReveal delay={0.2}>
          <div className="max-w-4xl mx-auto mt-8">
          <div className="relative w-full pt-[56.25%] rounded-brand overflow-hidden bg-brand-gray/40">
            <iframe
              title="Советы Аркадия — видео"
              src={data.videoUrl ?? 'https://kinescope.io/embed/a6GLp8GSYG6xib3brXvGAM'}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
              allowFullScreen
              frameBorder={0}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <h3 className="font-heading text-2xl md:text-3xl text-brand-wine-dark text-center mt-10 mb-6">
            Проверь свои привычки
          </h3>
        </ScrollReveal>

        {/* Habits grid / accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {data.habits.map((habit) => {
            const isOpen = openId === habit.id
            
            return (
              <div
                key={habit.id}
                className={cn(
                  'card overflow-hidden',
                  isOpen && 'ring-2 ring-brand-wine/20'
                )}
              >
                <button
                  onClick={() => toggle(habit.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 text-left',
                    'touch-target transition-colors',
                    'focus:outline-none focus:bg-brand-gray/30'
                  )}
                  aria-expanded={isOpen}
                  aria-controls={`habit-${habit.id}`}
                >
                  <span className="text-3xl flex-shrink-0">{habit.icon}</span>
                  
                  <span className="flex-1">
                    <span className="font-heading text-xl text-brand-wine-dark block">
                      {habit.title}
                    </span>
                  </span>
                  
                  <ChevronDown 
                    className={cn(
                      'w-6 h-6 text-brand-charcoal/50 transition-transform duration-accordion',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                
                <div
                  id={`habit-${habit.id}`}
                  role="region"
                  className={cn(
                    'overflow-hidden transition-all duration-accordion',
                    isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-4 pb-4 pl-16">
                    <p className="text-brand-charcoal leading-relaxed">
                      {habit.body}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* TODO: Добавить скетч IMG-01 */}
        {/* Промпт: "Black and white pencil sketch, industrial walkway with a hose crossing the path, 
        worker in PPE in a near-miss trip moment, foot catching the hose, arms free for balance, 
        no fall impact, no injury, no logos, no readable text, minimal background, transparent background, 4:3" */}
      </div>
    </section>
  )
}
