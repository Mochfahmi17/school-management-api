import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcryptjs from "bcryptjs";
import { prisma } from "../lib/prisma";

export const getAllTeachersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sortBy = "createdAt", order = "asc" } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await prisma.teacher.count();

    const safeOrder = order === "desc" ? "asc" : "desc";

    let orderBy: Object;
    switch (sortBy) {
      case "name":
        orderBy = {
          user: {
            name: safeOrder,
          },
        };
        break;

      case "email":
        orderBy = {
          user: {
            email: safeOrder,
          },
        };
        break;

      case "subject":
        orderBy = {
          subjects: {
            name: safeOrder,
          },
        };
        break;

      default:
        orderBy = {
          createdAt: "asc",
        };
    }

    const allTeachers = await prisma.teacher.findMany({
      include: {
        user: { select: { name: true, email: true, role: true } },
        subjects: { select: { name: true } },
      },
      skip,
      take: limit,
      orderBy,
    });

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: allTeachers,
    });
  } catch (error) {
    console.error("get data all teachers is error: ", error);
    return next(createHttpError(500, "Failed to get all data teachers."));
  }
};

export const getSigleTeacherController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        subjects: { select: { name: true } },
      },
    });

    if (!teacher) {
      return next(createHttpError(404, "Data guru tidak di temukan!"));
    }

    return res.status(200).json({ teacher });
  } catch (error) {
    console.error("get single teacher is error: ", error);
    return next(createHttpError(500, "Failed to get single data teacher."));
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

    const newTeacher = await prisma.teacher.create({
      data: {
        nip,
        phone,
        user: { create: { name, email, password: hashPassword } },
        subjects: { connect: { id: subjectId } },
      },
    });

    return res.status(201).json({ message: "Berhasil menambahkan data guru." });
  } catch (error) {
    console.error("Add teacher is error: ", error);
    return next(createHttpError(500, "Failed to add teacher."));
  }
};

export const editTeacherController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, nip, phone, subjectId } = req.body;
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        subjects: { select: { id: true, name: true } },
      },
    });
    if (!teacher) {
      return next(createHttpError(404, "Guru tidak ditemukan!"));
    }

    let hashPassword: string | undefined;
    if (nip) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(nip, salt);
    }

    const payloadData = {
      user: {
        update: {
          name: name ?? teacher.user.name,
          email: email ?? teacher.user.email,
          ...(hashPassword && { password: hashPassword }),
        },
      },
      nip: nip ?? teacher.nip,
      phone: phone ?? teacher.phone,
      subjects: { connect: subjectId ? { id: subjectId } : undefined },
    };

    await prisma.teacher.update({ where: { id }, data: payloadData });

    return res.status(200).json({ message: "Teacher updated." });
  } catch (error) {
    console.error("Edit teacher is error: ", error);
    return next(createHttpError(500, "Failed to edit teacher."));
  }
};

export const deleteTeacherController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!teacher) {
      return next(createHttpError(404, "This teacher is not found!"));
    }

    await prisma.user.delete({ where: { id: teacher.userId } });

    return res.status(200).json({ message: "Teacher is deleted." });
  } catch (error) {
    console.error("Delete teacher is error: ", error);
    return next(createHttpError(500, "Failed to delete teacher."));
  }
};
