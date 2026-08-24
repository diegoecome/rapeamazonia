'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/format';

const BUCKET = 'product-images';

const EMPTY = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  price: '',
  promo_price: '',
  category_id: '',
  stock: 0,
  weight_grams: '',
  origin_region: '',
  origin_community: '',
  origin_producer: '',
  ingredients: '',
  process_notes: '',
  origin_story: '',
  status: 'active',
};

export default function ProductForm({ product, images: initialImages, categories }) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = Boolean(product);

  const [form, setForm] = useState(() =>
    product ? { ...EMPTY, ...product } : { ...EMPTY }
  );
  const [images, setImages] = useState(initialImages || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleNameChange(value) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: isEditing ? f.slug : slugify(value),
    }));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!isEditing) {
      setError('Salve o produto primeiro para depois adicionar fotos.');
      return;
    }

    setUploading(true);
    setError('');

    for (const file of files) {
      const path = `${product.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file);

      if (uploadError) {
        setError(`Erro ao enviar imagem: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const { data: newImage, error: insertError } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          url: publicUrl.publicUrl,
          position: images.length,
          is_main: images.length === 0,
        })
        .select()
        .single();

      if (!insertError && newImage) {
        setImages((prev) => [...prev, newImage]);
      }
    }

    setUploading(false);
    e.target.value = '';
  }

  async function setMainImage(imageId) {
    await supabase.from('product_images').update({ is_main: false }).eq('product_id', product.id);
    await supabase.from('product_images').update({ is_main: true }).eq('id', imageId);
    setImages((prev) => prev.map((img) => ({ ...img, is_main: img.id === imageId })));
  }

  async function deleteImage(imageId) {
    await supabase.from('product_images').delete().eq('id', imageId);
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function moveImage(index, direction) {
    const newImages = [...images];
    const target = index + direction;
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    setImages(newImages);
    await Promise.all(
      newImages.map((img, i) =>
        supabase.from('product_images').update({ position: i }).eq('id', img.id)
      )
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      short_description: form.short_description || null,
      description: form.description || null,
      price: parseFloat(form.price) || 0,
      promo_price: form.promo_price ? parseFloat(form.promo_price) : null,
      category_id: form.category_id || null,
      stock: parseInt(form.stock, 10) || 0,
      weight_grams: form.weight_grams ? parseInt(form.weight_grams, 10) : null,
      origin_region: form.origin_region || null,
      origin_community: form.origin_community || null,
      origin_producer: form.origin_producer || null,
      ingredients: form.ingredients || null,
      process_notes: form.process_notes || null,
      origin_story: form.origin_story || null,
      status: form.status,
      updated_at: new Date().toISOString(),
    };

    if (isEditing) {
      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      router.refresh();
      setSaving(false);
    } else {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
      router.push(`/admin/produtos/${data.id}`);
    }
  }

  async function handleDelete() {
    setSaving(true);
    await supabase.from('products').delete().eq('id', product.id);
    router.push('/admin/produtos');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="font-display text-lg text-white">Informações básicas</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-neutral-300 sm:col-span-2">
            Nome do produto
            <input
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>

          <label className="text-sm text-neutral-300 sm:col-span-2">
            URL amigável (slug)
            <input
              required
              value={form.slug}
              onChange={(e) => update('slug', slugify(e.target.value))}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 font-mono text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </label>

          <label className="text-sm text-neutral-300 sm:col-span-2">
            Descrição curta (aparece nos cards)
            <input
              value={form.short_description}
              onChange={(e) => update('short_description', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>

          <label className="text-sm text-neutral-300 sm:col-span-2">
            Descrição completa
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>

          <label className="text-sm text-neutral-300">
            Categoria
            <select
              value={form.category_id || ''}
              onChange={(e) => update('category_id', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-neutral-300">
            Status
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="active">Ativo (visível na loja)</option>
              <option value="paused">Pausado (oculto)</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="font-display text-lg text-white">Preço e estoque</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="text-sm text-neutral-300">
            Preço (R$)
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-neutral-300">
            Preço promocional (R$)
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.promo_price}
              onChange={(e) => update('promo_price', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-neutral-300">
            Estoque
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => update('stock', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-neutral-300">
            Peso (g)
            <input
              type="number"
              min="0"
              value={form.weight_grams}
              onChange={(e) => update('weight_grams', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-white/10 bg-neutral-900 p-6">
        <h2 className="font-display text-lg text-white">Origem</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Preencha apenas com informações reais fornecidas pelo produtor. Deixe em branco o que não
          tiver confirmação.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-neutral-300">
            Região
            <input
              value={form.origin_region}
              onChange={(e) => update('origin_region', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-neutral-300">
            Comunidade / Povo
            <input
              value={form.origin_community}
              onChange={(e) => update('origin_community', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-neutral-300">
            Produtor
            <input
              value={form.origin_producer}
              onChange={(e) => update('origin_producer', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-neutral-300">
            Ingredientes
            <input
              value={form.ingredients}
              onChange={(e) => update('ingredients', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-neutral-300 sm:col-span-2">
            Processo de produção
            <textarea
              rows={3}
              value={form.process_notes}
              onChange={(e) => update('process_notes', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="text-sm text-neutral-300 sm:col-span-2">
            História / contexto
            <textarea
              rows={3}
              value={form.origin_story}
              onChange={(e) => update('origin_story', e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </label>
        </div>
      </section>

      {isEditing && (
        <section className="mt-6 rounded-xl border border-white/10 bg-neutral-900 p-6">
          <h2 className="font-display text-lg text-white">Fotos do produto</h2>

          <label className="mt-4 inline-block cursor-pointer rounded-lg border border-dashed border-white/20 px-4 py-2.5 text-sm text-neutral-300 hover:border-amber-400">
            {uploading ? 'Enviando...' : '+ Adicionar fotos'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {images.map((img, i) => (
                <li key={img.id} className="relative rounded-lg border border-white/10 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="aspect-square w-full rounded-md object-cover" />
                  {img.is_main && (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium text-neutral-950">
                      principal
                    </span>
                  )}
                  <div className="mt-2 flex items-center justify-between gap-1 text-xs">
                    <button type="button" onClick={() => moveImage(i, -1)} className="text-neutral-400 hover:text-white">
                      ↑
                    </button>
                    <button type="button" onClick={() => moveImage(i, 1)} className="text-neutral-400 hover:text-white">
                      ↓
                    </button>
                    {!img.is_main && (
                      <button type="button" onClick={() => setMainImage(img.id)} className="text-amber-400 hover:text-amber-300">
                        tornar principal
                      </button>
                    )}
                    <button type="button" onClick={() => deleteImage(img.id)} className="text-red-400 hover:text-red-300">
                      excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-neutral-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar produto'}
        </button>

        {isEditing && !confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
          >
            Excluir produto
          </button>
        )}

        {isEditing && confirmDelete && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-300">Confirma a exclusão?</span>
            <button type="button" onClick={handleDelete} className="text-red-400 hover:underline">
              Sim, excluir
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="text-neutral-400 hover:underline">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
