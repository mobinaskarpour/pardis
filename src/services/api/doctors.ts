import type { ApiResponse, Doctor } from "@/types";
import { doctorsMock, findDoctorById } from "@/mock/data/doctors";
import { apiRequest, apiRequestSync, notFound } from "./client";

function wrap<T>(data: T): ApiResponse<T> {
  return { data, meta: { timestamp: new Date().toISOString() } };
}

export const doctorsApi = {
  list(): Promise<ApiResponse<Doctor[]>> {
    return apiRequest(() => wrap(doctorsMock));
  },

  getById(id: string): Promise<ApiResponse<Doctor>> {
    return apiRequest(() => {
      const doctor = findDoctorById(id);
      if (!doctor) notFound("پزشک", id);
      return wrap(doctor);
    });
  },

  getByIdSync(id: string): Doctor {
    return apiRequestSync(() => {
      const doctor = findDoctorById(id);
      if (!doctor) notFound("پزشک", id);
      return doctor;
    });
  },

  getAllIds(): string[] {
    return doctorsMock.map((d) => d.id);
  },
};
