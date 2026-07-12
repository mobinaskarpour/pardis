import type { PatientListItem } from "@/types";
import { patientsMock } from "@/mock/data/patients";

const nlPatterns: Record<string, (p: PatientListItem) => boolean> = {
  mri: (p) =>
    p.mri.length > 0 || p.timeline.some((t) => t.event.includes("MRI")),
  امروز: (p) => p.lastVisit.includes("۲۲") || p.lastVisit.includes("۲۱"),
  "در انتظار": (p) => p.status === "در انتظار",
  فوری: (p) =>
    p.reports.some(
      (r) => r.status.includes("فوری") || r.status.includes("بررسی")
    ),
  فعال: (p) => p.status === "فعال",
};

export function filterPatients(query: string): PatientListItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return patientsMock;

  for (const [key, fn] of Object.entries(nlPatterns)) {
    if (q.includes(key)) return patientsMock.filter(fn);
  }

  return patientsMock.filter(
    (p) =>
      p.name.includes(q) ||
      p.caseNumber.includes(q) ||
      p.doctor.includes(q) ||
      p.specialty.includes(q) ||
      p.status.includes(q)
  );
}
