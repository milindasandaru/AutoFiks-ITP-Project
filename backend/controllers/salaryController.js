// // controllers/salaryController.js
// import Salary from "../models/SalaryModel.js";
// import Attendance from "../models/Attendance.js";
// import LeaveRequest from "../models/LeaveRequest.js";
// import { Employee } from "../models/Employee.js";

// // In salaryController.js - update the generateSalary function
// export const generateSalary = async (req, res) => {
//   try {
//     const { employeeId, startDate, endDate, customLabel } = req.body;

//     // Validate input
//     if (!employeeId || !startDate || !endDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Employee ID, start date, and end date are required",
//       });
//     }

//     // Parse dates
//     const periodStart = new Date(startDate);
//     const periodEnd = new Date(endDate);
//     periodStart.setHours(0, 0, 0, 0);
//     periodEnd.setHours(23, 59, 59, 999);

//     // Check date validity
//     if (periodEnd < periodStart) {
//       return res.status(400).json({
//         success: false,
//         message: "End date must be after start date",
//       });
//     }

//     // Find employee
//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }

//     // Use employee's actual salary from the database
//     const basicSalary = employee.salary || 50000; // Fallback to default if not set

//     // Check if salary for this period already exists
//     const existingSalary = await Salary.findOne({
//       employeeId: employee._id,
//       "period.startDate": periodStart,
//       "period.endDate": periodEnd,
//     });

//     if (existingSalary) {
//       return res.status(400).json({
//         success: false,
//         message: "Salary for this period already exists",
//         salaryId: existingSalary._id,
//       });
//     }

//     // Fetch attendance records
//     const attendanceRecords = await Attendance.find({
//       employeeId: employee._id,
//       createdAt: {
//         $gte: periodStart,
//         $lte: periodEnd,
//       },
//     });

//     // Fetch leave requests
//     const leaveRequests = await LeaveRequest.find({
//       employeeId: employee._id,
//       status: "approved",
//       $or: [
//         {
//           startDate: { $gte: periodStart, $lte: periodEnd },
//         },
//         {
//           endDate: { $gte: periodStart, $lte: periodEnd },
//         },
//       ],
//     });

//     // Calculate working days in the period
//     const totalDaysInPeriod = Math.ceil((periodEnd - periodStart) / (24 * 60 * 60 * 1000)) + 1;
    
//     // Count attendance statistics
//     const attendanceStats = {
//       present: 0,
//       halfDay: 0,
//       absent: 0,
//       late: 0,
//     };

//     // Track days with attendance records
//     const daysWithAttendance = new Set();
    
//     // Calculate total working hours
//     let totalWorkingHours = 0;

//     attendanceRecords.forEach(record => {
//       // Add to days with attendance
//       const recordDate = new Date(record.createdAt);
//       const dateString = recordDate.toISOString().split('T')[0];
//       daysWithAttendance.add(dateString);
      
//       // Count by status
//       if (record.status === "present") {
//         attendanceStats.present += 1;
//       } else if (record.status === "half-day") {
//         attendanceStats.halfDay += 1;
//       } else if (record.status === "late") {
//         attendanceStats.late += 1;
//       }
      
//       // Calculate working hours if both check-in and check-out exist
//       if (record.checkInTime && record.checkOutTime) {
//         const checkIn = new Date(record.checkInTime);
//         const checkOut = new Date(record.checkOutTime);
//         const hoursWorked = (checkOut - checkIn) / (1000 * 60 * 60);
//         totalWorkingHours += hoursWorked;
//       }
//     });

//     // Calculate leave statistics
//     const leaveStats = {
//       total: 0,
//       sick: 0,
//       casual: 0,
//       annual: 0,
//       other: 0,
//     };

//     // Track days with approved leaves
//     const daysWithLeave = new Set();

//     leaveRequests.forEach(leave => {
//       const leaveStart = new Date(leave.startDate) > periodStart ? new Date(leave.startDate) : new Date(periodStart);
//       const leaveEnd = new Date(leave.endDate) < periodEnd ? new Date(leave.endDate) : new Date(periodEnd);
      
//       // Calculate days in this period
//       const leaveDaysInPeriod = Math.ceil((leaveEnd - leaveStart) / (24 * 60 * 60 * 1000)) + 1;
      
//       // Add to type-specific count
//       leaveStats[leave.leaveType] += leaveDaysInPeriod;
//       leaveStats.total += leaveDaysInPeriod;
      
