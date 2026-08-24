import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function WhatsAppFloatButton({ number }) {
  if (!number) return null;

  const link = buildWhatsAppLink({ number, items: [], total: 0, customer: null });

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="focus-ring fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lift transition-transform hover:scale-105"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.34 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C22 6.45 17.5 2 12.04 2zm5.8 14.1c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.09-2.5-.53-2.1-.87-3.47-2.99-3.58-3.13-.1-.14-.86-1.14-.86-2.18 0-1.04.54-1.55.74-1.77.2-.21.43-.26.58-.26.14 0 .29 0 .41.01.14.01.32-.05.5.38.19.45.65 1.55.7 1.66.06.11.09.24.02.39-.07.14-.11.23-.22.35-.11.13-.23.29-.33.39-.11.11-.23.23-.1.45.13.22.58.96 1.25 1.55.86.77 1.58 1.01 1.8 1.12.22.11.35.09.48-.05.14-.14.57-.66.72-.89.15-.22.3-.19.5-.11.2.07 1.28.6 1.5.71.22.11.36.16.42.25.06.1.06.53-.18 1.21z" />
      </svg>
    </a>
  );
}
