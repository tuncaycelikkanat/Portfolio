// src/components/Projects.jsx
import { useGithubRepos } from '../hooks/useGithubRepos.js'
export default function Projects() {
  const repos = useGithubRepos()
  return (
    <section id="projeler" className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-3">Öne Çıkan Projeler</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {repos.map((r) => (
          <article key={r.name} className="border border-zinc-800 rounded p-4">
            <h3 className="font-semibold">{r.name}</h3>
            <p className="text-sm text-zinc-400 mt-1">{r.description}</p>
            <p className="text-xs mt-2">{r.language}{r.stars != null ? ` • ★ ${r.stars}` : ''}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <a href={r.url} className="underline">GitHub</a>
              {r.demo ? <a href={r.demo} className="underline">Canlı Demo</a> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
