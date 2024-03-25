/**
 * Custom error handling model
 * @extends {Error}
 */
export class ErrorResponse extends Error {
    constructor(public message: string, public errorCode: number) {
        super(message)
    }
}
