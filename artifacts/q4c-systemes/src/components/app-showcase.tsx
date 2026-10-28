import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

type Slide = {
  product: string;
  initial: string;
  title: string;
  caption: string;
  // Path under /public, e.g. '/screenshots/lexpia-pro.png'. Leave undefined to show the placeholder screen.
  image?: string;
  layout: 'document' | 'dashboard' | 'chart' | 'report';
};

const slides: Slide[] = [
  { product: 'Lexpia-Pro', initial: 'L', title: 'Lecture OCR d’une pièce', caption: 'Facture bilingue arabe / français lue et pré-saisie automatiquement.', image: undefined, layout: 'document' },
  { product: 'HisabPro', initial: 'H', title: 'Suivi des dossiers', caption: 'Vue d’ensemble des dossiers, des pièces à traiter et des échéances.', image: undefined, layout: 'dashboard' },
  { product: 'Mizane', initial: 'M', title: 'Analyse financière', caption: 'Indicateurs clés et revue analytique pour orienter la mission.', image: undefined, layout: 'chart' },
  { product: 'Mizane', initial: 'M', title: 'Rapport de synthèse', caption: 'Constats structurés, prêts à être restitués au client.', image: undefined, layout: 'report' },
];

const SLIDE_DURATION = 5500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function PlaceholderScreen({ slide }: { slide: Slide }) {
  return (
    <div className="grid h-full grid-cols-[22%_1fr] bg-[#f9f9fc]">
      <div className="border-r border-[#6d1a2b]/10 bg-[#ededf0] p-[4%]">
        <span className="grid aspect-square w-[34%] place-items-center bg-[#6d1a2b] font-mono text-[clamp(7px,1.2vw,11px)] text-[#f4f4f7]">{slide.initial}</span>
        <div className="mt-[18%] space-y-[10%]">
          {[70, 85, 60, 75].map((w, i) => <span key={i} className={`block h-[5px] ${i === 0 ? 'bg-[#6d1a2b]/45' : 'bg-[#d6d6d9]'}`} style={{ width: `${w}%` }} />)}
        </div>
      </div>
      <div className="flex min-w-0 flex-col p-[3.5%]">
        <div className="flex items-center justify-between">
          <span className="font-serif text-[clamp(10px,1.6vw,15px)] font-semibold text-[#2b2b30]">{slide.title}</span>
          <span className="border border-[#a3253f]/30 px-2 py-0.5 font-mono text-[clamp(6px,.9vw,8px)] tracking-[.1em] text-[#a3253f]">CAPTURE À VENIR</span>
        </div>
        <div className="mt-[3%] min-h-0 flex-1">
          {slide.layout === 'document' && (
            <div className="grid h-full grid-cols-2 gap-[4%]">
              <div className="border border-[#6d1a2b]/10 bg-white p-[6%]">
                {[90, 55, 75, 40, 80, 65, 50].map((w, i) => <span key={i} className="mb-[7%] block h-[4px] bg-[#dddde0]" style={{ width: `${w}%` }} />)}
                <span className="showcase-scan" />
              </div>
              <div className="space-y-[6%]">
                {['Fournisseur', 'Date', 'Montant HT', 'TVA', 'ICE'].map((f) => <div key={f} className="border border-[#6d1a2b]/10 bg-white px-[6%] py-[4%]"><span className="block font-mono text-[clamp(5px,.8vw,7px)] text-[#8d8d90]">{f}</span><span className="mt-1 block h-[4px] w-[60%] bg-[#6d1a2b]/35" /></div>)}
              </div>
            </div>
          )}
          {slide.layout === 'dashboard' && (
            <div className="flex h-full flex-col gap-[4%]">
              <div className="grid grid-cols-3 gap-[3%]">{['À traiter', 'En cours', 'Clôturés'].map((l, i) => <div key={l} className="border border-[#6d1a2b]/10 bg-white p-[6%]"><span className="block font-mono text-[clamp(5px,.8vw,7px)] text-[#8d8d90]">{l}</span><span className="mt-2 block font-serif text-[clamp(10px,1.8vw,17px)] font-semibold text-[#6d1a2b]">{[12, 28, 46][i]}</span></div>)}</div>
              <div className="flex-1 border border-[#6d1a2b]/10 bg-white">{[0, 1, 2, 3, 4].map((r) => <div key={r} className="flex items-center gap-[4%] border-b border-[#6d1a2b]/[.07] px-[3%] py-[2.2%] last:border-0"><span className="h-[4px] w-[30%] bg-[#dddde0]" /><span className="h-[4px] w-[18%] bg-[#dddde0]" /><span className={`ml-auto h-[4px] w-[14%] ${r % 2 ? 'bg-[#a3253f]/50' : 'bg-[#6d1a2b]/35'}`} /></div>)}</div>
            </div>
          )}
          {slide.layout === 'chart' && (
            <div className="grid h-full grid-cols-[1.5fr_1fr] gap-[4%]">
              <div className="flex items-end gap-[5%] border border-[#6d1a2b]/10 bg-white p-[5%]">{[45, 70, 55, 85, 62, 92].map((h, i) => <span key={i} className={`flex-1 ${i % 2 ? 'bg-[#6d1a2b]/70' : 'bg-[#c7c7ca]'}`} style={{ height: `${h}%` }} />)}</div>
              <div className="space-y-[8%]">{['Marge', 'BFR', 'Liquidité'].map((k) => <div key={k} className="border border-[#6d1a2b]/10 bg-white p-[7%]"><span className="block font-mono text-[clamp(5px,.8vw,7px)] text-[#8d8d90]">{k}</span><span className="mt-2 block h-[4px] bg-[#e0e0e3]"><span className="block h-full w-[64%] bg-[#a3253f]/70" /></span></div>)}</div>
            </div>
          )}
          {slide.layout === 'report' && (
            <div className="mx-auto h-full w-[62%] border border-[#6d1a2b]/10 bg-white p-[5%] shadow-[0_8px_24px_rgba(30,30,35,.06)]">
              <span className="block font-mono text-[clamp(5px,.8vw,7px)] tracking-[.12em] text-[#a3253f]">RAPPORT DE SYNTHÈSE</span>
              <span className="mt-[4%] block h-[6px] w-[55%] bg-[#2b2b30]/70" />
              {[1, 2, 3].map((s) => <div key={s} className="mt-[7%]"><span className="block h-[4px] w-[35%] bg-[#6d1a2b]/45" />{[92, 80, 86].map((w, i) => <span key={i} className="mt-[3%] block h-[3px] bg-[#e0e0e3]" style={{ width: `${w}%` }} />)}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppShowcase() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeStart = useRef<number | null>(null);

  // Only run the loop while the showcase is on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const autoplay = !reducedMotion && !userPaused;
  const running = autoplay && !hovered && inView;
  const current = slides[index];

  function goTo(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + slides.length) % slides.length;
    goTo(next);
    tabRefs.current[next]?.focus();
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') swipeStart.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (swipeStart.current === null) return;
    const delta = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1));
  }

  return (
    <div
      ref={rootRef}
      className="showcase"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}
      aria-roledescription="carrousel"
      aria-label="Captures des applications Q4C Systèmes"
      role="region"
    >
      <div className="preview-window showcase-window">
        <div className="preview-topbar">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#6d1a2b]" /><span className="h-2 w-2 rounded-full bg-[#c7c7ca]" /><span className="h-2 w-2 rounded-full bg-[#c7c7ca]" />
          </span>
          <span className="min-w-0 truncate font-mono text-[9px] tracking-[.08em] text-[#7b7b7e]">
            <span className="font-bold text-[#6d1a2b]">Q4C</span> · {current.product} — {current.title}
          </span>
          <span className="hidden font-mono text-[8px] tracking-[.1em] text-[#a3253f] sm:block">MVP</span>
        </div>

        <div className="showcase-stage relative aspect-[16/10] touch-pan-y overflow-hidden bg-[#e8e8eb]" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { swipeStart.current = null; }}>
          {slides.map((slide, i) => (
            <div
              key={`${slide.product}-${slide.title}`}
              id={`showcase-slide-${i}`}
              role="tabpanel"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${slides.length} : ${slide.product}, ${slide.title}`}
              aria-hidden={i !== index}
              className={`showcase-slide ${i === index ? 'is-active' : ''}`}
            >
              {slide.image
                ? <img src={slide.image} alt={`${slide.product} — ${slide.title}`} className="h-full w-full object-cover object-top" loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
                : <PlaceholderScreen slide={slide} />}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-[#6d1a2b]/10 bg-[#f8f8fb] px-3 py-2.5 sm:px-4">
          <button type="button" onClick={() => goTo(index - 1)} className="showcase-icon-btn" aria-label="Capture précédente"><ChevronLeft size={15} /></button>
          <div role="tablist" aria-label="Choisir une capture" className="flex min-w-0 flex-1 gap-1.5 sm:gap-2">
            {slides.map((slide, i) => (
              <button
                key={i}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-controls={`showcase-slide-${i}`}
                tabIndex={i === index ? 0 : -1}
                onClick={() => goTo(i)}
                onKeyDown={onTabKeyDown}
                className={`showcase-tab ${i === index ? 'is-active' : ''}`}
                data-testid={`button-showcase-${i}`}
              >
                <span className="showcase-tab-label">{slide.product}<span className="hidden lg:inline"> · {slide.title}</span></span>
                <span className="showcase-track" aria-hidden="true">
                  {i === index && autoplay
                    ? <span key={index} className="showcase-progress" style={{ animationDuration: `${SLIDE_DURATION}ms`, animationPlayState: running ? 'running' : 'paused' }} onAnimationEnd={() => goTo(index + 1)} />
                    : <span className={`block h-full bg-[#6d1a2b] ${i === index ? 'w-full' : 'w-0'}`} />}
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => goTo(index + 1)} className="showcase-icon-btn" aria-label="Capture suivante"><ChevronRight size={15} /></button>
          {!reducedMotion && (
            <button type="button" onClick={() => setUserPaused((v) => !v)} className="showcase-icon-btn" aria-label={userPaused ? 'Reprendre le défilement' : 'Mettre en pause le défilement'} data-testid="button-showcase-toggle">
              {userPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 min-h-[3.4em] text-[13px] leading-[1.7] text-[#626265]" aria-live={running ? 'off' : 'polite'}>
        <span className="font-mono text-[9px] font-bold tracking-[.13em] text-[#a3253f]">{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <span className="mx-2 text-[#c7c7ca]">—</span>
        <strong className="font-semibold text-[#2b2b30]">{current.product}</strong> : {current.caption}
      </p>
    </div>
  );
}
