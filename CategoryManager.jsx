'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/format';

export default function CategoryManager({ categories: initial }) {
  const router = useRouter();
  const supabase = createClient();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  async function addCategory(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: name.trim(), slug: slugify(name), position: categories.length })
      .select()
      .single();
    if (!error && data) {
      setCategories((c) => [...c, data]);
      setName('');
      router.refresh();
    }
  }

  async function removeCategory(id) {
    await supabase.from('categories').delete().eq('id', id);
    setCategories((c) => c.filter((cat) => cat.id !== id));
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900 p-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <h2 className="font-display text-base text-white">Categorias</h2>
        <span className="text-neutral-400">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-4">
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm text-neutral-200"
              >
                {c.name}
                <button
                  onClick={() => removeCategory(c.id)}
                  aria-label={`Remover ${c.name}`}
                  className="text-neutral-500 hover:text-red-400"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={addCategory} className="mt-4 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nova categoria"
              className="flex-1 rounded-lg border border-white/15 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-400"
            >
              Adicionar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
