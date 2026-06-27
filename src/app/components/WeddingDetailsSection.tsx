'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const WEDDING_DATE = new Date('2026-07-22T10:00:00');

function Countdown() {
  // Start with null to avoid SSR/client mismatch
  const [time, setTime] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setTime({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return (
    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
      {['Days','Hours','Mins','Secs'].map(u => (
        <div key={u} style={{ textAlign: 'center', minWidth: '80px' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, color: 'var(--deep-rose)', lineHeight: 1 }}>--</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: '0.4rem' }}>{u}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 'clamp(0.6rem,2vw,1.8rem)', justifyContent: 'center', flexWrap: 'wrap' }}>
      {Object.entries(time).map(([unit, val]) => (
        <div key={unit} style={{
          textAlign: 'center',
          background: 'rgba(253,246,238,0.85)',
          border: '1px solid rgba(184,144,74,0.22)',
          borderRadius: '20px',
          padding: 'clamp(1rem,2.5vw,1.6rem) clamp(1.2rem,3vw,2rem)',
          minWidth: 'clamp(70px,13vw,96px)',
          boxShadow: '0 4px 28px rgba(92,32,32,0.07), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.9rem,4.5vw,3rem)', fontWeight: 700, color: 'var(--deep-rose)', lineHeight: 1, marginBottom: '0.4rem' }}>
            {String(val).padStart(2, '0')}
          </div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 500 }}>{unit}</div>
        </div>
      ))}
    </div>
  );
}

const events = [
  { time: '11:00 AM',  title: 'Holy Mass & Wedding Ceremony', desc: 'Lourdes Matha Church, Mampuzhakary, Kerala', icon: '⛪' },
  { time: '12:30 PM',  title: 'Wedding Reception',             desc: 'Lourdes Matha Church Parish Hall, Mampuzhakary, Kerala', icon: '🥂' },
];

export default function WeddingDetailsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!items) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="details" ref={ref} style={{ background: 'var(--cream)', padding: '7rem 1.5rem 6rem', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="var(--ivory)" />
        </svg>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>

        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.56rem', letterSpacing: '0.44em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 500 }}>Save the Date</p>
          <h2 style={{ fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(2.8rem,7vw,5rem)', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.1, marginBottom: '0.8rem' }}>
            The Wedding Day
          </h2>
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-mid)' }}>22nd July 2026 — Mampuzhakary, Kerala</p>
        </div>

        <div className="reveal" style={{ marginBottom: '5.5rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.32em', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1.8rem' }}>Counting down to the big day</p>
          <Countdown />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(180px,32%,300px) 1fr', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'start' }} className="details-grid">

          <div className="reveal-left" style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 16px 60px rgba(92,32,32,0.14)', position: 'relative', aspectRatio: '3/4' }}>
            <Image src="/photos/photo3.jpg" alt="Wedding venue" fill style={{ objectFit: 'cover' }} sizes="300px" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(92,32,32,0.55) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: '1.4rem', left: '1.4rem', right: '1.4rem' }}>
              <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.45rem', color: '#fff', fontWeight: 600, textShadow: '0 2px 12px rgba(0,0,0,0.5)', marginBottom: '0.25rem' }}>Lourdes Matha Church</p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' }}>Mampuzhakary, Kerala</p>
            </div>
          </div>

          <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {events.map((ev, i) => (
              <div key={i} className="event-card" style={{
                background: 'rgba(253,246,238,0.75)',
                border: '1px solid rgba(184,144,74,0.2)',
                borderRadius: '20px',
                padding: '1.4rem 1.8rem',
                display: 'flex', alignItems: 'flex-start', gap: '1.2rem',
                boxShadow: '0 4px 24px rgba(92,32,32,0.05), inset 0 1px 0 rgba(255,255,255,0.6)',
                transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(92,32,32,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(92,32,32,0.05), inset 0 1px 0 rgba(255,255,255,0.6)'; }}
              >
                <span style={{ fontSize: '1.7rem', flexShrink: 0, lineHeight: 1 }}>{ev.icon}</span>
                <div>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.26em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 500 }}>{ev.time}</p>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.08rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>{ev.title}</h3>
                  <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.65, fontWeight: 300 }}>{ev.desc}</p>
                </div>
              </div>
            ))}

            <a className="directions-card" href="https://maps.google.com/?q=Lourdes+Matha+Church+Mampuzhakary+Kerala"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '1.2rem',
                color: 'var(--deep-rose)', textDecoration: 'none',
                border: '1.5px solid rgba(122,53,53,0.32)',
                borderRadius: '20px', padding: '1.35rem 1.8rem',
                width: '100%',
                background: 'linear-gradient(135deg, rgba(253,246,238,0.95), rgba(240,223,192,0.5))',
                boxShadow: '0 8px 30px rgba(92,32,32,0.08), inset 0 1px 0 rgba(255,255,255,0.75)',
                transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s, background 0.3s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 42px rgba(92,32,32,0.13), inset 0 1px 0 rgba(255,255,255,0.75)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(92,32,32,0.08), inset 0 1px 0 rgba(255,255,255,0.75)'; }}
            >
              <span style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(122,53,53,0.09)', flexShrink: 0 }}>
                <svg width="22" height="25" viewBox="0 0 12 14" fill="none">
                  <path d="M6 0C3.24 0 1 2.24 1 5c0 3.5 5 9 5 9s5-5.5 5-9c0-2.76-2.24-5-5-5z" stroke="var(--deep-rose)" strokeWidth="1.2" fill="none"/>
                  <circle cx="6" cy="5" r="1.5" fill="var(--deep-rose)"/>
                </svg>
              </span>
              <span>
                <span style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.35rem' }}>Location</span>
                <span style={{ display: 'block', fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: 700, marginBottom: '0.25rem' }}>Get Directions</span>
                <span style={{ display: 'block', fontFamily: 'Lato, sans-serif', fontSize: '0.88rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>Open Google Maps to Lourdes Matha Church</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .details-grid { grid-template-columns: 1fr !important; }
          .event-card {
            padding: 1.1rem 1rem !important;
            gap: 0.9rem !important;
            border-radius: 16px !important;
          }
          .directions-card {
            padding: 1.15rem 1rem !important;
            gap: 0.9rem !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
