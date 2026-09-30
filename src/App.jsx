import { useState } from 'react'
import Scene from './Scene'
import { DataCard, Drawer, TopBar } from './UIOverlay'
import { HOTSPOTS } from './data'

export default function App() {
  const [activeId, setActiveId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const active = HOTSPOTS.find((h) => h.id === activeId) || null

  const select = (id) => {
    setActiveId(id)
    setDrawerOpen(false) // keep the machine and its card unobstructed
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-900 font-sans text-white">
      <Scene activeId={activeId} onSelect={select} onClear={() => setActiveId(null)} />
      <TopBar />
      <DataCard h={active} onClose={() => setActiveId(null)} />
      <Drawer onSelect={select} open={drawerOpen} setOpen={(v) => { setDrawerOpen(v); if (v) setActiveId(null) }} />
    </div>
  )
}
