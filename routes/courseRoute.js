import { getAllCourses, getCourseDetails } from "../controllers/courseController.js";
import { Router } from "express";

const router = Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseDetails);

export default router;


