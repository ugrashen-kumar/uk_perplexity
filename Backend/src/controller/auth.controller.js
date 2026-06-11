import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      Message: "User altrady exist with this email or username",
      success: false,
      err: "user Already Exist",
    });
  }

  const user = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to UK Perplexity!",
    html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>UK Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The UK Perplexity Team</p>
        `,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "invalid token",
        success: false,
        err: "user not found",
      });
    }

    user.verified = true;
    await user.save();

    const html = `<h1>Email Verified Successfully!</h1>
    <p>Your email has been verified. You can now log in to your account.</p>
    <a href="http://localhost:3000/login">Go to Login</a>
    `;

    res.send(html);
  } catch (error) {
    console.log("verify email error", error);

    return res.status(400).json({
      success: false,
      message: "Invalid or Expire token",
      err: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({email}).select("+password")

  if (!user) {
    return res.status(404).json({
      message: "invalid email and password",
      status: false,
      err: "Invalid User",
    });
  }

  const isPasswordMatch = await user.comparePassword(password)

  if(!isPasswordMatch){
    return res.status(400).json({
        message : "Invalid Email or password",
        success : false,
        err : "Incorrect password"
    })
  }


  if(!user.verified){
    return res.status(400).json({
        message : "Please verify your email before logging in",
        success : false,
        err : "Email not verified"
    })
  }

  const token = jwt.sign(
    {
      id : user._id,
      username : user.username
    },
    process.env.JWT_SECRET,
    {expiresIn : "7d"}
  );


  res.cookie("token", token);

  res.status(200).json(
    {
        message : "Logedin Successfully",
        success : true,
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    }
  )

};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        err: "User not found",
      });
    }

    return res.status(200).json({
      message: "User Fetched Successfully",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};
