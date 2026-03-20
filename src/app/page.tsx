import Swirl from '@/components/ui/Swirl'
import Nav from '@/components/layout/Nav'
import ChatPanel from '@/components/ui/ChatPanel'
import OrbitalSystem from '@/components/ui/OrbitalSystem'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#161a22] overflow-hidden">
      <Swirl className="fixed inset-0 w-screen h-screen z-0" />
      <OrbitalSystem />
      <Nav />

      {/* Chat panel — always visible on homepage, centered */}
      <div id="chat-panel" className="fixed inset-0 flex items-center justify-center z-20 px-4 py-20">
        <ChatPanel />
      </div>

      {/* Name block — bottom left */}
      <div className="fixed bottom-8 left-8 z-10 pointer-events-none">
        <p className="font-mono text-sm font-normal text-white">Joe Siconolfi</p>
        <p className="font-mono text-xs font-light text-text-hint mt-0.5">Design + Engineering</p>
      </div>
    </main>
  )
}
