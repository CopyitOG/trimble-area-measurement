import { Configuration } from './config';
import { ServiceResponse } from './response';
/**
 * The service client that represents connection to the Organizer Service.
 * Each API operation is exposed as a function on service.
 */
export declare class Service {
    readonly config: Configuration;
    /** Used if maxRetries is not specified in {@see Configuration#maxRetries }. The defaultRetryCount can be overriden by service classes. */
    private defaultRetryCount;
    /**
     * @constructor Constructs a service object.
     * @param {Config} config The configuration options (e.g. service url).
     */
    constructor(config: Configuration);
    /**
     * Fetched the next page fromt he sequence of pages initiated by {@see Organizer.listTrees }.
     * @param {string} url The url to make request to. Could be absolute or relative to the service base uri.
     * @param {string} method The HTTP method.
     * @param {string} body The body to send in the request (will be serialized to JSON).
     * @param {string} headers The headers to attach to request.
     * @param {boolean} auth The value indicating wether the request requires authentication. If true, the credentials will be requested from the configuration {@see Config#credentials } and Authorization header will be attached.
     * @returns {Promise<ServiceResponse<D>>} The service response.
     * @throws {ServiceError} in case of the error response from the service.
     */
    makeRequest<D>(url: string, method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE', body?: string | FormData, customHeaders?: Headers, auth?: boolean): Promise<ServiceResponse<D>>;
    /**
     * Fetches all the items page by page, returning each page results in a callback.
     * @param {string} url The url to make request to. Could be absolute or relative to the service base uri.
     * @param {(response: ServiceResponse<D>) => void} onPageRetrieved The callback used to return results, page by page.
     * @param {number} pageSize The page size used to request items.
     * @param {string} body The body to send in the request (will be serialized to JSON).
     * @param {string} customHeaders The headers to attach to request.
     * @param {boolean} auth The value indicating wether the request requires authentication. If true, the credentials will be requested from the configuration {@see Config#credentials } and Authorization header will be attached.
     * @returns {Promise<ServiceResponse<D>>} The service response.
     * @throws {ServiceError} in case of the error response from the service.
     */
    getItemsWithPages<D>(url: string, onPageRetrieved: (response: ServiceResponse<D>) => void, pageSize: number, body?: string | FormData, customHeaders?: Headers, auth?: boolean): Promise<void>;
    /**
     * Makes a service request with all needed authenticationand retry logic. Converts error response to exception.
     * @param {string} url The url to make request to. Could be absolute or relative to the service base uri.
     * @param {string} method The HTTP method.
     * @param {string} body The body to send in the request (will be serialized to JSON).
     * @param {string} customHeaders The custom headers to attach to request.
     * @param {boolean} auth The value indicating wether the request requires authentication. If true, the credentials will be requested from the configuration {@see Config#credentials } and Authorization header will be attached.
     * @returns {Promise<ServiceResponse<D>>} The service response.
     * @throws {ServiceError} in case of the error response from the service.
     */
    request(url: string, method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE', body?: string | FormData | Blob, customHeaders?: Headers, auth?: boolean): Promise<ServiceResponse<void>>;
    /**
     * How many times a failed request should be retried before giving up.
     * the defaultRetryCount can be overriden by service classes.
     *
     * @api private
     * @private
     */
    maxRetries(): number;
    /**
     * First retry goes immediatly (0ms delay) then exponential growth with 100ms as a base.
     * @api private
     * @private
     */
    calculateRetryDelay(retryCount: number): number;
    /**
     * @api private
     * @private
     */
    private retryableError;
    /**
     * @api private
     * @private
     */
    private networkingError;
    /**
     * @api private
     * @private
     */
    private timeoutError;
    /**
     * @api private
     * @private
     */
    private expiredCredentialsError;
    /**
     * @api private
     * @private
     */
    private throttledError;
    /**
     * Makes a service call and takes care about retry logic (re-authentication if needed).
     * Note the <void> as a generic parameter. This method does not read the response body. The ServiceResponse return value will be cased to needed type on upper levels of the code.
     * @param {string} url The url to make request to. Could be absolute or relative to the service base uri.
     * @param {string} params The fetch parameters.
     * @param {boolean} auth The value indicating wether the request requires authentication. If true, the credentials will be requested from the configuration {@see Config#credentials } and Authorization header will be attached.
     * @returns {Promise<ServiceResponse<void>>} The service response.
     * @throws {ServiceError} in case of the error response from the service.
     * @private
     */
    private fetchWithRetry;
    /**
     * The lowest level fetch function wrapper.
     * This method allows to separte the step of actual sending of the request in the HTTP pipline and potentially intercept it and fire events.
     * @param {string} url The url to make request to. Could be absolute or relative to the service base uri.
     * @param {string} params The HTTP method.
     * @private
     */
    private fetch;
    /**
     * Gets the next range for the rest of the results of response data.
     * @param {ServiceResponse<D>} response The response for which we get the next range.
     * @private
     */
    private getRange;
    /**
     * Put a line of text to the log.
     * @param {string} line The line to log.
     * @private
     */
    private log;
}
