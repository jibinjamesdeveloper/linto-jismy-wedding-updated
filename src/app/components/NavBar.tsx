'use client';
import { useEffect, useState } from 'react';

const links = [
  { label: 'Our Story',   href: '#story' },
  { label: 'Wedding Day', href: '#details' },
  { label: 'Gallery',     href: '#gallery' },
  { label: 'Wishes',      href: '#wishes' },
];

export default function NavBar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* When NOT scrolled the hero is bright/warm so use deep burgundy links.
     When scrolled the navbar is cream so use bronze links.               */
  const linkColor   = scrolled ? '#6b4f2a' : '#5c2020';
  const linkHover   = '#b8904a';
  const logoColor   = scrolled ? '#7a3535' : '#5c2020';
  const hamColor    = scrolled ? '#7a3535' : '#5c2020';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.4s ease',
      background: scrolled ? 'rgba(253,246,238,0.96)' : 'rgba(253,246,238,0.25)',
      backdropFilter: scrolled ? 'blur(18px)' : 'blur(4px)',
      WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'blur(4px)',
      borderBottom: scrolled ? '1px solid rgba(184,144,74,0.18)' : '1px solid rgba(184,144,74,0.12)',
      padding: scrolled ? '0.7rem 2rem' : '1.1rem 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <a href="#" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'Dancing Script, cursive',
            fontSize: scrolled ? '1.5rem' : '1.75rem',
            fontWeight: 700, color: logoColor,
            transition: 'all 0.4s ease',
            letterSpacing: '0.02em',
          }}>L & J</span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="nav-desktop">
          {links.map(l => (
            <a key={l.href} href={l.href}
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.66rem', letterSpacing: '0.22em',
                textTransform: 'uppercase', fontWeight: 600,
                color: linkColor, textDecoration: 'none',
                transition: 'color 0.25s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
              onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
            >{l.label}</a>
          ))}

          {/* CTA pill */}
          <a href="#wishes" style={{
            fontFamily: 'Montserrat, sans-serif', fontSize: '0.63rem',
            letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
            color: '#7a3535',
            background: 'rgba(217,138,128,0.18)',
            border: '1px solid rgba(122,53,53,0.28)',
            borderRadius: '100px', padding: '0.5rem 1.3rem',
            textDecoration: 'none', transition: 'all 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(217,138,128,0.32)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(217,138,128,0.18)'; }}
          >Send Wishes ♡</a>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', display: 'none' }}
          className="nav-mobile" aria-label="Menu">
          <div style={{ width: '22px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', height: '1.5px', borderRadius: '2px',
                background: hamColor, transition: 'all 0.3s',
                transform: menuOpen
                  ? (i===0 ? 'rotate(45deg) translate(5px,5px)' : i===2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scaleX(0)')
                  : 'none',
              }} />
            ))}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(253,246,238,0.98)',
          padding: '1rem 2rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1.2rem',
          borderTop: '1px solid rgba(184,144,74,0.15)',
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#6b4f2a', textDecoration: 'none', fontWeight: 600,
              }}>{l.label}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: block !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
