import z from "zod";

export const addTeacherSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi."),
  email: z.email("Email tidak valid.").min(1, "Email wajib diisi."),
  nip: z
    .string()
    .regex(/^[0-9]*$/, "NIP hanya boleh angka.")
    .min(1, "NIP wajib diisi."),
  phone: z
    .string()
    .regex(/^(08|628)\d{8,11}$/, "Nomor handphone harus diawali 08 atau 628."),
  subjectId: z.string().min(1, "Mata pelajaran wajib diisi."),
});
