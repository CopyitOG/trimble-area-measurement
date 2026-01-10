import { Credentials } from './credentials';
import { TIDCredentials } from './tid_credentials';
/**
 * Service credentials that must be attached to authenticate each request.
 * Occasionally credentials can expire in the middle of a long-running application.
 */
export declare class ServiceCredentials extends Credentials {
    readonly tidCredentials?: TIDCredentials | undefined;
    /** The service bearer token. */
    token?: string;
    /**
     * Creates a Credentials object with a given set of credential information as positional arguments.
     * @param {TIDCredentials} tidCredentials - The TID master credentials. If provided the service token can be refreshed automatically.
     * @param {string | ServiceToken} token - The initial service bearer token (if e.g. known already from other sources).
     */
    constructor(tidCredentials?: TIDCredentials | undefined, token?: string | ServiceToken);
    /**
     * Refreshes the credentials.
     * Users should call get() before attempting to forcibly refresh credentials.
     * @note Subclasses should override this class to reset the {token} on the credentials object.
     * @see get
     */
    refresh(): Promise<void>;
    /**
     * Returns whether the token invalid
     */
    invalidToken(): boolean;
}
export interface ServiceToken {
    /** The service bearer token. */
    token: string;
}
