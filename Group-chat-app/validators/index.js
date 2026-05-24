import { body, oneOf, validationResult } from 'express-validator';

export const userDetailsValidator = () => {
    return [
        // 1. Name validation
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required'),

        // 2. Email validation
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),

        // 3. Password validation
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),

        // 4. Phone Number validation
        body('phoneNumber')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
            .isMobilePhone('any')
            .withMessage('Invalid phone number format'),

        // 5. Interceptor middleware to catch errors
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        }
    ];
};

export const loginValidator = () => {
    return [
        // 1. Check that EITHER a valid email OR a valid phone number is provided
        oneOf([
            body('email')
                .trim()
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Invalid email format')
                .normalizeEmail(),

            body('phoneNumber')
                .trim()
                .notEmpty()
                .withMessage('Phone number is required')
                .isMobilePhone('any')
                .withMessage('Invalid phone number format')
        ], {
            message: 'Please provide a valid email or phone number'
        }),

        // 2. Check that the password field is not empty
        body('password')
            .notEmpty()
            .withMessage('Password is required'),

        // 3. Interceptor middleware to catch errors
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        }
    ];
};

