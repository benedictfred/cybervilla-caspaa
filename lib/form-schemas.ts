import z from "zod";

export const addStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  admissionNumber: z.string().min(1, "Admission number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  class: z.string().min(1, "Class is required"),
  arm: z.string().optional(),
  session: z.string().optional(),
  bloodGroup: z.string().optional(),
  house: z.string().optional(),
  allergies: z.string().optional(),
  feeCategory: z.string().optional(),
  parent: z.string().min(1, "Parent / Guardian is required"),
  admissionType: z.string().optional(),
  activities: z.array(z.string()).optional(),
  status: z.string().optional(),
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;
