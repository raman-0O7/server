import { createCourse, deleteCourse, getAllCourses, getCourseDetails, updateCourse } from "../controllers/courseController.js";
import { Router } from "express";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.route("/")
  .post(upload.single('thumbnail'), createCourse)
  .get(getAllCourses);

router.route("/:id")
  .get(getCourseDetails)
  .put(updateCourse)
  .delete(deleteCourse);

export default router;


