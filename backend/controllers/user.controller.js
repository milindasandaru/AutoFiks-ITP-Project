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

export const updateProfile = async (req, res) => {
  try {
    const userID = req.userID;
    const { name, email, username, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { name, email, username, phone, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userID = req.userID;
    const deletedUser = await User.findByIdAndDelete(userID);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.clearCookie("token");

    res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
