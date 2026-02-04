import { useState, useEffect, useRef, useCallback } from 'react'
import { Eye, CheckCircle2, HelpCircle, X, Move, Copy, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { playClick, playSuccess, playHint } from '@/utils/sound'
import { getHazardState, setHazardState, type HazardState } from '@/utils/storage'

interface Hotspot {
  id: string
  label: string
  x: number
  y: number
  hint: string
  fix: string
}

interface HazardSpottingProps {
  data: {
    scene_id: string
    image: string
    hotspots: Hotspot[]
  }
}

export default function HazardSpotting({ data }: HazardSpottingProps) {
  const [found, setFound] = useState<Set<string>>(new Set())
  const [selectedSpot, setSelectedSpot] = useState<Hotspot | null>(null)
  const [showHintPrompt, setShowHintPrompt] = useState(false)
  const [hintTimeout, setHintTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [completed, setCompleted] = useState(false)
  
  // Edit mode state (activated via ?hazard-edit=true in URL)
  const [editMode, setEditMode] = useState(false)
  const [editableHotspots, setEditableHotspots] = useState<Hotspot[]>(data.hotspots)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalSpots = data.hotspots.length
  
  // Check for edit mode in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEditMode(params.get('hazard-edit') === 'true')
  }, [])
  
  // Sync editable hotspots with data
  useEffect(() => {
    setEditableHotspots(data.hotspots)
  }, [data.hotspots])

  // Load saved state
  useEffect(() => {
    const saved = getHazardState()
    if (saved) {
      setFound(new Set(saved.found))
      setCompleted(saved.completed)
    }
  }, [])

  // Save state on change
  useEffect(() => {
    const state: HazardState = {
      found: Array.from(found),
      completed
    }
    setHazardState(state)
  }, [found, completed])

  // Show hint prompt after 20 seconds of no activity
  useEffect(() => {
    if (completed || found.size === totalSpots) return

    if (hintTimeout) {
      clearTimeout(hintTimeout)
    }

    const timeout = setTimeout(() => {
      setShowHintPrompt(true)
    }, 20000)

    setHintTimeout(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [found, completed])

  const handleSpotClick = (spot: Hotspot) => {
    playClick()
    
    if (!found.has(spot.id)) {
      const newFound = new Set(found)
      newFound.add(spot.id)
      setFound(newFound)
      
      if (newFound.size === totalSpots) {
        setCompleted(true)
        playSuccess()
      }
    }
    
    setSelectedSpot(spot)
    setShowHintPrompt(false)
  }

  const closeModal = () => {
    playClick()
    setSelectedSpot(null)
  }

  const showHint = () => {
    playHint()
    setShowHintPrompt(false)
    
    // Find first unfound spot and highlight it briefly
    const unfound = data.hotspots.find(s => !found.has(s.id))
    if (unfound) {
      setSelectedSpot(unfound)
    }
  }

  const resetGame = () => {
    playClick()
    setFound(new Set())
    setCompleted(false)
    setSelectedSpot(null)
    setShowHintPrompt(false)
  }
  
  // === EDIT MODE FUNCTIONS ===
  
  const handleMouseDown = useCallback((e: React.MouseEvent, spotId: string) => {
    if (!editMode) return
    e.preventDefault()
    e.stopPropagation()
    setDraggingId(spotId)
  }, [editMode])
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!editMode || !draggingId || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    
    setEditableHotspots(prev => 
      prev.map(spot => 
        spot.id === draggingId 
          ? { ...spot, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 }
          : spot
      )
    )
  }, [editMode, draggingId])
  
  const handleMouseUp = useCallback(() => {
    setDraggingId(null)
  }, [])
  
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (!editMode || !containerRef.current) return
    
    // Check if clicked on a hotspot
    const target = e.target as HTMLElement
    if (target.closest('button')) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100) / 100
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100) / 100
    
    console.log(`Clicked at: x=${x}, y=${y}`)
  }, [editMode])
  
  const copyHotspotsJSON = useCallback(() => {
    const json = JSON.stringify(editableHotspots, null, 2)
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [editableHotspots])
  
  const hotspotsToRender = editMode ? editableHotspots : data.hotspots

  return (
    <section id="hazard-section" className="py-16 md:py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">Найди опасности</h2>
        <p className="section-subtitle text-center max-w-2xl mx-auto">
          Кликните на все потенциальные риски на картинке
        </p>

        <div className="max-w-4xl mx-auto mt-8">
          {/* Progress */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-charcoal/60" />
              <span className="text-brand-charcoal/80">
                Найдено: {found.size}/{totalSpots}
              </span>
            </div>
            
            {completed && (
              <span className="flex items-center gap-2 text-brand-forest font-bold">
                <CheckCircle2 className="w-5 h-5" />
                Все найдены!
              </span>
            )}
          </div>

          {/* Edit mode panel */}
          {editMode && (
            <div className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-brand">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Move className="w-5 h-5 text-yellow-700" />
                  <span className="font-bold text-yellow-800">РЕЖИМ РЕДАКТИРОВАНИЯ</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyHotspotsJSON}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Скопировано!' : 'Копировать JSON'}
                  </button>
                </div>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                Перетаскивайте точки мышью. Координаты автоматически обновляются.
                Нажмите «Копировать JSON» и вставьте в <code className="bg-yellow-200 px-1 rounded">content.json</code>
              </p>
            </div>
          )}

          {/* Scene container */}
          <div 
            ref={containerRef}
            className={cn(
              "relative rounded-brand overflow-hidden shadow-lg bg-brand-gray",
              editMode && "cursor-crosshair"
            )}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleContainerClick}
          >
            <div className="aspect-video bg-gradient-to-br from-brand-gray to-brand-charcoal/20 relative select-none">
              <img
                src={data.image}
                alt="Производственная зона — найдите опасности"
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              

              {/* Hotspots */}
              {hotspotsToRender.map((spot) => {
                const isFound = found.has(spot.id)
                const isDragging = draggingId === spot.id
                
                return (
                  <button
                    key={spot.id}
                    onClick={() => !editMode && handleSpotClick(spot)}
                    onMouseDown={(e) => handleMouseDown(e, spot.id)}
                    className={cn(
                      'absolute transform -translate-x-1/2 -translate-y-1/2',
                      'w-12 h-12 rounded-full',
                      'flex items-center justify-center',
                      'transition-all duration-200',
                      'focus:outline-none focus:ring-4 focus:ring-brand-wine/30',
                      editMode 
                        ? cn(
                            'bg-blue-500 border-2 border-white cursor-move',
                            isDragging && 'scale-125 shadow-lg z-50'
                          )
                        : isFound
                          ? 'bg-brand-forest/80 border-2 border-white'
                          : 'bg-transparent cursor-pointer'
                    )}
                    style={{
                      left: `${spot.x * 100}%`,
                      top: `${spot.y * 100}%`
                    }}
                    aria-label={isFound ? spot.label : 'Потенциальная опасность'}
                  >
                    {editMode ? (
                      <Move className="w-4 h-4 text-white" />
                    ) : isFound ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : null}
                  </button>
                )
              })}
              
              {/* Coordinate labels in edit mode */}
              {editMode && hotspotsToRender.map((spot) => (
                <div
                  key={`label-${spot.id}`}
                  className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-40"
                  style={{
                    left: `${spot.x * 100}%`,
                    top: `${spot.y * 100 + 4}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  {spot.label}: ({spot.x}, {spot.y})
                </div>
              ))}
            </div>
          </div>

          {/* Hint prompt */}
          {showHintPrompt && !completed && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={showHint}
                className="flex items-center gap-2 text-brand-charcoal/60 hover:text-brand-wine transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                Нужна подсказка?
              </button>
            </div>
          )}

          {/* Reset button */}
          {completed && (
            <div className="mt-6 flex justify-center">
              <button onClick={resetGame} className="btn-secondary">
                Начать заново
              </button>
            </div>
          )}
        </div>

        {/* Spot detail modal */}
        {selectedSpot && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-brand p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  {found.has(selectedSpot.id) ? (
                    <CheckCircle2 className="w-6 h-6 text-brand-forest" />
                  ) : (
                    <Eye className="w-6 h-6 text-brand-wine" />
                  )}
                  <h3 className="font-heading text-xl text-brand-wine-dark">
                    {selectedSpot.label}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-brand-gray rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-brand-charcoal/60" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold text-sm">Риск:</span>
                  <span className="text-brand-charcoal/80">{selectedSpot.hint}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="text-brand-forest font-bold text-sm">Решение:</span>
                  <span className="text-brand-charcoal/80">{selectedSpot.fix}</span>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="btn-primary w-full mt-6"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
