import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditarProdutoPage({ params }) {
  const supabase = createClient();

  const [{ data: product }, { data: images }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase
      .from('product_images')
      .select('*')
      .eq('product_id', params.id)
      .order('position', { ascending: true }),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-white">Editar produto</h1>
      <p className="mt-1 text-sm text-neutral-400">{product.name}</p>

      <div className="mt-6">
        <ProductForm product={product} images={images || []} categories={categories || []} />
      </div>
    </div>
  );
}
