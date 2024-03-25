import { useState } from 'react'
import Modal from '../elements/Modal'
import { useTaskContext } from '../../context/task-context'
import { type TaskProps } from './AddTask'
import '../../../public/styles/buttons.css'


/**
 * Props required for Icon Component
 * @typedef {DeleteTaskProps}
 * @extends TaskProps
 */
type DeleteTaskProps = TaskProps & {
    taskId: string,
}


/**
 * Component for rendering delete task element in modal
 * Props passed down from TaskItem component
 * @param {DeleteTaskProps} onSave callback function to MainHeader to save and close modal
 * @param {DeleteTaskProps} onCancel callback function to MainHeader to cancel and close modal
 * @param {DeleteTaskProps} openModal boolean indicating whether modal open (true) or not (false)
 * @param {DeleteTaskProps} taskId string for task id to be deleted
 * @returns {React.JSX.Element} DeleteTask
 */
export default function DeleteTask({ onSave, onCancel, taskId, openModal }: DeleteTaskProps) {
    const context = useTaskContext()
    const [modal, setModal] = useState(openModal)
    const [isError, setIsError] = useState<boolean>(false)


    // Function to handle cancel button click and close modal
    function cancelModalHandler(): void {
        setIsError(false)
        setModal(false)
        onCancel()
    }

    // Function to handle save button click,\
    // submit delete request to database, and close modal
    async function submitHandler(): Promise<void> {
        const response = await context.deleteTask(taskId)

        if (response) {
            setIsError(true)
        } else {
            onSave()
        }
    }


    return (
        <Modal openModal={modal} onCloseModal={cancelModalHandler}>
            {isError &&
                <p className='error-message'>
                    Deleting Failed. Please click cancel then try again.
                </p>
            }

            <h4>Confirm Delete Task</h4>
            <p>Are you sure you want to delete this task?</p>
            <div className='button-div'>
                <button id='delete-btn' onClick={submitHandler}>Delete</button>
                <button id='cancel-btn' onClick={cancelModalHandler}>Cancel</button>
            </div>
        </Modal>)
}
