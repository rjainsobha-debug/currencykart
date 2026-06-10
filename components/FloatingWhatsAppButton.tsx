import { MessageCircle } from "lucide-react";
import { brand } from "@/config/brand";

export function FloatingWhatsAppButton() {
  return (
    <a
      href={brand.whatsappUrl}
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-emerald text-white shadow-[0_18px_40px_rgba(16,185,129,0.34)] ring-4 ring-white transition hover:-translate-y-1 hover:scale-105"
      aria-label="Ask about a forex order on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}
