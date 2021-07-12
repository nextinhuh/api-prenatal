interface MedicalRecords {
  weight: string;
  heigh: string;
  heart_rate: string;
  blood_pressure: string;
  abdominal_circumference: string;
}

type Prescription = Array<{
  description: string;
  title: string;
}>;

export default interface IGETConsultDTO {
  prescriptions: Prescription;
  medicalRecords: MedicalRecords;
}
