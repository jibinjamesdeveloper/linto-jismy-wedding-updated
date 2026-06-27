'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const petalsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 760);
    const fn = () => {
      // Only apply parallax/fade on desktop — mobile browsers have unstable scrollY at load
      if (window.innerWidth > 760 && window.scrollY < window.innerHeight * 1.5) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const c = petalsRef.current;
    if (!c) return;
    const items = Array.from({ length: 22 }, () => {
      const el = document.createElement('div');
      const size = 5 + Math.random() * 11;
      el.style.cssText = `
        position:absolute; pointer-events:none;
        width:${size}px; height:${size * 1.5}px;
        left:${Math.random() * 100}%;
        border-radius: 50% 0 50% 0;
        background: rgba(217,138,128,${0.18 + Math.random() * 0.28});
        animation: petal-fall ${12 + Math.random() * 11}s linear infinite;
        animation-delay: ${-Math.random() * 16}s;
      `;
      return el;
    });
    items.forEach(el => c.appendChild(el));
    return () => items.forEach(el => el.remove());
  }, []);

  const parallax = isMobile ? 0 : scrollY * 0.28;
  const fade = isMobile ? 1 : Math.max(0, 1 - scrollY / 650);
  const T = (delay: number) => ({
    transition: `opacity 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
  });

  return (
    <section id="home" className="invitation-hero" style={{ position: 'relative', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>

      {/* ── Background photo — sharp, no blur ── */}
      <div className="hero-bg-layer" style={{ position: 'absolute', inset: 0, transform: `translateY(${parallax}px) scale(1.1)`, transformOrigin: 'center top' }}>
        {/* Desktop background */}
        <Image
          className="hero-bg-image hero-bg-desktop"
          src="/photos/hero-bg.jpg"
          alt="Linto and Jismy"
          fill priority
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          sizes="100vw"
          quality={95}
        />
        {/* Mobile background — shows both faces clearly */}
        <Image
          className="hero-bg-image hero-bg-mobile"
          src="/photos/hero-mobile.jpg"
          alt="Linto and Jismy"
          fill priority
          style={{ objectFit: 'cover', objectPosition: 'center 18%' }}
          sizes="100vw"
          quality={95}
        />
        {/* Romantic warm overlay — NO blur on image */}
        <div className="hero-warm-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(175deg, rgba(248,232,220,0.38) 0%, rgba(240,218,200,0.52) 50%, rgba(249,242,232,0.9) 100%)' }} />
        <div className="hero-focus-overlay" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 80% at 50% 30%, transparent 35%, rgba(92,32,32,0.1) 100%)' }} />
      </div>

      {/* Petals layer */}
      <div ref={petalsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }} />

      {/* ── Main content ── */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem', opacity: fade }}>

        {/* Eyebrow label */}
        <div className="hero-eyebrow" style={{ ...T(80), display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
          <div style={{ height: '1px', width: '56px', background: 'linear-gradient(to right, transparent, rgba(184,144,74,0.6))' }} />
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.56rem', letterSpacing: '0.5em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 500 }}>
            Together Forever
          </span>
          <div style={{ height: '1px', width: '56px', background: 'linear-gradient(to left, transparent, rgba(184,144,74,0.6))' }} />
        </div>

        {/* Names */}
        <div style={{ ...T(240), textAlign: 'center', marginBottom: '0.6rem' }}>
          <h1 className="hero-title" style={{
            fontFamily: 'Dancing Script, cursive',
            fontSize: 'clamp(5rem, 15vw, 11.5rem)',
            fontWeight: 700,
            lineHeight: 0.95,
            color: 'var(--text-dark)',
            textShadow: '0 2px 30px rgba(217,138,128,0.3)',
            letterSpacing: 0,
          }}>
            Linto
            <span className="hero-amp" style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--gold)',
              margin: '0 clamp(0.3rem,1.2vw,0.9rem)',
              verticalAlign: 'middle',
              paddingBottom: '0.35em',
              display: 'inline-block',
            }}>&amp;</span>
            Jismy
          </h1>
        </div>

        {/* Tagline */}
        <p className="hero-tagline" style={{
          ...T(400),
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(0.95rem,2vw,1.3rem)',
          color: 'var(--text-mid)',
          marginBottom: '2.8rem',
          letterSpacing: '0.05em',
          textAlign: 'center',
        }}>
          A love written in the stars, sealed with a prayer
        </p>

        {/* Floral ornament divider */}
        <div className="hero-ornament" style={{ ...T(540), display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ height: '1px', width: 'clamp(40px,7vw,90px)', background: 'linear-gradient(to right, transparent, rgba(217,138,128,0.6))' }} />
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="3.5" fill="var(--rose)" />
            {[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map((deg, i) => (
              <ellipse key={i} cx="16" cy="8" rx="2.2" ry="5"
                fill={`rgba(217,138,128,${0.35 + i * 0.07})`}
                transform={`rotate(${deg} 16 16)`} />
            ))}
          </svg>
          <div style={{ height: '1px', width: 'clamp(40px,7vw,90px)', background: 'linear-gradient(to left, transparent, rgba(217,138,128,0.6))' }} />
        </div>

        {/* Info cards */}
        <div className="hero-info-cards" style={{ ...T(660), display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.8rem', marginBottom: '3.5rem' }}>
          {[
            { label: 'Date', value: '22 · July · 2026' },
            { label: 'Church', value: 'Lourdes Matha Church' },
            { label: 'Place',  value: 'Mampuzhakary, Kerala' },
          ].map(c => (
            <div key={c.label} className="hero-info-card" style={{
              background: 'rgba(253,246,238,0.78)',
              border: '1px solid rgba(184,144,74,0.28)',
              borderRadius: '14px',
              padding: '0.9rem 1.8rem',
              textAlign: 'center',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 4px 24px rgba(92,32,32,0.06)',
            }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.32em', color: 'var(--gold)', marginBottom: '0.35rem', textTransform: 'uppercase', fontWeight: 500 }}>{c.label}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.93rem', color: 'var(--text-dark)', fontWeight: 500 }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="hero-ctas" style={{ ...T(780), display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: isMobile ? '1.5rem' : '5rem' }}>
          <a className="hero-cta" href="#story" style={{
            fontFamily: 'Montserrat, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', fontWeight: 600,
            background: 'linear-gradient(135deg, #b8904a 0%, #d98a80 100%)',
            color: '#fff', borderRadius: '100px', padding: '0.9rem 2.5rem',
            textDecoration: 'none', border: 'none',
            boxShadow: '0 6px 28px rgba(184,144,74,0.38)',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 36px rgba(184,144,74,0.48)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(184,144,74,0.38)'; }}
          >Our Story</a>
          <a className="hero-cta" href="#gallery" style={{
            fontFamily: 'Montserrat, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', fontWeight: 600, color: 'var(--deep-rose)',
            background: 'rgba(253,246,238,0.6)',
            border: '1.5px solid rgba(122,53,53,0.35)', borderRadius: '100px', padding: '0.9rem 2.5rem',
            textDecoration: 'none', backdropFilter: 'blur(8px)',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(253,246,238,0.9)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(253,246,238,0.6)'; }}
          >View Gallery</a>
        </div>

        {/* Scroll cue */}
        <div className="hero-scroll-cue" style={{ opacity: visible ? 0.45 : 0, transition: 'opacity 1s ease 1.4s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.46rem', letterSpacing: '0.42em', color: 'var(--text-mid)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '44px', overflow: 'hidden', position: 'relative', background: 'rgba(184,144,74,0.15)' }}>
            <div style={{ position: 'absolute', top: '-100%', width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)', animation: 'scan-down 2.2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      {/* ── Mobile-only floral wave transition ── */}
      <div className="hero-wave-divider" style={{
        display: 'none', // shown via CSS on mobile only
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        lineHeight: 0,
      }}>
        <svg viewBox="0 0 390 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '64px', display: 'block' }}>
          <path d="M0,32 C65,60 130,8 195,32 C260,56 325,4 390,32 L390,64 L0,64 Z" fill="#f9f2e8" />
        </svg>
        {/* Floral dots on the wave */}
        <div style={{
          position: 'absolute',
          bottom: '38px',
          left: 0, right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 4,
        }}>
          {['rgba(217,138,128,0.5)', 'rgba(184,144,74,0.7)', 'rgba(217,138,128,0.9)', 'rgba(184,144,74,0.7)', 'rgba(217,138,128,0.5)'].map((c, i) => (
            <div key={i} style={{
              width: i === 2 ? '8px' : '5px',
              height: i === 2 ? '8px' : '5px',
              borderRadius: '50%',
              background: c,
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
