# Portfolyo Sitesi (Vite + React + Tailwind) - Tasarım Dokümanı

Tarih: 2026-09-17
Kullanıcı: Tuncay Çelikkanat (https://github.com/tuncaycelikkanat)
Dil: Türkçe
Seçilen yaklaşım: B (Vite + React + Tailwind)

## 1. Amaç
Erciyes Üniversitesi öğrencisi Tuncay Çelikkanat için Türkçe, modern, koyu temalı tek sayfa portfolyo sitesi. GitHub projelerini öne çıkarır, GitHub Pages üzerinde canlı yayınlanır.

## 2. Kaynak Veriler (GitHub'dan alındı)
- İsim: Tuncay Çelikkanat, Konum: Kayseri, Şirket: Erciyes University, Hireable: true
- 36 public repo, 30 follower. Diller: Python, Go, C#, Java, Kotlin, Verilog, HTML
- Öne çıkan 6 proje (statik gömülü + API ile zenginleştirme):
  1. crypto-mas (Python) - Risk-first crypto trading engine. Demo: https://crypto-mas.vercel.app
  2. dagger (Python) - Document Analysis and Graphical Generation For Expert Retrieval
  3. warden (Python) - Watchful Agent for Risk Detection & Engineering Norms
  4. lumen (Go, MIT) - Log Unification and Monitoring Engine
  5. PipelineCPU (Verilog) - Pipeline CPU
  6. CoreDocs.Api (C#, ★1) - Core docs API
- Linkler: GitHub https://github.com/tuncaycelikkanat, LinkedIn https://www.linkedin.com/in/tuncay-%C3%A7elikkanat-866aa22a4/, LeetCode https://leetcode.com/u/tuncaycelikkanat/, ORCID https://orcid.org/0009-0000-3403-3263, Instagram https://www.instagram.com/tuncay.mp5/

## 3. Mimari
Vite + React 18 + TailwindCSS 3, React Router yok (tek sayfa anchor navigasyon). `src/data/profile.js` statik veriyi tutar (yukarıdaki 6 proje + linkler). `src/hooks/useGithubRepos.js` GitHub API'den (`https://api.github.com/users/tuncaycelikkanat/repos?per_page=100&sort=updated`) yıldız/güncelleme bilgisini çekmeye çalışır, başarısız olursa statik veriye düşer. `vite.config.js` içinde `base: './'` ile GitHub Pages uyumlu relative build. Deploy: `gh-pages` paketi veya GitHub Actions ile `dist/` -> `gh-pages` branch.

## 4. Bileşenler
- `App.jsx`: section kompozisyonu + navbar + footer
- `components/Navbar.jsx`: sabit üst bar, anchor linkler (Hakkımda, Yetenekler, Projeler, Eğitim, İletişim), mobil hamburger
- `components/Hero.jsx`: isim, unvan (Bilgisayar Mühendisliği Öğrencisi), konum, CTA butonları, avatar (https://avatars.githubusercontent.com/u/117767427?v=4)
- `components/About.jsx`: kısa biyografi (Türkçe, 2 paragraf)
- `components/Skills.jsx`: rozet listesi (Python, Go, C#, Java, Kotlin, Verilog, JavaScript, React, Tailwind)
- `components/Projects.jsx`: 6 kart grid (başlık, açıklama, dil rozeti, yıldız, GitHub linki, demo linki varsa)
- `components/Education.jsx`: Erciyes Üniversitesi + Achievements (Pull Shark x2, YOLO, Quickdraw)
- `components/Contact.jsx`: LinkedIn, GitHub, LeetCode, ORCID, Instagram kartları
- `components/Footer.jsx`: copyright + "GitHub API ile beslenmektedir" notu

## 5. Veri Akışı
Sayfa açılışı -> statik `profile.js` render (anında) -> `useGithubRepos` arka planda fetch -> yıldız/fork/saat güncellenir, hata olursa sessizce statik kalır. Rate-limit'e takılmamak için `localStorage` içinde 1 saat cache (`tuncay-portfolio-github-cache`).

## 6. Hata Yönetimi
- API 403/rate-limit: cache + statik fallback, console.warn, kullanıcıya hata gösterilmez
- Boş avatar: initials (TÇ) placeholder
- Build hatası: `npm run build` CI'da zorunlu

## 7. Test
- `npm run build` başarıyla `dist/` üretmeli
- `npm run preview` ile manuel kontrol: tüm sectionlar görünür, linkler 200/redirect, mobil 360px kırılma yok
- Lighthouse mobil performans hedefi: 85+

## 8. Kapsam Dışı
Blog, çoklu dil, backend, veritabanı, yorum sistemi yok. YAGNI.
