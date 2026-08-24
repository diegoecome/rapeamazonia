import { Fraunces, Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex',
  weight: ['400', '500'],
});

export const metadata = {
  title: 'Rapé da Floresta — Rapés artesanais de origem amazônica',
  description:
    'Rapés artesanais preparados por comunidades tradicionais da Amazônia, com origem rastreada e respeito à procedência.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
