export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        ((this.statusCode = statusCode),
            Error.captureStackTrace(this, this.constructor));
    }
    static badRequest(message = "Bad Request") {
        return new ApiError(400, message);
    }

    static conflict(message = "conflict") {
        return new ApiError(409, message);
    }

    static unauthorized(message = "unauthorized") {
        return new ApiError(401, message);
    }

    static notFound(message = "Not Found") {
        return new ApiError(404, message);
    }
}


