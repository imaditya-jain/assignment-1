import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        if (process.env.NODE_ENV === "production" && !process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not found.')
        } else if (process.env.NODE_ENV === "production" && process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI)
        } else if (process.env.NODE_ENV === "development") {
            await mongoose.connect("mongodb://127.0.0.1:27017/assignment_db")
        }
        console.log('Mongo DB is connected.')
    } catch (error) {
        if (error instanceof mongoose.Error) {
            console.log('Error while configuring with database.', error.message)
        } else {
            console.log('An unknown error occurred.')
        }
        process.exit(1)
    }
}

export default connectToDatabase