//       // Track each day of leave
//       let currentDate = new Date(leaveStart);
//       while (currentDate <= leaveEnd) {
//         daysWithLeave.add(currentDate.toISOString().split('T')[0]);
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//     });

//     // Calculate absences (days with neither attendance nor approved leave)
//     let absentDays = 0;
//     let currentDate = new Date(periodStart);
    
//     while (currentDate <= periodEnd) {
//       // Skip weekends (Saturday and Sunday)
//       const dayOfWeek = currentDate.getDay();
//       if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday(0) or Saturday(6)
//         const dateString = currentDate.toISOString().split('T')[0];
//         if (!daysWithAttendance.has(dateString) && !daysWithLeave.has(dateString)) {
//           absentDays++;
//         }
//       }
      
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     attendanceStats.absent = absentDays;

//     // Calculate salary using the employee's actual basic salary
//     const dailyRate = basicSalary / 30; // Assuming 30 days/month for calculation
    
//     // Deductions calculation
//     const absentDeduction = dailyRate * absentDays;
//     const halfDayDeduction = (dailyRate / 2) * attendanceStats.halfDay;
//     const lateDeduction = (dailyRate * 0.25) * attendanceStats.late; // 25% of daily rate for late
    
//     // Basic tax calculation (simplified - 5% of basic salary)
//     const taxRate = 0.05;
//     const taxDeduction = basicSalary * taxRate;
    
//     // Total deductions
//     const totalDeductions = absentDeduction + halfDayDeduction + lateDeduction + taxDeduction;
    
//     // Net salary
//     const netSalary = basicSalary - totalDeductions;

//     // Create period label if not provided
//     const periodLabel = customLabel || `${periodStart.toLocaleDateString()} to ${periodEnd.toLocaleDateString()}`;

//     // Create new salary record
//     const newSalary = new Salary({
//       employeeId: employee._id,
//       period: {
//         startDate: periodStart,
//         endDate: periodEnd,
//         label: periodLabel,
//       },
//       basicSalary: basicSalary, // Use the employee's actual salary from database
//       workingDays: {
//         total: totalDaysInPeriod,
//         present: attendanceStats.present,
//         halfDay: attendanceStats.halfDay,
//         absent: attendanceStats.absent,
//         late: attendanceStats.late,
//         leave: {
//           approved: leaveStats.total,
//           sick: leaveStats.sick,
//           casual: leaveStats.casual,
//           annual: leaveStats.annual,
//           other: leaveStats.other,
//         },
//       },
//       workingHours: {
//         total: totalWorkingHours,
//         regular: totalWorkingHours, // In this simple model, all hours are regular
//       },
//       calculations: {
//         basicPayment: basicSalary,
//         deductions: {
//           leaves: 0, // No deduction for approved leaves
//           absences: absentDeduction + halfDayDeduction + lateDeduction,
//           tax: taxDeduction,
//           other: 0,
//         },
//         netSalary,
//       },
//     });

//     await newSalary.save();

//     // Return the generated salary
//     res.status(201).json({
//       success: true,
//       message: "Salary generated successfully",
//       salary: newSalary,
//     });
//   } catch (error) {
//     console.error("Error generating salary:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to generate salary",
//       error: error.message,
//     });
//   }
// };


// // Get salary for an employee (by employee)
// export const getEmployeeSalaries = async (req, res) => {
//   try {
//     const employeeId = req.userID; // From authentication middleware
    
//     const salaries = await Salary.find({ employeeId })
//       .sort({ "period.endDate": -1 });
    
//     res.status(200).json({
//       success: true,
//       count: salaries.length,
//       data: salaries,
//     });
//   } catch (error) {
//     console.error("Error fetching employee salaries:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch salary records",
//       error: error.message,
//     });
//   }
// };

// // In salaryController.js - modify getSalaryById function
// export const getSalaryById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const salary = await Salary.findById(id)
//       .populate('employeeId', 'name position employeeId mail');
    
//     if (!salary) {
//       return res.status(404).json({
//         success: false,
//         message: "Salary record not found",
//       });
//     }
    
//     // For admin side - we should allow all access
//     // You might need to add isAdmin flag to your token or check user role
//     // This is just a simple example - adjust based on your authentication system
//     const requesterId = req.userID;
//     const isAdmin = req.isAdmin || true; // Assuming admin access for now
    
