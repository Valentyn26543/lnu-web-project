import { body } from "express-validator";

export const loginValidation = [
    body("email", "Неправильний формат пошти").isEmail(),
    body("password", "Пароль має бути мінімум 5 символів").isLength({ min: 5 }),
];

export const registerValidation = [
    body("email", "Неправильний формат пошти").isEmail(),
    body("password", "Пароль має бути імнімум 5 символів").isLength({ min: 5 }),
    body("fullName", "Вкажіть ім'я").isLength({ min: 3 }),
];


const validateMatrixSize = (matrixA, { req }) => {
    const vectorB = req.body.vectorB;

    if (!Array.isArray(matrixA) || matrixA.length === 0) {
        throw new Error("Матриця A має бути непорожнім масивом");
    }

    const N = matrixA.length;
    
    for (const row of matrixA) {
        if (!Array.isArray(row) || row.length !== N) {
            throw new Error("Матриця A має бути квадратною (N×N)");
        }
    }

    if (!Array.isArray(vectorB) || vectorB.length !== N) {
        throw new Error("Вектор B має мати таку ж кількість елементів, як і кількість рядків у матриці A");
    }

    return true;
};

export const taskValidation = [
    body("title", "Вкажіть назву завдання").optional().isString(),
    body("matrixA", "Вкажіть матрицю коефіцієнтів A").isArray().custom(validateMatrixSize),
    body("vectorB", "Вкажіть вектор вільних членів B").isArray(),
];
