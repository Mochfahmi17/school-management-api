import express from "express";
import authenticate from "../middlewares/authenticate";
import { allowRoles } from "../middlewares/allowRoles";
import {
  addTeacherController,
  getAllTeachersController,
} from "../controllers/teachersController";
import validate from "../middlewares/validate";
import { addTeacherSchema } from "../schemas/teacherSchema";

const teachersRouter = express.Router();

//* GET
teachersRouter.get(
  "/",
  authenticate,
  allowRoles("ADMIN"),
  getAllTeachersController,
);

//*POST
teachersRouter.post(
  "/",
  authenticate,
  allowRoles("ADMIN"),
  validate(addTeacherSchema),
  addTeacherController,
);

export default teachersRouter;
