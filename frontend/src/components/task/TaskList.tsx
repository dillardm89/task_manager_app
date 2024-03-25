import { useState, useEffect } from 'react'
import TaskItem from './TaskItem'
import Modal from '../elements/Modal'
import LoadingSpinner from '../elements/LoadingSpinner'
import type { TaskStateType, TaskStatus } from '../../utils/interfaces'
import { useDbClient } from '../../hooks/db-hook'
import { useTaskContext } from '../../context/task-context'
import '../../../public/styles/task-list.css'


/**
 * Props required for Task List Component
 * @typedef {TaskListProps}
 */
type TaskListProps = {
    listStatus: TaskStatus // enum representing list status type
}


/**
 * Component for rendering list of tasks
 * Props passed down from App component
 * @param {TaskListProps} listStatus enum representing list status type
 * @returns {React.JSX.Element} TaskList
 */
export default function TaskList({ listStatus }: TaskListProps) {
    const apiUrl = import.meta.env.VITE_APP_API_URL
    const context = useTaskContext()
    const { sendRequest } = useDbClient()
    const [tasks, setTasks] = useState<TaskStateType[]>([])
    const [isError, setIsError] = useState<boolean>(false)


    // Function to close modal without saving changes
    function closeErrorModalHandler(): void {
        setIsError(false)
        context.startRefreshList()
    }


    // Function to handle drag over event to move task between lists
    function handleDragOverEvent(event: React.DragEvent<HTMLUListElement>): void {
        context.dragOverHandler(event)
    }


    // Function to handle drop event to move task between lists
    function handleDropEvent(event: React.DragEvent<HTMLUListElement>) {
        context.dropHandler(event)
    }


    useEffect(() => {
        // Function to fetch tasks by list type status type
        async function fetchTasksByStatus(): Promise<void> {
            try {
                const statusIdString = listStatus.toString()
                const response = await sendRequest(`${apiUrl}/tasks/status/${statusIdString}/`, 'GET')

                if (response) {
                    setTasks(response.tasks)
                } else {
                    console.log(response.message)
                    setIsError(true)
                }
            } catch (error) {
                console.log('Failed to fetch tasks.')
                console.log(error)
                setIsError(true)
            }
        }


        // Check if TaskContext needRefresh is True
        // indicating Task List needs to be updated
        if (context.needRefresh) {
            fetchTasksByStatus()
            context.stopRefreshList()
        }
    }, [context, listStatus, isError, sendRequest, apiUrl])


    return (
        <>
            {context.needRefresh && !isError &&
                <LoadingSpinner />
            }


            {isError && !context.needRefresh &&
                <Modal openModal={isError}
                    onCloseModal={closeErrorModalHandler}>

                    <div id='error-modal'>
                        <h4>Error: Unable to Load Tasks!</h4>
                        <button onClick={closeErrorModalHandler}>Try Again?</button>
                    </div>
                </Modal>
            }


            {!context.needRefresh && !isError &&
                <ul id={listStatus.toString()}
                    onDragOver={handleDragOverEvent}
                    onDrop={handleDropEvent} >
                    {tasks.map(task => (
                        <TaskItem key={task._id} id={task._id} task={task} />
                    ))}
                </ul>
            }
        </>
    )
}
