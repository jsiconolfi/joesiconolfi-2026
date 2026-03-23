import ChatPanel from '@/components/ui/ChatPanel'

export default function Home() {
  return (
    <div
      style={{
        // Transparent — swirl and orbital cards show through from layout
        position: 'fixed',
        inset: 0,
      }}
    >
      {/* Chat panel — centered, always visible on homepage */}
      <div className="fixed inset-0 flex items-center justify-center z-20 px-4 py-20 pointer-events-none">
        <ChatPanel />
      </div>

      {/* Name block — bottom left */}
      <div className="fixed bottom-8 left-8 z-10 pointer-events-none">
        <p className="font-mono text-sm font-normal text-white">Joe Siconolfi</p>
        <p className="font-mono text-xs font-light text-text-hint mt-0.5">Design + Engineering</p>
      </div>
    </div>
  )
}
