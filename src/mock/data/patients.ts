import type { PatientListItem } from "@/types";
import { patientAhmadi } from "./ai-workspace";

export const patientsMock: PatientListItem[] = [
  {
    ...patientAhmadi,
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    insurance: "تأمین اجتماعی",
    financialStatus: "pending",
    nextAppointment: "۱۴۰۴/۰۱/۲۵ — ۱۰:۳۰",
    healthScore: 82,
  },
  {
    id: "198",
    name: "مریم کریمی",
    caseNumber: "۱۹۸",
    age: 38,
    gender: "زن",
    doctor: "دکتر حسینی",
    specialty: "سونوگرافی",
    lastVisit: "۱۴۰۴/۰۱/۲۱",
    status: "فعال",
    aiSummary:
      "بیمار با سابقه سونوگرافی شکم. آخرین گزارش تأیید شده. پیگیری ۶ ماهه پیشنهاد می‌شود.",
    timeline: [
      { date: "۱۴۰۴/۰۱/۲۱", event: "سونوگرافی شکم", type: "imaging" },
      { date: "۱۴۰۴/۰۱/۰۵", event: "ویزیت اولیه", type: "visit" },
    ],
    mri: [],
    reports: [
      { date: "۱۴۰۴/۰۱/۲۱", title: "گزارش سونوگرافی", status: "تأیید شده" },
    ],
    phone: "۰۹۱۳۳۴۴۵۵۶۶",
    insurance: "بیمه ایران",
    financialStatus: "paid",
    nextAppointment: "۱۴۰۴/۰۴/۲۱",
    healthScore: 91,
  },
  {
    id: "176",
    name: "علی محمدی",
    caseNumber: "۱۷۶",
    age: 52,
    gender: "مرد",
    doctor: "دکتر رضایی",
    specialty: "رادیولوژی",
    lastVisit: "۱۴۰۴/۰۱/۲۰",
    status: "در انتظار",
    aiSummary:
      "CT شکم انجام شده. منتظر تأیید پزشک. سابقه دیابت در پرونده ثبت شده.",
    timeline: [
      { date: "۱۴۰۴/۰۱/۲۰", event: "CT شکم", type: "imaging" },
      { date: "۱۴۰۳/۱۰/۱۵", event: "MRI زانو", type: "imaging" },
    ],
    mri: [],
    reports: [
      { date: "۱۴۰۴/۰۱/۲۰", title: "گزارش CT", status: "در انتظار تأیید" },
    ],
    phone: "۰۹۱۵۵۶۶۷۷۸۸",
    insurance: "نیروهای مسلح",
    financialStatus: "partial",
    healthScore: 74,
  },
  {
    id: "165",
    name: "فاطمه رضایی",
    caseNumber: "۱۶۵",
    age: 29,
    gender: "زن",
    doctor: "دکتر موسوی",
    specialty: "ماموگرافی",
    lastVisit: "۱۴۰۴/۰۱/۱۹",
    status: "فعال",
    aiSummary:
      "ماموگرافی غربالگری. نتیجه طبیعی. یادآوری سالانه تنظیم شده.",
    timeline: [
      { date: "۱۴۰۴/۰۱/۱۹", event: "ماموگرافی", type: "imaging" },
    ],
    mri: [],
    reports: [
      { date: "۱۴۰۴/۰۱/۱۹", title: "گزارش ماموگرافی", status: "تأیید شده" },
    ],
    financialStatus: "paid",
    healthScore: 95,
  },
  {
    id: "142",
    name: "حسین نوری",
    caseNumber: "۱۴۲",
    age: 61,
    gender: "مرد",
    doctor: "دکتر رضایی",
    specialty: "MRI",
    lastVisit: "۱۴۰۴/۰۱/۱۸",
    status: "پیگیری",
    aiSummary:
      "MRI ستون فقرات — نیاز به مقایسه با تصویر ۶ ماه قبل. AI پیشنهاد overlay دارد.",
    timeline: [
      { date: "۱۴۰۴/۰۱/۱۸", event: "MRI ستون فقرات", type: "imaging" },
    ],
    mri: [
      {
        date: "۱۴۰۴/۰۱/۱۸",
        type: "MRI ستون فقرات",
        device: "دستگاه ۱",
        status: "بررسی شده",
      },
    ],
    reports: [
      { date: "۱۴۰۴/۰۱/۱۸", title: "گزارش MRI", status: "تأیید شده" },
    ],
    financialStatus: "paid",
    healthScore: 78,
  },
  {
    id: "128",
    name: "سارا احمدی",
    caseNumber: "۱۲۸",
    age: 34,
    gender: "زن",
    doctor: "دکتر حسینی",
    specialty: "سونوگرافی",
    lastVisit: "۱۴۰۴/۰۱/۱۷",
    status: "فعال",
    aiSummary: "سونوگرافی بارداری — هفته ۲۴. همه پارامترها طبیعی.",
    timeline: [
      { date: "۱۴۰۴/۰۱/۱۷", event: "سونوگرافی بارداری", type: "imaging" },
    ],
    mri: [],
    reports: [],
    financialStatus: "paid",
    healthScore: 88,
  },
];

export function findPatientById(id: string): PatientListItem | undefined {
  return patientsMock.find((p) => p.id === id);
}
