import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{email}, {username}]
  });

  if(isUserAlreadyExist){
    return res.status(400).json({
        Message : "User altrady exist with this email or username",
        success : false,
        err : "user Already Exist"
    })
  }

  const user = await userModel.create({username, email, password})

  // const emailVerificationToken = jwt.sign(
  //   { email : user.email},
  //   process.env.JWT_SECRET
  // )

   // <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>

    await sendEmail({
        to: email,
        subject: "Welcome to UK Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>UK Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
               
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The UK Perplexity Team</p>
        `
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

};
