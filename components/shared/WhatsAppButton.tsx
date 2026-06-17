"use client";

const WHATSAPP_ICON_PATH =
  "M16 3C9.37 3 4 8.37 4 15c0 2.34.68 4.52 1.85 6.36L4 29l7.85-1.79C13.6 28 14.78 28 16 28c6.63 0 12-5.37 12-12S22.63 3 16 3Zm0 21.8c-1.1 0-2.18-.16-3.2-.47l-.36-.11-4.45 1.02 1.05-4.34-.24-.38A9.7 9.7 0 0 1 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Zm5.4-7.35c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.62-1.5-.85-2.06-.22-.54-.45-.46-.62-.47h-.53c-.17 0-.45.07-.69.32-.24.25-.92.9-.92 2.2s.95 2.55 1.08 2.73c.13.17 1.77 2.7 4.3 3.68 2.53 1 2.53.67 2.99.63.46-.05 1.5-.6 1.71-1.2.2-.6.2-1.1.14-1.2-.06-.1-.27-.17-.57-.32Z";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] motion-safe:animate-ping motion-safe:opacity-60" />
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" className="relative">
        <path d={WHATSAPP_ICON_PATH} />
      </svg>
    </a>
  );
}
