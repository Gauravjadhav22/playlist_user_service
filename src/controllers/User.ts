import { CustomError, InternalServerError } from "../middleware/ErrorHandler";
import User, { IUser } from "../models/User";
import userService from "../services/User";
import { ApiResponse } from "../utils/Response";

const create = (req, res) => {
  const user = userService.RegisterUser(req.body);
  res.status(201).json(ApiResponse.success(user,"User created"));
};

const sendOtp = (req, res) => {
  const otp = userService.SendOtp(req.email.toString());
  req.session.otp = otp;
  req.session.email = req.email.toString();
  const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  req.session.otpExpiration = expirationTime;
  res.status(200, "Otp sent Successfully!.");
};

const verifyOpt = (req, res) => {
  const { otp } = req.body;
  const storedOTP = req.session.otp;
  const email = req.session.email;
  const expirationTimestamp = req.session.otpExpiration;
  if (verifyOtp(otp, storedOTP, email, expirationTimestamp)) {
    res.status(200).send("Otp Verified!..");
  } else {
    res.status(400).send("Otp verification failed or expired!.");
  }
};

const forgotPassword = (req, res) => {
  const { otp } = req.body;
  const storedOTP = req.session.otp;
  const email = req.session.email;
  const expirationTimestamp = req.session.otpExpiration;
  if (verifyOtp(otp, storedOTP, email, expirationTimestamp)) {
    const result = userService.forgotPassword(
      req.body.user_id,
      req.email.toString(),
      req.updatedPassword.toString()
    );
    res.status(200).send("Password has changed!..");
  } else {
    res.status(400).send("Otp verification failed or expired!.");
  }
};

const update = (req, res) => {
  const user = userService.updateUser(req.params.user_id, req.body);

  return res.status(200).json(ApiResponse.success(user,"User Updated"));
};
const deleteUser = (req, res) => {
  const user = userService.deleteUser(req.params.user_id, req.body.password);

  return res.status(200).send("User Deleted");
};

const getUser = (req, res) => {
  const user = userService.getUser(req.user_id);
  return res.status(200).json(ApiResponse.success(user,""));
};
