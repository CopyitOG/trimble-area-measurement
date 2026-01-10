/**
 * A structure containing information about a service or networking error.
 */
export declare class ServiceError extends Error {
    readonly response: Response;
    readonly errorMessage: string;
    readonly errorCode?: string | undefined;
    /**
     * @constructor
     * @param {Response} response The http response received.
     * @param {string} errorMessage In the case of a request that reached the service, this value contains a longer human readable error message.
     * @param {string} errorCode In the case of a request that reached the service, this value contains a unique short code representing the error that was emitted (@see ErrorCodes for the expected values).
     */
    constructor(response: Response, errorMessage: string, errorCode?: string | undefined);
}
/**
 * The possible unique short codes representing the error returned by the service in the error response.
 * @see ServiceError#errorCode.
 */
export declare const ErrorCodes: {
    AlreadyExists: string;
    BadRequest: string;
    Deleted: string;
    DuplicateId: string;
    InvalidId: string;
    DuplicateName: string;
    ExpiredToken: string;
    Forbidden: string;
    InvalidToken: string;
    MethodNotAllowed: string;
    NameRequired: string;
    NotFound: string;
    NotSupportedEtagFormat: string;
    ParentDeleted: string;
    TypeRequired: string;
    Unauthorized: string;
    VersionDoesNotMatch: string;
};
/**
 * The possible unique short codes representing the error returned by the service in the error response.
 * @see ServiceError#errorCode.
 */
export declare const TCPSErrorCodes: {
    ExpiredToken: string;
};
