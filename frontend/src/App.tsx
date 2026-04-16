import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const rect = el.getBoundingClientRect();
      const enterTrigger = window.innerHeight * 0.88;
      const exitThreshold = window.innerHeight + 100;

      if (rect.top < enterTrigger && rect.bottom > 0) {
        setVisible(true);
      } else if (rect.top > exitThreshold || rect.bottom < -100) {
        setVisible(false);
      }
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  publishedAt: string;
  hypeLevel: number;
  isCrown: boolean;
}

const PALETTES = [
  { bg: '#0F1E3D', accent: '#4A7CFF', text: '#7EA4FF' },
  { bg: '#1A0A2E', accent: '#9B59B6', text: '#C39BD3' },
  { bg: '#0A2218', accent: '#27AE60', text: '#82E0AA' },
  { bg: '#2C0A0A', accent: '#E74C3C', text: '#F1948A' },
  { bg: '#1A1200', accent: '#F39C12', text: '#FAD7A0' },
  { bg: '#001A1A', accent: '#1ABC9C', text: '#76D7C4' },
  { bg: '#1A0A18', accent: '#E91E8C', text: '#F48FB1' },
  { bg: '#0A1A2C', accent: '#3498DB', text: '#85C1E9' },
];

function getPalette(author: string) {
  let hash = 0;
  for (let i = 0; i < author.length; i++) hash = author.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

function getInitials(author: string) {
  return author
    .split(/(?=[A-Z])|[\s_-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function getKeyword(title: string) {
  const words = title.split(' ').filter((w) => w.length > 3);
  return (words[0] ?? title).replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
}

function VideoCover({
  video,
  size = 'regular',
}: {
  video: Video;
  size?: 'crown' | 'regular';
}) {
  const palette = getPalette(video.author);
  const initials = getInitials(video.author);
  const keyword = getKeyword(video.title);

  return (
    <div
      className={`video-cover cover-${size}`}
      style={{ background: palette.bg }}
    >
      <div className="cover-geo" style={{ borderColor: palette.accent }} />
      <div className="cover-geo cover-geo2" style={{ borderColor: palette.accent }} />

      <span className="cover-keyword" style={{ color: palette.accent }}>
        {keyword}
      </span>

      <div className="cover-initials-wrap">
        <span className="cover-initials" style={{ color: palette.text }}>
          {initials}
        </span>
        <span className="cover-author-small" style={{ color: palette.accent }}>
          {video.author}
        </span>
      </div>

      <div className="cover-bar" style={{ background: palette.accent }} />
    </div>
  );
}

function HypeScore({ value, max, gold }: { value: number; max: number; gold?: boolean }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={`hype-score ${gold ? 'hype-score--gold' : ''}`}>
      <div className="hype-score-top">
        <span className="hype-score-label">HYPE INDEX</span>
        <span className="hype-score-val">{value.toFixed(4)}</span>
      </div>
      <div className="hype-track">
        <div className="hype-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CrownCard({ video, maxHype }: { video: Video; maxHype: number }) {
  return (
    <div className="crown-card">
      <div className="crown-card__cover">
        <VideoCover video={video} size="crown" />
        <div className="crown-card__badge">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polygon points="6,1 7.8,4.5 11.5,5 8.8,7.6 9.5,11.3 6,9.4 2.5,11.3 3.2,7.6 0.5,5 4.2,4.5" fill="currentColor"/>
          </svg>
          Premium Selection
        </div>
      </div>

      <div className="crown-card__body">
        <p className="crown-card__crown-label">Joya de la Corona</p>
        <div className="crown-card__meta">
          <span className="crown-card__author">{video.author}</span>
          <span className="crown-card__date">{video.publishedAt}</span>
        </div>
        <h2 className="crown-card__title">{video.title}</h2>
        <p className="crown-card__desc">La pieza con mayor nivel de engagement del tablero — curada por su relevancia estratégica y alcance.</p>
        <HypeScore value={video.hypeLevel} max={maxHype} gold />
      </div>
    </div>
  );
}

function StatementCard({ video, maxHype, rank }: { video: Video; maxHype: number; rank: number }) {
  const pct = maxHype > 0 ? Math.min((video.hypeLevel / maxHype) * 100, 100) : 0;
  const palette = getPalette(video.author);
  return (
    <article className="stmt">
      <div className="stmt__num" style={{ color: palette.accent }}>{String(rank).padStart(2, '0')}</div>
      <div className="stmt__cover">
        <VideoCover video={video} size="regular" />
      </div>
      <div className="stmt__content">
        <p className="stmt__author">{video.author}</p>
        <h3 className="stmt__title">{video.title}</h3>
        <p className="stmt__date">{video.publishedAt}</p>
      </div>
      <div className="stmt__hype">
        <span className="stmt__hype-val">{video.hypeLevel.toFixed(3)}</span>
        <div className="stmt__hype-track">
          <div className="stmt__hype-fill" style={{ width: `${pct}%`, background: palette.accent }} />
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/videos')
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((d: Video[]) => { setVideos(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="state-screen">
      <div className="loader" />
      <p>Cargando la cartelera…</p>
    </div>
  );

  if (error) return (
    <div className="state-screen state-screen--err">
      <span className="state-icon">!</span>
      <p>No se pudo conectar al backend</p>
      <code>{error}</code>
    </div>
  );

  const maxHype = Math.max(...videos.map((v) => v.hypeLevel), 0);
  const crown = videos.find((v) => v.isCrown);
  const rest  = videos.filter((v) => !v.isCrown);

  return (
    <div className="page">
      <nav className="topbar">
        <div className="topbar__brand">
          <img src="/sundevs-logo.svg" alt="SunDevs" className="topbar__logo-img" />
          
        </div>
        <div className="topbar__chips">
          <span className="chip">{videos.length} videos</span>
          <span className="chip chip--live">● LIVE</span>
        </div>
      </nav>

      <header className="hero">
        <div className="hero__top">
          <Reveal>
            <div className="hero__left">
              <p className="hero__eyebrow">Executive Knowledge Board · {new Date().getFullYear()}</p>
              <h1 className="hero__title">
                Cartelera<br />
                de <em>Hype</em><br />
                Tecnológico
              </h1>
            </div>
          </Reveal>
          {crown && (
            <Reveal delay={200}>
              <div className="hero__crown">
                <CrownCard video={crown} maxHype={maxHype} />
              </div>
            </Reveal>
          )}
        </div>
        <Reveal delay={350}>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num hero__stat-num--gold">{videos.length}</span>
              <span className="hero__stat-lbl">videos</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num hero__stat-num--dark">{rest.filter((_, i) => i < 5).length}</span>
              <span className="hero__stat-lbl">trending</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num hero__stat-num--accent">{maxHype.toFixed(3)}</span>
              <span className="hero__stat-lbl">max hype</span>
            </div>
          </div>
        </Reveal>
      </header>

      <div className="page-body">

        {rest.length >= 3 && (
          <section className="section">
            <Reveal>
              <div className="section-hd">
                <span className="section-hd__line" />
                <span className="section-hd__txt">Top Trending</span>
              </div>
            </Reveal>
            <div className="stmt-grid stmt-grid--top">
              {rest.slice(0, 3).map((v, i) => (
                <Reveal key={v.id} delay={i * 150}>
                  <StatementCard video={v} maxHype={maxHype} rank={i + 1} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {rest.length > 3 && (
          <section className="section">
            <Reveal>
              <div className="section-hd">
                <span className="section-hd__line" />
                <span className="section-hd__txt">Rising — en ascenso</span>
              </div>
            </Reveal>
            <div className="stmt-grid">
              {rest.slice(3, 12).map((v, i) => (
                <Reveal key={v.id} delay={(i % 3) * 120}>
                  <StatementCard video={v} maxHype={maxHype} rank={i + 4} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {rest.length > 12 && (
          <section className="section">
            <Reveal>
              <div className="section-hd">
                <span className="section-hd__line" />
                <span className="section-hd__txt">Todos los videos</span>
              </div>
            </Reveal>
            <div className="stmt-grid">
              {rest.slice(12).map((v, i) => (
                <Reveal key={v.id} delay={(i % 3) * 120}>
                  <StatementCard video={v} maxHype={maxHype} rank={i + 13} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
