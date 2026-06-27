'use client';
import { useEffect, useRef, useState } from 'react';

/*
  ─────────────────────────────────────────────────────────────────
  FORMSUBMIT SETUP
  ─────────────────────────────────────────────────────────────────
  Wishes are sent silently through FormSubmit so the visitor's mail
  app does not open. The first live-domain submission may need the
  usual FormSubmit activation email confirmation.
  ─────────────────────────────────────────────────────────────────
*/
const JISMY_EMAIL  = 'jismy97thomas@gmail.com';   // primary recipient
const JIBIN_EMAIL  = 'jibinjames158@gmail.com';   // private copy for Jibin
const FORM_RECIPIENTS = [JISMY_EMAIL, JIBIN_EMAIL];
const STORAGE_KEY  = 'linto-jismy-wishes-v2';

type Wish = { id: number; name: string; relation: string; wish: string; color: string; ts: string };

const SEED: Wish[] = [
  { id: 1, name: 'Jibin & Jisly',          relation: 'Family',    wish: 'Watching your love story unfold has been one of the most beautiful things. Wishing you both a lifetime of laughter, adventure, and endless joy. Congratulations! 💕', color: '#d98a80', ts: '2026-07-01' },
  { id: 2, name: 'Jiss Thomas',            relation: 'Family',    wish: "So incredibly proud and happy for you both. May your home be filled with love, warmth, and God's choicest blessings every single day. Here's to forever! 🌸",        color: '#b8904a', ts: '2026-07-01' },
  { id: 3, name: 'Mummy & Papa',           relation: 'Parents',   wish: 'Our hearts are so full seeing you begin this beautiful journey together. You are our greatest joy. May the Lord walk with you every step of the way. We love you always.',   color: '#7a3535', ts: '2026-07-01' },
  { id: 4, name: 'Fr. (Dr.) Xavier C. S.', relation: 'Celebrant', wish: 'May the Lord bless your union abundantly. As you begin this sacred covenant, may His grace guide you and keep your hearts forever entwined in love.',                       color: '#5c2020', ts: '2026-07-01' },
];

const COLORS = ['#d98a80','#b8904a','#7a3535','#5c2020','#8a6830','#c47068'];

