import z from "zod";

export const addAcademicYearSchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, "Format harus seperti 2025/2026")
    .min(1, "Tahun ajaran wajib diisi."),
});

export const editAcademicYearSchema = addAcademicYearSchema.partial();
