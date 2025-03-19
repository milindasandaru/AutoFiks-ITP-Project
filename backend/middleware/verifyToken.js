import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token: ", token);
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "unauthorized - no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ status: false, message: "Unauthiorized - Invalid token" });
    req.userID = decoded.userID;
    next();
  } catch (error) {
    console.log("Error in verifying the token", error);
    return res.status(402).json({ success: false, message: "Server error" });
  }
};