//     // If not admin and not the employee
//     if (salary.employeeId._id.toString() !== requesterId && !isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: "You don't have permission to view this salary record",
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: salary,
//     });
//   } catch (error) {
//     console.error("Error fetching salary details:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch salary details",
//       error: error.message,
//     });
//   }
// };


// // Get all salaries (admin)
// export const getAllSalaries = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, startDate, endDate, employeeId } = req.query;
    
//     // Build query
//     const query = {};
    
//     // Filter by date range
//     if (startDate || endDate) {
//       query["period.startDate"] = {};
      
//       if (startDate) {
//         query["period.startDate"].$gte = new Date(startDate);
//       }
      
//       if (endDate) {
//         query["period.endDate"] = { $lte: new Date(endDate) };
//       }
//     }
    
//     // Filter by employee
//     if (employeeId) {
//       query.employeeId = employeeId;
//     }
    
//     // Execute query with pagination
//     const salaries = await Salary.find(query)
//       .populate('employeeId', 'name position employeeId mail')
//       .sort({ "period.endDate": -1, createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
    
//     // Get total count
//     const total = await Salary.countDocuments(query);
    
//     res.status(200).json({
//       success: true,
//       count: salaries.length,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page),
//       data: salaries,
//     });
//   } catch (error) {
//     console.error("Error fetching salaries:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch salary records",
//       error: error.message,
//     });
//   }
// };

// // Update salary status (admin)
// export const updateSalaryStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, paymentDate, notes } = req.body;
    
//     // Validate status
//     if (!status || !['draft', 'finalized', 'paid'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status value",
//       });
//     }
    
//     const salary = await Salary.findById(id);
    
//     if (!salary) {
//       return res.status(404).json({
//         success: false,
//         message: "Salary record not found",
//       });
//     }
    
//     // Update fields
//     salary.status = status;
    
//     if (status === 'paid' && paymentDate) {
//       salary.paymentDate = new Date(paymentDate);
//     }
    
//     if (notes) {
//       salary.notes = notes;
//     }
    
//     await salary.save();
    
//     res.status(200).json({
//       success: true,
//       message: `Salary status updated to ${status}`,
//       data: salary,
//     });
//   } catch (error) {
//     console.error("Error updating salary status:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update salary status",
//       error: error.message,
//     });
//   }
// };

// export const generateTestSalaryData = async (req, res) => {
//   try {
//     const { employeeId, days = 7 } = req.body;
    
//     // Find employee
//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }
    
//     // Create end date (today)
//     const endDate = new Date();
//     endDate.setHours(23, 59, 59, 999);
    
//     // Create start date (days ago)
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days + 1);
//     startDate.setHours(0, 0, 0, 0);
    
//     // Generate random attendance data
//     const attendanceData = [];
//     let currentDate = new Date(startDate);
    
//     while (currentDate <= endDate) {
//       // Skip weekends
//       const dayOfWeek = currentDate.getDay();
//       if (dayOfWeek !== 0 && dayOfWeek !== 6) {
//         // 80% chance of attendance, 20% chance of absence
//         if (Math.random() < 0.8) {
//           // Create check-in time (8-10 AM)
//           const checkInHour = 8 + Math.floor(Math.random() * 2);
//           const checkInMinute = Math.floor(Math.random() * 60);
          
//           const checkInTime = new Date(currentDate);
//           checkInTime.setHours(checkInHour, checkInMinute, 0, 0);
          
//           // Create check-out time (4-6 PM)
//           const checkOutHour = 16 + Math.floor(Math.random() * 2);
//           const checkOutMinute = Math.floor(Math.random() * 60);
          
//           const checkOutTime = new Date(currentDate);
//           checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);
          
//           // Determine status
//           let status = "present";
//           if (checkInHour >= 9 && checkInMinute > 30) {
//             status = "late";
//           }
//           if ((checkOutTime - checkInTime) / (1000 * 60 * 60) < 6) {
//             status = "half-day";
//           }
          
//           // Create attendance record
//           const attendance = new Attendance({
//             employeeId: employee._id,
//             checkInTime,
//             checkOutTime,
//             status,
//             location: "Office",
//             createdAt: currentDate,
//             updatedAt: currentDate,
//           });
          
//           await attendance.save();
//           attendanceData.push(attendance);
//         }
//       }
      
