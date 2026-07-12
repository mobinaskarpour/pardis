/** @deprecated Import from @/mock or @/services/api */
export type { PatientListItem, Doctor, ModuleMeta } from "@/types";

export { patientsMock as patients } from "@/mock/data/patients";
export { doctorsMock as doctors } from "@/mock/data/doctors";
export { moduleMetaMock as moduleMeta } from "@/mock/data/modules";
export { findPatientById as getPatientById } from "@/mock/data/patients";
export { findDoctorById as getDoctorById } from "@/mock/data/doctors";
export { filterPatients } from "@/features/patients/utils/filterPatients";
