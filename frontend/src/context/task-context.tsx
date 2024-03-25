import { useContext } from 'react'
import { TaskContext } from './create-context'
import type { TaskContextValue } from '../utils/interfaces'


/**
 * Function for custom useTaskContext hook to enable all all components
 * to access and utilize context object values
 * @typedef {TaskContextValue}
 * @returns {object} context
 */
export function useTaskContext(): TaskContextValue {
    const context = useContext(TaskContext)

    if (!context) {
        throw new Error('useTaskContext must be used within a TaskContextProvider.')
    }
    return context
}
