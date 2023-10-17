import {Schema, model} from 'mongoose';

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

const User = model('User', userSchema);

export default  User;