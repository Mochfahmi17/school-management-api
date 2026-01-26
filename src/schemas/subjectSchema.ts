import z from "zod";

export const addSubjectSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi."),
  code: z.string().min(1, "Kode pelajaran wajib diisi."),
});
