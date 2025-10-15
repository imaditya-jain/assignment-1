import { Users } from "@/server/models";
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(request: NextApiRequest,response: NextApiResponse) {
  try {

    if(request.method !== "POST") return response.status(405).json({success: false, error:"Method not allowed."})

    const {otp, password, email} = request.body

    if(!otp || !password || !email) return response.status(400).json({success: false, error:"Provide all required fields."})

    const user = await Users.findOne({email})

    if(!user) return response.status(404).json({success: false, error:"User not found."})

    const isOTPMatched = user.compareOTP(otp)

    if(!isOTPMatched) return response.status(400).json({success: false, error:"OTP does not matched."})

    user.password = password
    user.otp = null
    user.otpExpiry = null

    await user.save()

    return response.status(200).json({success: true, error:"Password reset successfully."})
    

  } catch (error) {
    if(error instanceof Error){
        console.log(`An error occurred while reset password: ${error.message}`);
    }else{
        console.log('An unknown error occurred.')
    }

    return response.status(500).json({success: false, error:"Internal server error."})
  }
}