//       // Move to next day
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     // Create a leave request (if more than 5 days)
//     if (days > 5) {
//       const leaveStartDate = new Date(startDate);
//       leaveStartDate.setDate(leaveStartDate.getDate() + Math.floor(days / 2));
      
//       const leaveEndDate = new Date(leaveStartDate);
//       leaveEndDate.setDate(leaveEndDate.getDate() + 1);
      
//       const leaveTypes = ["sick", "casual", "annual", "other"];
//       const randomLeaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
      
//       const leaveRequest = new LeaveRequest({
//         employeeId: employee._id,
//         leaveType: randomLeaveType,
//         startDate: leaveStartDate,
//         endDate: leaveEndDate,
//         totalDays: 2,
//         reason: "Test leave request",
//         status: "approved",
//         adminRemarks: "Approved for testing",
//       });
      
//       await leaveRequest.save();
//     }
    
//     // Use employee's actual salary from database instead of default value
//     const employeeSalary = employee.salary || 50000; // Fallback to default if not set
    
//     // Generate the salary calculation with the correct employee salary
//     const salaryResponse = await generateSalary({
//       body: {
//         employeeId: employee._id,
//         startDate: startDate,
//         endDate: endDate,
//         customLabel: `Test Data (${days} days)`,
//         // Pass the actual employee salary to ensure it's used in calculations
//         employeeSalary: employeeSalary 
//       },
//     }, {
//       status: (code) => {
//         return {
//           json: (data) => data,
//         };
//       }
//     });
    
//     res.status(200).json({
//       success: true,
//       message: `Generated test data for ${days} days`,
//       attendanceCount: attendanceData.length,
//       salary: salaryResponse.salary,
//     });
//   } catch (error) {
//     console.error("Error generating test data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to generate test data",
//       error: error.message,
//     });
//   }
// };

import Salary from "../models/SalaryModel.js";
import Attendance from "../models/Attendance.js";
import LeaveRequest from "../models/LeaveRequest.js";
import { Employee } from "../models/Employee.js";

