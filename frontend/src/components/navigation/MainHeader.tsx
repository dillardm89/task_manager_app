import { useState } from 'react'
import AddTask from '../task/AddTask'
import logo from '../../assets/MD-logo-sm.jpg'
import { useTaskContext } from '../../context/task-context'
import '../../../public/styles/header.css'


/**
 * Component for rendering page header, including
 * AddTask element
 * @returns {React.JSX.Element} MainHeader
 */
export default function MainHeader() {
    const context = useTaskContext()
    const [isAddingTask, setIsAddingTask] = useState(false)


    // Function to open add task modal
    function startAddTaskHandler(): void {
        setIsAddingTask(true)
    }


    // Function to close add task modal, save changes,
    // and require refresh task list
    function saveTaskHandler(): void {
        setIsAddingTask(false)
        context.startRefreshList()
    }


    // Function to close add task modal without saving
    function cancelTaskHandler(): void {
        setIsAddingTask(false)
    }


    return (
        <header>
            <div>
                <img src={logo} alt='Marianne Logo' />
                <h1>Task Manager</h1>
            </div>

            {isAddingTask && (
                <AddTask onSave={saveTaskHandler}
                    onCancel={cancelTaskHandler}
                    openModal={isAddingTask} />)}

            <button id='header-button' onClick={startAddTaskHandler}>
                Add Task
            </button>
        </header>
    )
}
