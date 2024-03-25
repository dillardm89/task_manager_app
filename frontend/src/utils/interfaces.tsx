/**
 * Enum representaton of task status type used in App.tsx,
 * TaskForm.tsx, and TaskList.tsx
 * @exports TaskStatus
 */
export enum TaskStatus { Pending, Today, Completed }


/**
 * Type for task object used within app used in Icon.tsx,
 * TaskForm.tsx, EditTask.tsx, TaskItem.tsx
 * @typedef {AppTaskType}
 * @exports AppTaskType
 */
export type AppTaskType = {
    name: string,
    summary: string,
    dueDate: string,
    status: number
}


/**
 * Type for task object used within database used
 * in TaskItem.tsx and context-provider.tsx
 * @typedef {DBTaskType}
 * @exports DBTaskType
 */
export type DBTaskType = {
    name: string,
    summary: string,
    dueDate: number,
    status: number
}


/**
 * Type for task state used in TaskList.tsx
 * @typedef {TaskStateType}
 * @extends DBTaskType
 * @exports TaskStateType
 */
export type TaskStateType = DBTaskType & {
    _id: string
}


/**
 * Type for validator callback functions used in
 * Input.tsx and validators.tsx
 * @typedef {ValidatorCallbackType}
 * @exports ValidatorCallbackType
 */
export type ValidatorCallbackType = {
    type: string,
    value?: number
}


/**
 * Type for input state used in Input.tsx
 * @typedef {InputState}
 * @exports InputState
 */
export type InputState = {
    value: string,
    isTouched: boolean,
    isValid: boolean
}


/**
 * Type for form inputs object used in FormState (below)
 * @typedef {FormInputs}
 */
type FormInputs = {
    name: string,
    value: string,
    isValid: boolean
}


/**
 * Type for form state used in form-hook.ts
 * @typedef {FormState}
 * @exports FormState
 */
export type FormState = {
    inputs: FormInputs[],
    isValid: boolean
}


/**
 * Type for database query by task id response object
 * used in context-providers.tsx
 * @typedef {TaskByIdResponseType}
 * @exports TaskByIdResponseType
 */
export type TaskByIdResponseType = {
    message: string,
    code?: number,
    task?: DBTaskType
}


/**
 * Type for Task Context object used in task-context.tsx
 * and create-context.tsx, but also available to entire app
 * through Task Context Provider
 * @typedef {TaskContextValue}
 * @exports TaskContextValue
 */
export type TaskContextValue = {
    needRefresh: boolean,
    startRefreshList: () => void,
    stopRefreshList: () => void,
    deleteTask: (taskId: string) => Promise<boolean>,
    submitFormHandler: (formValues: DBTaskType, type: string, taskId: string) => Promise<boolean>,
    dragStartHandler(event: React.DragEvent<HTMLLIElement>): void,
    dragOverHandler(event: React.DragEvent<HTMLUListElement>): void,
    dropHandler: (event: React.DragEvent<HTMLUListElement>) => Promise<void>
}