// --- 1. GENERATE SALARY (The Core Logic) ---
export const generateSalary = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, customLabel, employeeSalary } = req.body;

    // 1. Validation
    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Employee ID, start date, and end date are required" });
    }

    const periodStart = new Date(startDate);
    const periodEnd = new Date(endDate);
    periodStart.setHours(0, 0, 0, 0);
    periodEnd.setHours(23, 59, 59, 999);

    if (periodEnd < periodStart) {
      return res.status(400).json({ success: false, message: "End date must be after start date" });
    }

    // 2. Find Employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // 3. Check for Overlapping Salary Periods (Prevents duplicates)
    const overlappingSalary = await Salary.findOne({
      employeeId: employee._id,
      $or: [
        {
          "period.startDate": { $lte: periodEnd },
          "period.endDate": { $gte: periodStart }
        }
      ]
    });

    if (overlappingSalary) {
      return res.status(400).json({
        success: false,
        message: `Salary already exists for a period overlapping ${overlappingSalary.period.label}`,
        salaryId: overlappingSalary._id,
      });
    }

    // 4. Fetch Attendance & Leaves
    const attendanceRecords = await Attendance.find({
      employeeId: employee._id,
      createdAt: { $gte: periodStart, $lte: periodEnd },
    });

    const approvedLeaves = await LeaveRequest.find({
      employeeId: employee._id,
      status: "approved",
      $or: [
        { startDate: { $lte: periodEnd }, endDate: { $gte: periodStart } }
      ],
    });

    // 5. Calculate Stats
    const totalDaysInPeriod = Math.ceil((periodEnd - periodStart) / (24 * 60 * 60 * 1000)) + 1;
    
    const stats = {
      present: 0,
      halfDay: 0,
      late: 0,
      absent: 0,
      leaves: { total: 0, sick: 0, casual: 0, annual: 0, other: 0 }
    };

    let totalWorkingHours = 0;
    const daysWithAttendance = new Set();
    const daysWithLeave = new Set();

    // Process Attendance
    attendanceRecords.forEach(record => {
      const dateStr = new Date(record.createdAt).toISOString().split('T')[0];
      daysWithAttendance.add(dateStr);

      if (record.status === "present") stats.present++;
      else if (record.status === "half-day") stats.halfDay++;
      else if (record.status === "late") stats.late++;

      // Hours Calc
      if (record.checkInTime && record.checkOutTime) {
        const hours = (new Date(record.checkOutTime) - new Date(record.checkInTime)) / (1000 * 60 * 60);
        totalWorkingHours += hours;
      }
    });

    // Process Leaves
    approvedLeaves.forEach(leave => {
       const start = new Date(Math.max(new Date(leave.startDate), periodStart));
       const end = new Date(Math.min(new Date(leave.endDate), periodEnd));
       
       let loopDate = new Date(start);
       while(loopDate <= end) {
         const dateStr = loopDate.toISOString().split('T')[0];
         if (!daysWithLeave.has(dateStr)) {
            daysWithLeave.add(dateStr);
            stats.leaves.total++;
            // Increment specific leave type safely
            const type = leave.leaveType || 'other';
            stats.leaves[type] = (stats.leaves[type] || 0) + 1;
         }
         loopDate.setDate(loopDate.getDate() + 1);
       }
    });

    // Process Absences (The Realistic Logic: Weekdays - Attendance - Leaves)
    let loopDate = new Date(periodStart);
    while (loopDate <= periodEnd) {
      const dayOfWeek = loopDate.getDay();
      const dateStr = loopDate.toISOString().split('T')[0];
      
      // If Mon-Fri (Not Sun=0, Sat=6) AND No attendance AND No leave
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { 
        if (!daysWithAttendance.has(dateStr) && !daysWithLeave.has(dateStr)) {
          stats.absent++;
        }
      }
      loopDate.setDate(loopDate.getDate() + 1);
    }

    // 6. Financial Calculations
    // Use passed salary (for tests) or DB salary, default to 50k
    const basicSalary = employeeSalary || employee.salary || 50000; 
    const dailyRate = basicSalary / 30; // Standard fixed rate

    // Deductions
    const costAbsent = dailyRate * stats.absent;
    const costHalfDay = (dailyRate / 2) * stats.halfDay; 
    const costLate = (dailyRate * 0.25) * stats.late; // 25% penalty for late
    const costTax = basicSalary * 0.05; // 5% tax

    const totalDeductions = costAbsent + costHalfDay + costLate + costTax;
    const netSalary = Math.max(0, basicSalary - totalDeductions);

    // 7. Save to DB
    const newSalary = new Salary({
      employeeId: employee._id,
      period: { 
        startDate: periodStart, 
        endDate: periodEnd, 
        label: customLabel || `${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}` 
      },
      basicSalary,
      workingDays: {
        total: totalDaysInPeriod,
        present: stats.present,
        halfDay: stats.halfDay,
        late: stats.late,
        absent: stats.absent,
        leave: {
          approved: stats.leaves.total,
          sick: stats.leaves.sick,
          casual: stats.leaves.casual,
          annual: stats.leaves.annual,
          other: stats.leaves.other
        }
      },
      workingHours: { total: totalWorkingHours, regular: totalWorkingHours },
      calculations: {
        basicPayment: basicSalary,
        deductions: {
          leaves: 0, // Paid leaves are free
          absences: costAbsent + costHalfDay, // Absent + Half Day loss
          tax: costTax,
          other: costLate
        },
        netSalary
      },
      status: 'draft' // Default status
    });

    await newSalary.save();

    // Populate employee reference so admin UI shows the employee name immediately
    await newSalary.populate('employeeId', 'name position employeeId mail');

    res.status(201).json({ success: true, message: "Salary generated successfully", salary: newSalary });

  } catch (error) {
    console.error("Generate Salary Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate salary", error: error.message });
  }
};

// --- 2. GET EMPLOYEE SALARIES (My Salaries) ---
export const getEmployeeSalaries = async (req, res) => {
  try {
    const employeeId = req.userID; // Assuming from Auth Middleware
    const salaries = await Salary.find({ employeeId }).sort({ "period.endDate": -1 });
    
    res.status(200).json({ success: true, count: salaries.length, data: salaries });
  } catch (error) {
    console.error("Error fetching employee salaries:", error);
    res.status(500).json({ success: false, message: "Failed to fetch records", error: error.message });
  }
};

// --- 3. GET SINGLE SALARY BY ID ---
export const getSalaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findById(id).populate('employeeId', 'name position employeeId mail');
    
    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }
    
    // Auth Check: Allow Admin OR Owner
    const requesterId = req.userID;
    const isAdmin = req.isAdmin || true; // Replace with actual Admin check from middleware
    
    if (salary.employeeId._id.toString() !== requesterId && !isAdmin) {
      return res.status(403).json({ success: false, message: "Permission denied" });
    }
    
    res.status(200).json({ success: true, data: salary });
  } catch (error) {
    console.error("Error fetching detail:", error);
    res.status(500).json({ success: false, message: "Failed to fetch details", error: error.message });
  }
};

