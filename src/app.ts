import express  from 'express';
import cors from 'cors';
import connectDB from "./utils/connectDB";
import registerRouter from './routes/register';
import dotenv from 'dotenv';
dotenv.config();

const app=express();
app.use(express.json());
app.use(cors()); 
app.use('/register',registerRouter);
const port=process.env.PORT;

app.listen(port||4000,()=>{
  console.log(`Server is running on ${port}`)
})

//connect to database
connectDB();

