export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}


export interface ErrorResponse {
    statusCode: number;
    message: string;
    success: boolean;
    errors: string | string[];
}