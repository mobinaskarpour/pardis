"use client";

import { cn } from "@/lib/utils";
import {
  Scan,
  ClipboardList,
  Server,
  Magnet,
  Layers,
  Waves,
  FlaskConical,
  ShieldCheck,
  MessageCircle,
  Smartphone,
  Mail,
  Calendar,
  Sparkles,
  ScanText,
  Mic,
  Calculator,
  Contact,
  UsersRound,
  DatabaseBackup,
  Link2,
  type LucideIcon,
} from "lucide-react";

const iconFallback: Record<string, LucideIcon> = {
  scan: Scan,
  "clipboard-list": ClipboardList,
  server: Server,
  magnet: Magnet,
  layers: Layers,
  waves: Waves,
  "flask-conical": FlaskConical,
  "shield-check": ShieldCheck,
  "message-circle": MessageCircle,
  smartphone: Smartphone,
  mail: Mail,
  calendar: Calendar,
  sparkles: Sparkles,
  "scan-text": ScanText,
  mic: Mic,
  calculator: Calculator,
  contact: Contact,
  "users-round": UsersRound,
  "database-backup": DatabaseBackup,
};

interface IntegrationLogoProps {
  id: string;
  icon: string;
  color: string;
  enabled?: boolean;
  size?: "md" | "lg";
}

