import { Service } from './service';
/**
 * A structure containing information about a service response.
 */
export declare class ServiceResponse<D> {
    private readonly service;
    response: Response;
    data: D;
    /**
     * The number of retries that were attempted before the request was completed.
     */
    retryCount: number;
    /**
     * @constructor
     * @param {Response} response  The raw HTTP response object containing the response headers and body information from the server.
     * @param {D} data The de-serialized response data from the service.
     */
    constructor(service: Service, response: Response, data: D);
    /**
     * Whether more pages of data can be returned by further requests.
     */
    hasNextPage(): boolean;
    /**
     * Creates a new request for the next page of response data.
     */
    nextPage(): Promise<ServiceResponse<D>>;
}
