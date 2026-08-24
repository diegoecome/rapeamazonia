import { notFound } from 'next/navigation';
import { getProductBySlug, getStoreSettings } from '@/lib/queries';
import ProductGallery from '@/components/ProductGallery';
import AddToCartButton from '@/components/AddToCartButton';
import { formatPrice } from '@/lib/format';

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — Rapé da Floresta`,
    description: product.short_description || product.description,
  };
}

export default async function ProductPage({ params }) {
  const [product, storeSettings] = await Promise.all([
    getProductBySlug(params.slug),
    getStoreSettings(),
  ]);

  if (!product || product.status !== 'active') notFound();

  const hasOrigin =
    product.origin_region ||
    product.origin_community ||
    product.origin_producer ||
    product.ingredients ||
    product.process_notes ||
    product.origin_story;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          {product.categories?.name && (
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400">
              {product.categories.name}
            </span>
          )}
          <h1 className="mt-2 font-display text-3xl text-sand-100 md:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3 font-mono text-xl">
            {product.promo_price ? (
              <>
                <span className="text-gold-400">{formatPrice(product.promo_price)}</span>
                <span className="text-sand-300/40 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-sand-100">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.weight_grams && (
            <p className="mt-1 font-body text-sm text-sand-300/60">{product.weight_grams}g</p>
          )}

          {product.description && (
            <p className="mt-6 font-body leading-relaxed text-sand-300/85">{product.description}</p>
          )}

          <div className="mt-8">
            <AddToCartButton product={product} whatsappNumber={storeSettings?.whatsapp?.number} />
          </div>
        </div>
      </div>

      {hasOrigin && (
        <div className="mt-20 border-t border-white/10 pt-14">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-400">Origem</span>
          <h2 className="mt-2 font-display text-2xl text-sand-100">De onde vem este rapé</h2>

          <dl className="mt-8 grid gap-8 md:grid-cols-2">
            {product.origin_region && (
              <div>
                <dt className="font-body text-xs uppercase tracking-wide text-sand-300/50">Região</dt>
                <dd className="mt-1 font-body text-sand-200">{product.origin_region}</dd>
              </div>
            )}
            {product.origin_community && (
              <div>
                <dt className="font-body text-xs uppercase tracking-wide text-sand-300/50">
                  Comunidade / Povo
                </dt>
                <dd className="mt-1 font-body text-sand-200">{product.origin_community}</dd>
              </div>
            )}
            {product.origin_producer && (
              <div>
                <dt className="font-body text-xs uppercase tracking-wide text-sand-300/50">Produtor</dt>
                <dd className="mt-1 font-body text-sand-200">{product.origin_producer}</dd>
              </div>
            )}
            {product.ingredients && (
              <div>
                <dt className="font-body text-xs uppercase tracking-wide text-sand-300/50">
                  Ingredientes
                </dt>
                <dd className="mt-1 font-body text-sand-200">{product.ingredients}</dd>
              </div>
            )}
            {product.process_notes && (
              <div className="md:col-span-2">
                <dt className="font-body text-xs uppercase tracking-wide text-sand-300/50">Processo</dt>
                <dd className="mt-1 font-body leading-relaxed text-sand-200">{product.process_notes}</dd>
              </div>
            )}
            {product.origin_story && (
              <div className="md:col-span-2">
                <dt className="font-body text-xs uppercase tracking-wide text-sand-300/50">História</dt>
                <dd className="mt-1 font-body leading-relaxed text-sand-200">{product.origin_story}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </section>
  );
}
