// src/components/Navbar.jsx
import { PROFILE } from '../data/profile.js'
export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#top" className="font-bold">TÇ</a>
        <div className="flex gap-4 text-sm">
          <a href="#hakkimda">Hakkımda</a>
          <a href="#yetenekler">Yetenekler</a>
          <a href="#projeler">Projeler</a>
          <a href="#egitim">Eğitim</a>
          <a href="#iletisim">İletişim</a>
        </div>
        <a href={PROFILE.links.github} className="text-sm border px-3 py-1 rounded">GitHub</a>
      </div>
    </nav>
  )
}
