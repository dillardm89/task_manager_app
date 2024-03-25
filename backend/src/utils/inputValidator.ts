import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

/**
 * Middleware to validate request body fields
 * before interacting with database to add or edit task
 */
export const validateInputs = [
    body('name').trim().not().isEmpty()
        .withMessage('Task name can not be empty.').bail()
        .isLength({ min: 5, max: 50 })
        .withMessage('Task name must be 5-50 characters.').bail(),
    body('summary').trim().not().isEmpty()
        .withMessage('Task summary can not be empty.').bail()
        .isLength({ min: 5, max: 200 })
        .withMessage('Task summary must be 5-200 characters.').bail(),
    body('dueDate').not().isEmpty()
        .withMessage('Task due date can not be empty.').bail()
        .isNumeric()
        .withMessage('Task due date must be in epoch integer format.')
        .bail()
        .isInt({ min: 1577880000, max: 2556100800 })
        .withMessage('Task due date must be between Jan 1, 2020 and Dec 31, 2050.').bail(),
    body('status').not().isEmpty()
        .withMessage('Task status can not be empty.').bail()
        .isNumeric()
        .withMessage('Task status must be in an integer.')
        .bail()
        .isInt({ min: 0, max: 2 })
        .withMessage('Task status must be 0, 1, or 2').bail(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ message: 'Invalid inputs passed.', errors: errors.array() })
        }
        return next()
    }
]
