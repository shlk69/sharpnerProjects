import { body, oneOf, validationResult } from 'express-validator';

export const userDetailsValidator = () => {
    return [

        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required'),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),

        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),

        body('phoneNumber')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
            .isLength({ min: 10, max: 10 })
            .withMessage('Phone number must be 10 digits'),

        (req, res, next) => {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                return res.status(400).json({
                    success: false,
                    message: errors.array()[0].msg
                });
            }

            next();
        }
    ];
};

export const loginValidator = () => {
    return [

        oneOf([
            body('email')
                .trim()
                .isEmail()
                .withMessage('Invalid email format'),

            body('phoneNumber')
                .trim()
                .isLength({ min: 10, max: 10 })
                .withMessage('Phone number must be 10 digits')
        ], {
            message: 'Please provide valid email or phone number'
        }),

        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required'),

        (req, res, next) => {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                return res.status(400).json({
                    success: false,
                    message: errors.array()[0].msg
                });
            }

            next();
        }
    ];
};