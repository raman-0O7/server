import {Router} from "express";
import {getProfile, login, logout, register} from "../controllers/userController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', getProfile);

export default router;