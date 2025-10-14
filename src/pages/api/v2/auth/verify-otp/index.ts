import connectToDatabase from "@/server/db/connect"
import { Users } from "@/server/models"
import { NextApiRequest, NextApiResponse } from "next"

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    connectToDatabase()
    try {
        if (request.method !== "POST") return response.status(405).json({ success: false, error: "Method not allowed." })

        const { email, otp } = request.body

        if (!email || !otp) return response.status(400).json({ success: false, error: "Please provide required fields." })

        const user = await Users.findOne({ email })

        if (!user) return response.status(404).json({ success: false, error: "User not found." })

        const isOTPMatched = await user.compareOTP(otp)

        if (!isOTPMatched) return response.status(400).json({ success: false, error: "Invalid OTP." })

        await Users.findByIdAndUpdate(user._id, { otp: null, otpExpiry: null })

        return response.status(200).json({ success: true, message: "OTP verified successfully." });

    } catch (error) {
        if (error instanceof Error) {
            console.log(`An error occurred while verifying otp: ${error.message}`)
        } else {
            console.log(`An unknown error occurred.`)
        }

        return response.status(500).json({ success: false, error: "Internal server error." })
    }
}