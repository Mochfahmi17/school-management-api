import z from "zod";

export const addClassSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi."),
  grade: z.number().min(1, "Kelas wajib diisi."),
  academicYear: z.string().min(1, "Tahun ajaran wajib diisi."),
  homeroomTeacherId: z.string().min(1, "Wali kelas wajib diisi."),
});

export const editClassSchema = addClassSchema.partial();
