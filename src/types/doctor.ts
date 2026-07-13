export type WorkloadLevel = "normal" | "busy" | "critical";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  patients: number;
  revenue: string;
  satisfaction: number;
  avgReportTime: string;
  workload: WorkloadLevel;
  schedule: string;
  aiInsight: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  videoIntroUrl?: string;
  recentPatients?: string[];
}
