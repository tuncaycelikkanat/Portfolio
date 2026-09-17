// src/components/Navbar.jsx
import { useState } from 'react'
import { PROFILE } from '../data/profile.js'
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    ['#hakkimda', 'Hakkımda'],
    ['#yetenekler', 'Yetenekler'],
    ['#projeler', 'Projeler'],
    ['#egitim', 'Eğitim'],
    ['#iletisim', 'İletişim'],
  ]
  return (
    <nav className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#top" className="font-bold">TÇ</a>
        <div className="hidden md:flex gap-4 text-sm">
          {links.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={PROFILE.links.github} className="text-sm border px-3 py-1 rounded">GitHub</a>
          <button
            type="button"
            className="md:hidden border border-zinc-700 rounded px-3 py-1 text-sm"
            aria-label="Menü"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-800 px-4 py-2 flex flex-col gap-2 text-sm">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </div>
      )}
    </nav>
  )
}
