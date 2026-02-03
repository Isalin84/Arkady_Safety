import { cn } from '@/utils/cn'
import { playClick } from '@/utils/sound'

export default function FooterCTA() {
  const scrollTo = (id: string) => {
    playClick()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="footer-cta" className="py-16 md:py-24 bg-gradient-to-b from-brand-wine-dark to-brand-wine">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
          Готовы к безопасному передвижению?
        </h2>
        
        <p className="text-brand-peach/90 text-lg mb-8 max-w-2xl mx-auto">
          Пройдите интерактивы ещё раз или поделитесь страницей с коллегами.
          Помните: безопасность — это привычка, которая формируется ежедневно.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => scrollTo('checklist-section')}
            className={cn(
              'inline-flex items-center justify-center px-8 py-4 rounded-brand',
              'bg-white text-brand-wine font-bold text-lg',
              'transition-all duration-200 hover:bg-brand-cream hover:scale-105',
              'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-wine'
            )}
          >
            Пройти чек-лист
          </button>
          
          <button
            onClick={() => scrollTo('quiz-section')}
            className={cn(
              'inline-flex items-center justify-center px-8 py-4 rounded-brand',
              'bg-brand-forest text-white font-bold text-lg',
              'transition-all duration-200 hover:bg-brand-teal hover:scale-105',
              'focus:outline-none focus:ring-2 focus:ring-brand-forest focus:ring-offset-2 focus:ring-offset-brand-wine'
            )}
          >
            Пройти квиз
          </button>
        </div>

        {/* Footer info */}
        <div className="border-t border-white/20 pt-8">
          <p className="text-brand-peach/60 text-sm">
            Месячник по производственной безопасности • Февраль 2026
          </p>
          <p className="text-brand-peach/40 text-xs mt-2">
            Напитки вместе • 11 пивоварен
          </p>
        </div>
      </div>
    </section>
  )
}
