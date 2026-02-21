import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";

export const getAllAcademicYearController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const academicYears = await prisma.academicYear.findMany();

    return res.status(200).json({ data: academicYears });
  } catch (error) {
    console.error("Get all data academic years is error: ", error);
    return next(createHttpError(500, "Failed to get all data academic years."));
  }
};

export const getActiveAcademicYearController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const academicYearActive = await prisma.academicYear.findFirst({
      where: { isActive: true },
    });

    if (!academicYearActive) {
      return next(
        createHttpError(404, "Tahun ajaran yang aktif tidak ditemukan!"),
      );
    }

    return res.status(200).json({ academicYearActive });
  } catch (error) {
    console.error("Get data academic year active is error: ", error);
    return next(createHttpError(500, "Failed to get data academic year."));
  }
};

export const getAcademicYearByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const academicYear = await prisma.academicYear.findUnique({
      where: { id },
    });
    if (!academicYear) {
      return next(createHttpError(404, "Tahun ajaran tidak ditemukan!"));
    }

    return res.status(200).json({ academicYear });
  } catch (error) {
    console.error("Get data academic year by id is error: ", error);
    return next(createHttpError(500, "Failed to get data academic year."));
  }
};

export const createAcademicYearController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { year } = req.body;

    const existingAcademicYear = await prisma.academicYear.findUnique({
      where: { year },
    });
    if (existingAcademicYear) {
      return next(createHttpError(400, "Tahun ajaran ini sudah ada."));
    }

    await prisma.academicYear.create({ data: { year, isActive: false } });
    return res.status(201).json({ message: "Tahun ajaran berhasil dibuat." });
  } catch (error) {
    console.error("Create academic year is error: ", error);
    return next(createHttpError(500, "Failed to create academic year."));
  }
};

export const updateAcademicYearController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { year } = req.body;
    const { id } = req.params;

    const existingAcademicYear = await prisma.academicYear.findUnique({
      where: { id },
    });
    if (!existingAcademicYear) {
      return next(createHttpError(404, "Tahun ajaran tidak ditemukan!"));
    }

    if (existingAcademicYear.isActive) {
      return next(
        createHttpError(
          400,
          "Tidak bisa menghapus tahun ajaran yang sedang aktif.",
        ),
      );
    }

    await prisma.academicYear.update({
      where: { id },
      data: { year },
    });

    return res
      .status(200)
      .json({ message: "Tahun ajaran berhasil di update." });
  } catch (error) {
    console.error("Update academic year is error: ", error);
    return next(createHttpError(500, "Failed to update academic year."));
  }
};

export const activateAcademicYearController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const existingAcademicYear = await prisma.academicYear.findUnique({
      where: { id },
    });
    if (!existingAcademicYear) {
      return next(createHttpError(404, "tahun ajaran ini tidak ditemukan!"));
    }

    await prisma.$transaction([
      prisma.academicYear.updateMany({ data: { isActive: false } }),
      prisma.academicYear.update({ where: { id }, data: { isActive: true } }),
    ]);

    return res
      .status(200)
      .json({ message: "Tahun ajaran berhasil di aktifkan." });
  } catch (error) {
    console.error("Acticated academic year is error: ", error);
    return next(createHttpError(500, "Failed to activate academic year."));
  }
};

export const deleteAcademicYearController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const usedAcademicYear = await prisma.class.findFirst({
      where: { academicYearId: id },
    });
    if (usedAcademicYear) {
      return next(
        createHttpError(
          400,
          "Tidak bisa  dihapus. Tahun ajaran sudah berjalan di kelas.",
        ),
      );
    }

    await prisma.academicYear.delete({ where: { id } });
    return res.status(200).json({ message: "Tahun ajaran berhasil dihapus." });
  } catch (error) {
    console.error("Delete academic year is error: ", error);
    return next(createHttpError(500, "Failed to delete academic year."));
  }
};
