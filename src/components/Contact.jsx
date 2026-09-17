// src/components/Contact.jsx
import { PROFILE } from '../data/profile.js'
export default function Contact() {
  const items = [['GitHub', PROFILE.links.github], ['LinkedIn', PROFILE.links.linkedin], ['LeetCode', PROFILE.links.leetcode], ['ORCID', PROFILE.links.orcid], ['Instagram', PROFILE.links.instagram]]
  return (
    <section id="iletisim" className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-3">İletişim</h2>
      <div className="grid md:grid-cols-2 gap-3">{items.map(([k, v]) => <a key={k} href={v} className="border border-zinc-800 rounded p-3">{k}</a>)}</div>
    </section>
  )
}
