import Link from 'next/link';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }) {
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group focus-ring block overflow-hidden rounded-2xl border border-white/10 bg-forest-900 transition-colors hover:border-gold-500/40"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-wood-900">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-wood-700 to-forest-900 font-display text-sand-300/30">
            sem foto
          </div>
        )}
        {product.promo_price && (
          <span className="absolute left-3 top-3 rounded-full bg-clay-500 px-3 py-1 font-mono text-[11px] text-sand-100">
            promoção
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-forest-950/70 font-body text-sm text-sand-200">
            Esgotado
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-sand-100">{product.name}</h3>
        {product.short_description && (
          <p className="mt-1 line-clamp-2 font-body text-sm text-sand-300/70">
            {product.short_description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2 font-mono text-sm">
          {product.promo_price ? (
            <>
              <span className="text-gold-400">{formatPrice(product.promo_price)}</span>
              <span className="text-sand-300/40 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sand-100">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
