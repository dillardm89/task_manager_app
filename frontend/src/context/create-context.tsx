import { createContext } from 'react'
import { type TaskContextValue } from '../utils/interfaces'

/**
 * Create custom Task Context object
 * @typedef {TaskContextValue}
 */
export const TaskContext = createContext<TaskContextValue | null>(null)
