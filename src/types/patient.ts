export type FinancialStatus = "paid" | "pending" | "partial";

export type PatientStatus = "فعال" | "در انتظار" | "پیگیری";

export interface TimelineEvent {
  date: string;
  event: string;
  type: string;
}

export interface ImagingRecord {
  date: string;
  type: string;
  device: string;
  status: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  videoUrl?: string;
}

export interface MedicalReport {
  date: string;
  title: string;
  status: string;
  documentUrl?: string;
}

export interface PatientDocument {
  id: string;
  title: string;
  type: "report" | "consent" | "referral" | "insurance";
  date: string;
  url?: string;
}

export interface Patient {
  id: string;
  name: string;
  caseNumber: string;
  age: number;
  gender: string;
  doctor: string;
  specialty: string;
  lastVisit: string;
  status: PatientStatus | string;
  aiSummary: string;
  timeline: TimelineEvent[];
  mri: ImagingRecord[];
  reports: MedicalReport[];
}

export interface PatientListItem extends Patient {
  phone?: string;
  insurance?: string;
  financialStatus?: FinancialStatus;
  nextAppointment?: string;
  healthScore?: number;
  avatarUrl?: string;
  coverImageUrl?: string;
  documents?: PatientDocument[];
}
