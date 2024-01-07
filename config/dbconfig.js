import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const connectToDB = async ()=> {
    try{
        const {connection} = await mongoose.connect("mongodb://localhost:27017/lms" ||process.env.MONGO_URI);

        if(connection) {
            console.log(`Connection to Db: ${connection.host}`);
        }
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

export default connectToDB;