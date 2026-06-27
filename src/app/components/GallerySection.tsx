'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const photos = [
  { src: '/photos/photo1.jpg',  span: 'tall' },
  { src: '/photos/photo5.jpg',  span: 'wide' },
  { src: '/photos/photo7.jpg',  span: 'normal' },
  { src: '/photos/photo8.jpg',  span: 'normal' },
  { src: '/photos/photo10.jpg', span: 'tall' },
  { src: '/photos/photo11.jpg', span: 'normal' },
  { src: '/photos/photo13.jpg', span: 'wide' },
  { src: '/photos/photo14.jpg', span: 'normal' },
  { src: '/photos/photo15.jpg', span: 'normal' },
  { src: '/photos/photo16.jpg', span: 'tall' },
  { src: '/photos/photo17.jpg', span: 'normal' },
  { src: '/photos/photo18.jpg', span: 'normal' },
];

export default function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    const items = ref.current?.querySelectorAll('.reveal');
    if (!items) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <section id="gallery" ref={ref} style={{ background: 'var(--ivory)', padding: '7rem 1.5rem', position: 'relative' }}>

      {/* Top wave */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
          <path d="M0,0 C360,60 1080,0 1440,60 L1440,0 L0,0 Z" fill="var(--cream)" />
        </svg>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.58rem', letterSpacing: '0.42em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>Captured Moments</p>
          <h2 style={{ fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(2.8rem,7vw,5rem)', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.1, marginBottom: '0.8rem' }}>
            Our Gallery
          </h2>
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-mid)' }}>Every picture tells our story</p>
        </div>

        {/* Masonry grid */}
        <div style={{ columns: 'clamp(150px, 25vw, 280px)', columnGap: '1rem', columnFill: 'balance' }}>
          {photos.map((p, i) => (
            <div
              key={i}
              className="reveal gallery-item"
              style={{
                transitionDelay: `${(i % 4) * 60}ms`,
                breakInside: 'avoid',
                marginBottom: '1rem',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(122,53,53,0.08)',
              }}
              onClick={() => setLightbox(p.src)}
            >
              <div style={{
                position: 'relative',
                aspectRatio: p.span === 'tall' ? '3/4' : p.span === 'wide' ? '4/3' : '1/1',
              }}>
                <Image
                  src={p.src} alt={`Memory ${i + 1}`}
                  fill style={{ objectFit: 'cover' }}
                  sizes="280px"
                />
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(122,53,53,0.45) 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '1.2rem',
                }}
                  className="gallery-overlay"
                >
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>View</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(20,10,10,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button onClick={() => setLightbox(null)} style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', borderRadius: '50%', width: '40px', height: '40px',
            cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
          <div style={{ position: 'relative', maxWidth: 'min(90vw, 800px)', maxHeight: '85vh', borderRadius: '20px', overflow: 'hidden' }}>
            <Image src={lightbox} alt="Gallery photo" width={800} height={600} style={{ objectFit: 'contain', display: 'block', maxHeight: '85vh', width: 'auto' }} />
          </div>
        </div>
      )}

      <style>{`
        .gallery-item:hover .gallery-overlay { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
