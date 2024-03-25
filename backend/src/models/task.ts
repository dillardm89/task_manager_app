import mongoose from 'mongoose'


/**
 * Type for task object used within db
 * @typedef {TaskType}
 */
interface TaskType {
    name: string,
    summary: string,
    dueDate: number,
    status: number
}


/**
 * DB schema for TaskModel
 */
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    summary: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    dueDate: {
        type: Number,
        required: true,
        min: 1577880000,
        max: 2556100800
    },
    status: {
        type: Number,
        required: true,
        min: 0,
        max: 2
    }
})

taskSchema.set('toObject', { getters: true })

export const TaskModel = mongoose.model<TaskType>('Task', taskSchema)
