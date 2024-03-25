import { ChangeEvent, useState } from 'react'
import { validateInput } from '../../utils/validators'
import type { InputState, ValidatorCallbackType } from '../../utils/interfaces'


/**
 * Props required for Icon Component
 * @typedef {InputProps}
 */
type InputProps = {
    initialValue: string,
    initialIsValid: boolean,
    name: string,
    fieldId: string,
    element: 'input' | 'textarea',
    selectedValidators: ValidatorCallbackType[],
    errorText: string,
    onInput: (id: string, value: string, isValid: boolean) => void,
    type?: string,
    rows?: number
}


/**
 * Component for rendering input elements in task form
 * Props passed from TaskForm component
 * @param {InputProps} initialValue string indicating initial value (blank for add task)
 * @param {InputProps} initialIsValid boolean indiciating initial value validity (true)
 * @param {InputProps} name string for field label
 * @param {InputProps} fieldId string for CSS id
 * @param {InputProps} element string 'input' or 'textarea' for field type
 * @param {InputProps} selectedValidators array of validator callback functions (validators.tsx)
 * @param {InputProps} errorText string of error text if input invalid after validation
 * @param {InputProps} onInput callback function to validate input (form-hook.ts)
 * @param {InputProps} type (optional) string for input field type (ex: text, date)
 * @param {InputProps} rows (option) number for rows to show if element is 'textarea'
 * @returns {React.JSX.Element} Input
 */
export default function Input({ initialValue, initialIsValid, selectedValidators, name, fieldId, element, errorText, onInput, ...props }: InputProps) {
    const [inputState, setInputState] = useState<InputState>({
        value: initialValue ? initialValue : '',
        isTouched: false,
        isValid: initialIsValid ? initialIsValid : false
    })


    // Function to handle, validate, and set state with input field during changes
    function changeHandler(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        let fieldStringValue
        let fieldValidateValue
        if (name === 'dueDate') {
            fieldStringValue = (new Date((event.target.value + 'T00:00:00'))).toISOString()
            fieldValidateValue = Math.floor(Date.parse(fieldStringValue) / 1000).toString()
        } else {
            fieldStringValue = event.target.value
            fieldValidateValue = event.target.value
        }

        const fieldIsValid = validateInput(fieldValidateValue, selectedValidators)

        setInputState({
            value: fieldStringValue,
            isTouched: false,
            isValid: fieldIsValid
        })
    }


    // Function to handle, validate, and set state for input field after changes
    function touchHandler(): void {
        setInputState({
            value: inputState.value,
            isTouched: true,
            isValid: inputState.isValid
        })
        onInput(name, inputState.value, inputState.isValid)
    }


    // Conditional for determining component type to render
    const elementType = element === 'input' ? (
        <input
            id={fieldId}
            name={name}
            className={`${name === 'dueDate' ? 'input-date-field' : 'input-field'}`}
            value={name === 'dueDate' ? inputState.value.split('T')[0] : inputState.value}
            onChange={changeHandler}
            onBlur={touchHandler}
            {...props}
        />
    ) : (
        <textarea
            id={fieldId}
            name={name}
            className='input-field'
            value={inputState.value}
            onChange={changeHandler}
            onBlur={touchHandler}
            {...props}
        />
    )


    return (
        <div className='form-input-fields'
            id={`${!inputState.isValid && inputState.isTouched && 'error-label'}`}>

            {elementType}

            {!inputState.isValid && inputState.isTouched && (
                <p>{errorText}</p>
            )}
        </div>
    )
}
