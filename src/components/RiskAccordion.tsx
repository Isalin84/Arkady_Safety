import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { playClick, playHint } from '@/utils/sound'

interface Risk {
  id: string
  icon: string
  title: string
  body: string
}

interface RiskAccordionProps {
  data: Risk[]
}

export default function RiskAccordion({ data }: RiskAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    playClick()
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        playHint()
      }
      return next
    })
  }

  return (
    <section id="risks-section" className="py-16 md:py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">Где и когда возникают риски</h2>
        <p className="section-subtitle text-center max-w-2xl mx-auto">
          Типичные источники спотыканий, поскальзываний и падений на производстве
        </p>

        <div className="max-w-3xl mx-auto mt-8 space-y-3">
          {data.map((risk) => {
            const isOpen = openIds.has(risk.id)
            
            return (
              <div
                key={risk.id}
                className="bg-white rounded-brand overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggle(risk.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 text-left',
                    'touch-target transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-wine/30'
                  )}
                  aria-expanded={isOpen}
                  aria-controls={`risk-${risk.id}`}
                >
                  <span className="text-2xl flex-shrink-0">{risk.icon}</span>
                  
                  <span className="flex-1 font-body font-bold text-brand-charcoal">
                    {risk.title}
                  </span>
                  
                  <ChevronDown 
                    className={cn(
                      'w-5 h-5 text-brand-charcoal/50 transition-transform duration-accordion',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                
                <div
                  id={`risk-${risk.id}`}
                  role="region"
                  className={cn(
                    'overflow-hidden transition-all duration-accordion',
                    isOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-4 pb-4 pl-12 border-t border-brand-gray/50">
                    <p className="text-brand-charcoal/80 pt-3 leading-relaxed">
                      {risk.body}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
