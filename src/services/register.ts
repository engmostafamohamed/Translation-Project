import { UserModelInterface, RegisterModelInterface, registerServiceInterface } from "../interfaces/register";
import userModel from "../models/register";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

class RegisterService implements registerServiceInterface {
    validateEmail(email: string): boolean {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    }
    validateUserName(userName: string): boolean {
        const userNameRegex = new RegExp(`^.{2,50}$`);
        return userNameRegex.test(userName);
    }
    async checkEmailExist(email: string): Promise<boolean> {
        //find user
        try {
            const result = await userModel.findOne({
                "email": email
            }).then((result) => {
                return result
            });
            if (result) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    async insertUser(userDetails: RegisterModelInterface, emailToken: string, hashPassword: string): Promise<any> {
        try {
            const result = new userModel({
                userName: userDetails.userName,
                email: userDetails.email,
                password: hashPassword,
                emailToken: emailToken,
                verified: false,
            })
            return await result.save();
        } catch (error) {
            throw error;
        }
    }
    async generateVerificationToken(id: string) {
        try {
            // const emailToken = crypto.randomBytes(64).toString("hex");
            const verificationToken = jwt.sign(
                { ID: id },
                process.env.USER_VERIFICATION_TOKEN_SECRET || "test",
                { expiresIn: "1m" }
            );
            const user = await userModel.findOne({ _id: id }).exec();
            if (!user) {
                const error = {
                    status: 404,
                    message: 'User does not  exists'
                }
                throw error;
            }
            user.messageExpired = new Date();
            await user.save();
            return verificationToken;
        } catch (error) {
            throw error
        }
    };
    async verifyAccount(token: string) {
        try {
            const payload = jwt.verify(
                token,
                process.env.USER_VERIFICATION_TOKEN_SECRET || "test",
            ) as string | JwtPayload;
            if (typeof payload === 'string') {
                throw new Error('Invalid token');
            }
            const user = await userModel.findOne({ _id: payload.ID }).exec();
            if (!user) {
                throw new Error('User does not exist');
            }
            user.isVerified = true;
            await user.save();
        } catch (error: any) {
            if (error instanceof jwt.TokenExpiredError) {
                throw { status: 401, message: 'Token has expired' };
            } else if (error.message === 'Invalid token') {
                throw { status: 404, message: error.message };
            } else if (error.message === 'User does not exist') {
                throw { status: 404, message: error.message };
            } else {
                throw error;
            }
        }
    }
    async getUserByEmail(email: string): Promise<any> {
        try {
            const result = await userModel.findOne({
                "email": email
            }).then((result) => {
                return result
            });
            if (result) {
                return result;
            }
            const error = {
                status: 404,
                message: 'Email does not exist',
            };
            throw error;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(messageExpired: string): Promise<any> {
        try {
            const result = await userModel.findOne({
                "messageExpired": messageExpired
            }).then((result) => {
                return result
            });
        } catch (error) {
            throw error;
        }
    }
}
export default RegisterService;