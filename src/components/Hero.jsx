// src/components/Hero.jsx
import { PROFILE } from '../data/profile.js'
export default function Hero() {
  return (
    <header id="top" className="pt-24 pb-12 max-w-5xl mx-auto px-4 flex gap-6 items-center">
      <img src={PROFILE.avatar} alt={PROFILE.name} className="w-24 h-24 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none' }} />
      <div>
        <h1 className="text-3xl font-bold">{PROFILE.name}</h1>
        <p className="text-zinc-400">{PROFILE.title} — {PROFILE.university}, {PROFILE.location}</p>
        <div className="mt-4 flex gap-3">
          <a href="#projeler" className="bg-white text-black px-4 py-2 rounded">Projeler</a>
          <a href="#iletisim" className="border px-4 py-2 rounded">İletişim</a>
        </div>
      </div>
    </header>
  )
}
