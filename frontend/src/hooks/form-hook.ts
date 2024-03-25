import { useCallback, useState } from 'react'
import type { FormState } from '../utils/interfaces'


/**
 * Function for custom useForm hook to handle form validation
 * used in TaskForm.tsx
 * @returns {formState} FormState type object containing form data and validation status
 * @returns {inputHandler} callback function for validating individual form input fields
 * @returns {validateForm} callback function for validating entire form upon submit
 */
export function useForm() {
    const [formState, setFormState] = useState<FormState>({
        inputs: [
            { name: 'name', value: '', isValid: true },
            { name: 'summary', value: '', isValid: true },
            { name: 'dueDate', value: '', isValid: true }
        ],
        isValid: true
    })


    /**
     * Callback function for validating individual form input fieds
     * then update formState with results
     * @param {string} name input field label
     * @param {string} value input field value
     * @param {boolean} isValid whether input field value passes validation checks
     */
    const inputHandler = useCallback((name: string, value: string, isValid: boolean) => {
        let formisValid = true
        const tempFormState = []
        for (const formItem of formState.inputs) {
            if (name !== formItem.name) {
                tempFormState.push({ ...formItem })
                continue
            } else {
                formItem.value = value
                formItem.isValid = isValid
                tempFormState.push({ ...formItem })
                formisValid = formisValid && isValid
            }

            setFormState({
                inputs: tempFormState,
                isValid: formisValid
            })
        }
    }, [formState])


    /**
     * Callback function for validating entire form upon submit
     * then update formState with results and return form validity
     * @returns {boolean} formIsValid
     */
    const validateForm = useCallback(() => {
        console.log(formState)
        let formIsValid = true
        for (const formItem of formState.inputs) {
            formIsValid = formIsValid && formItem.isValid
        }

        setFormState({
            inputs: [
                ...formState.inputs
            ],
            isValid: formIsValid
        })

        return formIsValid
    }, [formState])

    return { formState, inputHandler, validateForm }
}
