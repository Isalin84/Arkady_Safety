import { useState } from 'react'
import { cn } from '@/utils/cn'
import { playClick } from '@/utils/sound'
import { markExploreOpened } from '@/utils/storage'
import { ScrollReveal, TiltedCard } from './ui'
import { useIsMobile } from '@/utils/isMobile'

interface Control {
  id: string
  title: string
  body: string
  icon: string
  color: string
}

interface ControlHierarchyProps {
  data: Control[]
}

const colorMap: Record<string, string> = {
  wine: 'bg-brand-wine text-white',
  forest: 'bg-brand-forest text-white',
  teal: 'bg-brand-teal text-white',
  terracotta: 'bg-brand-terracotta text-white',
}

const borderColorMap: Record<string, string> = {
  wine: 'border-brand-wine',
  forest: 'border-brand-forest',
  teal: 'border-brand-teal',
  terracotta: 'border-brand-terracotta',
}

export default function ControlHierarchy({ data }: ControlHierarchyProps) {
  const [revealedId, setRevealedId] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const handleReveal = (id: string) => {
    playClick()
    const wasRevealed = revealedId === id
    setRevealedId(wasRevealed ? null : id)
    // Track opened control for scoring (only when opening)
    if (!wasRevealed) {
      markExploreOpened('controls', id)
    }
  }

  const CardWrapper = isMobile ? 'div' : TiltedCard

  return (
    <section id="controls-section" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="section-title text-center">Иерархия контроля</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            От устранения причины до индивидуальной защиты — системный подход к безопасности
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto">
          {data.map((control, index) => {
            const isRevealed = revealedId === control.id
            
            return (
              <ScrollReveal key={control.id} delay={index * 0.1}>
                <CardWrapper
                  {...(!isMobile && { maxTilt: 10, scale: 1.03, glare: true, glareMaxOpacity: 0.15 })}
                >
                  <button
                    onClick={() => handleReveal(control.id)}
                    className={cn(
                      'card text-left cursor-pointer group w-full',
                      'border-2 transition-all duration-200',
                      isRevealed 
                        ? borderColorMap[control.color] 
                        : 'border-transparent hover:border-brand-gray'
                    )}
                  >
                    {/* Step number */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mb-4',
                      'font-heading text-lg',
                      colorMap[control.color]
                    )}>
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <span className="text-3xl block mb-3">{control.icon}</span>

                    {/* Title */}
                    <h3 className="font-heading text-xl text-brand-wine-dark mb-2">
                      {control.title}
                    </h3>

                    {/* Body - revealed on click */}
                    <div className={cn(
                      'overflow-hidden transition-all duration-accordion',
                      isRevealed ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    )}>
                      <p className="text-brand-charcoal/80 text-sm leading-relaxed pt-2 border-t border-brand-gray">
                        {control.body}
                      </p>
                    </div>

                    {/* Tap hint */}
                    {!isRevealed && (
                      <p className="text-xs text-brand-charcoal/40 mt-2 group-hover:text-brand-charcoal/60 transition-colors">
                        Нажми для подробностей
                      </p>
                    )}
                  </button>
                </CardWrapper>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
