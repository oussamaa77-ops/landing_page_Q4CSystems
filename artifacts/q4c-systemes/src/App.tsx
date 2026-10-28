import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, Clock, FileCheck2, FileText, Fingerprint, Landmark, Languages, LayoutDashboard, Link2, ListChecks, LockKeyhole, Menu, MessageSquare, Receipt, ScanLine, SearchCheck, ShieldCheck, Sparkles, Target, TrendingUp, Users, Wallet, Workflow, X } from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSubmitContactRequest, type ContactRequestInputInterest } from '@workspace/api-client-react';
import { AppShowcase } from "@/components/app-showcase";
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const products = [
  {
    number: '01',
    name: 'Lexpia-Pro',
    label: 'TRAITEMENT INTELLIGENT',
    icon: ScanLine,
    description: 'Solution d’IA et d’OCR bilingue arabe/français pour automatiser la saisie et le traitement des pièces comptables.',
    detail: 'De la pièce comptable à une saisie plus fluide.',
    tone: 'sand',
  },
  {
    number: '02',
    name: 'Clarity',
    label: 'GESTION & PILOTAGE',
    icon: Workflow,
    description: 'Plateforme de gestion et de pilotage comptable pour fluidifier l’organisation des cabinets et entreprises.',
    detail: 'Une organisation comptable plus lisible au quotidien.',
    tone: 'green',
  },
  {
    number: '03',
    name: 'Mizane',
    label: 'ANALYSE & AUDIT',
    icon: FileText,
    description: 'Outil d’analyse financière, d’audit et de génération de rapports de synthèse.',
    detail: 'Des chiffres mieux éclairés, des synthèses plus claires.',
    tone: 'clay',
  },
];

// The hero cards link to these blocks by id.
const domains = [
  {
    id: 'comptabilite',
    number: '01',
    label: 'AUTOMATISATION',
    name: 'Comptabilité',
    icon: ScanLine,
    pitch: 'Automatiser la saisie et la tenue comptable, de la pièce reçue jusqu’aux états.',
    features: [
      { title: 'Saisie OCR des pièces', text: 'Lecture automatique des factures et pièces, en arabe comme en français.', icon: ScanLine },
      { title: 'Facture électronique', text: 'Émission et suivi des factures au format électronique.', icon: FileCheck2 },
      { title: 'Journal & grand livre', text: 'Écritures, mouvements et soldes consultables compte par compte.', icon: BookOpen },
      { title: 'Lettrage', text: 'Rapprochement des factures et des règlements pour chaque tiers.', icon: Link2 },
      { title: 'Rapprochement bancaire', text: 'Pointage des relevés bancaires avec les écritures de banque.', icon: Landmark },
      { title: 'TVA', text: 'Préparation des éléments de la déclaration de TVA.', icon: Receipt },
    ],
  },
  {
    id: 'finance',
    number: '02',
    label: 'PILOTAGE',
    name: 'Finance',
    icon: TrendingUp,
    pitch: 'Suivre l’activité, la trésorerie et les encours clients pour décider plus vite.',
    features: [
      { title: 'Tableaux de bord', text: 'Les indicateurs clés de l’activité, en un coup d’œil.', icon: LayoutDashboard },
      { title: 'Reporting clients & fournisseurs', text: 'Facturation, règlements et encours, tiers par tiers.', icon: Users },
      { title: 'Balance âgée & relances', text: 'Créances classées par ancienneté et priorités de recouvrement.', icon: Clock },
      { title: 'Trésorerie', text: 'Suivi des encaissements, des décaissements et des soldes.', icon: Wallet },
      { title: 'Budget vs réalisé', text: 'Comparaison des réalisations avec les prévisions.', icon: Target },
    ],
  },
  {
    id: 'audit',
    number: '03',
    label: 'CONTRÔLE',
    name: 'Audit',
    icon: ShieldCheck,
    pitch: 'Contrôler les comptes, détecter les anomalies et restituer des constats clairs.',
    features: [
      { title: 'Revue analytique', text: 'Lecture des comptes et des variations significatives.', icon: SearchCheck },
      { title: 'Contrôles automatiques', text: 'Règles comptables et fiscales appliquées à l’ensemble du journal.', icon: ListChecks },
      { title: 'Détection d’anomalies par IA', text: 'Anomalies expliquées et rattachées à leur pièce source.', icon: Sparkles },
      { title: 'Rapports de synthèse', text: 'Rapports structurés, exportables en PDF ou en Word.', icon: FileText },
      { title: 'Assistant documentaire IA', text: 'Des réponses fondées sur les documents du dossier.', icon: MessageSquare },
    ],
  },
];

