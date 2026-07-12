import type { ApiResponse } from "@/types";
import type { ImagingStudy, ImagingDevice } from "@/types/imaging";
import {
  imagingStudiesMock,
  imagingDevicesMock,
  findImagingStudyById,
  filterImagingStudies,
} from "@/mock/data/imaging";
import { apiRequest, apiRequestSync, notFound } from "./client";

function wrap<T>(data: T): ApiResponse<T> {
  return { data, meta: { timestamp: new Date().toISOString() } };
}

export const imagingApi = {
  list(filter?: string): Promise<ApiResponse<ImagingStudy[]>> {
    return apiRequest(() => wrap(filterImagingStudies(filter ?? "")));
  },

  getById(id: string): Promise<ApiResponse<ImagingStudy>> {
    return apiRequest(() => {
      const study = findImagingStudyById(id);
      if (!study) notFound("مطالعه تصویربرداری", id);
      return wrap(study);
    });
  },

  getByIdSync(id: string): ImagingStudy {
    return apiRequestSync(() => {
      const study = findImagingStudyById(id);
      if (!study) notFound("مطالعه تصویربرداری", id);
      return study;
    });
  },

  getDevices(): Promise<ApiResponse<ImagingDevice[]>> {
    return apiRequest(() => wrap(imagingDevicesMock));
  },

  getReadyCount(): Promise<ApiResponse<number>> {
    return apiRequest(() =>
      wrap(
        imagingStudiesMock.filter((s) => s.status === "آماده بررسی").length
      )
    );
  },
};
