import { RotateCcw } from 'lucide-react'
import { resetAllProgress } from '@/utils/storage'
import { cn } from '@/utils/cn'

interface ResetProgressProps {
  onReset: () => void
}

export default function ResetProgress({ onReset }: ResetProgressProps) {
  const handleReset = () => {
    if (window.confirm('Сбросить весь прогресс (чек-лист, квиз, найденные опасности)?')) {
      resetAllProgress()
      onReset()
    }
  }

  return (
    <button
      onClick={handleReset}
      className={cn(
        'touch-target flex items-center justify-center rounded-full',
        'bg-white/80 backdrop-blur-sm shadow-md',
        'transition-all duration-200 hover:bg-white hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-brand-wine focus:ring-offset-2',
        'w-11 h-11'
      )}
      aria-label="Сбросить прогресс"
      title="Сбросить прогресс"
    >
      <RotateCcw className="w-5 h-5 text-brand-charcoal" />
    </button>
  )
}
