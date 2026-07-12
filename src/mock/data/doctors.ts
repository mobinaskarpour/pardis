import type { Doctor } from "@/types";

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
    aiInsight: "بار کاری بحرانی. AI پیشنهاد توزیع ۵ MRI به دستگاه ۲ می‌دهد.",
  },
];

export function findDoctorById(id: string): Doctor | undefined {
  return doctorsMock.find((d) => d.id === id);
}

export function findDoctorByName(name: string): Doctor | undefined {
  return doctorsMock.find((d) => d.name === name);
}
