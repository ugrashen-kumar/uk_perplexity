import mongoose from 'mongoose'


const connectToDatabase = async() =>{
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected : ${connectionInstance.connection.host}`)
}

export default connectToDatabase