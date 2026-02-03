import { useState } from 'react'
import content from './data/content.json'
import Hero from './components/Hero'
import ArkadyTips from './components/ArkadyTips'
import RiskAccordion from './components/RiskAccordion'
import ControlHierarchy from './components/ControlHierarchy'
import Checklist from './components/Checklist'
import Quiz from './components/Quiz'
import HazardSpotting from './components/HazardSpotting'
import WinterModule from './components/WinterModule'
import FooterCTA from './components/FooterCTA'
import MuteToggle from './components/MuteToggle'
import ResetProgress from './components/ResetProgress'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleReset = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Fixed controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <MuteToggle />
        <ResetProgress onReset={handleReset} />
      </div>

      <main key={refreshKey}>
        {/* B1: Hero */}
        <Hero data={content.hero} arkadyIntro={content.arkady.intro} />

        {/* B2: Советы Аркадия */}
        <ArkadyTips data={content.arkady} />

        {/* B3: Риски */}
        <RiskAccordion data={content.risks} />

        {/* B4: Иерархия контроля */}
        <ControlHierarchy data={content.controls} />

        {/* B5: Чек-лист */}
        <Checklist data={content.checklist} />

        {/* B6: Мини-квиз */}
        <Quiz data={content.quiz} />

        {/* B7: Найди опасности */}
        <HazardSpotting data={content.hazard_spotting} />

        {/* B8: Зимний модуль */}
        <WinterModule data={content.safe_start_states} />

        {/* B9: Финальный CTA */}
        <FooterCTA />
      </main>
    </div>
  )
}

export default App
