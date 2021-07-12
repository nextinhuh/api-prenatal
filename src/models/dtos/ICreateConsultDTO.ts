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
  consult_id: string;
}>;

export default interface ICreateConsultDTO {
  prescriptions: Prescription;
  medicalRecords: MedicalRecords;
  patient_id: string;
  user_id: string;
}
