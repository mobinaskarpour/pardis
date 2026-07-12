import type { ApiResponse, PatientListItem } from "@/types";
import { patientsMock, findPatientById } from "@/mock/data/patients";
import { filterPatients } from "@/features/patients/utils/filterPatients";
import { apiRequest, apiRequestSync, notFound } from "./client";

function wrap<T>(data: T): ApiResponse<T> {
  return { data, meta: { timestamp: new Date().toISOString() } };
}

export const patientsApi = {
  list(filter?: string): Promise<ApiResponse<PatientListItem[]>> {
    return apiRequest(() => wrap(filterPatients(filter ?? "")));
  },

  getById(id: string): Promise<ApiResponse<PatientListItem>> {
    return apiRequest(() => {
      const patient = findPatientById(id);
      if (!patient) notFound("بیمار", id);
      return wrap(patient);
    });
  },

  getByIdSync(id: string): PatientListItem {
    return apiRequestSync(() => {
      const patient = findPatientById(id);
      if (!patient) notFound("بیمار", id);
      return patient;
    });
  },

  getAllIds(): string[] {
    return patientsMock.map((p) => p.id);
  },
};
