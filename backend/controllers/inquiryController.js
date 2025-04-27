import Inquiry from "../models/inquiry.js"; // Corrected import path
import { brevoTransporter, sender } from "../mails/brevo.config.js";


// Create a new inquiry
export async function addInquiry(req, res) {
  const { mail, userName, serviceID, type, message, status } = req.body;
  const userID = req.userID; // Get userID from the verified token

  try {
    const newInquiry = new Inquiry({
      userID,
      mail,
      userName,
      serviceID,
      type,
      message,
      status: type === "complaint" ? status : undefined, // Set status only for complaints
    });

    await newInquiry.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Inquiry added successfully",
        inquiry: newInquiry,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Get all inquiries
// Get all inquiries for the logged-in user
export async function getAllInquiries(req, res) {
  try {
    const inquiries = await Inquiry.find({ userID: req.userID }).populate(
      "userID",
      "name email"
    );
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Get a single inquiry by ID
export async function getInquiryById(req, res) {
  const { id } = req.params;

  try {
    const inquiry = await Inquiry.findById(id).populate("userID", "name email");
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    // Check if the user is accessing their own inquiry
    if (
      inquiry.userID._id.toString() !== req.userID &&
      req.userRole !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Update an inquiry by ID
export async function updateInquiry(req, res) {
  const { id } = req.params;
  const { mail, userName, serviceID, type, message, status } = req.body;

  try {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    // Check if the user is updating their own inquiry
    if (inquiry.userID.toString() !== req.userID && req.userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    inquiry.mail = mail || inquiry.mail;
    inquiry.userName = userName || inquiry.userName;
    inquiry.serviceID = serviceID || inquiry.serviceID;
    inquiry.type = type || inquiry.type;
    inquiry.message = message || inquiry.message;
    inquiry.status = type === "complaint" ? status : undefined;

    await inquiry.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Inquiry updated successfully",
        inquiry,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Delete an inquiry by ID
export async function deleteInquiry(req, res) {
  const { id } = req.params;

  try {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    // Check if the user is deleting their own inquiry
    if (inquiry.userID.toString() !== req.userID && req.userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    await inquiry.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Get inquiries by type
export async function getInquiriesByType(req, res) {
  try {
    const { type } = req.params;
    if (!["feedback", "complaint"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry type",
      });
    }

    const inquiries = await Inquiry.find({
      type,
      userID: req.userID, // Only get inquiries for the current user
    })
      .sort({ createdAt: -1 })
      .populate("userID", "name email");

    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching inquiries by type:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inquiries",
      error: error.message,
    });
  }
}

export async function getNextServiceID(req, res) {
  try {
    const lastInquiry = await Inquiry.findOne().sort({
      serviceID: -1
    });

    let nextServiceID = "1"; // Default starting point

    if (lastInquiry && lastInquiry.serviceID) {
      // Assuming serviceID is numeric string
      const lastID = parseInt(lastInquiry.serviceID);
      nextServiceID = (lastID + 1).toString();
    }

    res.status(200).json({ success: true, nextServiceID });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const sendInquiryReply = async (req, res) => {
  const { inquiryId, message } = req.body;

  try {
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,  // Sender name and email
      to: inquiry.mail,                            // Customer's email
      subject: "Response to Your Inquiry",
      html: `
        <p>Dear ${inquiry.userName},</p>
        <p>Thank you for reaching out to us regarding your ${inquiry.type}.</p>
        <p><strong>Our Response:</strong></p>
        <p>${message}</p>
        <br/>
        <p>Best regards,</p>
        <p>Autofiks Customer Support Team</p>
      `,
    };

    const response = await brevoTransporter.sendMail(mailOptions);
    console.log("Inquiry reply email sent successfully", response);

    res.status(200).json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ success: false, message: "Failed to send reply" });
  }
};