function BrandMark({ id, enabled }: { id: string; enabled: boolean }) {
  const opacity = enabled ? 1 : 0.45;

  switch (id) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" style={{ opacity }}>
          <path
            fill="#25D366"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
          />
          <path
            fill="#25D366"
            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect x="3" y="4" width="18" height="17" rx="3" fill="#4285F4" />
          <rect x="3" y="4" width="18" height="5" fill="#1967D2" />
          <text x="12" y="17" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">
            31
          </text>
        </svg>
      );
    case "openai":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" style={{ opacity }}>
          <path
            fill="#10a37f"
            d="M22.282 9.821a5.985 5.985 0 00-.516-4.938 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.742 7.097 5.98 5.98 0 00.511 4.938 6.051 6.051 0 006.514 2.898 5.985 5.985 0 004.997-2.9 6.055 6.055 0 003.998-2.9 5.99 5.99 0 002.29-4.392zm-9.007 7.495h-.006a4.62 4.62 0 01-3.528-1.623l-2.416-3.185a1.5 1.5 0 01-.19-1.704 1.48 1.48 0 011.704-.19l1.456 1.92V6.48a1.48 1.48 0 012.96 0v6.013l1.456-1.92a1.48 1.48 0 011.704.19 1.5 1.5 0 01-.19 1.704l-2.416 3.185a4.62 4.62 0 01-3.528 1.623z"
          />
        </svg>
      );
    case "sepidar":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="6" fill="#2d5a7b" />
          <text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
            س
          </text>
        </svg>
      );
    case "pacs":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" style={{ opacity }}>
          <rect x="2" y="4" width="20" height="16" rx="3" fill="#2d5a7b" />
          <circle cx="9" cy="11" r="2.5" fill="#4da8a8" />
          <path d="M14 15l3-4 3 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "ris":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#4a7a96" />
          <rect x="6" y="6" width="12" height="2" rx="1" fill="white" opacity="0.9" />
          <rect x="6" y="10" width="9" height="1.5" rx="0.75" fill="white" opacity="0.7" />
          <rect x="6" y="13" width="11" height="1.5" rx="0.75" fill="white" opacity="0.7" />
          <rect x="6" y="16" width="7" height="1.5" rx="0.75" fill="white" opacity="0.5" />
        </svg>
      );
    case "dicom":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#4da8a8" />
          <rect x="5" y="14" width="14" height="3" rx="1" fill="white" opacity="0.85" />
          <rect x="7" y="9" width="10" height="3" rx="1" fill="white" opacity="0.65" />
          <rect x="9" y="4" width="6" height="3" rx="1" fill="white" opacity="0.45" />
        </svg>
      );
    case "mri":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" style={{ opacity }}>
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#5b5fc7" />
          <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="2" fill="white" />
        </svg>
      );
    case "ct":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" style={{ opacity }}>
          <rect x="4" y="4" width="16" height="16" rx="3" fill="#6b7fc7" />
          <rect x="7" y="7" width="10" height="10" rx="1" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="1" opacity="0.6" />
        </svg>
      );
    case "ultrasound":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#c4a574" />
          <path d="M5 14c2-3 4-4 7-4s5 1 7 4" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M8 14c1.5-2 3-2.5 4-2.5s2.5.5 4 2.5" stroke="white" strokeWidth="1" fill="none" opacity="0.7" />
        </svg>
      );
    case "laboratory":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#4d8a5c" />
          <path d="M9 5h6l-2 9h-2L9 5z" fill="white" opacity="0.85" />
          <rect x="8" y="15" width="8" height="3" rx="1.5" fill="white" opacity="0.7" />
        </svg>
      );
    case "insurance":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#4da8a8" />
          <path d="M12 4l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-3z" fill="white" opacity="0.9" />
          <path d="M9 12l2 2 4-4" stroke="#4da8a8" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "crm":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#4da8a8" />
          <circle cx="12" cy="9" r="3" fill="white" opacity="0.9" />
          <path d="M6 19c0-3 2.5-5 6-5s6 2 6 5" fill="white" opacity="0.7" />
        </svg>
      );
    case "backup":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#4d8a5c" />
          <ellipse cx="12" cy="8" rx="6" ry="2.5" fill="white" opacity="0.85" />
          <path d="M6 8v5c0 1.5 2.7 2.7 6 2.7s6-1.2 6-2.7V8" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M6 13v3c0 1.5 2.7 2.7 6 2.7s6-1.2 6-2.7v-3" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />
        </svg>
      );
    case "active-directory":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="4" fill="#0078D4" />
          <path fill="white" d="M6 7h5v10H6zm7 0h5v10h-5z" opacity="0.9" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect x="2" y="5" width="20" height="14" rx="3" fill="#b8943a" />
          <path d="M2 8l10 6 10-6" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "sms":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect x="4" y="2" width="16" height="20" rx="3" fill="#5b5fc7" />
          <rect x="7" y="15" width="10" height="2" rx="1" fill="white" opacity="0.8" />
          <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "ocr":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#2d5a7b" />
          <rect x="5" y="6" width="14" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M8 10h8M8 13h5" stroke="white" strokeWidth="1.2" opacity="0.85" />
        </svg>
      );
    case "voice":
      return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ opacity }}>
          <rect width="24" height="24" rx="5" fill="#4da8a8" />
          <rect x="10" y="5" width="4" height="9" rx="2" fill="white" opacity="0.9" />
          <path d="M8 12a4 4 0 008 0" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M12 16v3M9 19h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function IntegrationLogo({
  id,
  icon,
  color,
  enabled = true,
  size = "lg",
}: IntegrationLogoProps) {
  const brandEl = BrandMark({ id, enabled });
  const Fallback = iconFallback[icon] ?? Link2;
  const boxSize = size === "lg" ? "h-14 w-14 rounded-[16px]" : "h-11 w-11 rounded-[13px]";
  const iconSize = size === "lg" ? 26 : 22;

  return (
    <div
      className={cn(
        "flex items-center justify-center shadow-[var(--shadow-sm)] transition-all duration-[180ms]",
        boxSize
      )}
      style={{
        background: enabled
          ? `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`
          : "linear-gradient(135deg, #8b919a12 0%, #8b919a06 100%)",
        border: `1px solid ${enabled ? `${color}28` : "#8b919a18"}`,
      }}
    >
      {brandEl ?? (
        <Fallback
          size={iconSize}
          strokeWidth={1.5}
          style={{ color: enabled ? color : "#8b919a" }}
        />
      )}
    </div>
  );
}
