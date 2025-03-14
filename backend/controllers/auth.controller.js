import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetMail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  console.log("Received body:", req.body);

  const { mail, password, name, address, NIC, username, phone } = req.body;

  try {
    if (
      !mail ||
      !password ||
      !name ||
      !address ||
      !NIC ||
      !username ||
      !phone
    ) {
      throw new Error("All feilds requred!");
    }

    const userAlreadyExists = await User.findOne({ mail });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      mail,
      username,
      password: hashPassword,
      name,
      address,
      phone,
      NIC,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24hours
    });

    await user.save();

    //jwt token verification part
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.mail, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created succesfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.mail, user.name);

    res.status(200).json({
      success: true,
      message: "Welcome email sent succesfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Welcome email could not be snent" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { mail, password } = req.body;
  try {
    let user = await User.findOne({ mail });
    if (!user) {
      // If not found in User collection, check in Employee collection
      const Employee = mongoose.model(
        "Employee",
        new mongoose.Schema(),
        "employee"
      ); // Dynamically create Employee model
      user = await Employee.findOne({ mail });

      if (!user) {
        console.log("User not found", mail);
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("Employee password invalid");
        return res
          .status(400)
          .json({ success: true, message: "Invalid credentials" });
      }

      generateTokenAndSetCookie(res, user._id);

      user.lastLogin = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        message: "Employee Logged in successfully",
        user: {
          ...user._doc,
          isVerified: user.isVerified ?? false,
          password: undefined,
        },
        role: "employee",
      });
    }

    //If user found authenticatte user
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("User password invalid");
      return res
        .status(400)
        .json({ success: true, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        isVerified: user.isVerified ?? false,
        password: undefined,
      },
      role: "user",
    });
  } catch (error) {
    console.log("Error in login function", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "User logged out succesfully" });
};

export const forgotPassword = async (req, res) => {
  const { mail } = req.body;
  try {
    const user = await User.findOne({ mail });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetMail(
      user.mail,
      `${process.env.CLIENT_URL}/resetpassword/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link succesfully sent",
    });
  } catch (error) {
    console.log("Error in forgotPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.mail);

    res
      .status(200)
      .json({ success: true, message: "Password reset succesfull" });
  } catch (error) {
    console.log("Error in reset password", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userID);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
