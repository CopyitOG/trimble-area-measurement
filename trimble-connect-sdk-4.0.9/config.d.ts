import { ServiceCredentials, ServiceToken } from './service_credentials';
/**
 * Configuration options.
 */
export interface Configuration {
    /** The endpoint URI to send requests to. Must end with slash ('/'). */
    serviceUri: string;
    /**
     * The region of the service. Ignored if the endpoint URI is also given in configuration.
     * @deprecated serviceUri should be provided. Use TCPSClient.regionToServiceUri to convert region to serviceUri if needed.
     */
    region?: string;
    /**
     * The credentials to attach to requests.
     */
    credentials?: ServiceCredentials | ServiceToken;
    /**
     * An object that responds to .write() (like a stream) or .log() (like the console object) in order to log information about requests.
     */
    logger?: Logger;
    /**
     * The maximum amount of retries to perform for a service request.
     */
    maxRetries?: number;
}
/**
 * The logger interface, could accept 'console' or 'process.stdout'.
 */
export interface Logger {
    write?: (chunk: any, encoding?: string, callback?: () => void) => void;
    log?: (...messages: any[]) => void;
}
