import { useState } from 'react'
import { Hero } from './components/Hero'
import { ProductGallery } from './components/ProductGallery'
import { HowToParticipate } from './components/HowToParticipate'
import { ParticipationModal } from './components/ParticipationModal'
import { Footer } from './components/Footer'

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero onOpenModal={() => setModalOpen(true)} />
        <ProductGallery />
        <HowToParticipate onOpenModal={() => setModalOpen(true)} />
      </main>
      <Footer />
      <ParticipationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default App
