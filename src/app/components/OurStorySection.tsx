'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ── Birthdays — Jismy: 2 Aug, Linto: 3 Sep (exactly 1 month + 1 day apart ✨) ── */
const BIRTHDAYS = [
  { name: 'Jismy', day: 2,  month: 8,  year: 1997, emoji: '🌸', color: '#d98a80' },
  { name: 'Linto', day: 3,  month: 9,  year: 1997, emoji: '🎂', color: '#b8904a' },
];

function daysUntil(day: number, month: number) {
  const now   = new Date();
  const next  = new Date(now.getFullYear(), month - 1, day);
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  return Math.ceil((next.getTime() - now.getTime()) / 86400000);
}

function BirthdaySection() {
  const [now,      setNow]      = useState<Date | null>(null);
  const [confetti, setConfetti] = useState<{x:number;y:number;c:string;r:number;s:number}[]>([]);
  const [dismissed,setDismissed]= useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const isBirthday = (b: typeof BIRTHDAYS[0]) =>
    now && now.getMonth() + 1 === b.month && now.getDate() === b.day;

  const celebrant = BIRTHDAYS.find(isBirthday);

  /* Generate confetti pieces once on birthday */
  useEffect(() => {
    if (!celebrant || dismissed) return;
    const pieces = Array.from({ length: 48 }, (_, i) => ({
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      c: ['#d98a80','#b8904a','#f0dfc0','#5c2020','#deb887','#c47068'][i % 6],
      r: Math.random() * 360,
      s: 0.6 + Math.random() * 0.8,
    }));
    setConfetti(pieces);
  }, [celebrant, dismissed]);

  if (!now) return null;

  return (
    <>
      {/* Birthday full-screen overlay */}
      {celebrant && !dismissed && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(253,232,228,0.97)',
          backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '2rem',
          animationName: 'birthday-in',
          animationDuration: '0.6s',
          animationTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
        } as React.CSSProperties}>
          {/* Confetti */}
          {confetti.map((p, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${p.x}%`,
              width: `${6 * p.s}px`, height: `${10 * p.s}px`,
              background: p.c,
              borderRadius: '2px',
              animationName: 'confetti-fall',
              animationDuration: `${2.5 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 1.5}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              transform: `rotate(${p.r}deg)`,
            } as React.CSSProperties} />
          ))}

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: '520px' }}>
            <div style={{ fontSize: 'clamp(3rem,10vw,5rem)', marginBottom: '0.5rem', animationName: 'bounce-emoji', animationDuration: '1s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out', display: 'inline-block' } as React.CSSProperties}>
              {celebrant.emoji}
            </div>
            <h2 style={{ fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(2.4rem,7vw,4.5rem)', fontWeight: 700, color: '#5c2020', lineHeight: 1.1, marginBottom: '0.8rem' }}>
              Happy Birthday,<br />{celebrant.name}!
            </h2>
            <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(0.9rem,2.5vw,1.2rem)', color: '#7a3535', lineHeight: 1.7, marginBottom: '2rem' }}>
              Today the world became more beautiful the day you were born.<br />
              May this day overflow with love, joy, and all the happiness you deserve. 💕
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ height: '1px', width: '60px', background: `linear-gradient(to right, transparent, ${celebrant.color})` }} />
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.58rem', letterSpacing: '0.3em', color: celebrant.color, textTransform: 'uppercase' }}>With All Our Love</span>
              <div style={{ height: '1px', width: '60px', background: `linear-gradient(to left, transparent, ${celebrant.color})` }} />
            </div>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.85rem', color: '#b8904a', marginBottom: '2rem', fontWeight: 300 }}>
              — From Linto &amp; Jismy's wedding family 🌸
            </p>
            <button onClick={() => setDismissed(true)} style={{
              fontFamily: 'Montserrat, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 700,
              background: `linear-gradient(135deg, ${celebrant.color}, #5c2020)`,
              color: '#fff', borderRadius: '100px', padding: '0.9rem 2.2rem',
              border: 'none', cursor: 'pointer', boxShadow: `0 6px 24px ${celebrant.color}55`,
            }}>Continue to the wedding ♡</button>
          </div>
        </div>
      )}

      {/* Birthday countdown cards — hidden on mobile */}
      <div className="reveal birthday-countdown-cards" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
        {BIRTHDAYS.map(b => {
          const isToday = now && now.getMonth() + 1 === b.month && now.getDate() === b.day;
          const d = daysUntil(b.day, b.month);
          const age = now ? now.getFullYear() - b.year - (now.getMonth() + 1 < b.month || (now.getMonth() + 1 === b.month && now.getDate() < b.day) ? 1 : 0) : b.year;
          return (
            <div key={b.name} style={{
              background: isToday ? `linear-gradient(135deg, ${b.color}22, ${b.color}10)` : 'rgba(253,246,238,0.9)',
              border: isToday ? `2px solid ${b.color}66` : '1px solid rgba(184,144,74,0.25)',
              borderRadius: '18px',
              padding: '1.1rem 1.8rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              boxShadow: isToday ? `0 8px 32px ${b.color}33` : '0 4px 20px rgba(92,32,32,0.06)',
              transition: 'all 0.4s',
              animationName: isToday ? 'birthday-card-glow' : 'none',
              animationDuration: '2s',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            } as React.CSSProperties}>
              <span style={{ fontSize: '1.8rem', animationName: isToday ? 'bounce-emoji' : 'none', animationDuration: '1s', animationIterationCount: 'infinite', display: 'inline-block' } as React.CSSProperties}>{b.emoji}</span>
              <div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.28em', color: b.color, textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 600 }}>Birthday</p>
                <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.3rem', color: '#2c1a1a', fontWeight: 700, lineHeight: 1.1 }}>{b.name}</p>
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.78rem', color: '#6b4040', fontWeight: 300 }}>
                  {b.day.toString().padStart(2,'0')} {['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][b.month]} {b.year}
                </p>
              </div>
              <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                {isToday ? (
                  <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.1rem', color: b.color, fontWeight: 700 }}>Today! 🎉</p>
                ) : (
                  <>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: b.color, fontWeight: 700, lineHeight: 1 }}>{d}</p>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.48rem', letterSpacing: '0.2em', color: '#b09090', textTransform: 'uppercase' }}>days away</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* "Destined" cosmic connection card */}
      <div className="reveal" style={{
        background: 'linear-gradient(135deg, rgba(217,138,128,0.1), rgba(184,144,74,0.08))',
        border: '1px solid rgba(184,144,74,0.22)',
        borderRadius: '20px',
        padding: '1.4rem 2rem',
        marginBottom: '4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, animationName: 'shimmer-bg', animationDuration: '4s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' } as React.CSSProperties} />
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.35em', color: '#b8904a', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 600 }}>✨ A Cosmic Connection</p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 'clamp(0.9rem,2vw,1.05rem)', color: '#5c2020', lineHeight: 1.7 }}>
          Jismy was born on <strong>2nd August</strong> and Linto on <strong>3rd September</strong> —<br />
          exactly <strong>1 month and 1 day</strong> apart. As if the universe itself<br />
          timed their arrival so they would find each other. 💫
        </p>
      </div>
    </>
  );
}

const milestones = [
  { year: '2001', tag: 'Chapter One',    title: 'First Hello',         desc: "Two little hearts crossed paths for the very first time — a childhood memory neither of them knew would become the opening chapter of the greatest love story.", photo: '/photos/childhood.jpg',   accent: '#d98a80', special: true,  specialText: 'The Beginning', aspectRatio: '4/3' },
  { year: '2016', tag: 'Chapter Two',    title: 'Growing Closer',      desc: 'Through shared laughter, long conversations, and countless little moments, a beautiful friendship quietly bloomed into something far deeper and more beautiful.',  photo: '/photos/pennu.jpg',      accent: '#b8904a', special: false, specialText: '', aspectRatio: '3/4' },
  { year: '2019', tag: 'Chapter Three',  title: 'The Promise',         desc: 'With hearts full of certainty, they made a quiet promise to each other — to walk through every season of life side by side, whatever may come.',                photo: '/photos/photo6.jpg',    accent: '#8a6830', special: false, specialText: '', aspectRatio: '3/4' },
  { year: '2026', tag: 'Chapter Four',   title: 'Pennu Kaanal',        subtitle: '— Seeing the Girl Officially —', desc: 'The families came together for the official Pennu Kaanal, a blessed moment filled with smiles, flowers, and the warmth of a beautiful beginning.', photo: '/photos/engagement2.jpg', accent: '#2f6b55', special: true, specialText: 'Official Meeting ♡', aspectRatio: '3/4' },
  { year: '2026', tag: 'Chapter Five',   title: 'Fixation Ceremony',   desc: 'After Pennu Kaanal, the promise was joyfully fixed with family, prayer, and celebration — one more sacred step toward forever.',                             photo: '/photos/growing.jpg',   accent: '#5c2020', special: true,  specialText: 'Date Fixed ♡', aspectRatio: '3/4' },
  { year: '2026', tag: 'Final Chapter',  title: 'Forever Begins',      desc: "On 22nd July 2026, under God's blessing and the witness of everyone who loves them, Linto and Jismy begin their forever — the most beautiful chapter yet.",   photo: '/photos/photo12.jpg',   accent: '#b8904a', special: true,  specialText: '22 · July · 2026 ✨', aspectRatio: '3/4' },
];

export default function OurStorySection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!items) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="story" ref={ref} style={{ background: 'var(--ivory)', padding: '2rem 1.5rem 6rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }} className="bg-petal-pattern" />

      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
        <BirthdaySection />

        {/* Section header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.56rem', letterSpacing: '0.46em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 500 }}>Chapter by Chapter</p>
          <h2 style={{ fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(3rem,7.5vw,5.5rem)', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.05, marginBottom: '1rem' }}>Our Love Story</h2>
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--text-mid)', maxWidth: '520px', margin: '0 auto 1.8rem' }}>Twenty-five years in the making — every chapter written with love</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <div style={{ height: '1px', width: '70px', background: 'linear-gradient(to right, transparent, rgba(217,138,128,0.6))' }} />
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C11 2 14 6 19 6C19 11 15.5 16.5 11 21C6.5 16.5 3 11 3 6C8 6 11 2 11 2Z" fill="rgba(217,138,128,0.5)"/></svg>
            <div style={{ height: '1px', width: '70px', background: 'linear-gradient(to left, transparent, rgba(217,138,128,0.6))' }} />
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          <div className="timeline-line" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(217,138,128,0.35) 8%, rgba(184,144,74,0.3) 50%, rgba(217,138,128,0.35) 92%, transparent)', transform: 'translateX(-50%)' }} />

          {milestones.map((m, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={`${m.year}-${m.title}`} className={isEven ? 'reveal-left' : 'reveal-right'} style={{ transitionDelay: `${i * 70}ms`, marginBottom: '5rem', position: 'relative' }}>
                <div className="timeline-dot" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '18px', height: '18px', borderRadius: '50%', background: m.accent, border: '3px solid var(--ivory)', boxShadow: `0 0 0 5px ${m.accent}28`, zIndex: 3 }} />

                <div className="milestone-row" style={{ display: 'flex', flexDirection: isEven ? 'row' : 'row-reverse', alignItems: 'center', gap: 'clamp(1.5rem, 4vw, 3.5rem)' }}>
                  <div className="milestone-photo" style={{ flex: '0 0 clamp(150px, 30vw, 280px)', borderRadius: '24px', overflow: 'hidden', boxShadow: `0 12px 50px ${m.accent}28`, position: 'relative', aspectRatio: m.aspectRatio, border: m.special ? `2px solid ${m.accent}55` : 'none' }}>
                    <Image src={m.photo} alt={m.title} fill style={{ objectFit: 'cover', objectPosition: 'top center' }} sizes="280px" />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${m.accent}88 0%, transparent 55%)` }} />
                    <div style={{ position: 'absolute', top: '0.9rem', left: isEven ? 'auto' : '0.9rem', right: isEven ? '0.9rem' : 'auto', background: 'rgba(253,246,238,0.93)', backdropFilter: 'blur(10px)', border: `1px solid ${m.accent}44`, borderRadius: '100px', padding: '0.28rem 0.85rem', fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.16em', color: m.accent, fontWeight: 700 }}>{m.year}</div>
                    {m.special && (<div style={{ position: 'absolute', bottom: '0.9rem', left: '0.9rem', right: '0.9rem', textAlign: 'center', background: `${m.accent}cc`, backdropFilter: 'blur(8px)', borderRadius: '100px', padding: '0.35rem 0.8rem', fontFamily: 'Dancing Script, cursive', fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>{m.specialText}</div>)}
                  </div>

                  <div className="milestone-copy" style={{ flex: 1, background: 'rgba(253,246,238,0.7)', border: `1px solid ${m.accent}22`, borderRadius: '20px', padding: 'clamp(1.2rem,2.5vw,2rem)', boxShadow: '0 4px 24px rgba(92,32,32,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: isEven ? 0 : 'auto', right: isEven ? 'auto' : 0, width: '4px', height: '100%', background: `linear-gradient(to bottom, ${m.accent}, ${m.accent}44)`, borderRadius: isEven ? '20px 0 0 20px' : '0 20px 20px 0' }} />
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.3em', color: m.accent, textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>{m.tag}</p>
                    <h3 style={{ fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(1.7rem,3.5vw,2.4rem)', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.2rem', lineHeight: 1.15 }}>{m.title}</h3>
                    {'subtitle' in m && m.subtitle && (<p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '0.82rem', color: m.accent, marginBottom: '0.7rem' }}>{(m as any).subtitle}</p>)}
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.92rem', lineHeight: 1.78, color: 'var(--text-mid)', fontWeight: 300 }}>{m.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes birthday-in   { from { opacity:0; transform:scale(1.04) } to { opacity:1; transform:scale(1) } }
        @keyframes confetti-fall { 0%{top:-5%;opacity:1} 100%{top:110%;opacity:0;transform:rotate(720deg) translateX(30px)} }
        @keyframes bounce-emoji  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.12)} }
        @keyframes birthday-card-glow { 0%,100%{box-shadow:0 8px 32px rgba(92,32,32,0.1)} 50%{box-shadow:0 12px 48px rgba(184,144,74,0.25)} }
        @keyframes shimmer-bg { 0%,100%{background:transparent} 50%{background:rgba(255,255,255,0.18)} }
        @media (max-width: 640px) {
          .timeline-line, .timeline-dot { display:none !important; }
          .milestone-row { flex-direction:column !important; gap:1.2rem !important; }
          .milestone-photo { width:min(85vw,320px) !important; flex:none !important; margin:0 auto !important; aspect-ratio:4/3 !important; }
          .milestone-copy  { width:100% !important; text-align:center !important; }
        }
      `}</style>
    </section>
  );
}
