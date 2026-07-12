export type ImagingModality = "MRI" | "CT" | "سونوگرافی" | "ماموگرافی";

export type ImagingStatus =
  | "آماده بررسی"
  | "در انتظار تأیید"
  | "در حال اسکن"
  | "تأیید شده";

export type ImagingUrgency = "normal" | "attention" | "urgent";

export interface ImagingAIAnalysis {
  summary: string;
  findings: string[];
  confidence: number;
  urgency: ImagingUrgency;
  suggestedAction?: string;
}

export interface ImagingSeries {
  id: string;
  label: string;
  sliceCount: number;
}

export interface ImagingStudy {
  id: string;
  patientId: string;
  patientName: string;
  caseNumber: string;
  modality: ImagingModality;
  bodyPart: string;
  device: string;
  physician: string;
  acquiredAt: string;
  status: ImagingStatus;
  waitMinutes?: number;
  series: ImagingSeries[];
  aiAnalysis: ImagingAIAnalysis;
}

export interface ImagingDevice {
  id: string;
  name: string;
  modality: ImagingModality;
  utilization: number;
  queue: number;
  status: "فعال" | "تعمیر" | "آماده";
}
