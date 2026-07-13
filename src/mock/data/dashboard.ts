import type { LucideIcon } from "lucide-react";
import {
  Users,
  ScanLine,
  Stethoscope,
  Wallet,
  Clock,
  Phone,
  MapPin,
  MonitorCog,
} from "lucide-react";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  icon: LucideIcon;
}

export const dashboardStats: DashboardStat[] = [
  {
    id: "patients",
    label: "بیماران امروز",
    value: "۳۴",
    delta: "۱۲٪ بیشتر از دیروز",
    deltaUp: true,
    icon: Users,
  },
  {
    id: "scans",
    label: "اسکن‌های امروز",
    value: "۲۸",
    delta: "۴ مورد در صف",
    icon: ScanLine,
  },
  {
    id: "doctors",
    label: "پزشکان حاضر",
    value: "۱۲",
    delta: "۲ نفر برنامه فشرده",
    icon: Stethoscope,
  },
  {
    id: "revenue",
    label: "درآمد امروز",
    value: "۴۸.۲M",
    delta: "۸٪ کمتر از هفته گذشته",
    deltaUp: false,
    icon: Wallet,
  },
];

export const weeklyPatients = [
  { label: "شنبه", value: 42 },
  { label: "یکشنبه", value: 38 },
  { label: "دوشنبه", value: 45 },
  { label: "سه‌شنبه", value: 31 },
  { label: "چهارشنبه", value: 36 },
  { label: "پنجشنبه", value: 24 },
  { label: "جمعه", value: 12 },
];

/** درآمد ماهانه — میلیون تومان */
export const monthlyRevenue = [
  { label: "بهمن", value: 860 },
  { label: "اسفند", value: 920 },
  { label: "فروردین", value: 780 },
  { label: "اردیبهشت", value: 1040 },
  { label: "خرداد", value: 1120 },
  { label: "تیر", value: 1210 },
];

/** سهم روش‌های تصویربرداری — اسکن این ماه */
export const modalityShare = [
  { id: "mri", label: "MRI", value: 420 },
  { id: "ct", label: "سی‌تی اسکن", value: 310 },
  { id: "sono", label: "سونوگرافی", value: 265 },
  { id: "xray", label: "رادیوگرافی", value: 190 },
];

export interface CenterFact {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
}

export const centerFacts: CenterFact[] = [
  {
    id: "devices",
    label: "دستگاه‌ها",
    value: "۳ MRI · ۲ CT · ۴ سونوگرافی",
    icon: MonitorCog,
  },
  {
    id: "staff",
    label: "کادر مرکز",
    value: "۱۲ پزشک · ۴۵ کارمند",
    icon: Users,
  },
  {
    id: "hours",
    label: "ساعت کاری",
    value: "شنبه تا پنجشنبه — ۷:۳۰ تا ۲۱:۰۰",
    icon: Clock,
  },
  {
    id: "phone",
    label: "تلفن نوبت‌دهی",
    value: "۰۲۱-۸۸۷۷۶۶۵۵",
    icon: Phone,
  },
  {
    id: "address",
    label: "نشانی",
    value: "تهران، بلوار کشاورز، پلاک ۱۲",
    icon: MapPin,
  },
];

export const chatSuggestions = [
  "گزارش دوز امروز را برای فیزیک بهداشت بفرست",
  "گزارش امروز مرکز را خلاصه کن",
  "درآمد این ماه را تحلیل کن",
];
