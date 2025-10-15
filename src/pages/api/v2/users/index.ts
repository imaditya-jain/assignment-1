import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/server/utils/verify-token.util";

export default async function GET(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== "GET") return response.status(405).json({ success: false, error: "Method not allowed." });

    const { valid, error } = verifyToken(request);

        if (!valid) {
            return response.status(401).json({ success: false, error });
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log(`An error occurred while fetching all users: ${error.message}`)
        } else {
            console.log(`An unknown error occurred.`)
        }

        return response.status(500).json({ success: false, error: "Internal server error." })
    }
}