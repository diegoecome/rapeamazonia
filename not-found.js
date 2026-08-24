import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-forest-950 px-5 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400">404</span>
      <h1 className="mt-3 font-display text-3xl text-sand-100">Página não encontrada</h1>
      <p className="mt-2 font-body text-sand-300/70">
        O caminho que você seguiu não leva a lugar nenhum na floresta.
      </p>
      <Link
        href="/"
        className="focus-ring mt-8 rounded-full bg-gold-500 px-6 py-2.5 font-body text-sm font-medium text-forest-950 hover:bg-gold-400"
      >
        Voltar para a home
      </Link>
    </div>
  );
}
