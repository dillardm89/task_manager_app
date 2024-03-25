import { useState } from 'react'
import EditTask from '../task/EditTask'
import DeleteTask from '../task/DeleteTask'
import editIcon from '../../assets/edit_icon.png'
import deleteIcon from '../../assets/delete_icon.png'
import { type AppTaskType } from '../../utils/interfaces'
import { useTaskContext } from '../../context/task-context'


/**
 * Props required for Icon Component
 * @typedef {IconProps}
 */
type IconProps = {
    taskId: string,
    type: string,
    task: AppTaskType
}


/**
 * Component for rendering icon elements within task item
 * Props passed from TaskItem component
 * @param {IconProps} type string indicating icon type (edit or delete)
 * @param {IconProps} taskId string of task id
 * @param {IconProps} task AppTaskType object of task
 * @returns {React.JSX.Element} Icon
 */
export default function Icon({ type, taskId, task }: IconProps) {
    const context = useTaskContext()
    const [isEditingTask, setIsEditingTask] = useState(false)
    const [isDeletingTask, setIsDeletingTask] = useState(false)

    let icon
    if (type === 'edit') {
        icon = editIcon
    } else {
        icon = deleteIcon
    }

    // Function to open edit or delete task modal
    function startTaskHandler() {
        if (type === 'edit') {
            setIsEditingTask(true)
        } else {
            setIsDeletingTask(true)
        }
    }


    // Function to close edit or delete task modal with saving
    // and require refresh task list
    function stopTaskHandler() {
        if (type === 'edit') {
            setIsEditingTask(false)
            context.startRefreshList()
        } else {
            setIsDeletingTask(false)
            context.startRefreshList()
        }
    }


    // Function to close edit or delete modal without saving
    function cancelTaskHandler() {
        if (type === 'edit') {
            setIsEditingTask(false)
        } else {
            setIsDeletingTask(false)
        }
    }


    return (
        <>
            {isEditingTask && (
                <EditTask onSave={stopTaskHandler}
                    onCancel={cancelTaskHandler} taskId={taskId}
                    task={task} openModal={isEditingTask} />)}

            {isDeletingTask && (
                <DeleteTask onSave={stopTaskHandler}
                    onCancel={cancelTaskHandler} taskId={taskId}
                    openModal={isDeletingTask} />)}

            <button className={`icon-link icon-${type}`}
                onClick={startTaskHandler}>
                <img src={icon} alt={`${type} icon`} />
            </button>
        </>
    )
}
