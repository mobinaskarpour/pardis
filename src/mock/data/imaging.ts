import type { ImagingStudy, ImagingDevice } from "@/types/imaging";
import { media } from "./media";

export const imagingStudiesMock: ImagingStudy[] = [
  {
    id: "img-214-mri-brain",
    patientId: "214",
    patientName: "محمد احمدی",
    caseNumber: "۲۱۴",
    modality: "MRI",
    bodyPart: "مغز",
    device: "دستگاه ۲ — Siemens Magnetom",
    physician: "دکتر رضایی",
    acquiredAt: "۱۴۰۴/۰۱/۲۲ — ۰۹:۱۵",
    status: "آماده بررسی",
    waitMinutes: 47,
    thumbnailUrl: media.imaging.mriBrain,
    previewUrl: media.imaging.mriBrainPhoto,
    videoUrl: media.videos.mriScanDemo,
    series: [
      { id: "s1", label: "T1 Sagittal", sliceCount: 24, thumbnailUrl: media.imaging.mriBrain },
      { id: "s2", label: "T2 Axial", sliceCount: 32, thumbnailUrl: media.imaging.mriBrain },
      { id: "s3", label: "FLAIR", sliceCount: 28, thumbnailUrl: media.imaging.mriBrain },
      { id: "s4", label: "DWI", sliceCount: 20, thumbnailUrl: media.imaging.mriBrain },
    ],
    aiAnalysis: {
      summary:
        "ضایعه هیپوکامپ راست با اندازه ۸ میلی‌متر شناسایی شد. پیشنهاد مقایسه با MRI قبلی (۱۴۰۳/۱۱/۱۵).",
      findings: [
        "T2 hyperintensity در لوب temporal راست",
        "عدم وسیع‌شدگی پس از تزریق در ناحیه مشکوک",
        "خط میانی در موقعیت طبیعی",
      ],
      confidence: 87,
      urgency: "attention",
      suggestedAction: "ارجاع فوری به دکتر رضایی برای تأیید",
    },
  },
  {
    id: "img-176-ct-abd",
    patientId: "176",
    patientName: "علی محمدی",
    caseNumber: "۱۷۶",
    modality: "CT",
    bodyPart: "شکم و لگن",
    device: "دستگاه ۱ — GE Revolution",
    physician: "دکتر رضایی",
    acquiredAt: "۱۴۰۴/۰۱/۲۰ — ۱۱:۴۰",
    status: "در انتظار تأیید",
    waitMinutes: 125,
    thumbnailUrl: media.imaging.ctAbdomen,
    previewUrl: media.imaging.ctScanPhoto,
    series: [
      { id: "s1", label: "Axial بدون تزریق", sliceCount: 48, thumbnailUrl: media.imaging.ctAbdomen },
      { id: "s2", label: "Axial با تزریق", sliceCount: 48, thumbnailUrl: media.imaging.ctAbdomen },
    ],
    aiAnalysis: {
      summary:
        "تصاویر CT شکم با کیفیت مناسب. AI سنگ کلیه ۴ میلی‌متری در کلیه چپ را علامت‌گذاری کرده است.",
      findings: [
        "سنگ ۴mm در lower pole کلیه چپ",
        "کبد و طحال در محدوده طبیعی",
        "بدون free fluid",
      ],
      confidence: 92,
      urgency: "normal",
      suggestedAction: "ثبت در پرونده و اطلاع‌رسانی به بیمار",
    },
  },
  {
    id: "img-142-mri-spine",
    patientId: "142",
    patientName: "حسین نوری",
    caseNumber: "۱۴۲",
    modality: "MRI",
    bodyPart: "ستون فقرات کمری",
    device: "دستگاه ۱",
    physician: "دکتر کریمی",
    acquiredAt: "۱۴۰۴/۰۱/۱۸ — ۱۴:۲۰",
    status: "تأیید شده",
    thumbnailUrl: media.imaging.mriSpine,
    previewUrl: media.imaging.mriSpine,
    videoUrl: media.videos.workflowDemo,
    series: [
      { id: "s1", label: "T1 Sagittal", sliceCount: 18, thumbnailUrl: media.imaging.mriSpine },
      { id: "s2", label: "T2 Sagittal", sliceCount: 18, thumbnailUrl: media.imaging.mriSpine },
      { id: "s3", label: "T2 Axial L4-L5", sliceCount: 16, thumbnailUrl: media.imaging.mriSpine },
    ],
    aiAnalysis: {
      summary:
        "فتق دیسک L4-L5 با فشار خفیف بر ریشه L5. مقایسه با تصویر ۶ ماه قبل: بدون پیشرفت قابل توجه.",
      findings: [
        "Protrusion دیسک L4-L5",
        "Canal diameter در محدوده طبیعی",
        "Facet arthropathy خفیف",
      ],
      confidence: 94,
      urgency: "normal",
    },
  },
  {
    id: "img-198-us-abd",
    patientId: "198",
    patientName: "مریم کریمی",
    caseNumber: "۱۹۸",
    modality: "سونوگرافی",
    bodyPart: "شکم",
    device: "سونو ۳ — Philips Affiniti",
    physician: "دکتر حسینی",
    acquiredAt: "۱۴۰۴/۰۱/۲۱ — ۰۸:۵۰",
    status: "تأیید شده",
    thumbnailUrl: media.imaging.ultrasoundAbdomen,
    previewUrl: media.imaging.ultrasoundAbdomen,
    videoUrl: media.videos.ultrasoundLive,
    series: [{ id: "s1", label: "شکم کامل", sliceCount: 12, thumbnailUrl: media.imaging.ultrasoundAbdomen }],
    aiAnalysis: {
      summary: "کبد، کیسه صفرا و pancreas در محدوده طبیعی. بدون mass یا collection.",
      findings: ["کبد homogenous", "کیسه صفرا بدون سنگ", "Kidneys normal size"],
      confidence: 89,
      urgency: "normal",
    },
  },
  {
    id: "img-165-mammo",
    patientId: "165",
    patientName: "فاطمه رضایی",
    caseNumber: "۱۶۵",
    modality: "ماموگرافی",
    bodyPart: "پستان دوطرفه",
    device: "ماموگرافی ۱ — Hologic",
    physician: "دکتر موسوی",
    acquiredAt: "۱۴۰۴/۰۱/۱۹ — ۱۰:۰۰",
    status: "تأیید شده",
    thumbnailUrl: media.imaging.mammography,
    previewUrl: media.imaging.mammography,
    series: [
      { id: "s1", label: "CC راست", sliceCount: 1, thumbnailUrl: media.imaging.mammography },
      { id: "s2", label: "MLO راست", sliceCount: 1, thumbnailUrl: media.imaging.mammography },
      { id: "s3", label: "CC چپ", sliceCount: 1, thumbnailUrl: media.imaging.mammography },
      { id: "s4", label: "MLO چپ", sliceCount: 1, thumbnailUrl: media.imaging.mammography },
    ],
    aiAnalysis: {
      summary: "غربالگری سالانه — BI-RADS 1. بدون ناحیه مشکوک.",
      findings: ["Density scattered fibroglandular", "بدون microcalcification"],
      confidence: 96,
      urgency: "normal",
    },
  },
  {
    id: "img-128-us-ob",
    patientId: "128",
    patientName: "سارا احمدی",
    caseNumber: "۱۲۸",
    modality: "سونوگرافی",
    bodyPart: "بارداری — هفته ۲۴",
    device: "سونو ۲",
    physician: "دکتر حسینی",
    acquiredAt: "۱۴۰۴/۰۱/۱۷ — ۱۶:۳۰",
    status: "در حال اسکن",
    thumbnailUrl: media.imaging.ultrasoundOb,
    previewUrl: media.imaging.ultrasoundOb,
    videoUrl: media.videos.ultrasoundLive,
    series: [{ id: "s1", label: "Obstetric", sliceCount: 8, thumbnailUrl: media.imaging.ultrasoundOb }],
    aiAnalysis: {
      summary: "در حال پردازش — BPD و FL در محدوده هفته ۲۴.",
      findings: ["Heartbeat detected", "Placenta anterior"],
      confidence: 78,
      urgency: "normal",
    },
  },
  {
    id: "img-203-mri-knee",
    patientId: "203",
    patientName: "رضا موسوی",
    caseNumber: "۲۰۳",
    modality: "MRI",
    bodyPart: "زانو راست",
    device: "دستگاه ۲",
    physician: "دکتر کریمی",
    acquiredAt: "۱۴۰۴/۰۱/۲۲ — ۱۰:۳۰",
    status: "آماده بررسی",
    waitMinutes: 22,
    thumbnailUrl: media.imaging.mriKnee,
    previewUrl: media.imaging.mriKnee,
    series: [
      { id: "s1", label: "PD Sagittal", sliceCount: 20, thumbnailUrl: media.imaging.mriKnee },
      { id: "s2", label: "T2 Axial", sliceCount: 18, thumbnailUrl: media.imaging.mriKnee },
    ],
    aiAnalysis: {
      summary: "پارگی جزئی منیسک میانی. ACL و PCL سالم.",
      findings: ["Signal change در posterior horn medial meniscus", "بدون effusion"],
      confidence: 91,
      urgency: "attention",
      suggestedAction: "ارجاع به ارتوپد",
    },
  },
  {
    id: "img-189-ct-chest",
    patientId: "189",
    patientName: "زهرا صادقی",
    caseNumber: "۱۸۹",
    modality: "CT",
    bodyPart: "سینه",
    device: "CT دستگاه ۱",
    physician: "دکتر اکبری",
    acquiredAt: "۱۴۰۴/۰۱/۲۱ — ۱۴:۰۰",
    status: "تأیید شده",
    thumbnailUrl: media.imaging.ctAbdomen,
    previewUrl: media.imaging.ctScanPhoto,
    series: [
      { id: "s1", label: "Axial lung window", sliceCount: 56, thumbnailUrl: media.imaging.ctAbdomen },
      { id: "s2", label: "Axial mediastinal", sliceCount: 56, thumbnailUrl: media.imaging.ctAbdomen },
    ],
    aiAnalysis: {
      summary: "رد ندول ریوی. Lymph nodes در محدوده طبیعی.",
      findings: ["Lungs clear", "No pleural effusion"],
      confidence: 95,
      urgency: "normal",
    },
  },
  {
    id: "img-155-mri-shoulder",
    patientId: "155",
    patientName: "امیر حسینی",
    caseNumber: "۱۵۵",
    modality: "MRI",
    bodyPart: "شانه راست",
    device: "دستگاه ۱",
    physician: "دکتر شفیعی",
    acquiredAt: "۱۴۰۴/۰۱/۲۰ — ۱۱:۱۵",
    status: "تأیید شده",
    thumbnailUrl: media.imaging.mriBrain,
    previewUrl: media.imaging.mriBrainPhoto,
    series: [
      { id: "s1", label: "T2 Coronal", sliceCount: 22, thumbnailUrl: media.imaging.mriBrain },
      { id: "s2", label: "T1 Axial", sliceCount: 20, thumbnailUrl: media.imaging.mriBrain },
    ],
    aiAnalysis: {
      summary: "التهاب تاندون supraspinatus. بدون پارگی کامل.",
      findings: ["Tendinosis supraspinatus", "Subacromial bursitis خفیف"],
      confidence: 88,
      urgency: "normal",
    },
  },
  {
    id: "img-091-mammo",
    patientId: "091",
    patientName: "لیلا فرهادی",
    caseNumber: "۰۹۱",
    modality: "ماموگرافی",
    bodyPart: "پستان",
    device: "ماموگرافی ۱",
    physician: "دکتر موسوی",
    acquiredAt: "۱۴۰۴/۰۱/۱۹ — ۰۹:۳۰",
    status: "تأیید شده",
    thumbnailUrl: media.imaging.mammography,
    previewUrl: media.imaging.mammography,
    series: [
      { id: "s1", label: "CC bilateral", sliceCount: 2, thumbnailUrl: media.imaging.mammography },
      { id: "s2", label: "MLO bilateral", sliceCount: 2, thumbnailUrl: media.imaging.mammography },
    ],
    aiAnalysis: {
      summary: "BI-RADS 2 — یافته‌های خوش‌خیم.",
      findings: ["Benign calcifications", "Symmetric density"],
      confidence: 93,
      urgency: "normal",
    },
  },
];

