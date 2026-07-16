/** Primary navigation — four core experiences + secondary modules drawer */

export interface PrimaryNavItem {
  id: string;
  emoji: string;
  label: string;
  subtitle: string;
  href: string;
  /** Highlight as the platform's core experience */
  featured?: boolean;
}

export interface MoreNavItem {
  id: string;
  emoji: string;
  label: string;
  href: string;
}

export const primaryNavItems: PrimaryNavItem[] = [
  {
    id: "mission-control",
    emoji: "🏠",
    label: "مرکز فرمان",
    subtitle: "Executive Dashboard",
    href: "/",
  },
  {
    id: "ai-conversation",
    emoji: "🤖",
    label: "گفتگو با ماشین",
    subtitle: "AI Workspace",
    href: "/chat",
    featured: true,
  },
  {
    id: "workflow-studio",
    emoji: "⚙️",
    label: "ورک‌فلو",
    subtitle: "Workflow Studio",
    href: "/workflows",
  },
  {
    id: "integrations",
    emoji: "🔗",
    label: "اتصالات",
    subtitle: "Smart Integrations",
    href: "/integrations",
  },
];

export const moreNavItems: MoreNavItem[] = [
  { id: "patients", emoji: "🏥", label: "بیماران", href: "/patients" },
  { id: "doctors", emoji: "👨‍⚕️", label: "پزشکان", href: "/doctors" },
  { id: "imaging", emoji: "🩻", label: "تصویربرداری", href: "/imaging" },
  { id: "appointments", emoji: "📅", label: "نوبت‌ها", href: "/appointments" },
  { id: "reports", emoji: "📄", label: "گزارش‌ها", href: "/reports" },
  { id: "analytics", emoji: "📊", label: "تحلیل‌های پیشرفته", href: "/analytics" },
  { id: "financial", emoji: "💰", label: "مالی", href: "/financial" },
  { id: "knowledge", emoji: "🧠", label: "پایگاه دانش", href: "/knowledge" },
  { id: "users", emoji: "👥", label: "کاربران", href: "/users" },
  { id: "roles", emoji: "🛡", label: "نقش‌ها و دسترسی", href: "/roles" },
  { id: "notifications", emoji: "🔔", label: "اعلان‌ها", href: "/notifications" },
  { id: "settings", emoji: "⚙️", label: "تنظیمات", href: "/settings" },
];

const moreHrefs = new Set(moreNavItems.map((item) => item.href));

export function isPrimaryNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isMoreNavActive(pathname: string): boolean {
  if (moreHrefs.has(pathname)) return true;
  return moreNavItems.some(
    (item) => item.href !== "/" && pathname.startsWith(`${item.href}/`)
  );
}

export function getNavTitle(pathname: string): string | null {
  const primary = primaryNavItems.find((item) => isPrimaryNavActive(pathname, item.href));
  if (primary) return primary.label;

  const more = moreNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  if (more) return more.label;

  if (pathname.startsWith("/patients/")) return "پرونده بیمار";
  if (pathname.startsWith("/doctors/")) return "پروفایل پزشک";

  return null;
}

/** @deprecated Use primaryNavItems + moreNavItems — kept for API/search compatibility */
export const dockItems = [
  ...primaryNavItems.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    icon:
      item.id === "mission-control"
        ? "home"
        : item.id === "ai-conversation"
          ? "sparkles"
          : item.id === "workflow-studio"
            ? "git-branch"
            : "plug",
  })),
  ...moreNavItems.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    icon:
      item.id === "patients"
        ? "users"
        : item.id === "doctors"
          ? "stethoscope"
          : item.id === "imaging"
            ? "scan"
            : item.id === "appointments"
              ? "calendar"
              : item.id === "reports"
                ? "file-text"
                : item.id === "analytics"
                  ? "activity"
                  : item.id === "financial"
                    ? "wallet"
                    : item.id === "knowledge"
                      ? "book"
                      : item.id === "users"
                        ? "users"
                        : item.id === "roles"
                          ? "shield"
                          : item.id === "notifications"
                            ? "bell"
                            : "settings",
  })),
];