export default function WishesSection() {
  const ref              = useRef<HTMLDivElement>(null);
  const [wishes,     setWishes]    = useState<Wish[]>(SEED);
  const [hydrated,   setHydrated]  = useState(false);
  const [modalOpen,  setModal]     = useState(false);
  const [name,       setName]      = useState('');
  const [relation,   setRelation]  = useState('Guest');
  const [wish,       setWish]      = useState('');
  const [submitted,  setSubmitted] = useState(false);
  const [sending,    setSending]   = useState(false);
  const [sendStatus, setSendStatus]= useState<'idle'|'ok'|'fail'>('idle');
  const [error,      setError]     = useState('');
  const nextId = useRef(SEED.length + 1);

  /* Load persisted wishes — deferred to avoid SSR/client hydration mismatch */
  useEffect(() => {
    setHydrated(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Wish[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge: keep seed wishes + any real submitted ones (id > SEED.length)
          const real = parsed.filter(w => w.id > SEED.length);
          if (real.length > 0) {
            setWishes([...real, ...SEED]);
            nextId.current = Math.max(...parsed.map(w => w.id)) + 1;
          }
        }
      }
    } catch { /* ignore */ }
  }, []);

  /* Persist wishes */
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes)); } catch { /* ignore */ }
  }, [wishes, hydrated]);

  /* Scroll reveal */
  useEffect(() => {
    const items = ref.current?.querySelectorAll('.reveal');
    if (!items) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const closeModal = () => {
    setModal(false); setName(''); setRelation('Guest');
    setWish(''); setError(''); setSubmitted(false);
    setSendStatus('idle'); setSending(false);
  };

  const submitToFormSubmit = (recipient: string, entry: Wish) => new Promise<void>((resolve, reject) => {
    const iframeName = `formsubmit_${recipient.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;
    const iframe = document.createElement('iframe');
    const form = document.createElement('form');
    const fields: Record<string, string> = {
      name: entry.name,
      relation: entry.relation,
      wish: entry.wish,
      _subject: `Wedding wish from ${entry.name}`,
      _template: 'table',
      _captcha: 'false',
    };

    iframe.name = iframeName;
    iframe.style.display = 'none';
    form.style.display = 'none';
    form.method = 'POST';
    form.action = `https://formsubmit.co/${recipient}`;
    form.target = iframeName;

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    const cleanup = () => {
      form.remove();
      iframe.remove();
    };
    const timer = window.setTimeout(() => {
      cleanup();
      resolve();
    }, 2400);

    iframe.addEventListener('error', () => {
      window.clearTimeout(timer);
      cleanup();
      reject(new Error('FormSubmit iframe failed'));
    }, { once: true });

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();
  });

  const handleSubmit = async () => {
    if (!name.trim())           { setError('Please enter your name.'); return; }
    if (wish.trim().length < 8) { setError('Please write at least a short message.'); return; }
    setError(''); setSending(true);

    /* 1. Add to wall immediately */
    const entry: Wish = {
      id: nextId.current++,
      name: name.trim(), relation,
      wish: wish.trim(),
      color: COLORS[nextId.current % COLORS.length],
      ts: new Date().toISOString().split('T')[0],
    };
    setWishes(prev => [entry, ...prev]);

    /* 2. Send separate hidden FormSubmit posts so both inboxes receive a copy */
    try {
      await Promise.all(FORM_RECIPIENTS.map(recipient => submitToFormSubmit(recipient, entry)));
      setSendStatus('ok');
    } catch { setSendStatus('fail'); }

    setSending(false);
    setSubmitted(true);
    setTimeout(() => closeModal(), 3200);
  };

  const inp: React.CSSProperties = {
    fontFamily: 'Lato, sans-serif', fontSize: '0.95rem', color: 'var(--text-dark)',
    background: 'rgba(253,246,238,0.85)', border: '1.5px solid rgba(184,144,74,0.22)',
    borderRadius: '12px', padding: '0.9rem 1.2rem', outline: 'none', width: '100%',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  };

  return (
    <section id="wishes" ref={ref} style={{ background: 'var(--cream)', padding: '7rem 1.5rem 6rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
          <path d="M0,30 C480,0 960,60 1440,30 L1440,0 L0,0 Z" fill="var(--ivory)" />
        </svg>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.56rem', letterSpacing: '0.44em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 500 }}>Words of Love</p>
          <h2 style={{ fontFamily: 'Dancing Script, cursive', fontSize: 'clamp(2.8rem,7vw,5.2rem)', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.05, marginBottom: '0.8rem' }}>Wishes &amp; Blessings</h2>
          <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-mid)', marginBottom: '2rem' }}>
            Leave a note for Linto &amp; Jismy to treasure forever
          </p>
          <button onClick={() => { closeModal(); setModal(true); }} style={{
            fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
            background: 'linear-gradient(135deg, #b8904a 0%, #d98a80 100%)',
            color: '#fff', borderRadius: '100px', padding: '1rem 2.8rem', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(184,144,74,0.38)', transition: 'transform 0.3s, box-shadow 0.3s',
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 14px 40px rgba(184,144,74,0.5)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)';    (e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(184,144,74,0.38)'; }}
          ><span style={{ fontSize: '1rem' }}>♡</span> Send Your Wish</button>
        </div>

        {/* Email notice — shows only Jismy's email */}
        <div className="reveal" style={{ background: 'linear-gradient(135deg, rgba(184,144,74,0.1), rgba(217,138,128,0.07))', border: '1px solid rgba(184,144,74,0.22)', borderRadius: '16px', padding: '1rem 1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #b8904a, #d98a80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 3px 12px rgba(184,144,74,0.35)' }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x="0.5" y="0.5" width="15" height="11" rx="1.5" stroke="white" strokeWidth="1.2"/><path d="M0.5 2L8 6.5L15.5 2" stroke="white" strokeWidth="1.2"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.16em', color: '#b8904a', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.15rem' }}>Wishes sent to Jismy Thomas</p>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 300 }}>
              Every wish is delivered directly to <strong style={{ color: '#7a3535' }}>{JISMY_EMAIL}</strong>
            </p>
          </div>
        </div>

        {/* Wishes wall */}
        <div style={{ columns: 'clamp(280px, 44%, 440px)', columnGap: '1.2rem' }}>
          {wishes.map(w => (
            <div key={w.id} className="reveal" style={{ breakInside: 'avoid', marginBottom: '1.2rem', background: 'rgba(253,246,238,0.88)', border: `1px solid ${w.color}22`, borderRadius: '22px', padding: '1.6rem 1.8rem 1.4rem', boxShadow: '0 4px 24px rgba(92,32,32,0.05), inset 0 1px 0 rgba(255,255,255,0.7)', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow=`0 12px 40px ${w.color}22`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)';    (e.currentTarget as HTMLElement).style.boxShadow='0 4px 24px rgba(92,32,32,0.05), inset 0 1px 0 rgba(255,255,255,0.7)'; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: `linear-gradient(to bottom, ${w.color}, ${w.color}55)`, borderRadius: '22px 0 0 22px' }} />
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.8rem', color: w.color, opacity: 0.12, lineHeight: 0.75, marginBottom: '0.4rem', fontWeight: 700, userSelect: 'none' }}>"</div>
              <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.78, marginBottom: '1.2rem' }}>{w.wish}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${w.color}50, ${w.color}28)`, border: `1.5px solid ${w.color}44` }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.85rem', color: w.color, fontWeight: 700 }}>{w.name[0]}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--text-dark)', fontWeight: 700 }}>{w.name}</p>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.52rem', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 400 }}>{w.relation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) closeModal(); }} style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(44,26,26,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', animation: 'modal-in 0.35s ease' }}>
          <div style={{ background: 'var(--cream)', borderRadius: '28px', padding: 'clamp(1.8rem,5vw,3rem)', width: '100%', maxWidth: '500px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(92,32,32,0.22)', position: 'relative', animation: 'card-in 0.4s cubic-bezier(0.22,1,0.36,1)' }}>

            <button onClick={closeModal} style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(122,53,53,0.08)', border: '1px solid rgba(122,53,53,0.15)', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7a3535', fontSize: '0.9rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(122,53,53,0.16)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(122,53,53,0.08)'; }}
            >✕</button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" style={{ marginBottom: '0.8rem' }}>
                <circle cx="19" cy="19" r="5" fill="#d98a80"/>
                {[0,51.4,102.8,154.2,205.7,257.1,308.5].map((deg,i) => (
                  <ellipse key={i} cx="19" cy="9.5" rx="3" ry="6.5" fill={`rgba(217,138,128,${0.28+i*0.08})`} transform={`rotate(${deg} 19 19)`}/>
                ))}
              </svg>
              <h3 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.2rem', color: '#5c2020', fontWeight: 700, marginBottom: '0.3rem' }}>Send Your Love</h3>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.82rem', color: 'var(--text-soft)', fontWeight: 300 }}>
                Your wish appears on the wall &amp; is emailed to Jismy
              </p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  {sendStatus === 'ok' ? '💕' : '💌'}
                </div>
                <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.6rem', color: '#5c2020', fontWeight: 700 }}>
                  Thank you, {name}!
                </p>
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.85rem', color: 'var(--text-mid)', marginTop: '0.5rem', fontWeight: 300 }}>
                  {sendStatus === 'ok'
                    ? 'Your wish is on the wall and has been sent to Jismy\'s inbox.'
                    : 'Your wish is on the wall. The email delivery did not finish, so please try again in a moment.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inp}
                  onFocus={e => { e.target.style.borderColor='rgba(217,138,128,0.7)'; e.target.style.boxShadow='0 0 0 4px rgba(217,138,128,0.1)'; }}
                  onBlur={e  => { e.target.style.borderColor='rgba(184,144,74,0.22)';   e.target.style.boxShadow='none'; }} />
                <select value={relation} onChange={e => setRelation(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  {['Guest','Family','Friend','Colleague','Relative','Well-wisher'].map(r => <option key={r}>{r}</option>)}
                </select>
                <textarea placeholder="Write your heartfelt wish for the couple…" rows={4} value={wish} onChange={e => setWish(e.target.value)} style={{ ...inp, resize: 'vertical', minHeight: '110px' }}
                  onFocus={e => { e.target.style.borderColor='rgba(217,138,128,0.7)'; e.target.style.boxShadow='0 0 0 4px rgba(217,138,128,0.1)'; }}
                  onBlur={e  => { e.target.style.borderColor='rgba(184,144,74,0.22)';   e.target.style.boxShadow='none'; }} />
                {error && (
                  <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.8rem', color: '#b03030', background: 'rgba(176,48,48,0.06)', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(176,48,48,0.14)' }}>{error}</p>
                )}
                <button onClick={handleSubmit} disabled={sending} style={{
                  fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                  background: sending ? 'rgba(184,144,74,0.5)' : 'linear-gradient(135deg, #b8904a 0%, #d98a80 100%)',
                  color: '#fff', borderRadius: '100px', padding: '1rem 2.5rem', border: 'none',
                  cursor: sending ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
                  boxShadow: sending ? 'none' : '0 6px 28px rgba(184,144,74,0.38)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { if (!sending) { (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 10px 36px rgba(184,144,74,0.5)'; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 6px 28px rgba(184,144,74,0.38)'; }}
                >
                  {sending ? (
                    <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animationName:'spin', animationDuration:'0.8s', animationTimingFunction:'linear', animationIterationCount:'infinite' } as React.CSSProperties}>
                      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg> Sending…</>
                  ) : (
                    <><span>♡</span> Send With Love</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes modal-in { from{opacity:0} to{opacity:1} }
        @keyframes card-in  { from{opacity:0;transform:scale(0.92) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width:520px) {
          div[style*="z-index: 500"] { align-items:flex-end !important; padding:0 !important; }
          div[style*="z-index: 500"] > div { border-radius:24px 24px 0 0 !important; }
        }
      `}</style>
    </section>
  );
}
