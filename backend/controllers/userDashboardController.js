// controllers/userDashboardController.js
import { User } from "../models/user.model.js";
import Booking from "../models/Booking.js";
import Cart from "../models/cart.model.js";
import SparePart from "../models/sparepart.model.js";
import Inquiry from "../models/inquiry.js";

// Get user dashboard data
export const getUserDashboardData = async (req, res) => {
  try {
    // Get user ID from authentication token
    const userId = req.userID;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    // Get user profile
    const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Get upcoming service bookings
    const upcomingBookings = await Booking.find({
      userId,
      selectedDateTime: { $gte: new Date() }
    }).sort({ selectedDateTime: 1 }).limit(5);
    
    // Get recent service history
    const serviceHistory = await Booking.find({
      userId,
      $or: [
        { selectedDateTime: { $lt: new Date() } },
        { status: { $in: ["Completed", "Cancelled"] } }
      ]
    }).sort({ selectedDateTime: -1 }).limit(5);
    
    // Get cart data
    const cart = await Cart.findOne({ userId }).populate('items.sparePart');
    
    // Get recent inquiries
    const inquiries = await Inquiry.find({ userID: userId }).sort({ createdAt: -1 }).limit(5);
    
    // Get recommended spare parts (example: just get some random parts)
    const recommendedParts = await SparePart.find({ isActive: true }).limit(4);
    
    res.status(200).json({
      success: true,
      data: {
        user,
        upcomingBookings,
        serviceHistory,
        cart,
        inquiries,
        recommendedParts
      }
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message
    });
  }
};

// Generate sample data for the user dashboard (for demonstration)
export const generateUserDemoData = async (req, res) => {
  try {
    const userId = req.userID;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Clear existing data
    await Booking.deleteMany({ userId });
    await Cart.deleteMany({ userId });
    await Inquiry.deleteMany({ userID: userId });
    
    // Generate sample bookings
    const serviceTypes = [
      "Oil Change", "Brake Service", "Tire Rotation", "Engine Tune-up", 
      "Transmission Service", "Battery Replacement", "A/C Service"
    ];
    const statuses = ["Not Started", "In Progress", "Completed", "Cancelled"];
    const carModels = ["Toyota Corolla", "Honda Civic", "Nissan Altima", "Suzuki Swift", "Mitsubishi Lancer"];
    
    // Generate future bookings
    for (let i = 0; i < 3; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
      futureDate.setHours(8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0);
      
      const booking = new Booking({
        userId,
        model: carModels[Math.floor(Math.random() * carModels.length)],
        year: 2010 + Math.floor(Math.random() * 14),
        registrationNumber: `ABC-${1000 + Math.floor(Math.random() * 9000)}`,
        serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        selectedDateTime: futureDate,
        status: "Not Started"
      });
      
      await booking.save();
    }
    
    // Generate past bookings
    for (let i = 0; i < 4; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 90) - 1);
      pastDate.setHours(8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0);
      
      const booking = new Booking({
        userId,
        model: carModels[Math.floor(Math.random() * carModels.length)],
        year: 2010 + Math.floor(Math.random() * 14),
        registrationNumber: `ABC-${1000 + Math.floor(Math.random() * 9000)}`,
        serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        selectedDateTime: pastDate,
        status: ["Completed", "Cancelled"][Math.floor(Math.random() * 2)]
      });
      
      await booking.save();
    }
    
    // Generate inquiries
    const inquiryTypes = ["feedback", "complaint"];
    const inquiryStatuses = ["normal", "important", "very important"];
    const inquiryMessages = [
      "I was very satisfied with the service provided by your technicians.",
      "The service was good, but it took longer than expected.",
      "I have a concern about the work done on my car during the last service.",
      "Your staff was very professional and courteous during my visit.",
      "My car is still making the same noise after the repair."
    ];
    
    for (let i = 0; i < 3; i++) {
      const type = inquiryTypes[Math.floor(Math.random() * inquiryTypes.length)];
      const inquiry = new Inquiry({
        userID: userId,
        mail: user.mail,
        userName: user.name,
        serviceID: `SRV${10000 + Math.floor(Math.random() * 90000)}`,
        type,
        message: inquiryMessages[Math.floor(Math.random() * inquiryMessages.length)],
        status: type === 'complaint' ? inquiryStatuses[Math.floor(Math.random() * inquiryStatuses.length)] : 'normal',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      });
      
      await inquiry.save();
    }
    
    // If SparePart model is available, create a cart with some items
    try {
      const spareParts = await SparePart.find().limit(10);
      if (spareParts.length > 0) {
        // Create or update cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
          cart = new Cart({ userId, items: [] });
        }
        
        // Add 2-3 random items to cart
        const itemCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < itemCount && i < spareParts.length; i++) {
          cart.items.push({
            sparePart: spareParts[i]._id,
            quantity: 1 + Math.floor(Math.random() * 3)
          });
        }
        
        await cart.save();
      }
    } catch (err) {
      console.log("Could not create sample cart (SparePart model may not be available):", err);
    }
    
    res.status(200).json({
      success: true,
      message: "Demo data generated successfully for user dashboard"
    });
  } catch (error) {
    console.error("Error generating demo data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate demo data",
      error: error.message
    });
  }
};
