'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const LINKS = [
  { href: '/admin', label: 'Visão geral', exact: true },
  { href: '/admin/produtos', label: 'Produtos' },
  { href: '/admin/home', label: 'Página inicial' },
  { href: '/admin/configuracoes', label: 'Configurações' },
];

export default function AdminSidebar({ email }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col justify-between border-r border-white/10 bg-neutral-900 p-5">
      <div>
        <p className="px-2 font-display text-lg text-white">Painel</p>
        <nav className="mt-6 flex flex-col gap-1">
          {LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="truncate px-2 text-xs text-neutral-500">{email}</p>
        <Link href="/" className="mt-2 block rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-white/5 hover:text-white">
          Ver loja
        </Link>
        <button
          onClick={handleLogout}
          className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-400 hover:bg-white/5 hover:text-white"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
