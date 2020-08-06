import { Response } from '../interfaces/response.interface';

export class ErrorResponse implements Response {
    error: object;
    status: number;
    data: object = null;
    hasError: boolean = true;

    constructor(error: object, status: number) {
        this.error = error;
        this.status = status;
    }
}
