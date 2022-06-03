export interface BackendResponse<T> {
    statusCode?: number;
    message?: string;
    data?: T;
}