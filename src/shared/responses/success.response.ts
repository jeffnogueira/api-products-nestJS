import { Response } from '../interfaces/response.interface';

export class SuccessResponse implements Response {
    error: object = null;
    status: number;
    data: object;
    hasError: boolean = false;

    constructor(data: object, status: number) {
        this.data = data;
        this.status = status;
    }
}
