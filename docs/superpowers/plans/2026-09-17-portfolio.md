# Portfolyo Sitesi (Vite + React + Tailwind) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tuncay Çelikkanat için Türkçe Vite+React+Tailwind portfolyo sitesini kurup GitHub Pages uyumlu hale getirmek.

**Architecture:** Vite SPA, `src/data/profile.js` statik veri + `useGithubRepos` ile GitHub API zenginleştirmesi (cache + fallback), `base: './'` ile relative build, `dist/` Pages deploy.

**Tech Stack:** Node 20+, Vite 5, React 18, TailwindCSS 3, gh-pages 6

**Spec:** docs/superpowers/specs/2026-09-17-portfolio-design.md

## Global Constraints

- Site dili Türkçe olacak, tüm kopyalar Türkçe.
- `vite.config.js` içinde `base: './'` zorunlu (Pages relative path).
- GitHub kullanıcı adı `tuncaycelikkanat` sabit, API URL `https://api.github.com/users/tuncaycelikkanat/repos?per_page=100&sort=updated`.
- Koyu modern tema, responsive (360px mobil kırılma yok).
- API hatasında statik fallback, kullanıcıya hata ekranı gösterilmez.

---

### Task 1: Scaffold + Tailwind + Pages config

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/index.css`
- Create: `src/App.jsx`

**Interfaces:**
- Consumes: Yok (ilk task).
- Produces: `App` bileşeni (boş iskelet), `npm run dev` ve `npm run build` çalışır.

- [ ] **Step 1: Node sürümünü doğrula**

```bash
node -v
npm -v
```

Run: `node -v && npm -v`
Expected: PASS, node v20+ görünür.

- [ ] **Step 2: Vite + React iskeletini kur**

```bash
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install -D gh-pages
```

Run: `ls package.json vite.config.js`
Expected: PASS, dosyalar var.

- [ ] **Step 3: Pages uyumlu config yaz**

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: './',
})
```

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```jsx
// src/App.jsx
export default function App() {
  return <div className="min-h-screen bg-zinc-950 text-zinc-100">Portfolyo yakında</div>
}
```

- [ ] **Step 4: Build ile doğrula**

