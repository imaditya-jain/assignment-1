import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        if (process.env.NODE_ENV === "production" && !process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not configured in environment')
        } else if (process.env.NODE_ENV === "production" && process.env.MONGO_URI) {
            const uri = process.env.MONGO_URI
            try {
                const hostMatch = uri.match(/@(.*)/)
                const host = hostMatch ? hostMatch[1] : 'unknown-host'
                console.log(`database connecting to: ${host}`)
            } catch {
                console.log('database connecting to MongoDB')
            }
            await mongoose.connect(uri)
        } else if (process.env.NODE_ENV === "development") {
            console.log("database connected: mongodb://127.0.0.1:27017/assignment_db")
            await mongoose.connect("mongodb://127.0.0.1:27017/assignment_db")
        }
        console.log('Mongo DB is connected.')
    } catch (error) {
        if (error instanceof mongoose.Error) {
            console.log('Error while configuring with database.', error.message)
        } else {
            console.log('An unknown error occurred.')
        }
        throw error
    }
}

export default connectToDatabase