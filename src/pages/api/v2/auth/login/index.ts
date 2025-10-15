import connectToDatabase from '@/server/db/connect';
import { generateOTP } from '@/server/helpers';
import { Users } from '@/server/models';
import { sendMail } from '@/server/utils';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    await connectToDatabase()
    try {
        if (request.method !== "POST") return response.status(405).json({ success: false, error: "Method not allowed." })

        const { email, password } = request.body

    if (!email || !password) return response.status(400).json({ success: false, error: "Please provide required fields." })

        const user = await Users.findOne({ email })

        if (!user) return response.status(404).json({ success: false, error: "User does not exist." })

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) return response.status(403).json({ success: false, error: "Password does not matched." })

        const OTP = generateOTP();
        const hashedOTP = await bcrypt.hash(OTP, 10);

        const otp = hashedOTP;
        const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

        await Users.findByIdAndUpdate(user._id, { otp, otpExpiry })

        const mail = {
            subject: "Verify your email",
            html: `<div><p>Enter <b>${OTP}</b> in the app to verify your email address and complete sign in.</p></div>`
        }

        const mailResponse = await sendMail({ _id: user._id.toString(), mail: { ...mail } })

        const { success, message, error, status } = mailResponse

        if (error) return response.status(status).json({ success, error })

        return response.status(status).json({ success, message })

    } catch (error) {
        if (error instanceof Error) {
            console.log(`An error occurred while login: ${error.message}`)
        } else {
            console.log(`An unknown error occurred.`)
        }

        return response.status(500).json({ success: false, error: "Internal server error." })
    }
}