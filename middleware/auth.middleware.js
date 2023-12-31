import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoggedIn = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return next(new AppError('Unauthenticated user', 400));

    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}

const authorizeUser = ([...roles]) =>  async (req, res, next) => {
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)) return next(new AppError(
        "You not have permission to access this route", 403
    ));
    next();
}

export {
    isLoggedIn,
    authorizeUser
}