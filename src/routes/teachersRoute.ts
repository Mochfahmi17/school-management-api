import express from "express";
import authenticate from "../middlewares/authenticate";
import { allowRoles } from "../middlewares/allowRoles";
import {
  addTeacherController,
  deleteTeacherController,
  editTeacherController,
  getAllTeachersController,
  getSigleTeacherController,
} from "../controllers/teachersController";
import validate from "../middlewares/validate";
import { addTeacherSchema, editTeacherSchema } from "../schemas/teacherSchema";

const teachersRouter = express.Router();

//* GET
teachersRouter.get(
  "/",
  authenticate,
  allowRoles("ADMIN"),
  getAllTeachersController,
);
teachersRouter.get(
  "/:id",
  authenticate,
  allowRoles("ADMIN"),
  getSigleTeacherController,
);

//*POST
teachersRouter.post(
  "/",
  authenticate,
  allowRoles("ADMIN"),
  validate(addTeacherSchema),
  addTeacherController,
);

//* PUT
teachersRouter.put(
  "/:id",
  authenticate,
  allowRoles("ADMIN"),
  validate(editTeacherSchema),
  editTeacherController,
);

//* DELETE
teachersRouter.delete(
  "/:id",
  authenticate,
  allowRoles("ADMIN"),
  deleteTeacherController,
);

export default teachersRouter;
