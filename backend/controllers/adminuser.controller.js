import { User } from "../models/user.model.js";

export const getUserDetails = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (user.lastLogin > sixMonthsAgo) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete users active within the last 6 months",
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const allUsers = await User.find();

    const totalUsers = allUsers.length;
    const verified = allUsers.filter((u) => u.isVerified).length;
    const unverified = totalUsers - verified;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const active = allUsers.filter((u) => u.lastLogin > sixMonthsAgo).length;

    const thisMonth = new Date().getMonth();
    const newThisMonth = allUsers.filter(
      (u) => new Date(u.createdAt).getMonth() === thisMonth
    ).length;

    res.json({ totalUsers, verified, unverified, active, newThisMonth });
  } catch (err) {
    res.status(500).json({ message: "Stats error" });
  }
};
