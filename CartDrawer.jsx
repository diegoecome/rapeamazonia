'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, total } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Fechar carrinho"
        className="absolute inset-0 bg-black/60"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative flex h-full w-full max-w-md flex-col bg-forest-900 shadow-lift">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-display text-xl text-sand-100">Seu carrinho</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fechar"
            className="focus-ring rounded-full p-2 text-sand-200 hover:text-gold-400"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center font-body text-sand-300/60">
              Seu carrinho está vazio.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-wood-900">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm text-sand-100">{item.name}</p>
                    <p className="mt-1 font-mono text-sm text-gold-400">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-white/15">
                        <button
                          className="focus-ring px-2.5 py-1 text-sand-200"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>
                        <span className="px-2 font-mono text-sm text-sand-100">{item.qty}</span>
                        <button
                          className="focus-ring px-2.5 py-1 text-sand-200"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="focus-ring font-body text-xs text-sand-300/50 hover:text-clay-500"
                      >
                        remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            <div className="mb-4 flex items-center justify-between font-body">
              <span className="text-sand-300/70">Total</span>
              <span className="font-mono text-lg text-sand-100">{formatPrice(total)}</span>
            </div>
            <Link
              href="/carrinho"
              onClick={() => setIsOpen(false)}
              className="focus-ring block w-full rounded-full bg-gold-500 py-3 text-center font-body text-sm font-medium text-forest-950 transition-colors hover:bg-gold-400"
            >
              Finalizar pedido
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
