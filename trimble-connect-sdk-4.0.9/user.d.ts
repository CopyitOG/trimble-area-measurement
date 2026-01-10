import { Service } from './service';
import { Configuration } from './config';
import { ServiceResponse } from './response';
/** The production USER service url. */
export declare const DefaultUSERServiceUri = "https://user-api.connect.trimble.com/v1/";
export interface Value {
    value: string;
}
/**
 * The respose for the user property CRUD operations.
 */
export interface UserPropertyResponse {
    key: string;
    tidUuid: string;
    values?: Value[];
}
/**
 * The request body for the create and update user property operations.
 */
export interface UserPropertyRequest {
    key: string;
    tidUuid: string;
    values?: Value[];
}
export declare class UserServiceClient extends Service {
    /**
     * @constructor Constructs a service client object.
     * @param {Config} config The configuration options (e.g. service url). If not provided the default configuration will be used.
     * @param {Credentials} credentials The credentials to be attached to service requests.
     */
    constructor(config?: Partial<Configuration>);
    /**
     * Creates the user property.
     * @param {UserProperty} The user property.
     * @returns {Promise<ServiceResponse<UserPropertyResponse>>} The service response with user property.
     * @throws {ServiceError} in case of the error response from the service.
     */
    createUserProperty(userProperty: UserPropertyRequest): Promise<ServiceResponse<UserPropertyResponse>>;
    /**
     * Returns all the user properties.
     * @param {string} key The property name.
     * @param {string} tidUuid The uuid of Trimble identity user.
     * @returns {Promise<ServiceResponse<UserPropertyResponse[]>>} The service response with an array of user properties.
     * @throws {ServiceError} in case of the error response from the service.
     */
    getUserProperties(tidUuid: string): Promise<ServiceResponse<UserPropertyResponse[]>>;
    /**
     * Returns the user property.
     * @param {string} key The property name.
     * @param {string} tidUuid The uuid of Trimble identity user.
     * @returns {Promise<ServiceResponse<UserPropertyResponse>>} The service response with user property.
     * @throws {ServiceError} in case of the error response from the service.
     */
    getUserProperty(key: string, tidUuid: string): Promise<ServiceResponse<UserPropertyResponse>>;
    /**
     * Updates the user property.
     * @param {UserProperty} userProperty The user property.
     * @returns {Promise<ServiceResponse<UserPropertyResponse>>} The service response with user property.
     * @throws {ServiceError} in case of the error response from the service.
     */
    updateUserProperty(userProperty: UserPropertyRequest): Promise<ServiceResponse<UserPropertyResponse>>;
    /**
     * Deletes the user property.
     * @param {string} key The property name.
     * @param {string} tidUuid The uuid of Trimble identity user.
     * @returns {Promise<ServiceResponse<UserPropertyResponse>>} The service response with user property.
     * @throws {ServiceError} in case of the error response from the service.
     */
    deleteUserProperty(key: string, tidUuid: string): Promise<ServiceResponse<void>>;
}
/**
 * The default instance of the USER client.
 */
export declare const UserClient: UserServiceClient;
export default UserServiceClient;
