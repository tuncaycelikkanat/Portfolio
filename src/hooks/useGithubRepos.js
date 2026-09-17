// src/hooks/useGithubRepos.js
import { useEffect, useState } from 'react'
import { PROFILE } from '../data/profile.js'
const CACHE_KEY = 'tuncay-portfolio-github-cache'
export function useGithubRepos() {
  const [repos, setRepos] = useState(PROFILE.projects)
  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
      if (cached && Date.now() - cached.ts < 3600 * 1000 && Array.isArray(cached.data)) { setRepos(cached.data); return }
    } catch {}
    fetch('https://api.github.com/users/tuncaycelikkanat/repos?per_page=100&sort=updated')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const byName = Object.fromEntries(data.map((d) => [d.name, d]))
        const merged = PROFILE.projects.map((p) => ({
          ...p,
          stars: byName[p.name]?.stargazers_count ?? 0,
          updated: byName[p.name]?.updated_at ?? null,
        }))
        setRepos(merged)
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: merged })) } catch {}
      })
      .catch((e) => console.warn('github fallback', e))
  }, [])
  return repos
}
