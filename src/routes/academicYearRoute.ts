import express from "express";
import authenticate from "../middlewares/authenticate";
import { allowRoles } from "../middlewares/allowRoles";
import validate from "../middlewares/validate";
import {
  addAcademicYearSchema,
  editAcademicYearSchema,
} from "../schemas/academicYearSchema";
import {
  activateAcademicYearController,
  createAcademicYearController,
  deleteAcademicYearController,
  getAcademicYearByIdController,
  getActiveAcademicYearController,
  getAllAcademicYearController,
  updateAcademicYearController,
} from "../controllers/academicYearsController";

const academicYearRouter = express.Router();

//* GET
academicYearRouter.get(
  "/",
  authenticate,
  allowRoles("ADMIN", "TEACHER"),
  getAllAcademicYearController,
);
academicYearRouter.get(
  "/active",
  authenticate,
  allowRoles("ADMIN", "TEACHER"),
  getActiveAcademicYearController,
);
academicYearRouter.get(
  "/:id",
  authenticate,
  allowRoles("ADMIN", "TEACHER"),
  getAcademicYearByIdController,
);

//* POST
academicYearRouter.post(
  "/",
  authenticate,
  allowRoles("ADMIN"),
  validate(addAcademicYearSchema),
  createAcademicYearController,
);

//* PUT
academicYearRouter.put(
  "/:id",
  authenticate,
  allowRoles("ADMIN"),
  validate(editAcademicYearSchema),
  updateAcademicYearController,
);

//* PATCH
academicYearRouter.patch(
  "/:id",
  authenticate,
  allowRoles("ADMIN"),
  activateAcademicYearController,
);

//* DELETE
academicYearRouter.delete(
  "/:id",
  authenticate,
  allowRoles("ADMIN"),
  deleteAcademicYearController,
);

export default academicYearRouter;
