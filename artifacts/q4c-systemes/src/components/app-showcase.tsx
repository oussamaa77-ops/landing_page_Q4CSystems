import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

type Layout = 'document' | 'ocr' | 'bilingual' | 'dashboard' | 'workspace' | 'entries' | 'chart' | 'ratios' | 'report';

type Frame = { title: string; caption: string; layout: Layout };

type ShowcaseApp = {
  product: string;
  initial: string;
  label: string;
  // Files placed in /public/screenshots. The frame at the same position uses images[i];
  // a missing or unreadable file falls back to the placeholder screen of that frame.
  images: string[];
  frames: Frame[];
};

const apps: ShowcaseApp[] = [
  {
    product: 'Lexpia-Pro',
    initial: 'L',
    label: 'Traitement intelligent & OCR',
    images: ['/screenshots/lexpia-1.png', '/screenshots/lexpia-2.png', '/screenshots/lexpia-3.png'],
    frames: [
      { title: 'Document brut', caption: 'La facture ou la pièce comptable telle qu’elle est importée.', layout: 'document' },
      { title: 'Reconnaissance OCR', caption: 'Lecture automatique et extraction des données clés de la pièce.', layout: 'ocr' },
      { title: 'Transcription & validation', caption: 'Transcription bilingue arabe / français, puis validation avant saisie.', layout: 'bilingual' },
    ],
  },
  {
    product: 'HisabPro',
    initial: 'H',
    label: 'Gestion & pilotage',
    images: ['/screenshots/hisab-1.png', '/screenshots/hisab-2.png', '/screenshots/hisab-3.png'],
    frames: [
      { title: 'Tableau de bord', caption: 'Vue d’ensemble et suivi de l’avancement des dossiers.', layout: 'dashboard' },
      { title: 'Espace de travail', caption: 'L’espace comptable où s’organisent pièces, tâches et échéances.', layout: 'workspace' },
      { title: 'Écritures & états', caption: 'Liste des écritures et états comptables, filtrables par dossier.', layout: 'entries' },
    ],
  },
  {
    product: 'Mizane',
    initial: 'M',
    label: 'Analyse & audit',
    images: ['/screenshots/mizane-1.png', '/screenshots/mizane-2.png', '/screenshots/mizane-3.png'],
    frames: [
      { title: 'Lecture financière', caption: 'Indicateurs clés pour une première lecture des comptes.', layout: 'chart' },
      { title: 'Répartition & ratios', caption: 'Graphiques de répartition et ratios pour la revue analytique.', layout: 'ratios' },
      { title: 'Rapport de synthèse', caption: 'Génération d’un rapport structuré, prêt à être restitué.', layout: 'report' },
    ],
  },
];

const FRAME_DURATION = 4500;

// Every frame of every app, in play order: the loop runs through an app's frames, then moves on to the next app.
type Slot = { app: number; frame: number; title: string; caption: string; layout: Layout; image?: string };
const slots: Slot[] = apps.flatMap((app, a) =>
  Array.from({ length: Math.max(app.frames.length, app.images.length) }, (_, f) => ({
    app: a,
    frame: f,
    title: app.frames[f]?.title ?? `Vue ${f + 1}`,
    caption: app.frames[f]?.caption ?? '',
    layout: app.frames[f]?.layout ?? app.frames[app.frames.length - 1].layout,
    image: app.images[f],
  })),
);

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

const tiny = 'font-mono text-[clamp(5px,.8vw,7px)] text-[#8d8d90]';
const card = 'border border-[#6d1a2b]/10 bg-white';
const bar = (w: number, tone = 'bg-[#dddde0]', h = 'h-[4px]') => <span className={`block ${h} ${tone}`} style={{ width: `${w}%` }} />;

