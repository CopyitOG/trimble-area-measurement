/**
 * Service credentials that must be attached to authenticate each request.
 * Occasionally credentials can expire in the middle of a long-running application.
 */
export declare class Credentials {
    /**
     * The number of seconds before {expireTime} during which the credentials will be considered expired.
     */
    expiryWindow: number;
    /**
     * Whether the credentials have been expired and require a refresh.
     * Used in conjunction with expireTime.
     */
    expired: boolean;
    /**
     * Time when credentials should be considered expired.
     * Used in conjunction with expired.
     */
    expireTime: Date | null;
    /**
     * Creates a Credentials object with a given set of credential information as positional arguments.
     */
    constructor();
    /**
     * Gets the existing credentials, refreshing them if they are not yet loaded or have expired.
     * Users should call this method before using refresh(), as this will not attempt to reload
     * credentials when they are already loaded into the object.
     */
    get(): Promise<Credentials>;
    /**
     * Returns whether the credentials object should call refresh()
     */
    needsRefresh(): boolean;
    /**
     * Returns whether the token is invalid. Subclasses should override this method.
     */
    invalidToken(): boolean;
    /**
     * Refreshes the credentials.
     * Users should call get() before attempting to forcibly refresh credentials.
     * @note Subclasses should override this class to reset the {token} on the credentials object.
     * @see get
     */
    refresh(): Promise<void>;
}
