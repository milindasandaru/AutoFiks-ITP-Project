import express from 'express';
import { 
  getAllTasks, 
  getEmployeeTasks,
  createTask, 
  getTaskById, 
  updateTask, 
  deleteTask, 
  updateTaskStatus,
  getTasksByStatus
} from '../controllers/taskController.js';

const router = express.Router();

// Get all tasks
router.get('/', getAllTasks);

// Get tasks by status
router.get('/status/:status', getTasksByStatus);

// Create a new task
router.post('/', createTask);

// Get a single task
router.get('/:id', getTaskById);

// Update a task
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

// Update task status - FIXED: removed the 'tasks/' prefix
router.patch('/:id/status', updateTaskStatus);

// Get tasks for a specific employee
router.get('/employee/:employeeId', getEmployeeTasks);

export default router;
