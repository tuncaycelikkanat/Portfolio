// src/components/Skills.jsx
import { PROFILE } from '../data/profile.js'
export default function Skills() {
  return (
    <section id="yetenekler" className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-3">Yetenekler</h2>
      <div className="flex flex-wrap gap-2">{PROFILE.skills.map((s) => <span key={s} className="border border-zinc-700 rounded px-3 py-1 text-sm">{s}</span>)}</div>
    </section>
  )
}
