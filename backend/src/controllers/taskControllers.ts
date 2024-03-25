import { Request, Response, NextFunction } from 'express'
import { TaskModel } from '../models/task'
import { ErrorResponse } from '../models/errorResponse'


// Custom error handling variables using errorResponse.ts model
const noTasksFoundError = new ErrorResponse('Could not find any tasks in the database.', 404)
const noTasksByStatusError = new ErrorResponse('Could not find any tasks for provided status.', 404)
const noTaskByIdError = new ErrorResponse('Could not find task with provided ID.', 404)
const badDataModelError = new ErrorResponse('Bad data for creating TaskModel.', 400)


// Custom error handling function for database retrieval errors
// using errorResponse.ts model
function dbRetrievalError(funcName: string, err: unknown) {
    return new ErrorResponse(`${funcName} Error: ${err}.`, 500)
}


/**
 * Retrieve all tasks from db and sort by due date
 * @param {express.Request} _
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Array} allTasks
 */
export async function getAllTasks(_: Request, res: Response, next: NextFunction) {
    let allTasks
    try {
        allTasks = await TaskModel.find().sort({ dueDate: 1 })
    } catch (err) {
        if (err instanceof Error && err.name === 'CastError') {
            return next(noTasksFoundError)
        } else {
            const newError = dbRetrievalError('getAllTasks', err)
            return next(newError)
        }
    }

    if (!allTasks || allTasks.length === 0) {
        return next(noTasksFoundError)
    }

    res.status(201).json({
        message: 'All tasks retrieved successfully', tasks: allTasks
    })
}


/**
 * Retrieve all tasks from db by specific status code
 * for Today, Pending, or Complete and sort by due date
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Array} tasksByStatus
 */
export async function getAllTasksByStatus(req: Request, res: Response, next: NextFunction) {
    const statusId = parseInt(req.params.sid, 10)
    let tasksByStatus
    try {
        tasksByStatus = await TaskModel.find({ status: statusId }).sort({ dueDate: 1 })
    } catch (err) {
        if (err instanceof Error && err.name === 'CastError') {
            return next(noTasksByStatusError)
        } else {
            const newError = dbRetrievalError('getAllTasksByStatus', err)
            return next(newError)
        }
    }

    if (!tasksByStatus || tasksByStatus.length === 0) {
        return next(noTasksByStatusError)
    }

    res.status(201).json({ message: 'Tasks retrieved successfully.', tasks: tasksByStatus })
}


/**
 * Retrieve specific task from db by id
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} selectedTask
 */
export async function getTaskById(req: Request, res: Response, next: NextFunction) {
    const taskId = req.params.tid
    let selectedTask
    try {
        selectedTask = await TaskModel.findById(taskId)
    } catch (err) {
        if (err instanceof Error && err.name === 'CastError') {
            return next(noTaskByIdError)
        } else {
            const newError = dbRetrievalError('getTaskById', err)
            return next(newError)
        }
    }

    if (!selectedTask || selectedTask === null) {
        return next(noTaskByIdError)
    }

    res.status(201).json({ message: 'Task retrieved successfully.', task: selectedTask })
}


/**
 * Add new task to db
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} newTask
 */
export async function addTask(req: Request, res: Response, next: NextFunction) {
    const newTask = new TaskModel({
        name: req.body.name as string,
        summary: req.body.summary as string,
        dueDate: req.body.dueDate as number,
        status: req.body.status as number
    })

    if (!(newTask instanceof TaskModel)) {
        console.log(newTask)
        return next(badDataModelError)
    }

    try {
        await newTask.save()
    } catch (err) {
        const newError = new ErrorResponse('Validation passed, but adding task failed.', 500)
        return next(newError)
    }

    res.status(201).json({ message: 'New task successfully created.', task: newTask })
}


/**
 * Edit existing task in db
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} updatedTask
 */
export async function editTask(req: Request, res: Response, next: NextFunction) {
    const taskId = req.params.tid
    let updatedTask
    try {
        updatedTask = await TaskModel.findById(taskId)
    } catch (err) {
        if (err instanceof Error && err.name === 'CastError') {
            return next(noTaskByIdError)
        } else {
            const newError = dbRetrievalError('editTask', err)
            return next(newError)
        }
    }

    if (!updatedTask) {
        return next(noTaskByIdError)
    }

    updatedTask.name = req.body.name
    updatedTask.summary = req.body.summary
    updatedTask.dueDate = req.body.dueDate
    updatedTask.status = req.body.status


    if (!(updatedTask instanceof TaskModel)) {
        console.log(updatedTask)
        return next(badDataModelError)
    }

    try {
        await updatedTask.save()
    } catch (err) {
        const newError = new ErrorResponse('Validation passed, but updating task failed.', 500)
        return next(newError)
    }

    res.status(201).json({ message: 'Task edited successfully.', task: updatedTask })
}


/**
 * Delete task from db
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Object} deleteTask
 */
export async function deleteTask(req: Request, res: Response, next: NextFunction) {
    const taskId = req.params.tid
    let deleteTask
    try {
        deleteTask = await TaskModel.findById(taskId)
    } catch (err) {
        if (err instanceof Error && err.name === 'CastError') {
            return next(noTaskByIdError)
        } else {
            const newError = dbRetrievalError('deleteTask', err)
            return next(newError)
        }
    }

    if (!deleteTask) {
        return next(noTaskByIdError)
    }

    try {
        await deleteTask.deleteOne()
    } catch (err) {
        const newError = new ErrorResponse('Validation passed, but deleting task failed.', 500)
        return next(newError)
    }

    res.status(201).json({ message: 'Task deleted successfully.', task: deleteTask })
}
