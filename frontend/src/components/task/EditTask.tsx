import { useState } from 'react'
import Modal from '../elements/Modal'
import TaskForm from '../elements/TaskForm'
import { type TaskProps } from './AddTask'
import { type AppTaskType } from '../../utils/interfaces'


/**
 * Props required for Icon Component
 * @typedef {EditTaskProps}
 * @extends TaskProps
 */
type EditTaskProps = TaskProps & {
    task: AppTaskType,
    taskId: string
}


/**
 * Component for rendering edit task element in modal
 * Props passed down from TaskItem component
 * @param {EditTaskProps} onSave callback function to MainHeader to save and close modal
 * @param {EditTaskProps} onCancel callback function to MainHeader to cancel and close modal
 * @param {EditTaskProps} openModal boolean indicating whether modal open (true) or not (false)
 * @param {EditTaskProps} task AppTaskType object containing task date to be edited
 * @param {EditTaskProps} taskId string for task id to be edited
 * @returns {React.JSX.Element} EditTask
 */
export default function EditTask({ onSave, onCancel, openModal, taskId, task }: EditTaskProps) {
    const [modal, setModal] = useState(openModal)

    // Function to handle save button click and close modal
    function saveModalHandler(): void {
        setModal(false)
        onSave()
    }


    // Function to handle cancel button click and close modal
    function cancelModalHandler(): void {
        setModal(false)
        onCancel()
    }


    return (
        <Modal openModal={modal} onCloseModal={cancelModalHandler}>
            <h4>Edit Task</h4>
            <TaskForm type='edit-task' taskId={taskId} task={task} onCancel={cancelModalHandler}
                onSave={saveModalHandler} />
        </Modal>)
}
