'use client';
import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  { title: 'Perfect',  artist: 'Ed Sheeran', src: '/music/perfect.mp3' },
];

const LYRICS = [
  '"Cause we were just kids when we fell in love"',
  '"Not knowing what it was"',
  '"I will not give you up this time"',
  '"But darling, just kiss me slow"',
  '"Your heart is all I own"',
  '"And in your eyes, you\'re holding mine"',
];

export default function MusicPlayer() {
  const audioRef        = useRef<HTMLAudioElement | null>(null);
  const [playing,  setPlay]  = useState(false);
  const [expanded, setExp]   = useState(false);
  const [shown,    setShown] = useState(false);
  const [trackIdx, setTrack] = useState(0);
  const [vol,      setVol]   = useState(0.72);
  const [progress, setProg]  = useState(0);
  const [lyricIdx, setLyric] = useState(0);
  const [prompt,   setPrompt]= useState(true);
  const lyricTimer     = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasPlayed      = useRef(false);
  const audioReady     = useRef(false);
  const playRequested  = useRef(false);
  const audibleStarted = useRef(false);

  useEffect(() => {
    /* Build audio element */
    const audio        = new Audio(TRACKS[0].src);
    audio.loop         = true;
    audio.volume       = 0.72;
    audio.preload      = 'auto';
    audio.muted        = false;
    audio.setAttribute('playsinline', 'true');
    audioRef.current   = audio;

    audio.addEventListener('play',       () => setPlay(true));
    audio.addEventListener('pause',      () => setPlay(false));
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) setProg(audio.currentTime / audio.duration);
    });
    audio.addEventListener('canplaythrough', () => { audioReady.current = true; });

    const startAudible = () => {
      if (audibleStarted.current || playRequested.current) return;
      playRequested.current = true;
      audio.muted = false;
      audio.volume = vol;
      audio.play()
        .then(() => {
          hasPlayed.current = true;
          audibleStarted.current = true;
          setPlay(true);
          setPrompt(false);
          cleanup();
        })
        .catch(() => { playRequested.current = false; });
    };

    /* Try real autoplay first, then keep the track primed silently if the browser blocks sound. */
    audio.play()
      .then(() => {
        hasPlayed.current = true;
        audibleStarted.current = true;
        setPlay(true);
        setPrompt(false);
        cleanup();
      })
      .catch(() => {
        audio.muted = true;
        audio.volume = 0;
        audio.play()
          .then(() => setPlay(false))
          .catch(() => {});
      });

    setTimeout(() => setShown(true), 1000);

    /*
      Autoplay on ANY user interaction:
      - scroll (desktop + mobile)
      - touchstart / touchmove (mobile swipe)
      - pointerdown / mousedown (click)
      - keydown
    */
    const tryPlay = () => startAudible();

    const EVENTS = ['scroll','touchstart','touchmove','touchend','pointerdown','mousedown','keydown','wheel'];
    EVENTS.forEach(ev => window.addEventListener(ev, tryPlay, { once: false, passive: true, capture: true }));

    /* Clean up after first successful audible play */
    function cleanup() {
      EVENTS.forEach(ev => window.removeEventListener(ev, tryPlay, { capture: true }));
    }

    return () => {
      audio.pause();
      audioRef.current = null;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Sync volume */
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = audioRef.current.muted ? 0 : vol;
  }, [vol]);

  /* Lyric cycling */
  useEffect(() => {
    if (lyricTimer.current) clearInterval(lyricTimer.current);
    if (playing) lyricTimer.current = setInterval(() => setLyric(i => (i + 1) % LYRICS.length), 4200);
    return () => { if (lyricTimer.current) clearInterval(lyricTimer.current); };
  }, [playing]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); }
    else {
      try {
        a.muted = false;
        a.volume = vol;
        await a.play();
        hasPlayed.current = true;
        audibleStarted.current = true;
        setPlay(true);
        setPrompt(false);
      } catch {}
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration;
  };

  if (!shown) return null;

  return (
    <div className="music-player-shell" style={{
      position: 'fixed',
      bottom: 'clamp(1rem,4vw,1.8rem)',
      right:  'clamp(1rem,4vw,1.8rem)',
      zIndex: 300,
      opacity:   shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(20px)',
      transitionProperty: 'opacity, transform',
      transitionDuration: '0.7s',
    }}>

      {prompt && !playing && (
        <button className="music-prompt" onClick={toggle} style={{
          position: 'absolute',
          right: 0,
          bottom: '4.6rem',
          width: 'max-content',
          maxWidth: 'min(78vw, 260px)',
          border: '1px solid rgba(184,144,74,0.26)',
          borderRadius: '999px',
          padding: '0.72rem 1rem',
          background: 'linear-gradient(135deg, rgba(253,246,238,0.98), rgba(255,250,244,0.94))',
          color: '#5c2020',
          boxShadow: '0 12px 38px rgba(92,32,32,0.16), inset 0 1px 0 rgba(255,255,255,0.82)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          cursor: 'pointer',
          animationName: 'music-nudge',
          animationDuration: '2.2s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        }}>
          <span className="music-prompt-note" style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #b8904a, #d98a80)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '0.75rem',
            boxShadow: '0 4px 14px rgba(184,144,74,0.38)',
          }}>♪</span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
            <span className="music-prompt-title" style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.08rem', fontWeight: 700 }}>Tap for music</span>
            <span className="music-prompt-track" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.46rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#b8904a', marginTop: '0.18rem' }}>Perfect - Ed Sheeran</span>
          </span>
        </button>
      )}

      {/* Expanded card */}
      {expanded && (
        <div style={{
          background: 'linear-gradient(145deg, rgba(253,246,238,0.98), rgba(255,250,244,0.94))',
          border: '1px solid rgba(184,144,74,0.24)',
          borderRadius: '18px',
          padding: '1.35rem 1.45rem 1.2rem',
          marginBottom: '0.9rem',
          boxShadow: '0 18px 54px rgba(92,32,32,0.18), inset 0 1px 0 rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          width: 'min(82vw, 292px)',
          animationName: 'card-pop',
          animationDuration: '0.35s',
          animationTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
        }}>

          {/* Track info */}
          <div style={{ marginBottom: '1rem', paddingBottom: '0.9rem', borderBottom: '1px solid rgba(184,144,74,0.14)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'radial-gradient(circle at center, #fdf6ee 0 18%, #b8904a 19% 27%, #5c2020 28% 100%)', boxShadow: playing ? '0 0 0 5px rgba(217,138,128,0.12)' : '0 0 0 5px rgba(184,144,74,0.08)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.3rem', color: '#5c2020', fontWeight: 700, lineHeight: 1.1 }}>{TRACKS[trackIdx].title}</p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.18em', color: '#b8904a', textTransform: 'uppercase', marginTop: '3px' }}>{TRACKS[trackIdx].artist}</p>
            </div>
          </div>

          {/* Lyric */}
          <div style={{ minHeight: '2.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem', overflow: 'hidden' }}>
            <p key={lyricIdx} style={{
              fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
              fontSize: '0.78rem', color: '#7a3535', textAlign: 'center', lineHeight: 1.5,
              opacity: playing ? 1 : 0.5,
              animationName: playing ? 'lyric-in' : 'none',
              animationDuration: '0.5s',
            }}>{LYRICS[lyricIdx]}</p>
          </div>

          {/* Waveform */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '1rem', height: '28px' }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{
                width: '3px', borderRadius: '3px',
                background: 'linear-gradient(to top, #b8904a, #d98a80)',
                height: `${7 + (i % 5) * 4}px`,
                opacity: playing ? 1 : 0.4,
                transitionProperty: 'height, opacity',
                transitionDuration: '0.4s',
                animationName: playing ? 'wave-bar' : 'none',
                animationDuration: `${0.6 + (i % 4) * 0.18}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationDelay: `${i * 0.06}s`,
              }} />
            ))}
          </div>

          {/* Progress */}
          <div onClick={seek} style={{ height: '3px', background: 'rgba(184,144,74,0.18)', borderRadius: '3px', cursor: 'pointer', marginBottom: '1rem' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(to right, #b8904a, #d98a80)', borderRadius: '3px', transitionProperty: 'width', transitionDuration: '0.5s' }} />
          </div>

          {/* Volume + play */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#b8904a"/>
              <path d="M16 8.5c1.1 1.1 1.1 5.9 0 7" stroke="#b8904a" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M18.5 6c2.2 2.4 2.2 9.6 0 12" stroke="#d98a80" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input type="range" min={0} max={1} step={0.05} value={vol}
              onChange={e => setVol(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#b8904a', cursor: 'pointer' }} />
            <button onClick={toggle} style={{
              width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #b8904a, #d98a80)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 12px rgba(184,144,74,0.4)', flexShrink: 0,
              transitionProperty: 'transform', transitionDuration: '0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              {playing
                ? <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><rect x="2" y="1" width="3" height="10" rx="1"/><rect x="7" y="1" width="3" height="10" rx="1"/></svg>
                : <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><path d="M3 1.5l8 4.5-8 4.5V1.5z"/></svg>
              }
            </button>
          </div>
        </div>
      )}

      {/* Vinyl button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
        <button className="music-vinyl" onClick={() => setExp(v => !v)} style={{
          width: '54px', height: '54px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'conic-gradient(from 0deg, #5c2020 0%, #b8904a 25%, #d98a80 50%, #b8904a 75%, #5c2020 100%)',
          boxShadow: playing ? '0 6px 28px rgba(184,144,74,0.55)' : '0 4px 18px rgba(92,32,32,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animationName: playing ? 'vinyl-spin' : 'none',
          animationDuration: '4s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          transitionProperty: 'box-shadow',
          transitionDuration: '0.3s',
        } as React.CSSProperties}
          aria-label="Music player"
        >
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(253,246,238,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b8904a' }} />
          </div>
        </button>

        {playing && (
          <div style={{
            position: 'absolute', inset: '-5px', borderRadius: '50%',
            border: '2px solid rgba(217,138,128,0.5)', pointerEvents: 'none',
            animationName: 'pulse-ring', animationDuration: '1.8s',
            animationTimingFunction: 'ease-out', animationIterationCount: 'infinite',
          } as React.CSSProperties} />
        )}

        <div style={{
          position: 'absolute', top: '-5px', right: '-5px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: playing ? 'linear-gradient(135deg, #b8904a, #d98a80)' : 'rgba(184,144,74,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '9px', color: '#fff', pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(92,32,32,0.2)',
          transitionProperty: 'background', transitionDuration: '0.3s',
        }}>{playing ? '♪' : '♩'}</div>
      </div>

      <style>{`
        @keyframes vinyl-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.7);opacity:0} }
        @keyframes card-pop   { from{opacity:0;transform:scale(0.9) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes lyric-in   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wave-bar   { from{transform:scaleY(0.45)} to{transform:scaleY(1)} }
        @keyframes music-nudge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @media (max-width: 760px) {
          .music-player-shell {
            right: 0.85rem !important;
            bottom: max(0.75rem, env(safe-area-inset-bottom)) !important;
          }
          .music-prompt {
            right: 3.9rem !important;
            bottom: 0.05rem !important;
            max-width: 178px !important;
            padding: 0.5rem 0.68rem !important;
            gap: 0.45rem !important;
            box-shadow: 0 8px 24px rgba(92,32,32,0.14), inset 0 1px 0 rgba(255,255,255,0.82) !important;
          }
          .music-prompt-note {
            width: 23px !important;
            height: 23px !important;
            font-size: 0.64rem !important;
          }
          .music-prompt-title {
            font-size: 0.94rem !important;
            white-space: nowrap !important;
          }
          .music-prompt-track {
            font-size: 0.38rem !important;
            letter-spacing: 0.09em !important;
            white-space: nowrap !important;
          }
          .music-vinyl {
            width: 48px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </div>
  );
}
