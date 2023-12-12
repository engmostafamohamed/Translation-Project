import { UserModelInterface,RegisterModelInterface, registerControllerInterface } from "../interfaces/register";
import RegisterService from "../services/register";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import sendVerificationMessage from "../utils/nodemailer";
class RegisterController implements registerControllerInterface {
    async registerNewUser(userDetails: RegisterModelInterface): Promise<{ message: string }> {
        try {
            const registerService = new RegisterService();
            const validateUserName = registerService.validateUserName(userDetails.userName);
            const validateEmail = registerService.validateEmail(userDetails.email);
            if (!validateUserName) {
                const error = {
                    status: 400,
                    message: 'Name is not valid'
                }
                throw error
            } else if (!validateEmail) {
                const error = {
                    status: 400,
                    message: 'Email is not valid'
                }
                throw error
            } else if (userDetails.password.length < 8) {
                const error = {
                    status: 400,
                    message: 'password is not valid'
                }
                throw error
            } else if (userDetails.password !== userDetails.password_confirmation) {
                const error = {
                    status: 400,
                    message: 'password and confirm password are not compatible'
                }
                throw error
            }
            const checkEmailExist = await registerService.checkEmailExist(userDetails.email)
            if (checkEmailExist) {
                const error = {
                    status: 400,
                    message: 'USER_ALREADY_EXIST'
                }
                throw error;
            }
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(userDetails.password, salt)
            const emailToken= crypto.randomBytes(64).toString("hex");
            const data =await registerService.insertUser(userDetails, emailToken,hashPassword);
            const  verificationToken = registerService.generateVerificationToken(data._id);
            console.log(verificationToken);
            // await sendVerificationMessage(data.email,await verificationToken);
            return { message: 'Sent a verification email to ${email}' }
        } catch (error) {
            throw error;
        }
    }
    async verifyAccount(token:string):Promise<{message:string}>{
        try {
            if (!token) {
                const error = {
                    status: 422,
                    message: 'Missing Token'
                }
                throw error;
            }
            const registerService = new RegisterService();
            await registerService.verifyAccount(token);
            return {message: 'Account Verified'}
        } catch (error) {
            // const err = {
            //     status: 500,
            //     message: `Error happened: ${error} `
            // }
            throw error;
        }
    }
    async resendVerificationMessage(email:string):Promise<{message:string}>{
        try {
            const registerService = new RegisterService();
            const user = await registerService.getUserByEmail(email);
            if (!user || user.isVerified) {
                const error = {
                    status: 400,
                    message: `Invalid request`
                };
                throw error;
            }
            const lastVerificationSentAt = user.messageExpired;
            const twoMinutesAgo = new Date(new Date().getTime() - 2 * 60 * 1000);
            if (lastVerificationSentAt > twoMinutesAgo) {
                const error = {
                    status: 429,
                    message: `Please wait for 2 minutes before requesting another email`
                }
                throw error;
            }
            const  verificationToken = registerService.generateVerificationToken(user.id);
            await sendVerificationMessage(email,await verificationToken);
            return { message: 'Sent a verification email to ${email}'}
        } catch (error:any) {
           throw error
        }
    }
}
export default RegisterController;