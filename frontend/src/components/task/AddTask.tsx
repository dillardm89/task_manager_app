import { useState } from 'react'
import Modal from '../elements/Modal'
import TaskForm from '../elements/TaskForm'


/**
 * Props required for Icon Component
 * @typedef {TaskProps}
 * @exports TaskProps extended by EditTaskProps and DeleteTaskProps
 */
export type TaskProps = {
    onSave: () => void,
    onCancel: () => void,
    openModal: boolean
}


/**
 * Component for rendering add task element in modal
 * Props passed down from MainHeader component
 * @param {TaskProps} onSave callback function to MainHeader to save and close modal
 * @param {TaskProps} onCancel callback function to MainHeader to cancel and close modal
 * @param {TaskProps} openModal boolean indicating whether modal open (true) or not (false)
 * @returns {React.JSX.Element} AddTask
 */
export default function AddTask({ onSave, onCancel, openModal }: TaskProps) {
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
            <h4>Add New Task</h4>
            <TaskForm type='add-task' taskId='new' task={null} onCancel={cancelModalHandler}
                onSave={saveModalHandler} />
        </Modal>
    )
}
