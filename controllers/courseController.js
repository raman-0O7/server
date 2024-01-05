import courseModel from "../models/courseModel.js";
import AppError from "../utils/error.util.js";

async function getAllCourses(req, res, next) {
    const courses = await courseModel.find({}).select("-lectures");
    if(!courses) {
        return res.status(200).json({
            msg: "No course Found"
        })
    }

    return res.status(200).json({
        success: true,
        courses
    });
}

async function getCourseDetails(req, res, next) { 
    const { id } = req.params;
    const courseDetails = await courseModel.findById(id);

    if(!courseDetails) {
        return next(new AppError("Course Id is wrong, please try again", 400));
    }

    return res.status(200).json({
        success: true,
        msg: "Course details found",
        courseDetails
    })
}

export {
    getAllCourses,
    getCourseDetails
}