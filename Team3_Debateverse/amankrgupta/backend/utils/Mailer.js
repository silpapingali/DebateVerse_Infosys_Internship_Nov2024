const nodemailer= require('nodemailer');
const bcrypt= require("bcrypt");

const transporter= nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
})

const verifyMail= async (message)=>{
    console.log("in mailer", message);
    const url= `http:localhost:3000/api/auth/register/verify?e=${message.email}&p=${message.password}`;
    try {
        const result= await transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: message.email,
            subject: "Verify your email",
            html: `Click on the button to verify your email <br/> <a href=${url}>Verify<a/>`,
        })
        console.log("sent",result);
        return true;
    } catch(err) {
        console.log("in catch",err);
        return false;
    }
}

const resetMail= async (email)=>{
    console.log("in mailer", message);
    const url= `http:localhost:3000/api/auth/resetpassword?e=${email}`;
    try {
        const result= await transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: email,
            subject: "Reset your password",
            html: `Click on the button to reset your password <br/> <a href=${url}>Reset Password<a/>`,
        })
        return true;
    } catch(err) {
        return false;
    }
}

module.exports= {verifyMail, resetMail};