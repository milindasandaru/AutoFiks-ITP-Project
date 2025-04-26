import Task from '../models/TaskModel.js';

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('employeeId', 'name email position')
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// Get tasks for a specific employee
export const getEmployeeTasks = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const tasks = await Task.find({ employeeId })
      .sort({ priority: -1, createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee tasks", error: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      employeeId,
      vehicleInfo,
      serviceType,
      customerName,
      customerPhone,
      estimatedTime,
      dueDate,
      notes
    } = req.body;
      
    console.log("Received Task Data:", req.body);

    // Validate required fields
    if (!title || !description || !employeeId) {
      return res.status(400).json({ message: "Title, description, and employeeId are required." });
    }

    const newTask = new Task({
      title,
      description,
      priority: priority || "medium",
      status: status || "pending",
      employeeId,
      vehicleInfo,
      serviceType,
      customerName,
      customerPhone,
      estimatedTime,
      dueDate: dueDate || null,
      notes: notes ? [{ text: notes, createdBy: 'Admin' }] : []
    });

    const savedTask = await newTask.save();
    
    // Populate employee details before sending response
    const populatedTask = await Task.findById(savedTask._id)
      .populate('employeeId', 'name email position');
      
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: "Failed to create task", error: error.message });
  }
};

// Get a single task
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('employeeId', 'name email position');
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task", error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // If adding a note
    if (req.body.newNote) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      task.notes.push({
        text: req.body.newNote,
        createdBy: req.body.createdBy || 'System'
      });
      
      const updatedTask = await task.save();
      return res.status(200).json(updatedTask);
    }
    
    // Regular update
    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email position');
    
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Failed to update task", error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    
    if (!['pending', 'in progress', 'completed', 'on hold'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    // Add status change note if provided
    if (note) {
      task.notes.push({
        text: `Status changed to ${status}: ${note}`,
        createdBy: req.body.createdBy || 'System'
      });
    }
    
    task.status = status;
    const updatedTask = await task.save();
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Failed to update task status", error: error.message });
  }
};

// Get tasks by status
export const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    if (!['pending', 'in progress', 'completed', 'on hold', 'all'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    let tasks;
    if (status === 'all') {
      tasks = await Task.find().populate('employeeId', 'name email position');
    } else {
      tasks = await Task.find({ status }).populate('employeeId', 'name email position');
    }
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};
