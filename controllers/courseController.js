import Course from "../models/courseModel.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from 'fs/promises';

async function getAllCourses(req, res, next) {
    const courses = await Course.find({}).select("-lectures");
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
    const courseDetails = await Course.findById(id);

    if(!courseDetails) {
        return next(new AppError("Course Id is wrong, please try again", 400));
    }

    return res.status(200).json({
        success: true,
        msg: "Course details found",
        courseDetails
    })
}

async function createCourse(req, res, next ) {
    const { title, description, category, createdBy} = req.body;

    if(!title || !description || !createdBy || !category) {
        console.log(title, description, createdBy, category);
        return next(new AppError("All fields are required", 400))
    }
    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
    });

    if(!course) {
        return next(new AppError("Course does not created, please try again" , 500))
    }
    if(req.file) {
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
            });
            if(result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;

                fs.rm(`uploads/${req.file.fieldname}`);
                console.log("Upload done");
            }
            
        } catch(err){
             return next(new AppError("Something went wrong in file uploading. try again later", 500));
        }
        
    }  
    await course.save();    
    return res.status(201).json({
        success: true,
        msg : "Course created successfully",
        course
    })
}

async function updateCourse(req, res, next) {

}

async function deleteCourse(req, res, next) {

}

export {
    getAllCourses,
    getCourseDetails,
    createCourse,
    updateCourse,
    deleteCourse
}