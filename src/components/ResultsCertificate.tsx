import { useState, useRef, useCallback, useEffect } from 'react'
import { Award, Download, X, Trophy } from 'lucide-react'
import { cn } from '@/utils/cn'
import { playClick, playSuccess } from '@/utils/sound'
import { calculateScore, type ScoreResult } from '@/utils/scoring'

// Certificate dimensions
const CERT_WIDTH = 1600
const CERT_HEIGHT = 900

// Optional background image (place in public/images/)
const CERT_BG_IMAGE = '/images/certificate-bg.png'

export default function ResultsCertificate() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [score, setScore] = useState<ScoreResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [bgLoaded, setBgLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgImageRef = useRef<HTMLImageElement | null>(null)

  // Preload background image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      bgImageRef.current = img
      setBgLoaded(true)
    }
    img.onerror = () => {
      bgImageRef.current = null
      setBgLoaded(true) // Continue without background
    }
    img.src = CERT_BG_IMAGE
  }, [])

  const openModal = () => {
    playClick()
    const result = calculateScore()
    setScore(result)
    setIsOpen(true)
    setPreviewUrl(null)
  }

  const closeModal = () => {
    playClick()
    setIsOpen(false)
    setName('')
    setPreviewUrl(null)
  }

  const drawCertificate = useCallback((ctx: CanvasRenderingContext2D, scoreData: ScoreResult, userName: string) => {
    const w = CERT_WIDTH
    const h = CERT_HEIGHT

    // Background
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, w, h)
    } else {
      // Fallback gradient
      const gradient = ctx.createLinearGradient(0, 0, w, h)
      gradient.addColorStop(0, '#FDF8F3') // brand-cream
      gradient.addColorStop(0.5, '#FEE8D6') // brand-peach
      gradient.addColorStop(1, '#FDF8F3')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      // Decorative border
      ctx.strokeStyle = '#722F37' // brand-wine
      ctx.lineWidth = 8
      ctx.strokeRect(40, 40, w - 80, h - 80)
      ctx.strokeStyle = '#D4A574' // gold accent
      ctx.lineWidth = 2
      ctx.strokeRect(50, 50, w - 100, h - 100)
    }

    // Title
    ctx.fillStyle = '#4A1C24' // brand-wine-dark
    ctx.font = 'bold 64px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('СЕРТИФИКАТ', w / 2, 140)

    // Subtitle
    ctx.fillStyle = '#3D3D3D' // brand-charcoal
    ctx.font = '32px Arial, sans-serif'
    ctx.fillText('Месячник по производственной безопасности • Февраль 2026', w / 2, 200)

    // Decorative line
    ctx.strokeStyle = '#722F37'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w / 2 - 300, 240)
    ctx.lineTo(w / 2 + 300, 240)
    ctx.stroke()

    // "This certifies that" text
    ctx.fillStyle = '#3D3D3D'
    ctx.font = '28px Arial, sans-serif'
    ctx.fillText('Настоящим подтверждается, что', w / 2, 310)

    // User name
    const displayName = userName.trim() || 'Участник'
    ctx.fillStyle = '#4A1C24'
    ctx.font = 'bold 72px Georgia, serif'
    // Truncate long names
    let nameToDisplay = displayName
    while (ctx.measureText(nameToDisplay).width > w - 200 && nameToDisplay.length > 3) {
      nameToDisplay = nameToDisplay.slice(0, -1)
    }
    if (nameToDisplay !== displayName) {
      nameToDisplay += '…'
    }
    ctx.fillText(nameToDisplay, w / 2, 400)

    // Achievement text
    ctx.fillStyle = '#3D3D3D'
    ctx.font = '28px Arial, sans-serif'
    ctx.fillText('прошёл(а) обучение по теме', w / 2, 470)

    ctx.fillStyle = '#4A1C24'
    ctx.font = 'bold 36px Georgia, serif'
    ctx.fillText('«Управление спотыканиями, поскальзываниями и падениями»', w / 2, 520)

    // Score box
    const boxX = w / 2 - 250
    const boxY = 560
    const boxW = 500
    const boxH = 140

    // Box background
    ctx.fillStyle = 'rgba(114, 47, 55, 0.1)'
    ctx.beginPath()
    ctx.roundRect(boxX, boxY, boxW, boxH, 16)
    ctx.fill()

    // Score
    ctx.fillStyle = '#722F37'
    ctx.font = 'bold 48px Georgia, serif'
    ctx.fillText(`${scoreData.earnedPoints} из ${scoreData.maxPoints}`, w / 2, boxY + 55)

    ctx.fillStyle = '#3D3D3D'
    ctx.font = '24px Arial, sans-serif'
    ctx.fillText(`баллов (${scoreData.percent}%)`, w / 2, boxY + 95)

    // Rank title with trophy icon simulation
    ctx.fillStyle = '#4A1C24'
    ctx.font = 'bold 44px Georgia, serif'
    const rankY = 780
    ctx.fillText(`🏆 ${scoreData.rankTitle}`, w / 2, rankY)

    // Footer
    ctx.fillStyle = '#666666'
    ctx.font = '20px Arial, sans-serif'
    ctx.fillText('SAFE', w / 2, h - 50)
  }, [])

  const generatePreview = useCallback(() => {
    if (!canvasRef.current || !score) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = CERT_WIDTH
    canvas.height = CERT_HEIGHT

    drawCertificate(ctx, score, name)
    setPreviewUrl(canvas.toDataURL('image/png'))
  }, [score, name, drawCertificate])

  // Regenerate preview when name changes (debounced effect)
  useEffect(() => {
    if (isOpen && score && bgLoaded) {
      const timer = setTimeout(() => {
        generatePreview()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, score, name, bgLoaded, generatePreview])

  const downloadPNG = () => {
    if (!canvasRef.current || !score) return

    playSuccess()

    const canvas = canvasRef.current
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${name.trim() || 'safety'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <>
      {/* Trigger Section */}
      <section id="results-section" className="py-16 md:py-24 bg-brand-mint/30">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-brand-wine" />
          <h2 className="section-title">Готовы узнать свой результат?</h2>
          <p className="section-subtitle max-w-2xl mx-auto mb-8">
            Пройдите все активности и получите персональный сертификат с вашим званием
          </p>
          <button onClick={openModal} className="btn-primary text-lg px-8 py-4">
            <Award className="w-6 h-6 mr-2" />
            Узнать результат
          </button>
        </div>
      </section>

      {/* Hidden canvas for PNG generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Modal */}
      {isOpen && score && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-brand p-6 md:p-8 max-w-4xl w-full shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-heading text-2xl md:text-3xl text-brand-wine-dark mb-2">
                  Ваш результат
                </h3>
                <p className="text-brand-charcoal/70">
                  {score.earnedPoints} из {score.maxPoints} баллов ({score.percent}%)
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-brand-gray rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-brand-charcoal/60" />
              </button>
            </div>

            {/* Rank display */}
            <div className={cn(
              'text-center py-6 px-4 rounded-brand mb-6',
              score.percent >= 100 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' :
              score.percent >= 80 ? 'bg-brand-mint/40' :
              score.percent >= 50 ? 'bg-brand-sky/30' :
              'bg-brand-peach/30'
            )}>
              <Trophy className={cn(
                'w-12 h-12 mx-auto mb-2',
                score.percent >= 100 ? 'text-yellow-600' :
                score.percent >= 80 ? 'text-brand-forest' :
                score.percent >= 50 ? 'text-brand-teal' :
                'text-brand-terracotta'
              )} />
              <p className="font-heading text-3xl text-brand-wine-dark">
                {score.rankTitle}
              </p>
            </div>

            {/* Score breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {Object.values(score.sections).map((section) => (
                <div key={section.label} className="bg-brand-gray/30 rounded-brand p-3 text-center">
                  <p className="text-xs text-brand-charcoal/60 mb-1">{section.label}</p>
                  <p className="font-bold text-brand-wine-dark">
                    {section.earned}/{section.max}
                  </p>
                </div>
              ))}
            </div>

            {/* Name input */}
            <div className="mb-6">
              <label htmlFor="cert-name" className="block text-sm font-medium text-brand-charcoal mb-2">
                Введите ваше имя для сертификата
              </label>
              <input
                id="cert-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                maxLength={50}
                className={cn(
                  'w-full px-4 py-3 rounded-brand border-2 border-brand-gray',
                  'focus:border-brand-wine focus:outline-none',
                  'text-brand-charcoal placeholder:text-brand-charcoal/40'
                )}
              />
            </div>

            {/* Certificate preview */}
            {previewUrl && (
              <div className="mb-6">
                <p className="text-sm text-brand-charcoal/60 mb-2">Превью сертификата:</p>
                <div className="border-2 border-brand-gray rounded-brand overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Превью сертификата"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Download button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadPNG}
                disabled={!previewUrl}
                className={cn(
                  'btn-primary flex-1 text-lg',
                  !previewUrl && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Download className="w-5 h-5 mr-2" />
                Скачать PNG
              </button>
              <button onClick={closeModal} className="btn-secondary flex-1">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
