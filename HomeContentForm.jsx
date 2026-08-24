'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function HomeContentForm({ content }) {
  const supabase = createClient();
  const [hero, setHero] = useState(content.hero || {});
  const [manifesto, setManifesto] = useState(content.manifesto || {});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    await Promise.all([
      supabase.from('home_content').upsert({ key: 'hero', value: hero, updated_at: new Date().toISOString() }),
      supabase
        .from('home_content')
        .upsert({ key: 'manifesto', value: manifesto, updated_at: new Date().toISOString() }),
    ]);

    setSaving(false);
    setSavedAt(new Date());
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <section className="rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="font-display text-lg text-white">Seção principal (Hero)</h2>

        <label className="mt-4 block text-sm text-neutral-300">
          Texto pequeno acima do título
          <input
            value={hero.eyebrow || ''}
            onChange={(e) => setHero((h) => ({ ...h, eyebrow: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-300">
          Título principal
          <textarea
            rows={2}
            value={hero.title || ''}
            onChange={(e) => setHero((h) => ({ ...h, title: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-300">
          Subtítulo
          <textarea
            rows={3}
            value={hero.subtitle || ''}
            onChange={(e) => setHero((h) => ({ ...h, subtitle: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-300">
          Texto do botão
          <input
            value={hero.cta_text || ''}
            onChange={(e) => setHero((h) => ({ ...h, cta_text: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>
      </section>

      <section className="rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="font-display text-lg text-white">Manifesto</h2>

        <label className="mt-4 block text-sm text-neutral-300">
          Título
          <textarea
            rows={2}
            value={manifesto.title || ''}
            onChange={(e) => setManifesto((m) => ({ ...m, title: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-300">
          Texto
          <textarea
            rows={4}
            value={manifesto.text || ''}
            onChange={(e) => setManifesto((m) => ({ ...m, text: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-neutral-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
        {savedAt && <span className="text-sm text-emerald-400">Salvo ✓</span>}
      </div>
    </form>
  );
}
