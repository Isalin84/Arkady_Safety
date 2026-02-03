import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { getMuteState, setMuteState } from '@/utils/storage'
import { cn } from '@/utils/cn'

export default function MuteToggle() {
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    setMuted(getMuteState())
  }, [])

  const toggle = () => {
    const newState = !muted
    setMuted(newState)
    setMuteState(newState)
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'touch-target flex items-center justify-center rounded-full',
        'bg-white/80 backdrop-blur-sm shadow-md',
        'transition-all duration-200 hover:bg-white hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-brand-wine focus:ring-offset-2',
        'w-11 h-11'
      )}
      aria-label={muted ? 'Включить звук' : 'Выключить звук'}
      title={muted ? 'Включить звук' : 'Выключить звук'}
    >
      {muted ? (
        <VolumeX className="w-5 h-5 text-brand-charcoal" />
      ) : (
        <Volume2 className="w-5 h-5 text-brand-wine" />
      )}
    </button>
  )
}
