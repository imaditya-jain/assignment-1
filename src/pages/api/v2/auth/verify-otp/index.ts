import connectToDatabase from "@/server/db/connect"
import { Users } from "@/server/models"
import { generateAccessAndRefreshToken } from "@/server/utils"
import { NextApiRequest, NextApiResponse } from "next"

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    await connectToDatabase()
    try {
        if (request.method !== "POST") return response.status(405).json({ success: false, error: "Method not allowed." })

        const { email, otp } = request.body
        console.log('{ email, otp }: ', { email, otp });

        if (!email || !otp) return response.status(400).json({ success: false, error: "Please provide required fields." })

        const user = await Users.findOne({ email })

        if (!user) return response.status(404).json({ success: false, error: "User not found." })

        const isOTPMatched = await user.compareOTP(otp)

        if (!isOTPMatched) return response.status(400).json({ success: false, error: "Invalid OTP." })

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString())
        console.log('{ accessToken, refreshToken }: ', { accessToken, refreshToken });

        await Users.findByIdAndUpdate(user._id, { otp: null, otpExpiry: null })

        response.setHeader("Set-Cookie", [`accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,`refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,])

        return response.status(200).json({success: true, message:'Login successfully.'})

    } catch (error) {
        if (error instanceof Error) {
            console.log(`An error occurred while verifying otp: ${error.message}`)
        } else {
            console.log(`An unknown error occurred.`)
        }

        return response.status(500).json({ success: false, error: "Internal server error." })
    }
}