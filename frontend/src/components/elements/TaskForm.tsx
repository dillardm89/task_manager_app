import { type FormEvent, useState, useMemo, useEffect, useCallback } from 'react'
import Input from './Input'
import { useForm } from '../../hooks/form-hook'
import { useTaskContext } from '../../context/task-context'
import { TaskStatus, type AppTaskType } from '../../utils/interfaces'
import '../../../public/styles/task-form.css'
import '../../../public/styles/buttons.css'
import { MAXLENGTH_VALIDATOR, MAXVALUE_VALIDATOR, MINLENGTH_VALIDATOR, MINVALUE_VALIDATOR, REQUIRED_VALIDATOR } from '../../utils/validators'


/**
 * Props required for TaskForm Component
 * @typedef {TaskFormProps}
 */
type TaskFormProps = {
    type: 'add-task' | 'edit-task',
    task: AppTaskType | null,
    taskId: string,
    onCancel: () => void,
    onSave: () => void
}


/**
 * Component for rendering add task element in modal
 * Props passed from AddTask or EditTask component
 * @param {TaskFormProps} type string indicating form type 'add-task' or 'edit-task'
 * @param {TaskFormProps} task AppTaskType object for task if editing or null if adding
 * @param {TaskFormProps} taskId string with task id if editing or blank if adding
 * @param {TaskFormProps} onCancel callback function for cancel button action (AddTask.tsx or EditTask.tsx)
 * @param {TaskFormProps} onSave callback function for save button action (AddTask.tsx or EditTask.tsx)
 * @returns {React.JSX.Element} TaskForm
 */
export default function TaskForm({ type, task, taskId, onCancel, onSave }: TaskFormProps) {
    const context = useTaskContext()
    const { formState, inputHandler, validateForm } = useForm()
    const [status, setStatus] = useState<number>(task ? task.status : TaskStatus.Pending)
    const [isError, setIsError] = useState<boolean>(false)
    const [submitForm, setSubmitForm] = useState<boolean>(false)

    // Memoize iniital form data
    const initialData = useMemo(() => {
        return {
            name: task ? task.name : '',
            summary: task ? task.summary : '',
            dueDate: task ? (new Date(task.dueDate)).toISOString() : (new Date()).toISOString(),
            taskId: taskId ? taskId : '',
            type: type
        }
    }, [task, taskId, type])


    // Function to handle save button action, validate form inputs,
    // and set submitForm state to true if valid
    function saveHandler(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault()

        const formIsValid = validateForm()
        if (!formIsValid) {
            console.log('Form Not Valid.')
            setIsError(true)
            return
        }

        setIsError(false)
        setSubmitForm(true)
    }


    // Function to get and clean form field values for submitting
    // to database then calls submitFormHandler
    const getFinalValues = useCallback(async () => {
        const taskItemValues = {
            name: '',
            summary: '',
            dueDate: 0,
            status: status
        }

        for (const formItem of formState.inputs) {
            if (formItem.name === 'name') {
                taskItemValues.name = (formItem.value === '' ? initialData.name : formItem.value)
            }

            if (formItem.name === 'summary') {
                taskItemValues.summary = (formItem.value === '' ? initialData.summary : formItem.value)
            }

            if (formItem.name === 'dueDate') {
                if (formItem.value === '') {
                    taskItemValues.dueDate = Math.floor(Date.parse(initialData.dueDate) / 1000)
                } else {
                    const dueDate = Math.floor(new Date(formItem.value).getTime() / 1000)
                    taskItemValues.dueDate = dueDate
                }
            }
        }

        const result = await context.submitFormHandler(taskItemValues, initialData.type, initialData.taskId)
        if (result) {
            setIsError(true)
            setSubmitForm(false)
            return
        } else {
            setSubmitForm(false)
            onSave()
        }
    }, [formState, initialData, status, context, onSave])


    useEffect(() => {
        if (submitForm) {
            getFinalValues()
        }

        if (isError) {
            console.log('Error - unable to submit form.')
        }
    }, [submitForm, getFinalValues, isError])


    return (
        <>
            <form onSubmit={saveHandler}>
                {isError && (
                    <div id='error-message'>
                        <p>Invalid Inputs. Please correct then submit form again.</p>
                    </div>
                )}

                <div id='form-container' >
                    <div id='form-item'>
                        <div className="input-label">
                            <p id='taskName'>Task Name</p>
                        </div>
                        <Input
                            element='input'
                            fieldId='taskName'
                            name='name'
                            type='text'
                            initialValue={initialData.name}
                            initialIsValid={true}
                            onInput={inputHandler}
                            selectedValidators={[REQUIRED_VALIDATOR(), MINLENGTH_VALIDATOR(5), MAXLENGTH_VALIDATOR(50)]}
                            errorText='Enter a valid name (5-50 characters).'
                        />
                    </div>

                    <div id='form-item'>
                        <div className="input-label">
                            <p id='taskSummary'>Task Summary</p>
                        </div>
                        <Input
                            element='textarea'
                            fieldId='taskSummary'
                            name='summary'
                            rows={5}
                            initialValue={initialData.summary}
                            initialIsValid={true}
                            onInput={inputHandler}
                            selectedValidators={[REQUIRED_VALIDATOR(), MINLENGTH_VALIDATOR(5), MAXLENGTH_VALIDATOR(200)]}
                            errorText='Enter a valid summary (5-200 characters).'
                        />
                    </div>

                    <div id='form-item'>
                        <div className="input-label">
                            <p id='taskDueDate'>Task Due Date</p>
                        </div>
                        <Input
                            element='input'
                            fieldId='taskDueDate'
                            name='dueDate'
                            type='date'
                            initialValue={initialData.dueDate.split('T')[0]}
                            initialIsValid={true}
                            onInput={inputHandler}
                            selectedValidators={[REQUIRED_VALIDATOR(), MINVALUE_VALIDATOR(1577880000), MAXVALUE_VALIDATOR(2556100800)]}
                            errorText='Enter a valid date (Jan 1, 2020 - Dec 31, 2050).'
                        />
                    </div>


                    <div id='form-item'>
                        <div className="input-label">
                            <p id='taskStatus'>Task Status</p>
                        </div>

                        <div className='form-input-fields'>
                            {type === 'add-task' && (
                                <select className='input-field'
                                    value={status}
                                    onChange={(event) => setStatus(+(event.target.value))}>

                                    <option value={TaskStatus.Pending.toString()} >
                                        Pending
                                    </option>
                                    <option value={TaskStatus.Today.toString()} >
                                        Today
                                    </option>
                                </select>
                            )}

                            {type === 'edit-task' && (
                                <select className='input-field'
                                    value={status}
                                    onChange={(event) => setStatus(+(event.target.value))}>

                                    <option value={TaskStatus.Pending.toString()} >
                                        Pending
                                    </option>
                                    <option value={TaskStatus.Today.toString()} >
                                        Today
                                    </option>
                                    <option value={TaskStatus.Completed.toString()} >
                                        Completed
                                    </option>
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                <div className='button-div'>
                    <button id='submit-btn' type='submit'>Save Task</button>
                    <button id='cancel-btn' onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </>
    )
}

