import nodemailer from 'nodemailer';
async function sendVerificationMessage(email:string | undefined, verificationToken: string){
    try{
        const url = `${process.env.APP_URL}/register/verify/${verificationToken}`;
        const transporter = nodemailer.createTransport({
            service:'gmail',
            host: process.env.EMAIL_HOST,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Verify Account',
            html: `Click <a href = '${url}'>here</a> to confirm your email.`
        })
        return { message: 'Sent a verification email to ${email}' }
    }
    catch (error) {
        throw error;
    }
}

export default sendVerificationMessage