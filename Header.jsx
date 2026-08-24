'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

export default function Header({ storeName }) {
  const { count, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forest-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl tracking-wide text-sand-100">
          {storeName || 'Rapé da Floresta'}
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-sand-200/90 md:flex">
          <Link href="/produtos" className="hover:text-gold-400 transition-colors">
            Rapés
          </Link>
          <Link href="/#origem" className="hover:text-gold-400 transition-colors">
            Origem
          </Link>
          <Link href="/#historia" className="hover:text-gold-400 transition-colors">
            Nossa história
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir carrinho"
            className="focus-ring relative rounded-full border border-white/15 px-4 py-2 font-body text-sm text-sand-100 transition-colors hover:border-gold-400"
          >
            Carrinho
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 font-mono text-[11px] text-forest-950">
                {count}
              </span>
            )}
          </button>

          <button
            className="focus-ring rounded-full border border-white/15 p-2 text-sand-100 md:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-5 py-3 font-body text-sm text-sand-200 md:hidden">
          <Link href="/produtos" className="py-2" onClick={() => setMenuOpen(false)}>
            Rapés
          </Link>
          <Link href="/#origem" className="py-2" onClick={() => setMenuOpen(false)}>
            Origem
          </Link>
          <Link href="/#historia" className="py-2" onClick={() => setMenuOpen(false)}>
            Nossa história
          </Link>
        </nav>
      )}
    </header>
  );
}
