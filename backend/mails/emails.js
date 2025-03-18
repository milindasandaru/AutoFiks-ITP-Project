import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
/*import { mailtrapClient } from "./mailtrap.config.js";
import { sender } from "./mailtrap.config.js";*/
import { brevoTransporter, sender } from "./brevo.config.js";

/*export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent succesfully", response);
  } catch (error) {
    console.error(`Error sending verification email:`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "60454ef0-50e3-4056-b72e-0fdc6c5db88a",
      template_variables: { company_info_name: "Company", name: name },
    });

    console.log("Welcome email sent succesfully", response);
  } catch (error) {
    throw new Error(`Error sending the welcome email: ${error}`);
  }
};

export const sendPasswordResetMail = async (email, resetUrl) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password reset",
    });

    console.log("Email sent successfuly", response);
  } catch (error) {
    console.error(`Error sending reset email:`, error);
    throw new Error(`Error sending reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset",
    });

    console.log("Password reset email sent succesfully", response);
  } catch (error) {
    console.error("Error sending password reset success mail", error);
    throw new Error(`Error sending password reset successfull email: ${error}`);
  }
};*/

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: sender.email,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    };

    const response = await brevoTransporter.sendMail(mailOptions);
    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: sender.email,
      to: email,
      subject: "Welcome to Our App!",
      html: `<p>Dear ${name},</p><p>Welcome to our platform!</p>`,
    };

    const response = await brevoTransporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetMail = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: sender.email,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
    };

    const response = await brevoTransporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error(`Error sending reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: sender.email,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };

    const response = await brevoTransporter.sendMail(mailOptions);
    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset success mail:", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
