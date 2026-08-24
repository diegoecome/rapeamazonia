'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function StoreSettingsForm({ settings }) {
  const supabase = createClient();
  const [storeInfo, setStoreInfo] = useState(settings.store_info || {});
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || {});
  const [delivery, setDelivery] = useState(settings.delivery || {});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    await Promise.all([
      supabase
        .from('store_settings')
        .upsert({ key: 'store_info', value: storeInfo, updated_at: new Date().toISOString() }),
      supabase
        .from('store_settings')
        .upsert({ key: 'whatsapp', value: whatsapp, updated_at: new Date().toISOString() }),
      supabase
        .from('store_settings')
        .upsert({ key: 'delivery', value: delivery, updated_at: new Date().toISOString() }),
    ]);

    setSaving(false);
    setSavedAt(new Date());
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <section className="rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="font-display text-lg text-white">WhatsApp</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Número que recebe os pedidos. Formato: código do país + DDD + número, só dígitos (ex:
          5548999999999).
        </p>
        <label className="mt-4 block text-sm text-neutral-300">
          Número do WhatsApp
          <input
            value={whatsapp.number || ''}
            onChange={(e) => setWhatsapp((w) => ({ ...w, number: e.target.value.replace(/\D/g, '') }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 font-mono text-white focus:border-amber-400 focus:outline-none"
          />
        </label>
      </section>

      <section className="rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="font-display text-lg text-white">Informações da loja</h2>

        <label className="mt-4 block text-sm text-neutral-300">
          Nome da loja
          <input
            value={storeInfo.name || ''}
            onChange={(e) => setStoreInfo((s) => ({ ...s, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-300">
          Descrição curta
          <input
            value={storeInfo.description || ''}
            onChange={(e) => setStoreInfo((s) => ({ ...s, description: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-300">
          Instagram (com ou sem @)
          <input
            value={storeInfo.instagram || ''}
            onChange={(e) => setStoreInfo((s) => ({ ...s, instagram: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm text-neutral-300">
          E-mail de contato
          <input
            type="email"
            value={storeInfo.email_contato || ''}
            onChange={(e) => setStoreInfo((s) => ({ ...s, email_contato: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>
      </section>

      <section className="rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="font-display text-lg text-white">Entrega</h2>
        <label className="mt-4 block text-sm text-neutral-300">
          Texto sobre envio (aparece no rodapé da loja)
          <textarea
            rows={3}
            value={delivery.text || ''}
            onChange={(e) => setDelivery((d) => ({ ...d, text: e.target.value }))}
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