// --- 4. GET ALL SALARIES (Admin) ---
export const getAllSalaries = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, employeeId } = req.query;
    const query = {};
    
    if (startDate || endDate) {
      query["period.startDate"] = {};
      if (startDate) query["period.startDate"].$gte = new Date(startDate);
      if (endDate) query["period.endDate"] = { $lte: new Date(endDate) };
    }
    
    if (employeeId) query.employeeId = employeeId;
    
    const salaries = await Salary.find(query)
      .populate('employeeId', 'name position employeeId mail')
      .sort({ "period.endDate": -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Salary.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: salaries.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: salaries,
    });
  } catch (error) {
    console.error("Error fetching all salaries:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// --- 5. UPDATE STATUS (Admin) ---
export const updateSalaryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentDate, notes } = req.body;
    
    if (!status || !['draft', 'finalized', 'paid'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    
    const salary = await Salary.findById(id);
    if (!salary) return res.status(404).json({ success: false, message: "Not found" });
    
    salary.status = status;
    if (status === 'paid') salary.paymentDate = paymentDate ? new Date(paymentDate) : new Date();
    if (notes) salary.notes = notes;
    
    await salary.save();

    // Ensure populated employee info for UI (avoids "Unknown" after status change)
    await salary.populate('employeeId', 'name position employeeId mail');
    
    res.status(200).json({ success: true, message: "Status updated", data: salary });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// --- 6. GENERATE TEST DATA ---
export const generateTestSalaryData = async (req, res) => {
  try {
    const { employeeId, days = 7 } = req.body;
    
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);
    
    // 1. Generate Fake Attendance
    const attendanceData = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        if (Math.random() < 0.8) { // 80% attendance rate
          const checkIn = new Date(currentDate);
          checkIn.setHours(8 + Math.floor(Math.random()*2), Math.floor(Math.random()*60));
          
          const checkOut = new Date(currentDate);
          checkOut.setHours(16 + Math.floor(Math.random()*2), Math.floor(Math.random()*60));
          
          let status = "present";
          if (checkIn.getHours() >= 9 && checkIn.getMinutes() > 30) status = "late";
          if ((checkOut - checkIn) / 36e5 < 6) status = "half-day";
          
          const att = new Attendance({
            employeeId: employee._id,
            checkInTime: checkIn,
            checkOutTime: checkOut,
            status,
            location: "Office",
            createdAt: new Date(currentDate), // Important: createdAt determines the date in logic
            updatedAt: new Date(currentDate)
          });
          await att.save();
          attendanceData.push(att);
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // 2. Generate One Fake Leave
    if (days > 5) {
        const leaveStart = new Date(startDate);
        leaveStart.setDate(leaveStart.getDate() + 2); // 2 days after start
        const leaveReq = new LeaveRequest({
            employeeId: employee._id,
            leaveType: 'sick',
            startDate: leaveStart,
            endDate: leaveStart,
            status: 'approved',
            reason: 'Test Sick Leave'
        });
        await leaveReq.save();
    }

    // 3. Call Generate Salary Logic Internally
    // We mock the request/response to reuse logic, or just manually call it.
    // To avoid recursion crash, we will just return success and let the user click "Generate Salary" in UI
    // OR, we can do this simple trick:
    
    return res.status(200).json({
      success: true,
      message: `Test data generated. Please click 'Generate Salary' button in the UI to calculate.`,
      attendanceCount: attendanceData.length
    });

  } catch (error) {
    console.error("Test Data Error:", error);
    res.status(500).json({ success: false, message: "Failed test data", error: error.message });
  }
};

// --- 7. DELETE SALARY (Admin - Only draft salaries) ---
export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;
    
    const salary = await Salary.findById(id);
    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }
    
    // Only allow deletion of draft salaries
    if (salary.status !== 'draft') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete a ${salary.status} salary. Only draft salaries can be deleted.` 
      });
    }
    
    await Salary.deleteOne({ _id: id });
    
    res.status(200).json({ 
      success: true, 
      message: "Salary record deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting salary:", error);
    res.status(500).json({ success: false, message: "Failed to delete salary", error: error.message });
  }
};