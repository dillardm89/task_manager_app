import { useState, ReactNode } from 'react'
import { TaskContext } from './create-context'
import type { DBTaskType, TaskByIdResponseType } from '../utils/interfaces'
import { useDbClient } from '../hooks/db-hook'

/**
 * Function create context provider used in App.tsx
 * @param {ReactNode} children passing along props for rendering app within provider
 * @returns {object} ctxValue object for TaskContextProvider value
 */
export function TaskContextProvider({ children }: { children: ReactNode }) {
    const apiUrl = import.meta.env.VITE_APP_API_URL
    const { sendRequest } = useDbClient()
    const [needRefresh, setNeedRefresh] = useState<boolean>(true)


    // Function to set state (true) indicating need to refresh task list
    function startRefreshList(): void {
        setNeedRefresh(true)
    }


    // Function to set state (false) indicating task list does not need refreshed
    function stopRefreshList(): void {
        setNeedRefresh(false)
    }


    /**
     * Function to handle drag start event on task item <li> elements
     * @param {React.DragEvent<HTMLLIElement>} event for item drag event
     */
    function dragStartHandler(event: React.DragEvent<HTMLLIElement>): void {
        const taskId = (event.target as HTMLLIElement).id
        event.dataTransfer!.setData('text/plain', taskId)
        event.dataTransfer!.effectAllowed = 'move'
    }


    /**
     * Function to handle drag over event on task list <ul> elements
     * @param {React.DragEvent<HTMLUlistElement>} event for item drag event
     */
    function dragOverHandler(event: React.DragEvent<HTMLUListElement>): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault()
        }
    }


    /**
     * Function to handle drop event on task list <ul> elements,
     * utilizes db-hook to get task by id for drag item then updates
     * status based on id for drop target list and finally sends request
     * to edit task in database with updated status
     * @param {React.DragEvent<HTMLUlistElement>} event for item drag event
     */
    async function dropHandler(event: React.DragEvent<HTMLUListElement>): Promise<void> {
        const taskId = event.dataTransfer!.getData('text/plain')
        const status = (event.currentTarget as HTMLUListElement).id

        const response = await getTaskbyId(taskId)

        if (response.code) {
            console.log('Failed to retrieve task by ID.')
            console.log(response.message)
            return
        }

        const updatedTask = response.task
        updatedTask!.status = parseInt(status, 10)

        try {
            const taskData = JSON.stringify(updatedTask)
            const result = await editTask(taskData, taskId)
            if (result) {
                console.log('Drop Failed. Unable to edit task.')
            } else {
                console.log('Drop Successful.')
                setNeedRefresh(true)
            }
        } catch (err) {
            console.log('Stringify failed. Unable to edit task.')
            console.log(err)
        }
    }


    /**
     * Function to get task by id from database using db-hook
     * @param {string} taskId string of task id
     * @returns {TaskByIdResponseType} object containing database response or error object
     */
    async function getTaskbyId(taskId: string): Promise<TaskByIdResponseType> {
        try {
            const response = await sendRequest(`${apiUrl}/tasks/task/${taskId}`, 'GET')
            return response
        } catch (error) {
            return { code: 500, message: 'Failed to fetch task by ID.' }
        }
    }


    /**
     * Function to add new task to database using db-hook
     * @param {BodyInit} taskData DBTaskType object containing task data
     * @returns {Promise<boolean>} boolean indicating error response from database
     *                    (sucess or no errors = false, failure with errors = true)
     */
    async function addTask(taskData: BodyInit): Promise<boolean> {
        try {
            const response = await sendRequest(`${apiUrl}/tasks/`, 'POST', taskData, {
                'Content-Type': 'application/json',
            })

            if (response.code) {
                console.log(response.message)
                return true //Errors
            } else {
                return false //No errors
            }
        } catch (error) {
            console.log('Failed to add new task.')
            console.log(error)
            return true //Errors
        }
    }


    /**
     * Function to edit task in database using db-hook
     * @param {BodyInit} taskData DBTaskType object containing task data
     * @param {string} taskId string of task id
     * @returns {Promise<boolean>} boolean indicating error response from database
     *                    (sucess or no errors = false, failure with errors = true)
     */
    async function editTask(taskData: BodyInit, taskId: string): Promise<boolean> {
        try {
            const response = await sendRequest(`${apiUrl}/tasks/${taskId}`, 'PATCH', taskData, {
                'Content-Type': 'application/json',
            })

            if (response.code) {
                console.log(response.message)
                return true //Errors
            } else {
                return false //No errors
            }
        } catch (error) {
            console.log('Failed to edit task.')
            console.log(error)
            return true //Errors
        }
    }


    /**
     * Function to delete task from database using db-hook
     * @param {string} taskId string of task id
     * @returns {Promise<boolean>} boolean indicating error response from database
     *                    (sucess or no errors = false, failure with errors = true)
     */
    async function deleteTask(taskId: string): Promise<boolean> {
        try {
            const response = await sendRequest(`${apiUrl}/tasks/${taskId}`, 'DELETE')

            if (response.code) {
                console.log(response.message)
                return true //Errors
            } else {
                return false //No errors
            }
        } catch (error) {
            console.log('Failed to delete task.')
            console.log(error)
            return true //Errors
        }
    }


    /**
     * Function to handle TaskForm submission and route to addTask or editTask function
     * @param {DBTaskType} formValues object containing task data from form fields
     * @param {string} type string indicating form type 'add-task' or 'edit-task'
     * @param {string} taskId string with task id if editing or blank if adding
     * @returns {Promise<boolean>} boolean indicating error response from database
     *                    (sucess or no errors = false, failure with errors = true)
     */
    async function submitFormHandler(formValues: DBTaskType, type: string, taskId: string): Promise<boolean> {
        const taskItem: DBTaskType = {
            name: formValues.name,
            summary: formValues.summary,
            dueDate: formValues.dueDate,
            status: formValues.status
        }

        let taskData
        try {
            taskData = JSON.stringify(taskItem)
        } catch (err) {
            console.log(err)
            console.log(taskData)
            return true //Errors
        }

        let response
        if (type === 'add-task') {
            response = await addTask(taskData)
        } else {
            response = await editTask(taskData, taskId)
        }
        return response
    }


    const ctxValue = {
        startRefreshList,
        stopRefreshList,
        submitFormHandler,
        deleteTask,
        dragStartHandler,
        dragOverHandler,
        dropHandler,
        needRefresh
    }


    return (
        <TaskContext.Provider value={ctxValue}>{children}</TaskContext.Provider>
    )
}
