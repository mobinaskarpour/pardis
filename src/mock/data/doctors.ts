import type { Doctor } from "@/types";
import { media } from "./media";

export const doctorsMock: Doctor[] = [
  {
    id: "dr-rezaei",
    name: "دکتر رضایی",
    specialty: "رادیولوژی",
    patients: 48,
    revenue: "۳۲۰M",
    satisfaction: 94,
    avgReportTime: "۲.۴ ساعت",
    workload: "busy",
    schedule: "امروز ۱۲ بیمار",
    avatarUrl: media.doctors.rezaei,
    coverImageUrl: media.facility.mriRoom,
    videoIntroUrl: media.videos.facilityTour,
    recentPatients: ["محمد احمدی", "علی محمدی", "حسین نوری"],
    aiInsight:
      "زمان گزارش‌دهی ۱۵٪ بهتر از میانگین. پیشنهاد: ۲ بیمار فردا redistribute شود.",
  },
  {
    id: "dr-hosseini",
    name: "دکتر حسینی",
    specialty: "سونوگرافی",
    patients: 36,
    revenue: "۱۸۵M",
    satisfaction: 91,
    avgReportTime: "۱.۸ ساعت",
    workload: "normal",
    schedule: "امروز ۸ بیمار",
    avatarUrl: media.doctors.hosseini,
    coverImageUrl: media.facility.reception,
    recentPatients: ["مریم کریمی", "سارا احمدی"],
    aiInsight: "عملکرد پایدار. ظرفیت برای ۳ بیمار اضافه وجود دارد.",
  },
  {
    id: "dr-mousavi",
    name: "دکتر موسوی",
    specialty: "ماموگرافی",
    patients: 28,
    revenue: "۱۴۲M",
    satisfaction: 96,
    avgReportTime: "۱.۵ ساعت",
    workload: "normal",
    schedule: "امروز ۶ بیمار",
    avatarUrl: media.doctors.mousavi,
    coverImageUrl: media.facility.waitingArea,
    recentPatients: ["فاطمه رضایی", "لیلا فرهادی"],
    aiInsight:
      "بالاترین رضایت در مرکز. الگوی کاری برای سایر پزشکان پیشنهاد می‌شود.",
  },
  {
    id: "dr-karimi",
    name: "دکتر کریمی",
    specialty: "MRI",
    patients: 52,
    revenue: "۴۱۰M",
    satisfaction: 89,
    avgReportTime: "۳.۱ ساعت",
    workload: "critical",
    schedule: "امروز ۱۵ بیمار",
    avatarUrl: media.doctors.karimi,
    coverImageUrl: media.facility.mriRoom,
    videoIntroUrl: media.videos.mriScanDemo,
    recentPatients: ["رضا موسوی", "امیر حسینی"],
    aiInsight: "بار کاری بحرانی. AI پیشنهاد توزیع ۵ MRI به دستگاه ۲ می‌دهد.",
  },
  {
    id: "dr-akbari",
    name: "دکتر اکبری",
    specialty: "رادیولوژی — CT",
    patients: 31,
    revenue: "۱۹۸M",
    satisfaction: 92,
    avgReportTime: "۲.۱ ساعت",
    workload: "busy",
    schedule: "امروز ۹ بیمار",
    avatarUrl: media.doctors.akbari,
    coverImageUrl: media.facility.centerHall,
    recentPatients: ["زهرا صادقی"],
    aiInsight:
      "تخصص در CT سینه و شکم. میانگین زمان تأیید گزارش ۲۰٪ کمتر از ماه گذشته.",
  },
  {
    id: "dr-shafiei",
    name: "دکتر شفیعی",
    specialty: "MRI — ارتوپدی",
    patients: 39,
    revenue: "۲۶۵M",
    satisfaction: 90,
    avgReportTime: "۲.۷ ساعت",
    workload: "busy",
    schedule: "امروز ۱۰ بیمار",
    avatarUrl: media.doctors.shafiei,
    coverImageUrl: media.facility.mriRoom,
    recentPatients: ["امیر حسینی"],
    aiInsight:
      "متخصص MRI مفاصل. ۴ گزارش در انتظار تأیید — اولویت با پرونده ۱۵۵.",
  },
];

export function findDoctorById(id: string): Doctor | undefined {
  return doctorsMock.find((d) => d.id === id);
}

export function findDoctorByName(name: string): Doctor | undefined {
  return doctorsMock.find((d) => d.name === name);
}
