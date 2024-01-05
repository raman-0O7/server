import { createCourse, deleteCourse, getAllCourses, getCourseDetails, updateCourse } from "../controllers/courseController.js";
import { Router } from "express";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.route("/")
  .get(getAllCourses);
router.post("/create", upload.single('thumbnail'),(req, res, next) => {
    console.log("reach 1")
    createCourse(req, res, next)
});

router.route("/:id")
  .get(getCourseDetails)
  .put(updateCourse)
  .delete(deleteCourse);

export default router;


