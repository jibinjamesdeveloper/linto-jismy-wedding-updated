'use client';

export default function FooterSection() {
  return (
    <footer style={{ background: '#2c1a1a', color: 'rgba(253,246,238,0.82)', padding: '5rem 1.5rem 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '80px' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="var(--cream)" />
        </svg>
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='5' fill='%23d98a80'/%3E%3C/svg%3E")` }} />

      <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', position: 'relative', paddingBottom: '0' }}>
        <div style={{ marginBottom: '1.2rem' }}>
          <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '3.8rem', fontWeight: 700, background: 'linear-gradient(135deg, #deb887, #d98a80)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>L & J</span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.2rem,3vw,1.7rem)', fontWeight: 400, fontStyle: 'italic', color: 'rgba(253,246,238,0.75)', marginBottom: '0.6rem', letterSpacing: '0.06em' }}>Linto &amp; Jismy</h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.58rem', letterSpacing: '0.38em', color: '#b8904a', textTransform: 'uppercase', marginBottom: '2.5rem' }}>22 · July · 2026 · Mampuzhakary, Kerala</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', marginBottom: '2.5rem' }}>
          <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, transparent, rgba(217,138,128,0.38))' }} />
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C11 2 14 6 19 6C19 11 15.5 16.5 11 21C6.5 16.5 3 11 3 6C8 6 11 2 11 2Z" fill="rgba(217,138,128,0.45)"/></svg>
          <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, transparent, rgba(217,138,128,0.38))' }} />
        </div>

        <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(253,246,238,0.48)', maxWidth: '460px', margin: '0 auto 3rem', lineHeight: 1.85 }}>
          "Two are better than one... if either of them falls down,<br />one can help the other up."
          <br /><span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'rgba(253,246,238,0.28)' }}>— Ecclesiastes 4:9</span>
        </p>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {[['#home','Home'],['#story','Our Story'],['#details','Wedding Day'],['#gallery','Gallery'],['#wishes','Wishes']].map(([href,label]) => (
            <a key={href} href={href} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.56rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(253,246,238,0.38)', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#b8904a')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(253,246,238,0.38)')}
            >{label}</a>
          ))}
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '0' }} />
      </div>

      {/* ── Developer Credit Strip ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(184,144,74,0.12), rgba(217,138,128,0.1))',
        borderTop: '1px solid rgba(184,144,74,0.15)',
        padding: '1.6rem 1.5rem',
        marginTop: '0',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

          {/* Left: Made with love */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #b8904a, #d98a80)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(184,144,74,0.35)', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                <path d="M7 2C7 2 5 4 2.5 4C2.5 7 4.5 10.5 7 13C9.5 10.5 11.5 7 11.5 4C9 4 7 2 7 2Z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.18em', color: '#b8904a', textTransform: 'uppercase', fontWeight: 700 }}>Made with ♡ for Linto &amp; Jismy</p>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.72rem', color: 'rgba(253,246,238,0.38)', fontWeight: 300 }}>A gift from someone who cares · 2026</p>
            </div>
          </div>

          {/* Right: Developer */}
          <a href="mailto:jibinjames158@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '100px', border: '1px solid rgba(184,144,74,0.25)', background: 'rgba(184,144,74,0.06)', transition: 'all 0.3s', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(184,144,74,0.16)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(184,144,74,0.45)'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(184,144,74,0.06)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(184,144,74,0.25)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)'; }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #5c2020, #b8904a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>J</span>
            </div>
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.56rem', letterSpacing: '0.14em', color: '#deb887', fontWeight: 700, textTransform: 'uppercase' }}>Developed by Jibin James</p>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.7rem', color: 'rgba(184,144,74,0.7)', fontWeight: 300 }}>jibinjames158@gmail.com</p>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
              <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#deb887" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
