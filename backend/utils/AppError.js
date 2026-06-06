// It is just a custom error object, that gets created whenever we want to throw an error in our controllers.
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;