import Link from 'next/link';

export default function Footer({ storeSettings }) {
  const info = storeSettings?.store_info || {};
  const delivery = storeSettings?.delivery || {};

  return (
    <footer className="border-t border-white/10 bg-forest-950 px-5 py-14 font-body text-sand-300">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg text-sand-100">{info.name || 'Rapé da Floresta'}</h3>
          <p className="mt-3 text-sm leading-relaxed text-sand-300/80">
            {info.description || 'Rapés artesanais de origem amazônica.'}
          </p>
        </div>

        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.2em] text-gold-400">Envio</h4>
          <p className="mt-3 text-sm leading-relaxed text-sand-300/80">
            {delivery.text || 'Consulte prazos e formas de envio pelo WhatsApp.'}
          </p>
        </div>

        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.2em] text-gold-400">Contato</h4>
          <ul className="mt-3 space-y-2 text-sm text-sand-300/80">
            {info.instagram && (
              <li>
                <a
                  href={`https://instagram.com/${info.instagram.replace('@', '')}`}
                  className="hover:text-gold-400"
                  target="_blank"
                  rel="noreferrer"
                >
                  {info.instagram}
                </a>
              </li>
            )}
            {info.email_contato && <li>{info.email_contato}</li>}
            <li>
              <Link href="/admin/login" className="text-sand-300/40 hover:text-sand-300/70">
                Acesso administrativo
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-white/5 pt-6 text-xs text-sand-300/40">
        © {new Date().getFullYear()} {info.name || 'Rapé da Floresta'}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
