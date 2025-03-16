import { User } from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userID).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User could not be found" });
    }

    console.log("User received: ", req.body);

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getProfile", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
