import { Mail, Phone } from "lucide-react";

const WHATSAPP_ICON_PATH =
  "M16 3C9.37 3 4 8.37 4 15c0 2.34.68 4.52 1.85 6.36L4 29l7.85-1.79C13.6 28 14.78 28 16 28c6.63 0 12-5.37 12-12S22.63 3 16 3Zm0 21.8c-1.1 0-2.18-.16-3.2-.47l-.36-.11-4.45 1.02 1.05-4.34-.24-.38A9.7 9.7 0 0 1 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Zm5.4-7.35c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.62-1.5-.85-2.06-.22-.54-.45-.46-.62-.47h-.53c-.17 0-.45.07-.69.32-.24.25-.92.9-.92 2.2s.95 2.55 1.08 2.73c.13.17 1.77 2.7 4.3 3.68 2.53 1 2.53.67 2.99.63.46-.05 1.5-.6 1.71-1.2.2-.6.2-1.1.14-1.2-.06-.1-.27-.17-.57-.32Z";

function toWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Heuristic: a leading 0 is a local Nigerian number — prefix country code.
  return digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
}

export function AgentContactButtons({
  phone,
  email,
  name,
  className,
}: {
  phone?: string | null;
  email?: string | string[] | null;
  name?: string | null;
  className?: string;
}) {
  const wa = phone ? toWhatsApp(phone) : "";
  const label = name ?? "this agent";
  const emails = email ? (Array.isArray(email) ? email : [email]) : [];

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {phone && (
        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          aria-label={`Call ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
        >
          <Phone size={17} />
        </a>
      )}
      {wa && (
        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" aria-hidden>
            <path d={WHATSAPP_ICON_PATH} />
          </svg>
        </a>
      )}
      {emails.map((e) => (
        <a
          key={e}
          href={`mailto:${e}`}
          aria-label={`Email ${label} at ${e}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
        >
          <Mail size={17} />
        </a>
      ))}
    </div>
  );
}