Run: `npm run build`
Expected: PASS, `dist/index.html` oluşur.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.js tailwind.config.js postcss.config.js index.html src/
git commit -m "feat: scaffold vite react tailwind with pages base"
```

### Task 2: Statik veri + GitHub hook

**Files:**
- Create: `src/data/profile.js`
- Create: `src/hooks/useGithubRepos.js`
- Test: `src/hooks/useGithubRepos.test.js` (manuel vitest yoksa build ile doğrulanır)

**Interfaces:**
- Consumes: Task 1 iskelet.
- Produces: `PROFILE` sabiti (isim, linkler, 6 proje), `useGithubRepos()` hook (statik + canlı merge, localStorage cache).

- [ ] **Step 1: Statik profil verisini yaz**

```js
// src/data/profile.js
export const PROFILE = {
  name: 'Tuncay Çelikkanat',
  title: 'Bilgisayar Mühendisliği Öğrencisi',
  university: 'Erciyes Üniversitesi',
  location: 'Kayseri',
  avatar: 'https://avatars.githubusercontent.com/u/117767427?v=4',
  links: {
    github: 'https://github.com/tuncaycelikkanat',
    linkedin: 'https://www.linkedin.com/in/tuncay-%C3%A7elikkanat-866aa22a4/',
    leetcode: 'https://leetcode.com/u/tuncaycelikkanat/',
    orcid: 'https://orcid.org/0009-0000-3403-3263',
    instagram: 'https://www.instagram.com/tuncay.mp5/',
  },
  skills: ['Python', 'Go', 'C#', 'Java', 'Kotlin', 'Verilog', 'JavaScript', 'React', 'Tailwind'],
  projects: [
    { name: 'crypto-mas', language: 'Python', description: 'Risk-first, explainable, backtestable, portfolio-aware crypto trading engine.', url: 'https://github.com/tuncaycelikkanat/crypto-mas', demo: 'https://crypto-mas.vercel.app' },
    { name: 'dagger', language: 'Python', description: 'Document Analysis and Graphical Generation For Expert Retrieval', url: 'https://github.com/tuncaycelikkanat/dagger' },
    { name: 'warden', language: 'Python', description: 'Watchful Agent for Risk Detection & Engineering Norms', url: 'https://github.com/tuncaycelikkanat/warden' },
    { name: 'lumen', language: 'Go', description: 'Log Unification and Monitoring Engine', url: 'https://github.com/tuncaycelikkanat/lumen' },
    { name: 'PipelineCPU', language: 'Verilog', description: 'Pipeline CPU tasarımı', url: 'https://github.com/tuncaycelikkanat/PipelineCPU' },
    { name: 'CoreDocs.Api', language: 'C#', description: 'Core docs API', url: 'https://github.com/tuncaycelikkanat/CoreDocs.Api' },
  ],
}
```

- [ ] **Step 2: GitHub hook yaz**

```jsx
// src/hooks/useGithubRepos.js
import { useEffect, useState } from 'react'
import { PROFILE } from '../data/profile.js'
const CACHE_KEY = 'tuncay-portfolio-github-cache'
export function useGithubRepos() {
  const [repos, setRepos] = useState(PROFILE.projects)
  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
      if (cached && Date.now() - cached.ts < 3600 * 1000) { setRepos(cached.data); return }
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
```

- [ ] **Step 3: Build ile doğrula**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/data/profile.js src/hooks/useGithubRepos.js
git commit -m "feat: add static profile data and github hook with fallback"
```

### Task 3: Navbar + Hero + Hakkımda

**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Hero.jsx`
- Create: `src/components/About.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `PROFILE`, Tailwind.
- Produces: Üst navigasyon + hero + hakkımda sectionları (`#hakkimda` anchor).

- [ ] **Step 1: Bileşenleri yaz**

```jsx
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
```

```jsx
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
```

```jsx
// src/components/About.jsx
export default function About() {
  return (
    <section id="hakkimda" className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-3">Hakkımda</h2>
      <p className="text-zinc-300">Erciyes Üniversitesi öğrencisiyim. Python, Go ve C# ağırlıklı backend, veri ve sistem projeleri geliştiriyorum. GitHub'da 36 public repom var.</p>
      <p className="text-zinc-400 mt-2">İlgim: backend servisler, doküman analizi/RAG, log izleme ve donanım (Verilog CPU). Öğrenmeye ve üretmeye odaklıyım.</p>
    </section>
  )
}
```

```jsx
// src/App.jsx
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <Hero />
      <About />
    </div>
  )
}
```

- [ ] **Step 2: Build ile doğrula**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.jsx src/components/Hero.jsx src/components/About.jsx src/App.jsx
git commit -m "feat: add navbar hero about sections"
```

### Task 4: Yetenekler + Projeler + Eğitim + İletişim + Footer

**Files:**
- Create: `src/components/Skills.jsx`
- Create: `src/components/Projects.jsx`
- Create: `src/components/Education.jsx`
- Create: `src/components/Contact.jsx`
- Create: `src/components/Footer.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `PROFILE`, `useGithubRepos`.
- Produces: Tam tek sayfa (`#yetenekler`, `#projeler`, `#egitim`, `#iletisim`).

- [ ] **Step 1: Bileşenleri yaz**

```jsx
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
```

```jsx
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
```

```jsx
// src/components/Education.jsx
export default function Education() {
  return (
    <section id="egitim" className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-3">Eğitim ve Başarılar</h2>
      <p>Erciyes Üniversitesi — Bilgisayar Mühendisliği (öğrenci)</p>
      <p className="text-sm text-zinc-400 mt-1">GitHub: Pull Shark x2, YOLO, Quickdraw</p>
    </section>
  )
}
```

```jsx
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
```

```jsx
// src/components/Footer.jsx
export default function Footer() {
  return <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">© 2026 Tuncay Çelikkanat • GitHub API ile beslenmektedir</footer>
}
```

```jsx
// src/App.jsx
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar /><Hero /><About /><Skills /><Projects /><Education /><Contact /><Footer />
    </div>
  )
}
```

- [ ] **Step 2: Build ile doğrula**

Run: `npm run build && ls dist/index.html`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ src/App.jsx
git commit -m "feat: add skills projects education contact footer"
```

### Task 5: README + Pages deploy hazırlığı

**Files:**
- Create: `README.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: Tüm site.
- Produces: `npm run deploy` ile Pages yayın, README'de kurulum + linkler.

- [ ] **Step 1: Deploy scripti ekle**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

`package.json` içindeki `scripts` alanını yukarıdakiyle birleştir (mevcut dev/build/preview korunur, predeploy/deploy eklenir).

- [ ] **Step 2: README yaz**

```markdown
# Tuncay Çelikkanat — Portfolyo

Türkçe tek sayfa portfolyo (Vite + React + Tailwind).

## Geliştirme
npm install
npm run dev

## Build
npm run build

## Deploy (GitHub Pages)
npm run deploy

Profil: https://github.com/tuncaycelikkanat
```

- [ ] **Step 3: Son build + preview kontrolü**

Run: `npm run build && npx vite preview --port 4173 & sleep 3; curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/; kill %1`
Expected: PASS, 200 döner.

- [ ] **Step 4: Commit**

```bash
git add package.json README.md
git commit -m "chore: add readme and pages deploy script"
```
