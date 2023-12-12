import { MongoClient ,ServerApiVersion} from "mongodb";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const {
    MONGO_HOST,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_PORT,
    MONGO_DB_NAME,
    MONGO_LOCAL,
} = process.env;
// Construct the connection string
const connectionString = `mongodb+srv://${MONGO_HOST}:${MONGO_PASSWORD}@cluster0.0imewrd.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
// Set up Mongoose options
const mongooseOptions = {
  useNewUrlParser: true,
  // @ts-ignore
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;UnifiedTopology: true

if (MONGO_LOCAL) {
  // MONGO_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;
}
const connectDB =async ()=>{
  // Connect to the MongoDB database
  mongoose.connect(connectionString, mongooseOptions)
    .then(() => {
    console.log('Connecting to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });
}
export default connectDB;