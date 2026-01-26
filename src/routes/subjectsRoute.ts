import express from "express";
import {
  addSubjectController,
  getAllSubjectsController,
} from "../controllers/subjectsController";
import authenticate from "../middlewares/authenticate";
import validate from "../middlewares/validate";
import { addSubjectSchema } from "../schemas/subjectSchema";
import { allowRoles } from "../middlewares/allowRoles";

const subjectsRouter = express.Router();

//* GET
subjectsRouter.get(
  "/",
  authenticate,
  allowRoles("ADMIN"),
  getAllSubjectsController,
);

//* POST
subjectsRouter.post(
  "/",
  authenticate,
  validate(addSubjectSchema),
  addSubjectController,
);

export default subjectsRouter;
