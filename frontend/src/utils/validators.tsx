import { ValidatorCallbackType } from './interfaces'

/**
 * @exports REQUIRED_VALIDATOR Function to set input field type as 'Required'
 */
export const REQUIRED_VALIDATOR = () => ({ type: 'REQUIRED' })


/**
 * @param {number} value number for minimum length required in field
 * @exports MINLENGTH_VALIDATOR Function to set input field 'minlength'
 */
export const MINLENGTH_VALIDATOR = (value: number) => ({
    type: 'MIN_LENGTH',
    value: value
})


/**
 * @param {number} value number for maximum length required in field
 * @exports MAXLENGTH_VALIDATOR Function to set input field 'maxlength'
 */
export const MAXLENGTH_VALIDATOR = (value: number) => ({
    type: 'MAX_LENGTH',
    value: value
})


/**
 * @param {number} value number for minimum required in field
 * @exports MINVALUE_VALIDATOR Function to set input field 'minvalue'
 */
export const MINVALUE_VALIDATOR = (value: number) => ({
    type: 'MIN_VALUE',
    value: value
})


/**
 * @param {number} value number for minimum required in field
 * @exports MAXVALUE_VALIDATOR Function to set input field 'maxvalue'
 */
export const MAXVALUE_VALIDATOR = (value: number) => ({
    type: 'MAX_VALUE',
    value: value
})


/**
 * Function for validating input fields based on set parameters
 * Params passed down from TaskForm.tsx
 * @param {string} value string containing input field data (event.target.value)
 * @param {ValidatorCallbackType[]} validators array of callback validation functions
 * @returns {boolean} isValid whether input passes validation checks (true/false)
 */
export function validateInput(value: string, validators: ValidatorCallbackType[]): boolean {
    let isValid = true
    for (const validator of validators) {
        if (validator.type == 'REQUIRED') {
            isValid = isValid && value.trim().length > 0
        }

        if (validator.type == 'MIN_LENGTH') {
            isValid = isValid && value.trim().length >= validator.value!
        }

        if (validator.type == 'MAX_LENGTH') {
            isValid = isValid && value.trim().length <= validator.value!
        }

        if (validator.type == 'MIN_VALUE') {
            isValid = isValid && +value >= validator.value!
        }

        if (validator.type == 'MAX_VALUE') {
            isValid = isValid && +value <= validator.value!
        }
    }
    return isValid
}