function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const contactRequestMutation = useSubmitContactRequest();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const interest = String(formData.get('interest') ?? '');

    try {
      await contactRequestMutation.mutateAsync({
        data: {
          name: String(formData.get('name') ?? '').trim(),
          email: String(formData.get('email') ?? '').trim(),
          organization: String(formData.get('organization') ?? '').trim(),
          ...(interest ? { interest: interest as ContactRequestInputInterest } : {}),
          message: String(formData.get('message') ?? '').trim(),
          website: String(formData.get('website') ?? '').trim(),
        },
      });
      setSubmitted(true);
    } catch {
      // React Query keeps the form data available so the visitor can retry.
    }
  }

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <div className="q4c-page">
      <header className="absolute inset-x-0 top-0 z-20 border-b border-[#6d1a2b]/10">
        <div className="q4c-container flex h-[78px] items-center justify-between">
          <a href="#accueil" aria-label="Q4C Systèmes, accueil" className="flex items-center gap-3">
            <span className="grid h-[36px] min-w-[44px] place-items-center border border-[#6d1a2b]/25 px-1 text-[#6d1a2b]">
              <span className="font-serif text-[13px] font-extrabold tracking-[-.08em]">Q4C</span>
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-[15px] font-extrabold tracking-[-.04em] text-[#2b2b30]">Q4C Systèmes</span>
              <span className="block text-[8px] font-bold tracking-[.18em] text-[#737376]">COMPTA · FINANCE · AUDIT</span>
            </span>
          </a>
          <nav aria-label="Navigation principale" className="hidden items-center gap-9 md:flex">
            <a className="nav-link" href="#solutions">Solutions</a>
            <a className="nav-link" href="#demo">Démo</a>
            <a className="nav-link" href="#approche">Notre approche</a>
            <a className="nav-link" href="#recherche">À propos</a>
          </nav>
          <a className="button-main hidden min-h-[42px] px-4 text-[11px] md:inline-flex" href="#contact" data-testid="link-demo-header">
            Demander une démo <ArrowUpRight size={14} />
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center text-[#2b2b30] md:hidden"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {mobileOpen && (
          <nav aria-label="Navigation mobile" className="border-t border-[#6d1a2b]/10 bg-[#f4f4f7] px-5 py-5 md:hidden">
            <div className="mx-auto flex max-w-[560px] flex-col gap-5">
              <a className="nav-link" href="#solutions" onClick={closeMenu}>Solutions</a>
              <a className="nav-link" href="#demo" onClick={closeMenu}>Démo</a>
              <a className="nav-link" href="#approche" onClick={closeMenu}>Notre approche</a>
              <a className="nav-link" href="#recherche" onClick={closeMenu}>À propos</a>
              <a className="button-main mt-1 w-full" href="#contact" onClick={closeMenu} data-testid="link-demo-mobile">Demander une démo <ArrowUpRight size={15} /></a>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="accueil" className="hero-grid relative min-h-[760px] overflow-hidden bg-[#efeff2] pt-[78px] md:min-h-[790px]">
          <div className="q4c-container relative grid min-h-[680px] items-center gap-10 py-16 md:grid-cols-[1.02fr_.98fr] md:py-20">
            <div className="relative z-10 max-w-[590px]">
              <div className="eyebrow reveal">ÉCOSYSTÈME FINANCIER · MAROC</div>
              <h1 className="reveal reveal-2 mt-7 font-serif text-[clamp(3.2rem,7vw,6.45rem)] font-semibold leading-[.98] tracking-[-.075em] text-[#2b2b30]">
                Le chiffre,<br />
                <span className="text-[#a3253f]">en mouvement.</span>
              </h1>
              <p className="reveal reveal-3 mt-7 max-w-[530px] text-[15px] leading-[1.8] text-[#5e5e61] md:text-[16px]">
                <strong className="font-semibold text-[#2b2b30]">Q4C Systèmes</strong> automatise et fluidifie les processus comptables, financiers et d’audit des cabinets et des entreprises au Maroc. Grâce à l’<strong className="font-semibold text-[#2b2b30]">intelligence artificielle</strong> et à l’<strong className="font-semibold text-[#2b2b30]">OCR</strong> adaptés au contexte réglementaire marocain, nous réduisons la saisie et les tâches répétitives pour libérer du temps dédié à l’analyse, au conseil stratégique et à la <strong className="font-semibold text-[#6d1a2b]">conformité</strong>.
              </p>
              <a href="#contact" className="efacture-alert reveal reveal-3 mt-6 flex max-w-[530px] items-center gap-3 border border-[#a3253f]/30 border-l-[3px] border-l-[#6d1a2b] bg-[#f4f4f7]/80 px-4 py-3" data-testid="link-efacture-hero">
                <span className="efacture-pulse relative grid h-2.5 w-2.5 shrink-0 place-items-center"><span className="h-2 w-2 rounded-full bg-[#a3253f]" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[9px] font-bold tracking-[.13em] text-[#a3253f]">ACTUALITÉ · MAROC</span>
                  <span className="mt-0.5 block text-[13px] font-semibold leading-snug text-[#2b2b30]">Facture électronique : préparez dès maintenant vos flux de facturation.</span>
                </span>
                <ArrowRight size={15} className="efacture-arrow shrink-0 text-[#6d1a2b]" />
              </a>
              <div className="reveal reveal-3 mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a className="button-main" href="#contact" data-testid="link-demo-hero">Demander une démo <ArrowRight size={16} /></a>
                <a className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#505056] transition-colors hover:text-[#a3253f]" href="#solutions" data-testid="link-explore-solutions">
                  Découvrir les solutions <ArrowDown size={14} />
                </a>
              </div>
              <div className="mt-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#757578]">
                <span className="h-px w-8 bg-[#a3253f]" /> Trois expertises. Un même cap.
              </div>
            </div>

            <div className="relative mx-auto grid w-full max-w-[535px] gap-3 md:block md:h-[530px]" aria-label="Nos trois domaines : comptabilité, finance, audit" role="group">
              <div className="absolute inset-[7%] hidden rounded-full border border-[#6d1a2b]/15 md:block" />
              <div className="absolute inset-[16%] hidden rounded-full border border-dashed border-[#a3253f]/30 md:block" />
              <div className="hero-orbit absolute inset-[7%] hidden rounded-full border border-transparent border-t-[#a3253f]/55 md:block">
                <span className="absolute left-[13%] top-[7%] h-2 w-2 rounded-full bg-[#a3253f]" />
              </div>
              <div className="absolute left-1/2 top-1/2 hidden h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#6d1a2b]/15 bg-[#f4f4f7]/70 shadow-[0_25px_80px_rgba(30,30,35,.08)] md:grid">
                <div className="absolute inset-[17px] rounded-full border border-[#6d1a2b]/10" />
                <div className="relative text-center">
                  <div className="mx-auto mb-3 grid h-12 min-w-[56px] w-fit px-2 place-items-center bg-[#6d1a2b] text-[#f4f4f7]"><span className="font-serif text-[15px] font-bold tracking-[-.08em]">Q4C</span></div>
                  <span className="block text-[9px] font-bold uppercase tracking-[.19em] text-[#7c7c7f]">Automatiser</span>
                  <span className="mt-1 block font-serif text-[18px] font-semibold tracking-[-.04em] text-[#2b2b30]">le chiffre</span>
                </div>
              </div>
              <a href="#comptabilite" className="hero-float hero-card hero-card-link relative block md:absolute md:left-0 md:top-[9%] md:w-[205px]" aria-label="Comptabilité — voir les fonctionnalités" data-testid="link-hero-comptabilite">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center bg-[#dedee1] text-[#6d1a2b]"><ScanLine size={15} /></span>
                  <span className="font-mono text-[9px] text-[#a3253f]">01 / AUTOMATISATION</span>
                </div>
                <p className="mt-3 font-serif text-[17px] font-semibold text-[#2b2b30]">Comptabilité</p>
                <ul className="mt-2 flex flex-wrap gap-1">{['Saisie OCR', 'Lettrage', 'Rapprochement', 'TVA'].map((op) => <li key={op} className="hero-chip">{op}</li>)}</ul>
                <div className="relative mt-3 h-7 overflow-hidden border border-[#6d1a2b]/10 bg-[#fcfcff] px-2 py-[7px]">
                  <span className="doc-line w-[72%]" /><span className="doc-line mt-1.5 w-[46%]" />
                  <span className="hero-scan absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-[#d9a0ab]/50 to-transparent" />
                </div>
                <span className="mt-3 flex items-center gap-1.5 border border-[#6d1a2b]/20 bg-[#f2e4e7] px-2 py-1 font-mono text-[8px] font-bold tracking-[.04em] text-[#6d1a2b]"><FileCheck2 size={11} className="shrink-0" />PRÊT · FACTURE ÉLECTRONIQUE</span>
                <span className="hero-card-cta">Voir les fonctionnalités <ArrowRight size={11} /></span>
              </a>
              <a href="#finance" className="hero-float-delay hero-card hero-card-link relative block md:absolute md:right-[-2%] md:top-[31%] md:w-[200px]" aria-label="Finance — voir les fonctionnalités" data-testid="link-hero-finance">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center bg-[#e1e1e4] text-[#6d1a2b]"><TrendingUp size={15} /></span>
                  <span className="font-mono text-[9px] text-[#a3253f]">02 / PILOTAGE</span>
                </div>
                <p className="mt-3 font-serif text-[17px] font-semibold text-[#2b2b30]">Finance</p>
                <ul className="mt-2 flex flex-wrap gap-1">{['Reporting', 'Trésorerie', 'Budget vs réalisé'].map((op) => <li key={op} className="hero-chip">{op}</li>)}</ul>
                <div className="mt-3 flex h-7 items-end gap-1">
                  {['#c7c7ca', '#9e9ea1', '#d9a0ab', '#6d1a2b', '#9e9ea1', '#6d1a2b'].map((color, i) => <span key={i} className="hero-bar h-full w-3" style={{ backgroundColor: color, animationDelay: `${i * 0.25}s` }} />)}
                </div>
                <span className="hero-card-cta">Voir les fonctionnalités <ArrowRight size={11} /></span>
              </a>
              <a href="#audit" className="hero-float hero-card hero-card-link relative block md:absolute md:bottom-[4%] md:left-[20%] md:w-[210px]" aria-label="Audit — voir les fonctionnalités" data-testid="link-hero-audit">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center bg-[#efdfe3] text-[#a3253f]"><ShieldCheck size={15} /></span>
                  <span className="font-mono text-[9px] text-[#a3253f]">03 / CONTRÔLE</span>
                </div>
                <p className="mt-3 font-serif text-[17px] font-semibold text-[#2b2b30]">Audit</p>
                <ul className="mt-2 flex flex-wrap gap-1">{['Revue analytique', 'Anomalies', 'Rapports de synthèse'].map((op) => <li key={op} className="hero-chip">{op}</li>)}</ul>
                <div className="mt-3 flex h-7 items-center gap-2">
                  {[0, 1, 2].map((i) => <span key={i} className="flex flex-1 items-center gap-1.5"><span className="hero-check grid h-3.5 w-3.5 shrink-0 place-items-center border border-[#a3253f]/60 text-[#a3253f]" style={{ animationDelay: `${i * 0.6}s` }}><Check size={9} strokeWidth={3} /></span><span className="h-[3px] flex-1 bg-[#dddde0]" /></span>)}
                </div>
                <span className="hero-card-cta">Voir les fonctionnalités <ArrowRight size={11} /></span>
              </a>
              <span className="absolute right-[15%] top-[3%] hidden font-mono text-[9px] tracking-[.12em] text-[#7d7d80] md:block">MAROC · SECTEUR DU CHIFFRE</span>
              <span className="absolute bottom-[-2%] right-[3%] hidden font-mono text-[9px] tracking-[.12em] text-[#7d7d80] md:block">COMPTA / FINANCE / AUDIT</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#6d1a2b]/15" />
        </section>

        <section id="solutions" className="bg-[#f4f4f7] py-24 md:py-32">
          <div className="q4c-container">
            <div className="grid gap-8 md:grid-cols-[.75fr_1.25fr] md:items-end">
              <div>
                <div className="eyebrow">UN ÉCOSYSTÈME, TROIS EXPERTISES</div>
                <h2 className="section-heading mt-5 max-w-[380px]">Du document<br />à la <em>décision.</em></h2>
              </div>
              <div className="max-w-[540px] md:justify-self-end">
                <p className="text-[15px] leading-[1.8] text-[#6a6a6d]">Chaque solution répond à un temps fort du travail comptable. Ensemble, elles accompagnent le traitement, le pilotage et l’analyse.</p>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[.12em] text-[#8f4a58]">Trois solutions opérationnelles</p>
              </div>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {products.map(({ number, name, label, icon: Icon, description, detail, tone }) => (
                <article key={name} className={`product-card relative flex min-h-[340px] flex-col border border-[#6d1a2b]/15 p-7 ${tone === 'green' ? 'bg-[#eaeaed]' : tone === 'clay' ? 'bg-[#f1e6e8]' : 'bg-[#ebebee]'}`} data-testid={`card-product-${number}`}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-[.13em] text-[#a3253f]">{number} / 03</span>
                    <span className="product-arrow text-[#5e5e61]"><ArrowUpRight size={18} /></span>
                  </div>
                  <div className="mt-9 grid h-12 w-12 place-items-center border border-[#6d1a2b]/20 text-[#6d1a2b]"><Icon size={20} strokeWidth={1.5} /></div>
                  <p className="mt-6 font-mono text-[9px] font-bold tracking-[.13em] text-[#a3253f]">{label}</p>
                  <h3 className="mt-2 font-serif text-[26px] font-semibold tracking-[-.045em] text-[#2b2b30]">{name}</h3>
                  <p className="mt-3 text-[13px] leading-[1.75] text-[#626265]">{description}</p>
                  <div className="mt-auto border-t border-[#6d1a2b]/15 pt-5">
                    <p className="text-[11px] font-semibold text-[#4a4a50]">{detail}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-[#6d1a2b]/15 pt-7 sm:flex-row sm:items-center">
              <p className="text-[12px] text-[#737376]">Un fil conducteur : moins de friction dans le travail du chiffre.</p>
              <a href="#contact" className="inline-flex items-center gap-2 text-[12px] font-bold text-[#6d1a2b] transition-colors hover:text-[#a3253f]" data-testid="link-demo-products">Parler de vos besoins <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>

        <section id="apercus" className="relative overflow-hidden bg-[#e9e9ec] py-24 md:py-32" aria-labelledby="domains-heading">
          <div className="q4c-container">
            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
              <div>
                <div className="eyebrow">NOS CHANTIERS · PAR DOMAINE</div>
                <h2 id="domains-heading" className="section-heading mt-5 max-w-[440px]">Les fonctionnalités,<br />par <em>domaine.</em></h2>
              </div>
              <p className="max-w-[520px] text-[14px] leading-[1.85] text-[#6a6a6d] md:justify-self-end">
                Comptabilité, finance, audit : les principaux ateliers que nous développons pour automatiser le travail du chiffre, de la pièce reçue au rapport final.
              </p>
            </div>

            <div className="mt-12 space-y-7 md:mt-16">
              {domains.map(({ id, number, label, name, icon: Icon, pitch, features }) => (
                <article key={id} id={id} className="domain-case grid overflow-hidden border border-[#6d1a2b]/15 bg-[#f4f4f7] lg:grid-cols-[.62fr_1.38fr]" aria-labelledby={`domain-${id}-title`} data-testid={`card-domain-${id}`}>
                  <div className="flex flex-col border-b border-[#6d1a2b]/10 p-6 md:p-9 lg:border-b-0 lg:border-r lg:p-10">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-[.14em] text-[#a3253f]">{number} / {label}</span>
                      <span className="grid h-10 w-10 place-items-center border border-[#6d1a2b]/20 text-[#6d1a2b]"><Icon size={18} strokeWidth={1.5} /></span>
                    </div>
                    <h3 id={`domain-${id}-title`} className="mt-6 font-serif text-[32px] font-semibold tracking-[-.045em] text-[#2b2b30]">{name}</h3>
                    <p className="mt-3 max-w-[340px] text-[13px] leading-[1.8] text-[#68686b]">{pitch}</p>
                    <a href="#demo" className="mt-6 inline-flex w-fit items-center gap-2 text-[11px] font-bold text-[#6d1a2b] transition-colors hover:text-[#a3253f] lg:mt-auto lg:pt-8" data-testid={`link-domain-demo-${id}`}>Voir en démo <ArrowRight size={14} /></a>
                  </div>
                  <ul className="grid gap-px bg-[#6d1a2b]/10 sm:grid-cols-2 xl:grid-cols-3">
                    {features.map(({ title, text, icon: FeatureIcon }) => (
                      <li key={title} className="domain-feature bg-[#f9f9fc] p-5 md:p-6">
                        <span className="grid h-8 w-8 place-items-center bg-[#f2e4e7] text-[#6d1a2b]"><FeatureIcon size={15} strokeWidth={1.75} /></span>
                        <p className="mt-4 text-[14px] font-semibold tracking-[-.01em] text-[#2b2b30]">{title}</p>
                        <p className="mt-1.5 text-[12px] leading-[1.7] text-[#6a6a6d]">{text}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="relative overflow-hidden bg-[#f4f4f7] py-24 md:py-32" aria-labelledby="demo-heading">
          <div className="q4c-container grid items-center gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <div className="eyebrow">DÉMONSTRATION · MVP</div>
              <h2 id="demo-heading" className="section-heading mt-5 max-w-[400px]">Nos applications,<br /><em>en action.</em></h2>
              <p className="mt-6 max-w-[400px] text-[14px] leading-[1.85] text-[#6a6a6d]">Un aperçu des écrans de Lexpia-Pro, Clarity et Mizane : de la lecture d’une pièce au rapport de synthèse, en passant par le suivi des dossiers.</p>
              <ul className="mt-7 space-y-2.5 text-[12px] text-[#4a4a50]">
                {['Défilement automatique, pause au survol', 'Navigation par onglets, flèches ou glissement', 'Interfaces issues de nos MVP'].map((item) => <li key={item} className="flex items-center gap-3"><span className="h-px w-5 bg-[#a3253f]" />{item}</li>)}
              </ul>
              <a className="button-main mt-9" href="#contact" data-testid="link-demo-showcase">Demander une démo complète <ArrowRight size={16} /></a>
            </div>
            <AppShowcase />
          </div>
        </section>

        <section id="approche"className="relative bg-[#2b2b30] py-24 text-[#f4f4f7] md:py-32">
          <div className="absolute right-[-100px] top-[-90px] h-[370px] w-[370px] rounded-full border border-[#f4f4f7]/10" />
          <div className="absolute right-[-28px] top-[-18px] h-[220px] w-[220px] rounded-full border border-dashed border-[#d9a0ab]/30" />
          <div className="q4c-container relative">
            <div className="grid gap-12 md:grid-cols-[.95fr_1.05fr] md:items-end">
              <div>
                <div className="eyebrow !text-[#d9a0ab]">POURQUOI Q4C SYSTÈMES</div>
                <h2 className="section-heading mt-5 max-w-[490px] !text-[#f4f4f7]">L’expertise du chiffre.<br /><em className="!text-[#d9a0ab]">La fluidité en plus.</em></h2>
              </div>
              <p className="max-w-[470px] text-[15px] leading-[1.85] text-[#cfcfd2] md:justify-self-end">Nous pensons les outils à partir des réalités de celles et ceux qui produisent, contrôlent et interprètent les chiffres.</p>
            </div>
            <div className="mt-16 grid gap-x-12 md:grid-cols-2">
              <article className="border-t border-[#f4f4f7]/20 py-7">
                <span className="font-mono text-[10px] text-[#d9a0ab]">01 — TEMPS RETROUVÉ</span>
                <div className="mt-5 flex items-start gap-5">
                  <span className="font-serif text-[clamp(3.8rem,7vw,6.3rem)] font-semibold leading-[.85] tracking-[-.08em] text-[#f2e4e7]" data-testid="text-productivity-stat">70<span className="text-[.54em]">%</span></span>
                  <div className="pt-2">
                    <h3 className="font-serif text-[19px] font-semibold tracking-[-.03em]">de gain de productivité annoncé</h3>
                    <p className="mt-2 max-w-[330px] text-[12px] leading-[1.7] text-[#c5c5c8]">L’automatisation du répétitif libère de l’espace pour le travail d’expertise.</p>
                  </div>
                </div>
              </article>
              <article className="border-t border-[#f4f4f7]/20 py-7">
                <span className="font-mono text-[10px] text-[#d9a0ab]">02 — ANCRAGE LOCAL</span>
                <div className="mt-5 flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-[#f4f4f7]/20 text-[#d9a0ab]"><Languages size={20} strokeWidth={1.5} /></span>
                  <div>
                    <h3 className="font-serif text-[19px] font-semibold tracking-[-.03em]">Pensé pour les exigences locales</h3>
                    <p className="mt-2 max-w-[330px] text-[12px] leading-[1.7] text-[#c5c5c8]">Une suite conçue pour les exigences et les usages du secteur du chiffre au Maroc, avec une approche bilingue arabe/français pour Lexpia-Pro.</p>
                  </div>
                </div>
              </article>
              <article className="border-t border-[#f4f4f7]/20 py-7">
                <span className="font-mono text-[10px] text-[#d9a0ab]">03 — CONFIANCE</span>
                <div className="mt-5 flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-[#f4f4f7]/20 text-[#d9a0ab]"><ShieldCheck size={20} strokeWidth={1.5} /></span>
                  <div>
                    <h3 className="font-serif text-[19px] font-semibold tracking-[-.03em]">La sécurité comme priorité</h3>
                    <p className="mt-2 max-w-[330px] text-[12px] leading-[1.7] text-[#c5c5c8]">Les données financières méritent une attention exigeante, avec une volonté de souveraineté au cœur de notre approche.</p>
                  </div>
                </div>
              </article>
              <article className="border-t border-[#f4f4f7]/20 py-7">
                <span className="font-mono text-[10px] text-[#d9a0ab]">04 — LISIBILITÉ</span>
                <div className="mt-5 flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-[#f4f4f7]/20 text-[#d9a0ab]"><Sparkles size={20} strokeWidth={1.5} /></span>
                  <div>
                    <h3 className="font-serif text-[19px] font-semibold tracking-[-.03em]">Du traitement à la compréhension</h3>
                    <p className="mt-2 max-w-[330px] text-[12px] leading-[1.7] text-[#c5c5c8]">Des opérations mieux structurées, pour que les informations clés prennent leur juste place.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="recherche" className="bg-[#e9e9ec] py-24 md:py-32">
          <div className="q4c-container grid gap-12 md:grid-cols-[.85fr_1.15fr] md:items-center">
            <div className="relative min-h-[320px] overflow-hidden border border-[#6d1a2b]/15 bg-[#e0e0e3] p-8 md:min-h-[390px]">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(60,60,66,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(60,60,66,.08) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
              <div className="absolute left-[15%] top-[15%] h-[68%] w-[68%] rounded-full border border-[#6d1a2b]/20" />
              <div className="absolute left-[27%] top-[27%] h-[44%] w-[44%] rounded-full border border-dashed border-[#a3253f]/40" />
              <div className="absolute left-1/2 top-1/2 grid h-[115px] w-[115px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#6d1a2b] text-[#f4f4f7]">
                <div className="text-center"><Fingerprint className="mx-auto mb-2 text-[#d9a0ab]" size={24} strokeWidth={1.3} /><span className="font-mono text-[8px] tracking-[.12em]">Q4C / R&D</span></div>
              </div>
              <div className="absolute left-[8%] top-[12%] border border-[#6d1a2b]/20 bg-[#f4f4f7] px-3 py-2 font-mono text-[8px] tracking-[.08em] text-[#626265]">INGÉNIERIE</div>
              <div className="absolute bottom-[14%] right-[8%] border border-[#a3253f]/30 bg-[#f4f4f7] px-3 py-2 font-mono text-[8px] tracking-[.08em] text-[#a3253f]">SECTEUR DU CHIFFRE</div>
              <span className="absolute bottom-5 left-6 font-mono text-[8px] tracking-[.14em] text-[#7d7d80]">CONCEVOIR · COMPRENDRE · FAIRE ÉVOLUER</span>
            </div>
            <div className="md:pl-7">
              <div className="eyebrow">À PROPOS · RECHERCHE & DÉVELOPPEMENT</div>
              <h2 className="section-heading mt-5">Des ingénieurs<br />proches du <em>terrain.</em></h2>
              <div className="mt-7 max-w-[510px] space-y-4 text-[14px] leading-[1.85] text-[#69696c]">
                <p>Q4C Systèmes est un éditeur marocain de logiciels dédiés à la finance, à la comptabilité et à l’audit.</p>
                <p>Notre équipe d’ingénieurs passionnés par le secteur du chiffre développe des outils où l’exigence métier rencontre une expérience plus fluide.</p>
                <p>La recherche et le développement sont au cœur de cette démarche : comprendre les tâches réelles, puis concevoir des solutions qui les rendent plus simples à conduire.</p>
              </div>
              <div className="mt-8 flex items-center gap-4 border-l-2 border-[#a3253f] pl-4">
                <LockKeyhole size={17} className="shrink-0 text-[#a3253f]" />
                <p className="text-[11px] leading-[1.65] text-[#707073]">La sécurité et la souveraineté des données restent des priorités de conception.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f4f7] py-16">
          <div className="q4c-container flex flex-col items-start justify-between gap-7 border-y border-[#6d1a2b]/15 py-8 md:flex-row md:items-center">
            <div className="max-w-[660px]">
              <p className="font-mono text-[9px] font-bold tracking-[.15em] text-[#a3253f]">UNE SUITE FAITE POUR LE TRAVAIL DU CHIFFRE</p>
              <h2 className="mt-3 font-serif text-[clamp(1.65rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-.05em] text-[#2b2b30]">Faisons place à une comptabilité plus lisible.</h2>
            </div>
            <a href="#contact" className="button-main shrink-0" data-testid="link-demo-cta">Demander une démo <ArrowRight size={16} /></a>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden bg-[#2b2b30] py-24 text-[#f4f4f7] md:py-28">
          <div className="absolute -right-40 top-[-190px] h-[550px] w-[550px] rounded-full border border-[#f4f4f7]/10" />
          <div className="absolute -right-20 top-[-70px] h-[300px] w-[300px] rounded-full border border-dashed border-[#d9a0ab]/25" />
          <div className="q4c-container relative grid gap-14 md:grid-cols-[.9fr_1.1fr]">
            <div className="pt-1">
              <div className="eyebrow !text-[#d9a0ab]">ÉCHANGEONS</div>
              <h2 className="section-heading mt-5 max-w-[480px] !text-[#f4f4f7]">Voyons ce qui<br />peut <em className="!text-[#d9a0ab]">changer.</em></h2>
              <p className="mt-6 max-w-[400px] text-[14px] leading-[1.8] text-[#cfcfd2]">Vous souhaitez découvrir les solutions Q4C pour votre cabinet ou votre entreprise ? Laissez-nous quelques informations.</p>
              <div className="mt-10 flex items-center gap-3 border-t border-[#f4f4f7]/20 pt-5 text-[10px] font-mono tracking-[.08em] text-[#bbbbbe]">
                <span className="h-2 w-2 rounded-full bg-[#d9a0ab]" /> DÉMO · ÉCHANGE · DÉCOUVERTE
              </div>
            </div>
            <div className="border border-[#f4f4f7]/20 bg-[#f4f4f7]/[.035] p-6 md:p-8">
              {submitted ? (
                <div role="status" aria-live="polite" className="flex min-h-[390px] flex-col justify-center">
                  <span className="grid h-12 w-12 place-items-center border border-[#d9a0ab]/60 text-[#d9a0ab]"><Check size={21} /></span>
                  <h3 className="mt-6 font-serif text-[26px] font-semibold tracking-[-.04em]">Votre demande a bien été envoyée.</h3>
                  <p className="mt-3 max-w-[380px] text-[13px] leading-[1.75] text-[#cfcfd2]">Merci pour votre intérêt. L’équipe Q4C Systèmes reviendra vers vous au sujet de votre demande de démonstration.</p>
                  <button className="mt-7 w-fit border-b border-[#d9a0ab]/60 pb-1 text-[11px] font-semibold text-[#e8c0c8] transition-colors hover:text-white" onClick={() => setSubmitted(false)} type="button" data-testid="button-reset-contact">Envoyer une autre demande</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-2 block text-[11px] font-semibold text-[#e4e4e7]">Nom et prénom <span aria-hidden="true" className="text-[#d9a0ab]">*</span></label>
                      <input id="contact-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={120} className="form-control" placeholder="Votre nom" data-testid="input-contact-name" />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-2 block text-[11px] font-semibold text-[#e4e4e7]">Adresse e-mail <span aria-hidden="true" className="text-[#d9a0ab]">*</span></label>
                      <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} className="form-control" placeholder="nom@entreprise.ma" data-testid="input-contact-email" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label htmlFor="contact-organization" className="mb-2 block text-[11px] font-semibold text-[#e4e4e7]">Cabinet ou entreprise <span aria-hidden="true" className="text-[#d9a0ab]">*</span></label>
                    <input id="contact-organization" name="organization" type="text" autoComplete="organization" required minLength={2} maxLength={160} className="form-control" placeholder="Nom de votre organisation" data-testid="input-contact-organization" />
                  </div>
                  <div className="mt-5">
                    <label htmlFor="contact-interest" className="mb-2 block text-[11px] font-semibold text-[#e4e4e7]">Domaine qui vous intéresse</label>
                    <select id="contact-interest" name="interest" defaultValue="" className="form-control" data-testid="select-contact-interest">
                      <option value="">Choisir un domaine</option>
                      <option value="comptabilite">Automatisation comptable</option>
                      <option value="finance">Pilotage financier</option>
                      <option value="audit">Audit & contrôle</option>
                      <option value="autre">Autre / plusieurs domaines</option>
                    </select>
                  </div>
                  <div className="mt-5">
                    <label htmlFor="contact-message" className="mb-2 block text-[11px] font-semibold text-[#e4e4e7]">Votre besoin <span className="font-normal text-[#b2b2b5]">(facultatif)</span></label>
                    <textarea id="contact-message" name="message" rows={3} maxLength={2000} className="form-control resize-y" placeholder="Quelques mots sur votre contexte..." data-testid="textarea-contact-message" />
                  </div>
                  <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                    <label htmlFor="contact-website">Ne pas remplir ce champ</label>
                    <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  {contactRequestMutation.isError && (
                    <p className="mt-4 text-[12px] leading-[1.65] text-[#f0bfc8]" role="alert">
                      L’envoi automatique est indisponible pour le moment. Votre demande n’a pas été transmise. Réessayez plus tard.
                    </p>
                  )}
                  <button type="submit" disabled={contactRequestMutation.isPending} aria-busy={contactRequestMutation.isPending} className="button-main mt-6 w-full justify-between disabled:cursor-wait disabled:opacity-70" data-testid="button-submit-contact">
                    {contactRequestMutation.isPending ? 'Envoi en cours…' : 'Demander une démo'}
                    <ArrowRight size={16} />
                  </button>
                  <p className="mt-4 text-[10px] leading-[1.65] text-[#b6b6b9]">Les champs marqués d’un astérisque sont requis. Vos coordonnées seront utilisées pour donner suite à votre demande.</p>
                  <p className="sr-only" aria-live="polite" id="form-validation-note">La validation des champs est effectuée par votre navigateur.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1f1f23] text-[#e9e9ec]">
        <div className="q4c-container grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <a href="#accueil" className="inline-flex items-center gap-3" data-testid="link-footer-home">
              <span className="grid h-[36px] min-w-[44px] place-items-center border border-[#d9a0ab]/50 px-1 text-[#d9a0ab]"><span className="font-serif text-[13px] font-extrabold tracking-[-.08em]">Q4C</span></span>
              <span className="leading-tight"><span className="block font-serif text-[15px] font-extrabold tracking-[-.04em]">Q4C Systèmes</span><span className="block text-[8px] font-bold tracking-[.18em] text-[#bbbbbe]">COMPTA · FINANCE · AUDIT</span></span>
            </a>
            <p className="mt-5 max-w-[420px] text-[11px] leading-[1.75] text-[#b6b6b9]">Éditeur marocain de logiciels pour la finance, la comptabilité et l’audit.</p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-semibold text-[#cacacd]">
            <a href="#solutions" className="transition-colors hover:text-[#d9a0ab]">Solutions</a>
            <a href="#approche" className="transition-colors hover:text-[#d9a0ab]">Notre approche</a>
            <a href="#recherche" className="transition-colors hover:text-[#d9a0ab]">À propos</a>
            <a href="#contact" className="transition-colors hover:text-[#d9a0ab]">Demander une démo</a>
          </div>
        </div>
        <div className="border-t border-[#f4f4f7]/10">
          <div className="q4c-container flex flex-col gap-2 py-4 text-[9px] text-[#9c9c9f] sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Q4C Systèmes. Tous droits réservés.</span>
            <span>Logiciels du chiffre · Maroc</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Home() {
  return <DemoForm />;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
