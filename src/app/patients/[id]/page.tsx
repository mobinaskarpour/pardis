import { notFound } from "next/navigation";
import { PatientProfilePage } from "@/components/modules/patients/PatientProfilePage";
import { patientsApi } from "@/services/api/patients";

export function generateStaticParams() {
  return patientsApi.getAllIds().map((id) => ({ id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const patient = patientsApi.getByIdSync(id);
    return <PatientProfilePage patient={patient} />;
  } catch {
    notFound();
  }
}