export const imagingDevicesMock: ImagingDevice[] = [
  {
    id: "mri-1",
    name: "MRI دستگاه ۱",
    modality: "MRI",
    utilization: 72,
    queue: 3,
    status: "فعال",
  },
  {
    id: "mri-2",
    name: "MRI دستگاه ۲",
    modality: "MRI",
    utilization: 91,
    queue: 5,
    status: "فعال",
  },
  {
    id: "ct-1",
    name: "CT دستگاه ۱",
    modality: "CT",
    utilization: 68,
    queue: 2,
    status: "فعال",
  },
  {
    id: "us-1",
    name: "سونوگرافی ۲",
    modality: "سونوگرافی",
    utilization: 54,
    queue: 1,
    status: "فعال",
  },
  {
    id: "us-2",
    name: "سونوگرافی ۳",
    modality: "سونوگرافی",
    utilization: 61,
    queue: 2,
    status: "فعال",
  },
  {
    id: "mammo-1",
    name: "ماموگرافی ۱",
    modality: "ماموگرافی",
    utilization: 45,
    queue: 0,
    status: "فعال",
  },
];

export function findImagingStudyById(id: string): ImagingStudy | undefined {
  return imagingStudiesMock.find((s) => s.id === id);
}

export function filterImagingStudies(query: string): ImagingStudy[] {
  const q = query.trim().toLowerCase();
  if (!q) return imagingStudiesMock;

  const patterns: Record<string, (s: ImagingStudy) => boolean> = {
    mri: (s) => s.modality === "MRI",
    ct: (s) => s.modality === "CT",
    آماده: (s) => s.status === "آماده بررسی",
    فوری: (s) => s.aiAnalysis.urgency === "urgent" || s.aiAnalysis.urgency === "attention",
    امروز: (s) => s.acquiredAt.includes("۲۲"),
  };

  for (const [key, fn] of Object.entries(patterns)) {
    if (q.includes(key)) return imagingStudiesMock.filter(fn);
  }

  return imagingStudiesMock.filter(
    (s) =>
      s.patientName.includes(q) ||
      s.caseNumber.includes(q) ||
      s.bodyPart.includes(q) ||
      s.physician.includes(q) ||
      s.modality.includes(q)
  );
}
