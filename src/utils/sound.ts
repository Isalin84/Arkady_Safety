import { getMuteState } from './storage'

// Звуковые файлы (будут в src/assets/audio/)
const SOUNDS = {
  click: '/audio/click.mp3',
  success: '/audio/success.mp3',
  error: '/audio/error.mp3',
  hint: '/audio/hint.mp3',
} as const

type SoundType = keyof typeof SOUNDS

// Audio instances cache
const audioCache: Map<SoundType, HTMLAudioElement> = new Map()

function getAudio(type: SoundType): HTMLAudioElement {
  if (!audioCache.has(type)) {
    const audio = new Audio(SOUNDS[type])
    audio.volume = 0.3 // Нормализованная громкость
    audioCache.set(type, audio)
  }
  return audioCache.get(type)!
}

export function playSound(type: SoundType): void {
  if (getMuteState()) return

  try {
    const audio = getAudio(type)
    audio.currentTime = 0
    audio.play().catch(() => {
      // Игнорируем ошибки воспроизведения (например, если пользователь ещё не взаимодействовал со страницей)
    })
  } catch {
    // Fallback: если звук не загружен
  }
}

export function playClick(): void {
  playSound('click')
}

export function playSuccess(): void {
  playSound('success')
}

export function playError(): void {
  playSound('error')
}

export function playHint(): void {
  playSound('hint')
}

// Preload sounds
export function preloadSounds(): void {
  Object.keys(SOUNDS).forEach(type => {
    getAudio(type as SoundType)
  })
}
