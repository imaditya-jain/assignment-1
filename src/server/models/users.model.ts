import mongoose, { Types } from "mongoose";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Model } from "mongoose";

enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

export interface IUser extends mongoose.Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    otp: string | null;
    otpExpiry: Date | null;
    refreshToken: string | null;
    comparePassword(enteredPassword: string): Promise<boolean>;
    compareOTP(enteredOTP: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const usersSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: (value: string) => /^[A-Za-z]+$/.test(value),
            message: 'First name should only contain alphabets'
        }
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        validate: {
            validator: (value: string) => /^[A-Za-z]+$/.test(value),
            message: 'last name should only contain alphabets'
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: "Invalid email address",
        }
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER,
        required: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) =>
                /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/.test(value),
            message:
                'Password must be 8-16 characters long, include at least one letter, one number, and one special character (@$!%*?&#).',
        },
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true })

usersSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

usersSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}

usersSchema.methods.compareOTP = async function (enteredOTP: string): Promise<boolean> {
    if (!this.otp || !this.otpExpiry) return false;
    const isExpired = this.otpExpiry.getTime() < Date.now();
    if (isExpired) return false;
    return await bcrypt.compare(enteredOTP, this.otp);
};

usersSchema.methods.generateAccessToken = function (): string {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined.')
    }
    return jwt.sign({ _id: this._id, firstName: this.firstName, lastName: this.lastName, email: this.email, role: this.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

usersSchema.methods.generateRefreshToken = function (): string {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined.')
    }
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const Users: Model<IUser> = mongoose.models.Users || mongoose.model<IUser>('Users', usersSchema)

export default Users