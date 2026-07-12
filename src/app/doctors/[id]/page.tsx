import { notFound } from "next/navigation";
import { DoctorProfilePage } from "@/components/modules/doctors/DoctorProfilePage";
import { doctorsApi } from "@/services/api/doctors";

export function generateStaticParams() {
  return doctorsApi.getAllIds().map((id) => ({ id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const doctor = doctorsApi.getByIdSync(id);
    return <DoctorProfilePage doctor={doctor} />;
  } catch {
    notFound();
  }
}
