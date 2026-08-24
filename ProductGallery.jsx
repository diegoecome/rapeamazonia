'use client';

import { useState } from 'react';

export default function ProductGallery({ images, productName }) {
  const [active, setActive] = useState(0);
  const list = images && images.length > 0 ? images : [{ url: null }];

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl bg-wood-900">
        {list[active]?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={list[active].url}
            alt={productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-sand-300/30">
            sem foto
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-4 flex gap-3">
          {list.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1}`}
              className={`focus-ring h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                active === i ? 'border-gold-400' : 'border-white/10'
              }`}
            >
              {img.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
