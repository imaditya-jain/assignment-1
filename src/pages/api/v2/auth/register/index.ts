import connectToDatabase from "@/server/db/connect";
import { Users } from "@/server/models";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    connectToDatabase()
    try {
        if (request.method !== "POST") return response.status(405).json({ success: false, error: "Method not allowed." })

        const { firstName, lastName, email, password, role } = request.body

        if (!firstName || !lastName || !email || !password || !role) return response.status(400).json({ success: false, error: "Please provide required fields." })

        const isExist = await Users.findOne({ email })

        if (isExist) return response.status(400).json({ success: false, error: "User already exist." })

        const newUser = new Users({ firstName, lastName, email, password, role })

        const user = await newUser.save()

        if (!user) return response.status(500).json({ success: false, error: "Failed to create user." })

        return response.status(201).json({ success: true, message: "User created successfully." })

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors: Record<string, string> = {};
            for (const field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return response.status(400).json({ success: false, error: validationErrors, });
        }

        interface MongoDuplicateKeyError {
            code: number;
            keyPattern: Record<string, unknown>;
        }

        if (typeof error === "object" && error !== null && "code" in error && (error as MongoDuplicateKeyError).code === 11000) {
            const field = Object.keys((error as MongoDuplicateKeyError).keyPattern)[0];
            return response.status(400).json({ success: false, error: `${field} already exists.`, });
        }

        console.error("Error creating user:", error);

        return response.status(500).json({ success: false, error: "Internal server error." })
    }
}