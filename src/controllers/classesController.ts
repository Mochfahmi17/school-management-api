import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";

export const getAllClassesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        academicYear: { select: { year: true } },
        homeroomTeacher: { select: { user: { select: { name: true } } } },
        student: true,
      },
    });

    return res.status(200).json({ data: classes });
  } catch (error) {
    console.error("get data all classes is error: ", error);
    return next(createHttpError(500, "Failed to get all data class."));
  }
};

export const getSingleClassController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const classroom = await prisma.class.findUnique({
      where: { id },
      include: {
        academicYear: { select: { year: true } },
        homeroomTeacher: { select: { user: { select: { name: true } } } },
        student: true,
      },
    });
    if (!classroom) {
      return next(createHttpError(404, "Data kelas tidak ditemukan!"));
    }

    return res.status(200).json({ classroom });
  } catch (error) {
    console.error("get single class is error: ", error);
    return next(createHttpError(500, "Failed to get single data class."));
  }
};

export const addClassController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, grade, major, academicYearId, homeroomTeacherId } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { id: homeroomTeacherId },
    });
    if (!teacher) {
      return next(createHttpError(404, "Guru tidak ditemukan."));
    }

    const existingClass = await prisma.class.findFirst({
      where: { name, academicYearId },
    });

    if (existingClass) {
      return next(
        createHttpError(409, "Nama kelas sudah ada untuk tahun ajaran ini."),
      );
    }

    await prisma.class.create({
      data: {
        name,
        grade,
        major,
        academicYear: { connect: { id: academicYearId } },
        homeroomTeacher: { connect: { id: homeroomTeacherId } },
      },
    });

    return res.status(201).json({ message: "Kelas berhasil ditambahkan." });
  } catch (error) {
    console.error("add class is error: ", error);
    return next(createHttpError(500, "Failed to add new class."));
  }
};

export const editClassController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, grade, major, academicYearId, homeroomTeacherId } = req.body;
    const { id } = req.params;

    const classroom = await prisma.class.findUnique({ where: { id } });
    if (!classroom) {
      return next(createHttpError(404, "Data kelas tidak ditemukan!"));
    }

    const payloadData = {
      name: name ?? classroom.name,
      grade: grade ?? classroom.grade,
      major: major ?? classroom.major,
      academicYear: {
        connect: academicYearId ? { id: academicYearId } : undefined,
      },
      teacher: {
        connect: homeroomTeacherId ? { id: homeroomTeacherId } : undefined,
      },
    };

    await prisma.class.update({ where: { id }, data: payloadData });

    return res.status(200).json({ message: "Kelas berhasil di update." });
  } catch (error) {
    console.error("edit class is error: ", error);
    return next(createHttpError(500, "Failed to edit class."));
  }
};

export const deleteClassController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const classroom = await prisma.class.findUnique({ where: { id } });
    if (!classroom) {
      return next(createHttpError(404, "Data kelas tidak ditemukan!"));
    }

    await prisma.class.delete({ where: { id } });

    return res.status(200).json({ message: "Data kelas berhasil dihapus." });
  } catch (error) {
    console.error("delete class is error: ", error);
    return next(createHttpError(500, "Failed to delete class."));
  }
};
