import bcryptjs from 'bcryptjs';
import {Schema, model} from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema({
    name: {
        type : 'String',
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be at least 5 charachter'],
        lowercase: true,
        trim: true
    },
    email: {
        type: 'String',
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true,

    },
    password: {
        type: 'String',
        required: [true, 'Password is reuired'],
        minLength: [8, 'Password must be atleast 8 chars'],
        select : false
    },
    avatar: {
        public_id: {
            type: 'String'
        },
        secure_url: {
            type: 'String'
        }
    },
    role: {
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    this.password = await bcryptjs.hash(this.password, 10);
})

userSchema.methods={
    generateJwtToken: async function() {
        return await jwt.sign(
            {
                id: this._id, email:this.email, subscription:this.subscription, role: this.role
            },
            process.env.JWT_SECRET
            
        )
    },
    comparePassword: async function(password) {
        return await bcryptjs.compare(password, this.password)
    },
    generateResetPasswordToken: async function() {
        const resetToken = crypto.randomByte(20).toString("hex");
        const encryptedToken = crypto.createHmac("sha256").update(resetToken).digest("hex");

        this.forgetPasswordToken = encryptedToken;
        this.forgetPasswordExpiry = Date.now() = 15 * 60 * 1000;
        
        return resetToken;
    }
}
const User = model('User', userSchema);

export default  User;