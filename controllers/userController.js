import AppError from "../utils/error.util.js";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOption= {
    maxAge: 7*24*60*60*1000, //7 days
    httpOnly: true,
    secure: true
}
const register = async (req, res, next) => {
    const{name, email, password} = req.body;
    if(!name || !email || !password) {
        return next(new AppError('All field are required', 400))
    }

    const userExists = await User.findOne({email});
    if(userExists) {
        return next(new AppError('User already register', 400))
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Favatar&psig=AOvVaw2Xke-S6Gg6X9XEVouvQjtW&ust=1697472372166000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNjTsL-3-IEDFQAAAAAdAAAAABAE'
        }
    });
    if(!user) {
        return next(new AppError('User registration failed please try again'),400)
    }
    //File Upload

    if(req.file) {
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
                width: 250,
                height: 250,
                gravity: "faces",
                crop: "fill"
            });

            
            if(result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                fs.rm(`uploads/${req.file.fieldname}`);
            }
            
        } catch(err){
             return next(new AppError(err ||"Something went wrong in file uploading. try again later", 500));
        }
    }

    await user.save();
    user.password = undefined;

    const token = await user.generateJwtToken();
    res.cookie('token')
    res.status(201).json({
        success: true,
        message: 'User register successfully',
        user
    })
};

const login = async (req, res, next) => {

    try {
        const {email,password} = req.body;
    if(!email || !password) {
        return next(new AppError('All field are required', 400));

    }

    const user = await User.findOne({email}).select('+password');

    if(!user || !user.comparePassword(password)) {
        return next(new AppError('Email password does not match', 400))
    }

    const token = await user.generateJwtToken();
    user.password = undefined;

    res.cookie('token', token , cookieOption);

    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user
    })
    } catch(e) {
        return next(new AppError(e.message, 400))

    }
    
};

const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out sucessfully'
    })
};

const getProfile = async (req, res, next) => {

    try{
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'User details',
            user
        });
    } catch(e) {
        return next(new AppError('Failed to fetch profile', 400));
    }
   
};

const forgotPassword = async function(req, res, next) {
    const {email} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        return next(new AppError('User not registered', 400));
    }

    const resetToken = await user.generateResetPasswordToken();
    const resetTokenUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const subject = "Reset Password";
    const message = `Click to the below link for resetting your LMS account password ${resetTokenUrl}`;

    try {
        const result = await sendEmail(email, subject, message);

        return res.json({
            message: "Success",
            result
        })
    } catch(err) {
        user.forgetPasswordToken ='';
        user.forgetPasswordExpiry = undefined;
        await user.save();
        return next(new AppError('Some Error occured while sending you mail, please try later', 500));
    }
}

async function resetPassword(req, res ,next) {
    const { resetToken } = req.params;
    const { password } = req.body;

    const forgetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
        forgetPasswordToken,
        forgetPasswordExpiry : { $gt: Date.now()}
    });

    if(!user) {
        return next(new AppError("Invalid or expired token ,please try again", 400));
    }

    user.password = password;
    await user.save();
    user.password = undefined;
    return res.json({
        msg : " Password changed Success"
    });
}

async function changePassword(req, res, next) {
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword) {
        return next(new AppError("All fields are required", 400));
    }

    const { id } = req.user;
    const user = await User.findById(id).select("+password");
    if(!user) {
        return next(new AppError("User does not exist", 400));
    }

    const matchPassword = user.comparePassword(oldPassword);
    if(!matchPassword) {
        return next(new AppError("Old Password is incorrect, Please try again", 400));
    }

    user.password = newPassword;
    await user.save();
    user.password = undefined;
    return res.json({
        success: true,
        msg: "Password changed successfully"
    })
}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,


}