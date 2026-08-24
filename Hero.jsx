import Link from 'next/link';

export default function Hero({ content }) {
  const hero = content?.hero || {};

  return (
    <section className="relative overflow-hidden bg-forest-950 pb-24 pt-28 md:pt-36">
      {/* Fundo: gradiente de floresta em profundidade, sem foto genérica de banco de imagens.
          Substitua por fotografia real da floresta/produto via o painel admin quando disponível. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#213A26_0%,_#0B120D_65%)]" />
        <div className="light-ray absolute -left-10 top-0 h-full w-1/3 bg-gradient-to-b from-gold-500/25 via-transparent to-transparent blur-3xl" />
        <div className="light-ray absolute right-0 top-10 h-2/3 w-1/4 bg-gradient-to-b from-gold-400/15 via-transparent to-transparent blur-3xl" style={{ animationDelay: '4s' }} />
        <div className="grain-overlay" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-400">
          {hero.eyebrow || 'Amazônia — Ancestralidade — Rapé'}
        </span>

        <h1 className="mt-6 font-display text-4xl leading-[1.1] text-sand-100 md:text-6xl">
          {hero.title || 'Feito na floresta, para o seu centro.'}
        </h1>

        <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-sand-300/85 md:text-lg">
          {hero.subtitle ||
            'Rapés artesanais preparados por comunidades tradicionais da Amazônia, com origem rastreada e respeito à sua procedência.'}
        </p>

        <Link
          href="/produtos"
          className="focus-ring mt-10 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 font-body text-sm font-medium text-forest-950 transition-transform hover:scale-[1.03] hover:bg-gold-400"
        >
          {hero.cta_text || 'Explorar rapés'}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Divisor orgânico em forma de copa de árvore, no lugar de uma linha reta */}
      <div className="canopy-divider absolute -bottom-1 left-0 h-10 w-full bg-forest-950" />
    </section>
  );
}
