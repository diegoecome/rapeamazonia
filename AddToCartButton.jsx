'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function AddToCartButton({ product, whatsappNumber }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const outOfStock = product.stock <= 0;

  const buyNowLink = buildWhatsAppLink({
    number: whatsappNumber,
    items: [
      {
        name: product.name,
        qty,
        price: product.promo_price || product.price,
      },
    ],
    total: (product.promo_price || product.price) * qty,
    customer: null,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-white/15">
          <button
            className="focus-ring px-4 py-2.5 text-sand-200"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span className="px-3 font-mono text-sand-100">{qty}</span>
          <button
            className="focus-ring px-4 py-2.5 text-sand-200"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        <button
          disabled={outOfStock}
          onClick={() => addItem(product, qty)}
          className="focus-ring flex-1 rounded-full border border-gold-500 py-3 font-body text-sm font-medium text-gold-400 transition-colors hover:bg-gold-500 hover:text-forest-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {outOfStock ? 'Esgotado' : 'Adicionar ao carrinho'}
        </button>
      </div>

      {!outOfStock && (
        <a
          href={buyNowLink}
          target="_blank"
          rel="noreferrer"
          className="focus-ring rounded-full bg-gold-500 py-3 text-center font-body text-sm font-medium text-forest-950 transition-colors hover:bg-gold-400"
        >
          Comprar agora via WhatsApp
        </a>
      )}
    </div>
  );
}
