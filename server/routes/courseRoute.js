import express from "express";
import { getAllCourse, getCourseId } from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.get("/all", getAllCourse);
courseRouter.get("/:_id", getCourseId);

export default courseRouter;
