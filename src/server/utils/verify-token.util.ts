import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

export function verifyToken(req: NextApiRequest) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return { valid: false, error: "Unauthorized - missing or invalid token format" };
        }

        if (!JWT_SECRET) {
            return { valid: false, error: "JWT secret not configured" };
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        return { valid: true, decoded };
    } catch (error: Error | unknown) {
        console.error("JWT verification failed:", (error as Error).message);
        return { valid: false, error: "Invalid or expired token" };
    }
}