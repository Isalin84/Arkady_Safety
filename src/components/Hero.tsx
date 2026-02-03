import { cn } from '@/utils/cn'
import { playClick } from '@/utils/sound'

// TODO: Заменить на локальный файл после скачивания
// Промпт для генерации аватара Аркадия:
// "Friendly male brewery shift supervisor character, simple cartoon style, warm colors, 
// wearing safety vest and hard hat, confident pose, transparent background, PNG"
const ARKADY_IMAGE = '/images/arkady.png'

interface HeroProps {
  data: {
    title: string
    subtitle: string
    cta_primary: string
    cta_secondary: string
  }
  arkadyIntro: string
}

export default function Hero({ data, arkadyIntro }: HeroProps) {
  const scrollTo = (id: string) => {
    playClick()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-brand-cream to-brand-peach/30 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-mint rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand-sky rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Arkady character */}
          <div className="flex-shrink-0 order-1 lg:order-2">
            <div className="relative">
              {/* Placeholder for Arkady image */}
              <div className={cn(
                'w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96',
                'bg-brand-gray/50 rounded-brand overflow-hidden',
                'flex items-center justify-center',
                'shadow-xl'
              )}>
                <img 
                  src={ARKADY_IMAGE}
                  alt="Аркадий — руководитель смены"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback placeholder
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="text-center p-4">
                        <div class="text-6xl mb-2">👷</div>
                        <p class="text-sm text-brand-charcoal/60">Аркадий</p>
                      </div>
                    `
                  }}
                />
              </div>
              
              {/* Speech bubble */}
              <div className={cn(
                'absolute -bottom-4 -left-4 lg:-left-8',
                'bg-white rounded-brand p-4 shadow-lg',
                'max-w-[280px] md:max-w-xs',
                'before:content-[""] before:absolute before:-top-2 before:right-8',
                'before:w-4 before:h-4 before:bg-white before:rotate-45'
              )}>
                <p className="text-sm md:text-base text-brand-charcoal leading-relaxed">
                  {arkadyIntro}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <h1 className="section-title text-4xl md:text-5xl lg:text-6xl text-brand-wine-dark mb-4 leading-tight">
              {data.title}
            </h1>
            
            <p className="section-subtitle text-xl md:text-2xl text-brand-charcoal/80 mb-8 max-w-2xl">
              {data.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollTo('checklist-section')}
                className="btn-primary text-lg px-8 py-4"
              >
                {data.cta_primary}
              </button>
              
              <button
                onClick={() => scrollTo('quiz-section')}
                className="btn-secondary text-lg px-8 py-4"
              >
                {data.cta_secondary}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-brand-charcoal/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-brand-charcoal/30 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