function PlaceholderBody({ layout }: { layout: Layout }) {
  switch (layout) {
    case 'document':
      return (
        <div className={`mx-auto h-full w-[58%] ${card} p-[5%] shadow-[0_8px_24px_rgba(30,30,35,.06)]`}>
          <div className="flex justify-between"><span className="w-[40%] space-y-1.5">{bar(90, 'bg-[#2b2b30]/60', 'h-[5px]')}{bar(60)}</span><span className="w-[30%] space-y-1.5 text-right" dir="rtl">{bar(100, 'bg-[#6d1a2b]/40')}{bar(70)}</span></div>
          <div className="mt-[10%] space-y-[4%]">{[95, 80, 88, 70, 92].map((w, i) => <div key={i}>{bar(w)}</div>)}</div>
          <div className="mt-[10%] ml-auto w-[40%] space-y-1.5">{bar(100)}{bar(100, 'bg-[#6d1a2b]/45', 'h-[5px]')}</div>
        </div>
      );
    case 'ocr':
      return (
        <div className="grid h-full grid-cols-2 gap-[4%]">
          <div className={`relative overflow-hidden ${card} p-[6%]`}>
            {[90, 55, 75, 40, 80, 65, 50].map((w, i) => <span key={i} className={`mb-[7%] block h-[4px] ${i === 1 || i === 4 ? 'outline outline-1 outline-offset-2 outline-[#a3253f]/60' : ''} bg-[#dddde0]`} style={{ width: `${w}%` }} />)}
            <span className="showcase-scan" />
          </div>
          <div className="space-y-[6%]">{['Fournisseur', 'Date', 'Montant HT', 'TVA', 'ICE'].map((f) => <div key={f} className={`${card} px-[6%] py-[4%]`}><span className={`block ${tiny}`}>{f}</span><span className="mt-1 block h-[4px] w-[60%] bg-[#6d1a2b]/35" /></div>)}</div>
        </div>
      );
    case 'bilingual':
      return (
        <div className="flex h-full flex-col gap-[4%]">
          <div className="grid flex-1 grid-cols-2 gap-[4%]">
            {['FRANÇAIS', 'العربية'].map((lang, i) => <div key={lang} className={`${card} p-[6%]`} dir={i ? 'rtl' : 'ltr'}><span className={`block ${tiny} tracking-[.1em]`}>{lang}</span><div className="mt-[8%] space-y-[8%]">{[85, 60, 75, 50].map((w, j) => <div key={j}>{bar(w, j === 0 ? 'bg-[#6d1a2b]/40' : 'bg-[#dddde0]')}</div>)}</div></div>)}
          </div>
          <div className="flex items-center justify-between border border-[#6d1a2b]/20 bg-[#f2e4e7] px-[3%] py-[2%]"><span className={tiny}>5 champs reconnus · prêts à valider</span><span className="bg-[#6d1a2b] px-[3%] py-[1%] font-mono text-[clamp(5px,.8vw,7px)] text-white">VALIDER</span></div>
        </div>
      );
    case 'dashboard':
      return (
        <div className="flex h-full flex-col gap-[4%]">
          <div className="grid grid-cols-3 gap-[3%]">{['À traiter', 'En cours', 'Clôturés'].map((l, i) => <div key={l} className={`${card} p-[6%]`}><span className={`block ${tiny}`}>{l}</span><span className="mt-2 block font-serif text-[clamp(10px,1.8vw,17px)] font-semibold text-[#6d1a2b]">{[12, 28, 46][i]}</span></div>)}</div>
          <div className={`flex-1 ${card}`}>{[0, 1, 2, 3, 4].map((r) => <div key={r} className="flex items-center gap-[4%] border-b border-[#6d1a2b]/[.07] px-[3%] py-[2.2%] last:border-0"><span className="h-[4px] w-[30%] bg-[#dddde0]" /><span className="h-[4px] w-[18%] bg-[#dddde0]" /><span className={`ml-auto h-[4px] w-[14%] ${r % 2 ? 'bg-[#a3253f]/50' : 'bg-[#6d1a2b]/35'}`} /></div>)}</div>
        </div>
      );
    case 'workspace':
      return (
        <div className="grid h-full grid-cols-3 gap-[3%]">
          {['Pièces', 'Tâches', 'Échéances'].map((col, c) => <div key={col} className="bg-[#ededf0] p-[5%]"><span className={`block ${tiny} tracking-[.1em]`}>{col.toUpperCase()}</span><div className="mt-[8%] space-y-[8%]">{Array.from({ length: 3 - (c % 2) }, (_, k) => <div key={k} className={`${card} space-y-1.5 p-[8%]`}>{bar(80)}{bar(45, c === 2 ? 'bg-[#a3253f]/50' : 'bg-[#6d1a2b]/30')}</div>)}</div></div>)}
        </div>
      );
    case 'entries':
      return (
        <div className={`h-full ${card}`}>
          <div className="grid grid-cols-[.7fr_1.6fr_.8fr_.8fr] gap-[3%] border-b border-[#6d1a2b]/10 bg-[#ededf0] px-[3%] py-[2%]">{['DATE', 'LIBELLÉ', 'DÉBIT', 'CRÉDIT'].map((h) => <span key={h} className={`${tiny} tracking-[.08em]`}>{h}</span>)}</div>
          {[0, 1, 2, 3, 4, 5].map((r) => <div key={r} className="grid grid-cols-[.7fr_1.6fr_.8fr_.8fr] items-center gap-[3%] border-b border-[#6d1a2b]/[.07] px-[3%] py-[2%] last:border-0">{bar(80)}{bar(70 - r * 6)}{r % 2 ? <span /> : bar(60, 'bg-[#6d1a2b]/35')}{r % 2 ? bar(60, 'bg-[#a3253f]/40') : <span />}</div>)}
        </div>
      );
    case 'chart':
      return (
        <div className="grid h-full grid-cols-[1.5fr_1fr] gap-[4%]">
          <div className={`flex items-end gap-[5%] ${card} p-[5%]`}>{[45, 70, 55, 85, 62, 92].map((h, i) => <span key={i} className={`flex-1 ${i % 2 ? 'bg-[#6d1a2b]/70' : 'bg-[#c7c7ca]'}`} style={{ height: `${h}%` }} />)}</div>
          <div className="space-y-[8%]">{['Marge', 'BFR', 'Liquidité'].map((k) => <div key={k} className={`${card} p-[7%]`}><span className={`block ${tiny}`}>{k}</span><span className="mt-2 block h-[4px] bg-[#e0e0e3]"><span className="block h-full w-[64%] bg-[#a3253f]/70" /></span></div>)}</div>
        </div>
      );
    case 'ratios':
      return (
        <div className="grid h-full grid-cols-2 gap-[4%]">
          <div className={`grid place-items-center ${card}`}>
            <span className="aspect-square w-[62%] rounded-full" style={{ background: 'conic-gradient(#6d1a2b 0 42%, #a3253f 42% 63%, #c7c7ca 63% 84%, #e0e0e3 84% 100%)', mask: 'radial-gradient(circle, transparent 52%, #000 53%)', WebkitMask: 'radial-gradient(circle, transparent 52%, #000 53%)' }} />
          </div>
          <div className="grid grid-cols-2 gap-[6%]">{['Autonomie', 'Rentabilité', 'Endettement', 'Rotation'].map((r, i) => <div key={r} className={`${card} p-[10%]`}><span className={`block ${tiny}`}>{r}</span><span className="mt-2 block font-serif text-[clamp(9px,1.5vw,14px)] font-semibold text-[#2b2b30]">{['0,48', '12 %', '0,31', '4,2'][i]}</span></div>)}</div>
        </div>
      );
    case 'report':
      return (
        <div className={`mx-auto h-full w-[62%] ${card} p-[5%] shadow-[0_8px_24px_rgba(30,30,35,.06)]`}>
          <span className={`block ${tiny} tracking-[.12em] !text-[#a3253f]`}>RAPPORT DE SYNTHÈSE</span>
          <span className="mt-[4%] block h-[6px] w-[55%] bg-[#2b2b30]/70" />
          {[1, 2, 3].map((s) => <div key={s} className="mt-[7%]"><span className="block h-[4px] w-[35%] bg-[#6d1a2b]/45" />{[92, 80, 86].map((w, i) => <span key={i} className="mt-[3%] block h-[3px] bg-[#e0e0e3]" style={{ width: `${w}%` }} />)}</div>)}
        </div>
      );
  }
}

