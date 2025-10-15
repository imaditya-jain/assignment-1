import connectToDatabase from "@/server/db/connect";
import { Users } from "@/server/models";
import { generateAccessAndRefreshToken } from "@/server/utils";
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    await connectToDatabase();
    try {
        if (request.method !== "POST") return response.status(405).json({ success: false, error: "Method not allowed." });

        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken) {
            return response.status(401).json({ success: false, error: "No refresh token provided." });
        }

        if (!process.env.REFRESH_TOKEN_SECRET) {
            return response.status(500).json({ success: false, error: 'Server misconfigured.' });
        }

        let decoded: { _id: string }
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as { _id: string }
        } catch {
            return response.status(401).json({ success: false, error: 'Invalid refresh token.' });
        }

        const user = await Users.findById(decoded._id);
        if (!user) {
            return response.status(404).json({ success: false, error: "User not found." });
        }

        if (user.refreshToken !== refreshToken) {
            return response.status(401).json({ success: false, error: "Invalid refresh token." });
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id.toString());

        response.setHeader("Set-Cookie", [
            `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
            `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
        ]);

        return response.status(200).json({
            success: true,
            message: "Tokens refreshed successfully.",
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
                refreshToken: newRefreshToken,
            },
        });

    } catch (error) {
        if (error instanceof Error) {
            console.log(`An error occurred while refreshing token: ${error.message}`);
        } else {
            console.log(`An unknown error occurred.`);
        }

        return response.status(500).json({ success: false, error: "Internal server error." });
    }
}