import { Router } from 'express'
import { validateInputs } from '../utils/inputValidator'
import {
    getAllTasks, getTaskById, getAllTasksByStatus,
    addTask, editTask, deleteTask
} from '../controllers/taskControllers'

const router = Router()

// Retrieve all tasks from db
router.get('/', getAllTasks)

// Add new task to db
router.post('/', validateInputs, addTask)

// Retrieve all tasks from db by status code
router.get('/status/:sid', getAllTasksByStatus)

// Retrieve task from db by id
router.get('/task/:tid', getTaskById)

// Edit existing task in db
router.patch('/:tid', validateInputs, editTask)

// Delete task from db
router.delete('/:tid', deleteTask)

export { router as taskRoutes }
