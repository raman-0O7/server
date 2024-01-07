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
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(id, { $set : req.body }, { runValidator : true});
        if(!course) return next(new AppError("Course does not exist", 400));
        await course.save();
        return res.status(200).json({
            success : true,
            msg : "Course Updated Successfully",
            course
        })
    } catch(e) {
        return next(new AppError(e.message, 400));
    }
}

async function deleteCourse(req, res, next) {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if(!course) return next(new AppError("Course does not exist", 400));
        await Course.findByIdAndDelete(id);
        return res.status(200).json({
            success : true,
            msg : "Course deleted successfully"
        });
    } catch(e) {
        return next(new AppError(e.message, 400));
    }
}

async function addLectureInCourse(req, res, next) {
    const { title, description }= req.body;
    const { id } = req.params;

    if(!title || !description) return next(new AppError("All field are required", 400));

    const course = await Course.findById(id);
    if(!course) return next(new AppError("Course does not exist", 400));

    const lectureData = {
        id : course.lectures.length + 1,
        title,
        description,
        thumbnail: {}
    }

    if(req.file) {
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
            });
            if(result) {
                lectureData.thumbnail.public_id = result.public_id;
                lectureData.thumbnail.secure_url = result.secure_url;

                fs.rm(`uploads/${req.file.fieldname}`);
            }
            
        } catch(err){
             return next(new AppError("Something went wrong in file uploading. try again later", 500));
        }
    }
    course.lectures.push(lectureData);
    course.numberOfLectures = course.numberOfLectures + 1;
    await course.save();
    return res.status(201).json({
        succuss: true,
        msg : "Added lecture successfully",
        course
    })
}

async function deleteLectureOfCourse(req, res, next) {
    const { id, lectureId } = req.params;
    console.log(id , lectureId);
    const course = await Course.findById(id);
    if(!course) return next(new AppError("Course does not exist", 400));
    const lectureData = course.lectures.filter((lecture) => {
        if(lecture.id == lectureId) {
            console.log("Matched");
            return false;
        }
        return true;
    })
    console.log(lectureData);
    course.lectures = lectureData;
    console.log(course.lectures);
    course.numberOfLectures = course.numberOfLectures - 1;
    await course.save();
    return res.status(200).json({
        course
    })
}

export {
    getAllCourses,
    getCourseDetails,
    createCourse,
    updateCourse,
    deleteCourse,
    addLectureInCourse,
    deleteLectureOfCourse
}