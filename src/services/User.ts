import {
  BadRequestError,
  CustomError,
  NotFoundError,
} from "../middleware/ErrorHandler";
import { randomBytes } from "crypto";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import nodemailer from "nodemailer";
import { InternalServerError } from "../middleware/ErrorHandler";
const secret = process.env.JWT_SECRET;

// const generateResetToken = (): string => {
//   const token = randomBytes(32).toString("hex");
//   return token;
// };
// const saveResetToken = async (email: string, resetToken: string) => {
//   const user = User.findOne({ email: email });

//   if (!user) {
//     throw new NotFoundError("User Not Found!..");
//   }
// };

const generateRefreshToken = (user_id: string) =>
  jwt.sign({ userId: user_id }, secret, {
    expiresIn: "30d",
  });
const generateAccessToken = (user_id: string) =>
  jwt.sign({ userId: user_id }, secret, {
    expiresIn: "15m",
  });
const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const comparePassword = async (password: string, userPassword: string) => {
  const passwordMatch = await bcrypt.compare(password, userPassword);

  if (!passwordMatch) {
    throw new BadRequestError("Invalid email or password");
  }
  return true;
};

const SendOtp = (email: string) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASSWORD,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(new InternalServerError("Failed to send OTP"));
      } else {
        resolve(otp);
      }
    });
  });
};

const RegisterUser = async (payload: IUser) => {
  try {
    const userExist = await User.find({
      $or: [{ email: payload.email }, { username: payload.username }],
    });

    if (userExist.length > 0) {
      const existingUser = userExist[0] as Document & IUser;
      if (existingUser.username === payload.username) {
        throw new BadRequestError("Username Already Exists!.");
      } else {
        throw new BadRequestError("Email Already Exists!.");
      }
    }

    const hashedPass = bcrypt.hash(payload.password, 10);
    let user = await User.create({ ...payload, password: hashPassword });

    if (user) {
      //   const refreshToken = generateRefreshToken(user._id);
      const accessToken = generateAccessToken(user._id);
      const token = jwt.sign(payload, secret);
      user.refreshToken = token;
      user.accessToken = generateAccessToken(user._id);
      await user.save();
      return { user, accessToken, token };
    }
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};
const LoginUser = async (email: string, password: string) => {
  try {
    let user = await User.findOne({ email: email });

    if (user && comparePassword(password, user.password)) {
      const refreshToken = generateRefreshToken(user._id);
      const accessToken = generateAccessToken(user._id);
      user.refreshToken = generateRefreshToken(user._id);
      user.accessToken = generateAccessToken(user._id);
      await user.save();
      return { user, accessToken, refreshToken };
    }
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};

const deleteUser = async (user_id: string, password: string) => {
  try {
    let user = await User.findOne({ _id: user_id });
    if (user) {
      comparePassword(password, user.password);
    }
    const result = await User.findOneAndDelete({ _id: user_id });

    if (result) {
      return;
    } else {
      throw new NotFoundError("User not found");
    }
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};

const updateUser = async (user_id: string, payload: Partial<IUser>) => {
  const { password, ...updatedFields } = payload;
  try {
    const user = await User.updateOne({ _id: user_id }, updatedFields, {
      new: true,
    });

    if (user) {
      return user;
    } else {
      throw new NotFoundError("User not found");
    }
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};

const getUser = async (user_id) => {
  try {
    const user = await User.findOne({ _id: new Types.ObjectId(user_id) });

    if (user) {
      return user;
    } else {
      throw new NotFoundError("User not found");
    }
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};

const forgotPassword = async (
  userId: string,
  newPassword: string,
  currentPassword: string
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Password in wrong");
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    // Generate new tokens
    const accessToken = generateRefreshToken(user._id);
    const refreshToken = generateAccessToken(user._id);

    // Update the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Send response with new tokens
    return { message: "Password updated successfully" };
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};

const updatePassword = async (
  user_id: string,
  newPassword: string,
  oldPassword: string
) => {
  try {
    let user = await User.findById({ _id: user_id });

    if (user && comparePassword(oldPassword, user.password)) {
      user.password = bcrypt.hash(newPassword, 10);
      return user;
    }
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};

const userService = {
  RegisterUser,
  LoginUser,
  getUser,
  SendOtp,
  updatePassword,
  updateUser,
  deleteUser,
  forgotPassword,
};

export default userService;
