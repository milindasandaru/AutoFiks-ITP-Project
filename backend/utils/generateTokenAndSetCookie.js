import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userID) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, //Prevents xss attacks
    secure: process.env.NODE_ENV === "production", //only works in http https
    sameSite: "strict", //csref attack prevented
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
