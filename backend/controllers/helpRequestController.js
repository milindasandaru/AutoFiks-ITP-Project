import HelpRequest from '../models/HelpRequestModel.js';

// Get all help requests (admin)
export const getAllHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find()
      .populate('employeeId', 'name email position')
      .sort({ createdAt: -1 });
    res.status(200).json(helpRequests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch help requests", error: error.message });
  }
};

// Get help requests for a specific employee
export const getEmployeeHelpRequests = async (req, res) => {
  try {
    // Get employee ID from the authenticated user token
    const employeeId = req.userID;
    
    const helpRequests = await HelpRequest.find({ employeeId })
      .sort({ createdAt: -1 });
    res.status(200).json(helpRequests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee help requests", error: error.message });
  }
};

// Create a new help request
export const createHelpRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority
    } = req.body;
    
    // Get employee ID from the authenticated user token
    const employeeId = req.userID;
      
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const newHelpRequest = new HelpRequest({
      title,
      description,
      category: category || "other",
      priority: priority || "medium",
      employeeId,
      responses: []
    });

    const savedHelpRequest = await newHelpRequest.save();
    
    res.status(201).json(savedHelpRequest);
  } catch (error) {
    res.status(400).json({ message: "Failed to create help request", error: error.message });
  }
};

// Get a single help request by ID
export const getHelpRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const helpRequest = await HelpRequest.findById(id)
      .populate('employeeId', 'name email position');
    
    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }
    
    // Check if the authenticated user owns this help request or is an admin
    // This is a basic check - you may want to enhance this with proper role checking
    if (helpRequest.employeeId._id.toString() !== req.userID && !req.isAdmin) {
      return res.status(403).json({ message: "You don't have permission to view this help request" });
    }
    
    res.status(200).json(helpRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch help request", error: error.message });
  }
};

// Add a response to a help request
export const addResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isAdmin } = req.body;
    
    // Get user info from authenticated request
    const userId = req.userID;
    const userName = req.body.userName || "User"; // Pass the user name in the request
    
    if (!text) {
      return res.status(400).json({ message: "Response text is required" });
    }
    
    const helpRequest = await HelpRequest.findById(id);
    
    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }
    
    // Check ownership or admin status (basic check)
    if (helpRequest.employeeId.toString() !== userId && !isAdmin) {
      return res.status(403).json({ message: "You don't have permission to respond to this help request" });
    }
    
    // Add the new response
    helpRequest.responses.push({
      text,
      createdBy: userName,
      isAdmin: isAdmin || false
    });
    
    // If admin is responding, update status to in-progress if it's open
    if (isAdmin && helpRequest.status === 'open') {
      helpRequest.status = 'in-progress';
    }
    
    const updatedHelpRequest = await helpRequest.save();
    res.status(200).json(updatedHelpRequest);
  } catch (error) {
    res.status(400).json({ message: "Failed to add response", error: error.message });
  }
};

// Update help request status
export const updateHelpRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const helpRequest = await HelpRequest.findById(id);
    
    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }
    
    // Only admins should update status (add proper admin check based on your auth system)
    if (!req.body.isAdmin) {
      return res.status(403).json({ message: "Only admins can update status" });
    }
    
    helpRequest.status = status;
    
    // If marking as resolved, set resolvedAt date
    if (status === 'resolved' && !helpRequest.resolvedAt) {
      helpRequest.resolvedAt = new Date();
    }
    
    const updatedHelpRequest = await helpRequest.save();
    res.status(200).json(updatedHelpRequest);
  } catch (error) {
    res.status(400).json({ message: "Failed to update help request status", error: error.message });
  }
};
