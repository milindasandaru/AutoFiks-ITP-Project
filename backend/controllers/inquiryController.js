import Inquiry from '../models/inquiry.js'; // Corrected import path

// Create a new inquiry
export async function addInquiry(req, res) {
  const { mail, userName, serviceID, type, message, status } = req.body;

  try {
    const newInquiry = new Inquiry({
      mail,
      userName,
      serviceID,
      type,
      message,
      status: type === 'complaint' ? status : undefined, // Set status only for complaints
    });

    await newInquiry.save();
    res.status(201).json({ success: true, message: 'Inquiry added successfully', inquiry: newInquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Get all inquiries
export async function getAllInquiries(req, res) {
  try {
    const inquiries = await Inquiry.find(); // Use Inquiry.find()
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Get a single inquiry by ID
export async function getInquiryById(req, res) {
  const { id } = req.params;

  try {
    const inquiry = await Inquiry.findById(id); // Use Inquiry.findById()
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
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
    const inquiry = await Inquiry.findById(id); // Use Inquiry.findById()
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    inquiry.mail = mail || inquiry.mail;
    inquiry.userName = userName || inquiry.userName;
    inquiry.serviceID = serviceID || inquiry.serviceID;
    inquiry.type = type || inquiry.type;
    inquiry.message = message || inquiry.message;
    inquiry.status = type === 'complaint' ? status : undefined; // Update status only for complaints

    await inquiry.save();
    res.status(200).json({ success: true, message: 'Inquiry updated successfully', inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Delete an inquiry by ID
export async function deleteInquiry(req, res) {
  const { id } = req.params;

  try {
    const inquiry = await Inquiry.findByIdAndDelete(id); // Use Inquiry.findByIdAndDelete()
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Get inquiries by type
export async function getInquiriesByType(req, res) {
  try {
    const { type } = req.params;
    if (!['feedback', 'complaint'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inquiry type',
      });
    }

    const inquiries = await Inquiry.find({ type }).sort({ createdAt: -1 }); // Use Inquiry.find()
    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error('Error fetching inquiries by type:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries',
      error: error.message,
    });
  }
}