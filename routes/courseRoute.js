import { addLectureInCourse, createCourse, deleteCourse, deleteLectureOfCourse, getAllCourses, getCourseDetails, updateCourse } from "../controllers/courseController.js";
import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { authorizeUser, isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/")
  .post(isLoggedIn, authorizeUser(["ADMIN"]) ,upload.single('thumbnail'), createCourse)
  .get(getAllCourses);

router.route("/:id")
  .get(getCourseDetails)
  .put(isLoggedIn, authorizeUser(["ADMIN"]), updateCourse)
  .delete(isLoggedIn, authorizeUser(["ADMIN"]), deleteCourse)
  .post(isLoggedIn, authorizeUser(["ADMIN"]), upload.single("thumbnail"), addLectureInCourse)

router.delete("/:id/:lectureId", deleteLectureOfCourse);

export default router;


