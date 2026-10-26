import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, FileText, Fingerprint, Languages, LockKeyhole, Menu, ScanLine, ShieldCheck, Sparkles, Workflow, X } from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSubmitContactRequest } from '@workspace/api-client-react';
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
    name: 'HisabPro',
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
          ...(interest ? { interest: interest as 'Lexpia-Pro' | 'HisabPro' | 'Mizane' | 'ecosysteme' } : {}),
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
      <header className="absolute inset-x-0 top-0 z-20 border-b border-[#1e4d43]/10">
        <div className="q4c-container flex h-[78px] items-center justify-between">
          <a href="#accueil" aria-label="Q4C Systèmes, accueil" className="flex items-center gap-3">
            <span className="grid h-[36px] w-[36px] place-items-center border border-[#1e4d43]/25 text-[#1e4d43]">
              <span className="font-serif text-[15px] font-extrabold tracking-[-.12em]">Q4</span>
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-[15px] font-extrabold tracking-[-.04em] text-[#173a34]">Q4C</span>
              <span className="block text-[8px] font-bold tracking-[.18em] text-[#697a73]">SYSTÈMES</span>
            </span>
          </a>
          <nav aria-label="Navigation principale" className="hidden items-center gap-9 md:flex">
            <a className="nav-link" href="#solutions">Solutions</a>
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
            className="grid h-10 w-10 place-items-center text-[#173a34] md:hidden"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {mobileOpen && (
          <nav aria-label="Navigation mobile" className="border-t border-[#1e4d43]/10 bg-[#f8f5ec] px-5 py-5 md:hidden">
            <div className="mx-auto flex max-w-[560px] flex-col gap-5">
              <a className="nav-link" href="#solutions" onClick={closeMenu}>Solutions</a>
              <a className="nav-link" href="#approche" onClick={closeMenu}>Notre approche</a>
              <a className="nav-link" href="#recherche" onClick={closeMenu}>À propos</a>
              <a className="button-main mt-1 w-full" href="#contact" onClick={closeMenu} data-testid="link-demo-mobile">Demander une démo <ArrowUpRight size={15} /></a>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="accueil" className="hero-grid relative min-h-[760px] overflow-hidden bg-[#f2f0e7] pt-[78px] md:min-h-[790px]">
          <div className="q4c-container relative grid min-h-[680px] items-center gap-10 py-16 md:grid-cols-[1.02fr_.98fr] md:py-20">
            <div className="relative z-10 max-w-[590px]">
              <div className="eyebrow reveal">ÉCOSYSTÈME FINANCIER · MAROC</div>
              <h1 className="reveal reveal-2 mt-7 font-serif text-[clamp(3.2rem,7vw,6.45rem)] font-semibold leading-[.98] tracking-[-.075em] text-[#173a34]">
                Le chiffre,<br />
                <span className="text-[#a85f3c]">en mouvement.</span>
              </h1>
              <p className="reveal reveal-3 mt-7 max-w-[490px] text-[16px] leading-[1.8] text-[#52665f] md:text-[17px]">
                Q4C Systèmes accélère la transformation digitale des cabinets comptables et des entreprises au Maroc. Avec Lexpia-Pro, HisabPro et Mizane, chaque étape du travail du chiffre gagne en fluidité et en lisibilité.
              </p>
              <div className="reveal reveal-3 mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a className="button-main" href="#contact" data-testid="link-demo-hero">Demander une démo <ArrowRight size={16} /></a>
                <a className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#3b5851] transition-colors hover:text-[#a85f3c]" href="#solutions" data-testid="link-explore-solutions">
                  Découvrir les solutions <ArrowDown size={14} />
                </a>
              </div>
              <div className="mt-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#6d7b72]">
                <span className="h-px w-8 bg-[#a85f3c]" /> Trois expertises. Un même cap.
              </div>
            </div>

            <div className="relative mx-auto h-[420px] w-full max-w-[535px] md:h-[530px]" aria-label="Illustration abstraite de l’écosystème Q4C" role="img">
              <div className="absolute inset-[7%] rounded-full border border-[#1e4d43]/15" />
              <div className="absolute inset-[16%] rounded-full border border-dashed border-[#a85f3c]/30" />
              <div className="hero-orbit absolute inset-[7%] rounded-full border border-transparent border-t-[#a85f3c]/55">
                <span className="absolute left-[13%] top-[7%] h-2 w-2 rounded-full bg-[#a85f3c]" />
              </div>
              <div className="absolute left-1/2 top-1/2 grid h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#1e4d43]/15 bg-[#f8f5ec]/70 shadow-[0_25px_80px_rgba(33,65,56,.08)]">
                <div className="absolute inset-[17px] rounded-full border border-[#1e4d43]/10" />
                <div className="relative text-center">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center bg-[#1e4d43] text-[#f8f5ec]"><span className="font-serif text-lg font-bold tracking-[-.1em]">Q4</span></div>
                  <span className="block text-[9px] font-bold uppercase tracking-[.19em] text-[#75827a]">Écosystème</span>
                  <span className="mt-1 block font-serif text-[18px] font-semibold tracking-[-.04em] text-[#173a34]">du chiffre</span>
                </div>
              </div>
              <div className="hero-float absolute left-[1%] top-[18%] w-[177px] border border-[#1e4d43]/15 bg-[#faf8f1] p-4 shadow-[0_16px_45px_rgba(33,65,56,.09)] md:left-0 md:w-[196px]">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center bg-[#e6dfd0] text-[#1e4d43]"><ScanLine size={15} /></span>
                  <span className="font-mono text-[9px] text-[#a85f3c]">01 / IA + OCR</span>
                </div>
                <p className="mt-4 font-serif text-[17px] font-semibold text-[#173a34]">Lexpia-Pro</p>
                <p className="mt-1 text-[10px] text-[#718078]">Pièces comptables</p>
                <div className="mt-4 flex gap-1.5"><span className="h-[3px] w-[49%] bg-[#1e4d43]" /><span className="h-[3px] w-[24%] bg-[#d9a274]" /><span className="h-[3px] flex-1 bg-[#e2ded3]" /></div>
              </div>
              <div className="hero-float-delay absolute right-[-1%] top-[35%] w-[174px] border border-[#1e4d43]/15 bg-[#faf8f1] p-4 shadow-[0_16px_45px_rgba(33,65,56,.09)] md:right-[-2%] md:w-[194px]">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center bg-[#dce6dc] text-[#1e4d43]"><Workflow size={15} /></span>
                  <span className="font-mono text-[9px] text-[#a85f3c]">02 / PILOTAGE</span>
                </div>
                <p className="mt-4 font-serif text-[17px] font-semibold text-[#173a34]">HisabPro</p>
                <p className="mt-1 text-[10px] text-[#718078]">Gestion comptable</p>
                <div className="mt-4 flex items-end gap-1"><span className="h-3 w-3 bg-[#bdcfc2]" /><span className="h-5 w-3 bg-[#8da99b]" /><span className="h-4 w-3 bg-[#d9a274]" /><span className="h-7 w-3 bg-[#1e4d43]" /><span className="h-5 w-3 bg-[#8da99b]" /></div>
              </div>
              <div className="hero-float absolute bottom-[9%] left-[18%] w-[188px] border border-[#1e4d43]/15 bg-[#faf8f1] p-4 shadow-[0_16px_45px_rgba(33,65,56,.09)] md:bottom-[7%] md:left-[22%] md:w-[205px]">
                <div className="flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center bg-[#f0e2d6] text-[#a85f3c]"><FileText size={15} /></span>
                  <span className="font-mono text-[9px] text-[#a85f3c]">03 / ANALYSE</span>
                </div>
                <p className="mt-4 font-serif text-[17px] font-semibold text-[#173a34]">Mizane</p>
                <p className="mt-1 text-[10px] text-[#718078]">Audit & synthèse</p>
                <div className="mt-4 flex items-center gap-2"><span className="h-px flex-1 bg-[#d6d2c8]" /><span className="h-2 w-2 rounded-full border border-[#a85f3c]" /><span className="h-px w-7 bg-[#d6d2c8]" /></div>
              </div>
              <span className="absolute right-[15%] top-[9%] font-mono text-[9px] tracking-[.12em] text-[#74847b]">MAROC · SECTEUR DU CHIFFRE</span>
              <span className="absolute bottom-[4%] right-[3%] font-mono text-[9px] tracking-[.12em] text-[#74847b]">FLUX / CLARTÉ / DÉCISION</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1e4d43]/15" />
        </section>

        <section id="solutions" className="bg-[#f8f5ec] py-24 md:py-32">
          <div className="q4c-container">
            <div className="grid gap-8 md:grid-cols-[.75fr_1.25fr] md:items-end">
              <div>
                <div className="eyebrow">UN ÉCOSYSTÈME, TROIS EXPERTISES</div>
                <h2 className="section-heading mt-5 max-w-[380px]">Du document<br />à la <em>décision.</em></h2>
              </div>
              <div className="max-w-[540px] md:justify-self-end">
                <p className="text-[15px] leading-[1.8] text-[#61716a]">Chaque solution répond à un temps fort du travail comptable. Ensemble, elles accompagnent le traitement, le pilotage et l’analyse.</p>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[.12em] text-[#9b6850]">Trois solutions opérationnelles</p>
              </div>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {products.map(({ number, name, label, icon: Icon, description, detail, tone }) => (
                <article key={name} className={`product-card relative flex min-h-[340px] flex-col border border-[#1e4d43]/15 p-7 ${tone === 'green' ? 'bg-[#e9ede4]' : tone === 'clay' ? 'bg-[#f2e9df]' : 'bg-[#f0ecdf]'}`} data-testid={`card-product-${number}`}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-[.13em] text-[#a85f3c]">{number} / 03</span>
                    <span className="product-arrow text-[#52665f]"><ArrowUpRight size={18} /></span>
                  </div>
                  <div className="mt-9 grid h-12 w-12 place-items-center border border-[#1e4d43]/20 text-[#1e4d43]"><Icon size={20} strokeWidth={1.5} /></div>
                  <p className="mt-6 font-mono text-[9px] font-bold tracking-[.13em] text-[#a85f3c]">{label}</p>
                  <h3 className="mt-2 font-serif text-[26px] font-semibold tracking-[-.045em] text-[#173a34]">{name}</h3>
                  <p className="mt-3 text-[13px] leading-[1.75] text-[#566a62]">{description}</p>
                  <div className="mt-auto border-t border-[#1e4d43]/15 pt-5">
                    <p className="text-[11px] font-semibold text-[#34554c]">{detail}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-[#1e4d43]/15 pt-7 sm:flex-row sm:items-center">
              <p className="text-[12px] text-[#6a7972]">Un fil conducteur : moins de friction dans le travail du chiffre.</p>
              <a href="#contact" className="inline-flex items-center gap-2 text-[12px] font-bold text-[#1e4d43] transition-colors hover:text-[#a85f3c]" data-testid="link-demo-products">Parler de vos besoins <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>

        <section id="apercus" className="product-previews relative overflow-hidden bg-[#eeeade] py-24 md:py-32" aria-labelledby="previews-heading">
          <div className="q4c-container">
            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
              <div>
                <div className="eyebrow">APERÇUS INDICATIFS</div>
                <h2 id="previews-heading" className="section-heading mt-5 max-w-[440px]">Les solutions,<br />en <em>situation.</em></h2>
              </div>
              <p className="max-w-[520px] text-[14px] leading-[1.85] text-[#61716a] md:justify-self-end">
                Trois vues pour comprendre les usages couverts, du traitement d’une pièce à la lecture d’un rapport.
              </p>
            </div>
            <p className="mt-7 inline-flex items-center gap-2 border border-[#a85f3c]/25 bg-[#f8f5ec]/65 px-3 py-2 font-mono text-[9px] leading-relaxed tracking-[.04em] text-[#86553e]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#a85f3c]" />
              Illustrations d’interface — données d’exemple, non contractuelles. Ces vues ne sont pas des captures exactes des produits.
            </p>

            <div className="mt-12 space-y-7 md:mt-16">
              <article className="preview-case grid overflow-hidden border border-[#1e4d43]/15 bg-[#f8f5ec] lg:grid-cols-[.78fr_1.22fr]" aria-labelledby="preview-lexpia-title">
                <div className="flex flex-col justify-center p-6 md:p-9 lg:p-11">
                  <span className="font-mono text-[9px] tracking-[.14em] text-[#a85f3c]">01 / TRAITEMENT DE PIÈCE</span>
                  <h3 id="preview-lexpia-title" className="mt-4 font-serif text-[29px] font-semibold tracking-[-.045em] text-[#173a34]">Lexpia-Pro</h3>
                  <p className="mt-3 max-w-[350px] text-[13px] leading-[1.8] text-[#5c7067]">Une pièce comptable bilingue, visualisée à côté des informations reconnues et de leur transcription arabe / français.</p>
                  <span className="mt-6 w-fit border-l-2 border-[#a85f3c] pl-3 text-[10px] leading-[1.7] text-[#748078]">Exemple de parcours OCR · contenu fictif</span>
                </div>
                <div className="preview-screen p-3 sm:p-5 md:p-7" role="img" aria-label="Illustration indicative de Lexpia-Pro : une facture fictive en arabe et français à côté de champs de lecture OCR d’exemple.">
                  <div className="preview-window">
                    <div className="preview-topbar">
                      <span className="flex items-center gap-2 font-serif text-[12px] font-bold text-[#173a34]"><span className="grid h-6 w-6 place-items-center bg-[#1e4d43] font-mono text-[9px] text-[#f8f5ec]">L</span>Lexpia-Pro</span>
                      <span className="preview-window-label">APERÇU · EXEMPLE</span>
                    </div>
                    <div className="grid min-h-[275px] sm:grid-cols-[.9fr_1.1fr]">
                      <div className="preview-document-wrap">
                        <div className="preview-document">
                          <div className="flex items-start justify-between border-b border-[#1e4d43]/10 pb-3">
                            <div><span className="block font-mono text-[7px] tracking-[.1em] text-[#a85f3c]">DOCUMENT EXEMPLE</span><span className="mt-1 block text-[10px] font-bold text-[#34554c]">Facture / فاتورة</span></div>
                            <FileText size={15} className="text-[#a85f3c]" strokeWidth={1.5} />
                          </div>
                          <div className="mt-4 flex justify-between gap-3">
                            <div className="space-y-2"><span className="doc-line w-16" /><span className="doc-line w-24" /><span className="doc-line w-20" /></div>
                            <div dir="rtl" lang="ar" className="space-y-2 text-right"><span className="doc-line ml-auto w-16" /><span className="doc-line ml-auto w-20" /><span className="doc-line ml-auto w-14" /></div>
                          </div>
                          <div className="mt-5 border border-dashed border-[#a85f3c]/45 p-2">
                            <div className="flex justify-between border-b border-[#1e4d43]/10 pb-2 text-[7px] text-[#748078]"><span>Désignation</span><span>البيان</span></div>
                            <div className="flex justify-between py-2 text-[8px] text-[#52665f]"><span>Exemple de ligne</span><span dir="rtl" lang="ar">مثال</span></div>
                          </div>
                          <div className="mt-4 flex justify-between border-t border-[#1e4d43]/10 pt-2 text-[8px] text-[#748078]"><span>Total · مثال</span><span>—</span></div>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:px-5">
                        <div className="flex items-center justify-between"><span className="font-mono text-[8px] font-bold tracking-[.1em] text-[#52665f]">LECTURE OCR</span><span className="border border-[#1e4d43]/15 px-2 py-1 text-[7px] text-[#66776f]">BILINGUE</span></div>
                        <div className="mt-4 space-y-3">
                          {[['Fournisseur / المورّد', 'Exemple de donnée'], ['Date / التاريخ', 'Exemple de donnée'], ['Référence / المرجع', 'Exemple de donnée']].map(([label, value]) => (
                            <div key={label} className="border-b border-[#1e4d43]/10 pb-2"><span className="block text-[7px] text-[#87928a]">{label}</span><span className="mt-1 block text-[9px] font-medium text-[#34554c]">{value}</span></div>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center gap-2 border border-[#1e4d43]/10 bg-[#e9ede4] px-2.5 py-2 text-[8px] text-[#52665f]"><span className="h-1.5 w-1.5 rounded-full bg-[#1e4d43]" />Champs présentés à titre illustratif</div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="preview-case grid overflow-hidden border border-[#1e4d43]/15 bg-[#f8f5ec] lg:grid-cols-[.78fr_1.22fr]" aria-labelledby="preview-hisab-title">
                <div className="flex flex-col justify-center p-6 md:p-9 lg:order-2 lg:p-11">
                  <span className="font-mono text-[9px] tracking-[.14em] text-[#a85f3c]">02 / GESTION & PILOTAGE</span>
                  <h3 id="preview-hisab-title" className="mt-4 font-serif text-[29px] font-semibold tracking-[-.045em] text-[#173a34]">HisabPro</h3>
                  <p className="mt-3 max-w-[350px] text-[13px] leading-[1.8] text-[#5c7067]">Un espace de gestion comptable pour organiser les dossiers et suivre les principaux sujets d’un cabinet ou d’une entreprise.</p>
                  <span className="mt-6 w-fit border-l-2 border-[#a85f3c] pl-3 text-[10px] leading-[1.7] text-[#748078]">Exemple de vue de pilotage · données fictives</span>
                </div>
                <div className="preview-screen p-3 sm:p-5 md:p-7 lg:order-1" role="img" aria-label="Illustration indicative d’HisabPro : vue de gestion comptable avec dossiers d’exemple et différents états de suivi.">
                  <div className="preview-window">
                    <div className="preview-topbar">
                      <span className="flex items-center gap-2 font-serif text-[12px] font-bold text-[#173a34]"><span className="grid h-6 w-6 place-items-center bg-[#1e4d43] font-mono text-[9px] text-[#f8f5ec]">H</span>HisabPro</span>
                      <span className="preview-window-label">GESTION COMPTABLE · EXEMPLE</span>
                    </div>
                    <div className="grid min-h-[275px] sm:grid-cols-[.42fr_.58fr]">
                      <div className="border-b border-[#1e4d43]/10 bg-[#f1efe5] p-3 sm:border-b-0 sm:border-r">
                        <span className="font-mono text-[7px] font-bold tracking-[.12em] text-[#87928a]">ESPACE DE TRAVAIL</span>
                        <div className="mt-4 space-y-1">
                          {['Vue d’ensemble', 'Dossiers', 'Suivi comptable'].map((item, index) => <div key={item} className={`flex items-center gap-2 px-2 py-2 text-[8px] ${index === 0 ? 'bg-[#e1e8dd] font-semibold text-[#34554c]' : 'text-[#748078]'}`}><span className="h-1.5 w-1.5 border border-current" />{item}</div>)}
                        </div>
                        <div className="mt-6 border-t border-[#1e4d43]/10 pt-3"><span className="font-mono text-[7px] tracking-[.1em] text-[#87928a]">DOSSIERS</span><div className="mt-2 space-y-2 text-[8px] text-[#66776f]"><span className="block">Entreprise exemple</span><span className="block">Cabinet exemple</span><span className="block">Autre dossier</span></div></div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2"><div><span className="font-mono text-[7px] tracking-[.1em] text-[#a85f3c]">TABLEAU DE BORD</span><p className="mt-1 font-serif text-[13px] font-semibold text-[#173a34]">Suivi des dossiers</p></div><span className="border border-[#1e4d43]/15 px-2 py-1 text-[7px] text-[#748078]">DONNÉES EXEMPLE</span></div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {['À traiter', 'En cours', 'À vérifier'].map((label, i) => <div key={label} className="border border-[#1e4d43]/10 bg-[#fbfaf5] p-2"><span className="block text-[7px] text-[#87928a]">{label}</span><span className="mt-2 block h-1 w-full bg-[#e5e1d5]"><span className={`block h-1 ${i === 1 ? 'w-2/3 bg-[#a85f3c]/70' : 'w-1/2 bg-[#1e4d43]/55'}`} /></span></div>)}
                        </div>
                        <div className="mt-4 border border-[#1e4d43]/10">
                          <div className="grid grid-cols-[1.3fr_.8fr_.8fr] gap-1 border-b border-[#1e4d43]/10 bg-[#f1efe5] px-2 py-2 font-mono text-[6px] tracking-[.05em] text-[#748078]"><span>DOSSIER</span><span>ACTIVITÉ</span><span>SUIVI</span></div>
                          {[['Entreprise exemple', 'Comptabilité', 'En cours'], ['Cabinet exemple', 'Pièces', 'À traiter'], ['Dossier exemple', 'Révision', 'À vérifier']].map(([a, b, c]) => <div key={a} className="grid grid-cols-[1.3fr_.8fr_.8fr] gap-1 border-b border-[#1e4d43]/[.07] px-2 py-2 text-[7px] text-[#52665f] last:border-0"><span>{a}</span><span>{b}</span><span className="text-[#8b624d]">{c}</span></div>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="preview-case grid overflow-hidden border border-[#1e4d43]/15 bg-[#f8f5ec] lg:grid-cols-[.78fr_1.22fr]" aria-labelledby="preview-mizane-title">
                <div className="flex flex-col justify-center p-6 md:p-9 lg:p-11">
                  <span className="font-mono text-[9px] tracking-[.14em] text-[#a85f3c]">03 / ANALYSE & AUDIT</span>
                  <h3 id="preview-mizane-title" className="mt-4 font-serif text-[29px] font-semibold tracking-[-.045em] text-[#173a34]">Mizane</h3>
                  <p className="mt-3 max-w-[350px] text-[13px] leading-[1.8] text-[#5c7067]">Une lecture visuelle des éléments d’analyse et une trame de rapport de synthèse pour restituer les constats.</p>
                  <span className="mt-6 w-fit border-l-2 border-[#a85f3c] pl-3 text-[10px] leading-[1.7] text-[#748078]">Exemple d’analyse · aucune donnée réelle</span>
                </div>
                <div className="preview-screen p-3 sm:p-5 md:p-7" role="img" aria-label="Illustration indicative de Mizane : écran d’analyse d’audit, graphiques sans valeurs réelles et rapport de synthèse d’exemple.">
                  <div className="preview-window">
                    <div className="preview-topbar">
                      <span className="flex items-center gap-2 font-serif text-[12px] font-bold text-[#173a34]"><span className="grid h-6 w-6 place-items-center bg-[#1e4d43] font-mono text-[9px] text-[#f8f5ec]">M</span>Mizane</span>
                      <span className="preview-window-label">ANALYSE & AUDIT · EXEMPLE</span>
                    </div>
                    <div className="grid min-h-[275px] sm:grid-cols-[1fr_.8fr]">
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2"><div><span className="font-mono text-[7px] tracking-[.1em] text-[#a85f3c]">VUE D’ANALYSE</span><p className="mt-1 font-serif text-[13px] font-semibold text-[#173a34]">Lecture financière</p></div><span className="border border-[#1e4d43]/15 px-2 py-1 text-[7px] text-[#748078]">ILLUSTRATION</span></div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="border border-[#1e4d43]/10 p-2"><span className="text-[7px] text-[#87928a]">Indicateur exemple</span><div className="mt-3 flex h-10 items-end gap-1 border-b border-[#1e4d43]/10">{[35, 55, 43, 70, 58, 83, 64].map((height, i) => <span key={i} className="flex-1 bg-[#1e4d43]/55" style={{ height: `${height}%` }} />)}</div><span className="mt-1 block text-[6px] text-[#87928a]">Visualisation sans valeur réelle</span></div>
                          <div className="border border-[#1e4d43]/10 p-2"><span className="text-[7px] text-[#87928a]">Répartition exemple</span><div className="mt-3 flex h-10 items-center justify-center"><div className="h-9 w-9 rounded-full border-[5px] border-[#d9a274] border-r-[#1e4d43] border-b-[#b9c9bd]" /></div><span className="mt-1 block text-[6px] text-[#87928a]">Données fictives</span></div>
                        </div>
                        <div className="mt-3 border border-[#1e4d43]/10 p-2">
                          <span className="font-mono text-[7px] tracking-[.08em] text-[#748078]">POINTS DE LECTURE · EXEMPLE</span>
                          <div className="mt-2 space-y-2"><div className="h-1 w-[88%] bg-[#e2ded3]" /><div className="h-1 w-[72%] bg-[#e2ded3]" /><div className="h-1 w-[80%] bg-[#e2ded3]" /></div>
                        </div>
                      </div>
                      <div className="border-t border-[#1e4d43]/10 bg-[#f1efe5] p-3 sm:border-l sm:border-t-0 sm:p-4">
                        <div className="flex items-center justify-between"><span className="font-mono text-[7px] font-bold tracking-[.1em] text-[#52665f]">RAPPORT DE SYNTHÈSE</span><FileText size={14} className="text-[#a85f3c]" strokeWidth={1.5} /></div>
                        <div className="mt-4 border border-[#1e4d43]/10 bg-[#f8f5ec] p-3">
                          <span className="font-serif text-[10px] font-semibold text-[#173a34]">Rapport · exemple</span>
                          <span className="mt-1 block text-[7px] text-[#87928a]">Trame illustrative, sans constat réel</span>
                          <div className="mt-4 border-l-2 border-[#a85f3c]/70 pl-2"><span className="block text-[7px] font-semibold text-[#52665f]">Synthèse</span><div className="mt-2 space-y-1.5"><div className="h-1 w-full bg-[#e2ded3]" /><div className="h-1 w-[86%] bg-[#e2ded3]" /><div className="h-1 w-[70%] bg-[#e2ded3]" /></div></div>
                          <div className="mt-4 border-t border-[#1e4d43]/10 pt-3"><span className="block text-[7px] font-semibold text-[#52665f]">Analyse · Audit · Observations</span><div className="mt-2 space-y-1.5"><div className="h-1 w-full bg-[#e2ded3]" /><div className="h-1 w-[77%] bg-[#e2ded3]" /></div></div>
                          <span className="mt-4 block border-t border-[#1e4d43]/10 pt-2 font-mono text-[6px] tracking-[.06em] text-[#a85f3c]">DOCUMENT D’ILLUSTRATION</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="approche" className="relative bg-[#173a34] py-24 text-[#f8f5ec] md:py-32">
          <div className="absolute right-[-100px] top-[-90px] h-[370px] w-[370px] rounded-full border border-[#f8f5ec]/10" />
          <div className="absolute right-[-28px] top-[-18px] h-[220px] w-[220px] rounded-full border border-dashed border-[#d9a274]/30" />
          <div className="q4c-container relative">
            <div className="grid gap-12 md:grid-cols-[.95fr_1.05fr] md:items-end">
              <div>
                <div className="eyebrow !text-[#d9a274]">POURQUOI Q4C SYSTÈMES</div>
                <h2 className="section-heading mt-5 max-w-[490px] !text-[#f8f5ec]">L’expertise du chiffre.<br /><em className="!text-[#d9a274]">La fluidité en plus.</em></h2>
              </div>
              <p className="max-w-[470px] text-[15px] leading-[1.85] text-[#cad4cb] md:justify-self-end">Nous pensons les outils à partir des réalités de celles et ceux qui produisent, contrôlent et interprètent les chiffres.</p>
            </div>
            <div className="mt-16 grid gap-x-12 md:grid-cols-2">
              <article className="border-t border-[#f8f5ec]/20 py-7">
                <span className="font-mono text-[10px] text-[#d9a274]">01 — TEMPS RETROUVÉ</span>
                <div className="mt-5 flex items-start gap-5">
                  <span className="font-serif text-[clamp(3.8rem,7vw,6.3rem)] font-semibold leading-[.85] tracking-[-.08em] text-[#f4e8d4]" data-testid="text-productivity-stat">70<span className="text-[.54em]">%</span></span>
                  <div className="pt-2">
                    <h3 className="font-serif text-[19px] font-semibold tracking-[-.03em]">de gain de productivité annoncé</h3>
                    <p className="mt-2 max-w-[330px] text-[12px] leading-[1.7] text-[#bdcbc1]">L’automatisation du répétitif libère de l’espace pour le travail d’expertise.</p>
                  </div>
                </div>
              </article>
              <article className="border-t border-[#f8f5ec]/20 py-7">
                <span className="font-mono text-[10px] text-[#d9a274]">02 — ANCRAGE LOCAL</span>
                <div className="mt-5 flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-[#f8f5ec]/20 text-[#d9a274]"><Languages size={20} strokeWidth={1.5} /></span>
                  <div>
                    <h3 className="font-serif text-[19px] font-semibold tracking-[-.03em]">Pensé pour les exigences locales</h3>
                    <p className="mt-2 max-w-[330px] text-[12px] leading-[1.7] text-[#bdcbc1]">Une suite conçue pour les exigences et les usages du secteur du chiffre au Maroc, avec une approche bilingue arabe/français pour Lexpia-Pro.</p>
                  </div>
                </div>
              </article>
              <article className="border-t border-[#f8f5ec]/20 py-7">
                <span className="font-mono text-[10px] text-[#d9a274]">03 — CONFIANCE</span>
                <div className="mt-5 flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-[#f8f5ec]/20 text-[#d9a274]"><ShieldCheck size={20} strokeWidth={1.5} /></span>
                  <div>
                    <h3 className="font-serif text-[19px] font-semibold tracking-[-.03em]">La sécurité comme priorité</h3>
                    <p className="mt-2 max-w-[330px] text-[12px] leading-[1.7] text-[#bdcbc1]">Les données financières méritent une attention exigeante, avec une volonté de souveraineté au cœur de notre approche.</p>
                  </div>
                </div>
              </article>
              <article className="border-t border-[#f8f5ec]/20 py-7">
                <span className="font-mono text-[10px] text-[#d9a274]">04 — LISIBILITÉ</span>
                <div className="mt-5 flex items-start gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center border border-[#f8f5ec]/20 text-[#d9a274]"><Sparkles size={20} strokeWidth={1.5} /></span>
                  <div>
                    <h3 className="font-serif text-[19px] font-semibold tracking-[-.03em]">Du traitement à la compréhension</h3>
                    <p className="mt-2 max-w-[330px] text-[12px] leading-[1.7] text-[#bdcbc1]">Des opérations mieux structurées, pour que les informations clés prennent leur juste place.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="recherche" className="bg-[#eeeade] py-24 md:py-32">
          <div className="q4c-container grid gap-12 md:grid-cols-[.85fr_1.15fr] md:items-center">
            <div className="relative min-h-[320px] overflow-hidden border border-[#1e4d43]/15 bg-[#e5e1d5] p-8 md:min-h-[390px]">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(30,77,67,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,77,67,.08) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
              <div className="absolute left-[15%] top-[15%] h-[68%] w-[68%] rounded-full border border-[#1e4d43]/20" />
              <div className="absolute left-[27%] top-[27%] h-[44%] w-[44%] rounded-full border border-dashed border-[#a85f3c]/40" />
              <div className="absolute left-1/2 top-1/2 grid h-[115px] w-[115px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#1e4d43] text-[#f8f5ec]">
                <div className="text-center"><Fingerprint className="mx-auto mb-2 text-[#d9a274]" size={24} strokeWidth={1.3} /><span className="font-mono text-[8px] tracking-[.12em]">Q4C / R&D</span></div>
              </div>
              <div className="absolute left-[8%] top-[12%] border border-[#1e4d43]/20 bg-[#f8f5ec] px-3 py-2 font-mono text-[8px] tracking-[.08em] text-[#566a62]">INGÉNIERIE</div>
              <div className="absolute bottom-[14%] right-[8%] border border-[#a85f3c]/30 bg-[#f8f5ec] px-3 py-2 font-mono text-[8px] tracking-[.08em] text-[#a85f3c]">SECTEUR DU CHIFFRE</div>
              <span className="absolute bottom-5 left-6 font-mono text-[8px] tracking-[.14em] text-[#74847b]">CONCEVOIR · COMPRENDRE · FAIRE ÉVOLUER</span>
            </div>
            <div className="md:pl-7">
              <div className="eyebrow">À PROPOS · RECHERCHE & DÉVELOPPEMENT</div>
              <h2 className="section-heading mt-5">Des ingénieurs<br />proches du <em>terrain.</em></h2>
              <div className="mt-7 max-w-[510px] space-y-4 text-[14px] leading-[1.85] text-[#5e7068]">
                <p>Q4C Systèmes est un éditeur marocain de logiciels dédiés à la finance, à la comptabilité et à l’audit.</p>
                <p>Notre équipe d’ingénieurs passionnés par le secteur du chiffre développe des outils où l’exigence métier rencontre une expérience plus fluide.</p>
                <p>La recherche et le développement sont au cœur de cette démarche : comprendre les tâches réelles, puis concevoir des solutions qui les rendent plus simples à conduire.</p>
              </div>
              <div className="mt-8 flex items-center gap-4 border-l-2 border-[#a85f3c] pl-4">
                <LockKeyhole size={17} className="shrink-0 text-[#a85f3c]" />
                <p className="text-[11px] leading-[1.65] text-[#66776f]">La sécurité et la souveraineté des données restent des priorités de conception.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f8f5ec] py-16">
          <div className="q4c-container flex flex-col items-start justify-between gap-7 border-y border-[#1e4d43]/15 py-8 md:flex-row md:items-center">
            <div className="max-w-[660px]">
              <p className="font-mono text-[9px] font-bold tracking-[.15em] text-[#a85f3c]">UNE SUITE FAITE POUR LE TRAVAIL DU CHIFFRE</p>
              <h2 className="mt-3 font-serif text-[clamp(1.65rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-.05em] text-[#173a34]">Faisons place à une comptabilité plus lisible.</h2>
            </div>
            <a href="#contact" className="button-main shrink-0" data-testid="link-demo-cta">Demander une démo <ArrowRight size={16} /></a>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden bg-[#173a34] py-24 text-[#f8f5ec] md:py-28">
          <div className="absolute -right-40 top-[-190px] h-[550px] w-[550px] rounded-full border border-[#f8f5ec]/10" />
          <div className="absolute -right-20 top-[-70px] h-[300px] w-[300px] rounded-full border border-dashed border-[#d9a274]/25" />
          <div className="q4c-container relative grid gap-14 md:grid-cols-[.9fr_1.1fr]">
            <div className="pt-1">
              <div className="eyebrow !text-[#d9a274]">ÉCHANGEONS</div>
              <h2 className="section-heading mt-5 max-w-[480px] !text-[#f8f5ec]">Voyons ce qui<br />peut <em className="!text-[#d9a274]">changer.</em></h2>
              <p className="mt-6 max-w-[400px] text-[14px] leading-[1.8] text-[#cad4cb]">Vous souhaitez découvrir les solutions Q4C pour votre cabinet ou votre entreprise ? Laissez-nous quelques informations.</p>
              <div className="mt-10 flex items-center gap-3 border-t border-[#f8f5ec]/20 pt-5 text-[10px] font-mono tracking-[.08em] text-[#b2c2b7]">
                <span className="h-2 w-2 rounded-full bg-[#d9a274]" /> DÉMO · ÉCHANGE · DÉCOUVERTE
              </div>
            </div>
            <div className="border border-[#f8f5ec]/20 bg-[#f8f5ec]/[.035] p-6 md:p-8">
              {submitted ? (
                <div role="status" aria-live="polite" className="flex min-h-[390px] flex-col justify-center">
                  <span className="grid h-12 w-12 place-items-center border border-[#d9a274]/60 text-[#d9a274]"><Check size={21} /></span>
                  <h3 className="mt-6 font-serif text-[26px] font-semibold tracking-[-.04em]">Votre demande a bien été envoyée.</h3>
                  <p className="mt-3 max-w-[380px] text-[13px] leading-[1.75] text-[#cad4cb]">Merci pour votre intérêt. L’équipe Q4C Systèmes reviendra vers vous au sujet de votre demande de démonstration.</p>
                  <button className="mt-7 w-fit border-b border-[#d9a274]/60 pb-1 text-[11px] font-semibold text-[#e9c09e] transition-colors hover:text-white" onClick={() => setSubmitted(false)} type="button" data-testid="button-reset-contact">Envoyer une autre demande</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-2 block text-[11px] font-semibold text-[#e3e8df]">Nom et prénom <span aria-hidden="true" className="text-[#d9a274]">*</span></label>
                      <input id="contact-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={120} className="form-control" placeholder="Votre nom" data-testid="input-contact-name" />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-2 block text-[11px] font-semibold text-[#e3e8df]">Adresse e-mail <span aria-hidden="true" className="text-[#d9a274]">*</span></label>
                      <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} className="form-control" placeholder="nom@entreprise.ma" data-testid="input-contact-email" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label htmlFor="contact-organization" className="mb-2 block text-[11px] font-semibold text-[#e3e8df]">Cabinet ou entreprise <span aria-hidden="true" className="text-[#d9a274]">*</span></label>
                    <input id="contact-organization" name="organization" type="text" autoComplete="organization" required minLength={2} maxLength={160} className="form-control" placeholder="Nom de votre organisation" data-testid="input-contact-organization" />
                  </div>
                  <div className="mt-5">
                    <label htmlFor="contact-interest" className="mb-2 block text-[11px] font-semibold text-[#e3e8df]">Solution qui vous intéresse</label>
                    <select id="contact-interest" name="interest" defaultValue="" className="form-control" data-testid="select-contact-interest">
                      <option value="">Choisir une solution</option>
                      <option value="Lexpia-Pro">Lexpia-Pro</option>
                      <option value="HisabPro">HisabPro</option>
                      <option value="Mizane">Mizane</option>
                      <option value="ecosysteme">L’écosystème Q4C</option>
                    </select>
                  </div>
                  <div className="mt-5">
                    <label htmlFor="contact-message" className="mb-2 block text-[11px] font-semibold text-[#e3e8df]">Votre besoin <span className="font-normal text-[#a9b9ae]">(facultatif)</span></label>
                    <textarea id="contact-message" name="message" rows={3} maxLength={2000} className="form-control resize-y" placeholder="Quelques mots sur votre contexte..." data-testid="textarea-contact-message" />
                  </div>
                  <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                    <label htmlFor="contact-website">Ne pas remplir ce champ</label>
                    <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  {contactRequestMutation.isError && (
                    <p className="mt-4 text-[12px] leading-[1.65] text-[#f2bba0]" role="alert">
                      L’envoi automatique est indisponible pour le moment. Votre demande n’a pas été transmise. Réessayez plus tard.
                    </p>
                  )}
                  <button type="submit" disabled={contactRequestMutation.isPending} aria-busy={contactRequestMutation.isPending} className="button-main mt-6 w-full justify-between disabled:cursor-wait disabled:opacity-70" data-testid="button-submit-contact">
                    {contactRequestMutation.isPending ? 'Envoi en cours…' : 'Demander une démo'}
                    <ArrowRight size={16} />
                  </button>
                  <p className="mt-4 text-[10px] leading-[1.65] text-[#aebdb3]">Les champs marqués d’un astérisque sont requis. Vos coordonnées seront utilisées pour donner suite à votre demande.</p>
                  <p className="sr-only" aria-live="polite" id="form-validation-note">La validation des champs est effectuée par votre navigateur.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#122f2a] text-[#e9ece4]">
        <div className="q4c-container grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <a href="#accueil" className="inline-flex items-center gap-3" data-testid="link-footer-home">
              <span className="grid h-[36px] w-[36px] place-items-center border border-[#d9a274]/50 text-[#d9a274]"><span className="font-serif text-[15px] font-extrabold tracking-[-.12em]">Q4</span></span>
              <span className="leading-tight"><span className="block font-serif text-[15px] font-extrabold tracking-[-.04em]">Q4C</span><span className="block text-[8px] font-bold tracking-[.18em] text-[#b1c2b7]">SYSTÈMES</span></span>
            </a>
            <p className="mt-5 max-w-[420px] text-[11px] leading-[1.75] text-[#aebdb3]">Éditeur marocain de logiciels pour la finance, la comptabilité et l’audit.</p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-semibold text-[#c4d0c7]">
            <a href="#solutions" className="transition-colors hover:text-[#d9a274]">Solutions</a>
            <a href="#approche" className="transition-colors hover:text-[#d9a274]">Notre approche</a>
            <a href="#recherche" className="transition-colors hover:text-[#d9a274]">À propos</a>
            <a href="#contact" className="transition-colors hover:text-[#d9a274]">Demander une démo</a>
          </div>
        </div>
        <div className="border-t border-[#f8f5ec]/10">
          <div className="q4c-container flex flex-col gap-2 py-4 text-[9px] text-[#91a49a] sm:flex-row sm:items-center sm:justify-between">
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