function PlaceholderScreen({ app, slot }: { app: ShowcaseApp; slot: Slot }) {
  return (
    <div className="grid h-full grid-cols-[20%_1fr] bg-[#f9f9fc]">
      <div className="border-r border-[#6d1a2b]/10 bg-[#ededf0] p-[4%]">
        <span className="grid aspect-square w-[34%] place-items-center bg-[#6d1a2b] font-mono text-[clamp(7px,1.2vw,11px)] text-[#f4f4f7]">{app.initial}</span>
        <div className="mt-[18%] space-y-[10%]">
          {app.frames.map((f, i) => <span key={f.title} className={`block h-[5px] ${i === slot.frame ? 'bg-[#6d1a2b]/50' : 'bg-[#d6d6d9]'}`} style={{ width: `${[70, 85, 60, 75][i % 4]}%` }} />)}
        </div>
      </div>
      <div className="flex min-w-0 flex-col p-[3.5%]">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-serif text-[clamp(10px,1.6vw,15px)] font-semibold text-[#2b2b30]">{slot.title}</span>
          <span className="shrink-0 border border-[#a3253f]/30 px-2 py-0.5 font-mono text-[clamp(6px,.9vw,8px)] tracking-[.1em] text-[#a3253f]">CAPTURE À VENIR</span>
        </div>
        <div className="relative mt-[3%] min-h-0 flex-1"><PlaceholderBody layout={slot.layout} /></div>
      </div>
    </div>
  );
}

export function AppShowcase() {
  const [position, setPosition] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(() => new Set());
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const appTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeStart = useRef<number | null>(null);

  // Only run the loop while the showcase is on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const current = slots[position];
  const activeApp = apps[current.app];
  const appSlots = useMemo(() => slots.map((slot, i) => ({ slot, i })).filter(({ slot }) => slot.app === current.app), [current.app]);
  const autoplay = !reducedMotion && !userPaused;
  const running = autoplay && !hovered && inView;
  const hasImage = (slot: Slot) => Boolean(slot.image && !brokenImages.has(slot.image));

  function goTo(next: number) {
    setPosition((next + slots.length) % slots.length);
  }

  function goToApp(app: number) {
    const target = (app + apps.length) % apps.length;
    goTo(slots.findIndex((slot) => slot.app === target));
  }

  function markBroken(src: string) {
    setBrokenImages((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }

  function onAppTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = { ArrowRight: current.app + 1, ArrowLeft: current.app - 1, Home: 0, End: apps.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + apps.length) % apps.length;
    goToApp(next);
    appTabRefs.current[next]?.focus();
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') swipeStart.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (swipeStart.current === null) return;
    const delta = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(delta) > 40) goTo(position + (delta < 0 ? 1 : -1));
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
      <div role="tablist" aria-label="Choisir une application" className="mb-3 grid grid-cols-3 gap-1.5 sm:gap-2">
        {apps.map((app, a) => (
          <button
            key={app.product}
            ref={(el) => { appTabRefs.current[a] = el; }}
            type="button"
            role="tab"
            id={`showcase-app-${a}`}
            aria-selected={a === current.app}
            aria-controls="showcase-panel"
            tabIndex={a === current.app ? 0 : -1}
            onClick={() => goToApp(a)}
            onKeyDown={onAppTabKeyDown}
            className={`showcase-app-tab ${a === current.app ? 'is-active' : ''}`}
            data-testid={`button-showcase-app-${a}`}
          >
            <span className="block font-serif text-[13px] font-semibold tracking-[-.03em] sm:text-[15px]">{app.product}</span>
            <span className="mt-0.5 hidden truncate font-mono text-[8px] tracking-[.08em] sm:block">{app.label.toUpperCase()}</span>
          </button>
        ))}
      </div>

      <div className="preview-window showcase-window" id="showcase-panel" role="tabpanel" aria-labelledby={`showcase-app-${current.app}`}>
        <div className="preview-topbar">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#6d1a2b]" /><span className="h-2 w-2 rounded-full bg-[#c7c7ca]" /><span className="h-2 w-2 rounded-full bg-[#c7c7ca]" />
          </span>
          <span className="min-w-0 truncate font-mono text-[9px] tracking-[.08em] text-[#7b7b7e]">
            <span className="font-bold text-[#6d1a2b]">Q4C</span> · {activeApp.product} — {current.title}
          </span>
          <span className="hidden font-mono text-[8px] tracking-[.1em] text-[#a3253f] sm:block">MVP</span>
        </div>

        <div className="showcase-stage group relative aspect-[16/10] touch-pan-y overflow-hidden bg-[#e8e8eb]" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { swipeStart.current = null; }}>
          {slots.map((slot, i) => (
            <div
              key={`${slot.app}-${slot.frame}`}
              aria-roledescription="diapositive"
              aria-label={`${apps[slot.app].product}, vue ${slot.frame + 1} : ${slot.title}`}
              aria-hidden={i !== position}
              className={`showcase-slide ${i === position ? 'is-active' : ''}`}
            >
              {hasImage(slot)
                ? <img src={slot.image} alt={`${apps[slot.app].product} — ${slot.title}`} className="h-full w-full object-cover object-top" draggable={false} onError={() => markBroken(slot.image!)} />
                : <PlaceholderScreen app={apps[slot.app]} slot={slot} />}
            </div>
          ))}
          <button type="button" onClick={() => goTo(position - 1)} className="showcase-arrow left-2 sm:left-3" aria-label="Vue précédente"><ChevronLeft size={16} /></button>
          <button type="button" onClick={() => goTo(position + 1)} className="showcase-arrow right-2 sm:right-3" aria-label="Vue suivante"><ChevronRight size={16} /></button>
        </div>

        <div className="flex items-stretch gap-2 border-t border-[#6d1a2b]/10 bg-[#f8f8fb] p-2 sm:gap-3 sm:p-3">
          <div className="grid min-w-0 flex-1 gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${appSlots.length}, minmax(0, 1fr))` }}>
            {appSlots.map(({ slot, i }) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Vue ${slot.frame + 1} : ${slot.title}`}
                aria-current={i === position ? 'true' : undefined}
                className={`showcase-thumb ${i === position ? 'is-active' : ''}`}
                data-testid={`button-showcase-frame-${slot.frame}`}
              >
                <span className="showcase-thumb-media">
                  {hasImage(slot)
                    ? <img src={slot.image} alt="" className="h-full w-full object-cover object-top" draggable={false} onError={() => markBroken(slot.image!)} />
                    : <span className="grid h-full w-full place-items-center font-mono text-[10px] font-bold text-[#6d1a2b]/60">{String(slot.frame + 1).padStart(2, '0')}</span>}
                </span>
                <span className="showcase-thumb-label">{slot.title}</span>
                <span className="showcase-track" aria-hidden="true">
                  {i === position && autoplay
                    ? <span key={position} className="showcase-progress" style={{ animationDuration: `${FRAME_DURATION}ms`, animationPlayState: running ? 'running' : 'paused' }} onAnimationEnd={() => goTo(position + 1)} />
                    : <span className={`block h-full bg-[#6d1a2b] ${i < position ? 'w-full opacity-35' : i === position ? 'w-full' : 'w-0'}`} />}
                </span>
              </button>
            ))}
          </div>
          {!reducedMotion && (
            <button type="button" onClick={() => setUserPaused((v) => !v)} className="showcase-icon-btn self-center" aria-label={userPaused ? 'Reprendre le défilement' : 'Mettre en pause le défilement'} data-testid="button-showcase-toggle">
              {userPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 min-h-[3.4em] text-[13px] leading-[1.7] text-[#626265]" aria-live={running ? 'off' : 'polite'}>
        <span className="font-mono text-[9px] font-bold tracking-[.13em] text-[#a3253f]">{activeApp.product.toUpperCase()} · {String(current.frame + 1).padStart(2, '0')} / {String(appSlots.length).padStart(2, '0')}</span>
        <span className="mx-2 text-[#c7c7ca]">—</span>
        <strong className="font-semibold text-[#2b2b30]">{current.title}</strong>{current.caption && <> : {current.caption}</>}
      </p>
    </div>
  );
}
