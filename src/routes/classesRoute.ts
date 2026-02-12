import express from "express";
import authenticate from "../middlewares/authenticate";
import { allowRoles } from "../middlewares/allowRoles";
import {
  addClassController,
  deleteClassController,
  editClassController,
  getAllClassesController,
  getSingleClassController,
} from "../controllers/classesController";
import validate from "../middlewares/validate";
import { addClassSchema, editClassSchema } from "../schemas/classSchema";
const classesRouter = express.Router();

//* GET
classesRouter.get(
  "/",
  authenticate,
  allowRoles("ADMIN", "TEACHER"),
  getAllClassesController,
);
classesRouter.get(
  "/:id",
  authenticate,
  allowRoles("ADMIN", "TEACHER"),
  getSingleClassController,
);

//* POST
classesRouter.post(
  "/",
  authenticate,
  allowRoles("ADMIN"),
  validate(addClassSchema),
  addClassController,
);

//* PUT
classesRouter.put(
  "/:id",
  authenticate,
  allowRoles("ADMIN"),
  validate(editClassSchema),
  editClassController,
);

//* DELETE
classesRouter.delete(
  "/:id",
  authenticate,
  allowRoles("ADMIN"),
  deleteClassController,
);

export default classesRouter;
