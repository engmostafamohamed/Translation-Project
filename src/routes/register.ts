import express,{Request,Response} from 'express';
import RegisterController from '../controllers/register';
import { RegisterModelInterface, VerifyModelInterface } from '../interfaces/register';

const registerRouter=express.Router()

registerRouter.post('/',async(req:Request,res:Response):Promise<Response>=>{
    try{
        const userDetails:RegisterModelInterface={
            userName:req.body.userName,
            email:req.body.email,
            password:req.body.password,
            password_confirmation:req.body.password_confirmation
        }
        const registerController=new RegisterController();
        const result=await registerController.registerNewUser(userDetails)
        return res.status(200).json(result);
    }
    catch(error:any){
        return res.status(error.status||500).json({message:error.message||'Internal server Error'})
    }
})
registerRouter.get('/verify/:token',async(req:Request,res:Response):Promise<Response>=>{
    try{
        const {token}=req.params;
        const registerController=new RegisterController();
        const result=await registerController.verifyAccount(token)
        return res.status(200).json(result);
    }
    catch(error:any){
        return res.status(error.status||500).json({message:error.message||'Internal server Error'})
    }
})
registerRouter.post('/resendMessage',async (req:Request,res:Response):Promise<Response>=>{
    try {
        const email=req.body.email;
        const registerController=new RegisterController();
        const result= await registerController.resendVerificationMessage(email);
        console.log(result);
        return res.status(200).json(result);
    } catch (error:any) {
        return res.status(error.status||500).json({message:error.message||'Internal server Error'})
    }
})
export default registerRouter;