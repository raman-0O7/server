import {Router} from "express";
import {changePassword, forgotPassword, getProfile, login, logout, register, resetPassword, userUpdate} from "../controllers/userController.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.post('/register',upload.single("avatar"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',isLoggedIn, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.post("/change-password",isLoggedIn, changePassword);
router.put("/update", isLoggedIn, upload.single("avatar"), userUpdate)

export default router;