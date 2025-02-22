import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log("Successfully connected to MongoDB!! DB host:", connectionInstance.connection.host);

  } catch (error) {
    console.log("Error while connecting to MongoDB:", error);
    process.exit(1)
  }
}

export { connectDB };