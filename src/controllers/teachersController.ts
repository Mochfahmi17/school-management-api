import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcryptjs from "bcryptjs";
import { prisma } from "../lib/prisma";
import { email } from "zod";

export const getAllTeachersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allTeachers = await prisma.teacher.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        subjects: true,
      },
    });

    return res.status(200).json({ data: allTeachers });
  } catch (error) {
    console.error("get data all teachers is error: ", error);
    return next(createHttpError(500, "Failed to get all data teachers."));
  }
};

export const addTeacherController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, nip, phone, subjectId } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return next(
        createHttpError(400, "User dengan email ini sudah digunakan."),
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(nip, salt);

    const newTeacher = await prisma.user.create({
      data: { name, email, password: hashPassword },
    });

    await prisma.teacher.create({
      data: { userId: newTeacher.id, nip, phone, subjectId },
    });

    return res.status(201).json({ message: "Berhasil menambahkan data guru." });
  } catch (error) {
    console.error("Add teacher is error: ", error);
    return next(createHttpError(500, "Failed to add teacher."));
  }
};
