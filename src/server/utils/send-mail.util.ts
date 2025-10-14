import { transporter } from "../config";
import { Users } from "../models"

interface Mail {
    subject: string;
    html: string;
}

interface SendMailParams {
    _id: string;
    mail: Mail;
}

const sendMail = async ({ _id, mail }: SendMailParams): Promise<{
    status: number;
    success: boolean;
    error: string;
    message?: undefined;
} | {
    status: number;
    message: string;
    success: boolean;
    error?: undefined;
}> => {
    try {

        if (!_id) return { status: 400, success: false, error: "User id is required." }

        const user = await Users.findById(_id)

        if (!user) return { status: 404, success: false, error: "User not found." }

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: mail.subject,
            html: mail.html,
            priority: "high"
        } as const

        await transporter.sendMail(mailOptions)

        return { status: 200, message: "Mail sent successfully.", success: true }

    } catch (error) {
        if (error instanceof Error) {
            console.log(`An error occurred while sending mail: ${error.message}`)
        } else {
            console.log(`An unknown error occurred.`)
        }

        return { status: 500, success: false, error: "Internal server error." }
    }
}

export default sendMail