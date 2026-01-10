import { Credentials } from './credentials';
import { AuthResponse, TIDConfig } from './tid';
export interface TIDCredentialsParams extends TIDConfig {
}
/**
 * User credentials can be used only for user accounts with 2FA disabled, such as test user accounts.
 */
export interface TIDUserCredentials {
    password: string;
    username: string;
}
/**
 * Service credentials that must be attached to authenticate each request.
 * Occasionally credentials can expire in the middle of a long-running application.
 */
export declare class TIDCredentials extends Credentials {
    readonly params: TIDCredentialsParams;
    userCredentials?: TIDUserCredentials | undefined;
    readonly onRefreshed?: ((tidCredentials: TIDCredentials) => void) | undefined;
    readonly onInvalidated?: ((redirectUri: string) => void) | undefined;
    tokens?: AuthResponse;
    private readonly service;
    private ongoingTokenRefresh;
    /**
     * Creates a TIDCredentials object with a given set of credential information as positional arguments.
     * @param {TIDCredentialsParams} params The TID Credentials configuration options.
     * @param {TIDUserCredentials} [userCredentials] The user credentials. Optional.
     * @param {(TIDCredentials) => void} [onRefreshed] Called when TID tokens are refreshed. Optional.
     * @param {(string) => void} [onInvalidated] Called when TID tokens are not valid anymore. Optional.
     * @example Creating a new credentials object
     *   credentials = new TC.TIDCredentials({
     *       serviceUri: "https://id.trimble.com/",
     *       clientId: "xxx",
     *       clientSecret: "yyy",
     *       appName: 'zzz',
     *       redirectUri: 'https://aaa.com',
     *     },
     *     { username: "name", password: "pass" }
     *   )
     */
    constructor(params: TIDCredentialsParams, userCredentials?: TIDUserCredentials | undefined, onRefreshed?: ((tidCredentials: TIDCredentials) => void) | undefined, onInvalidated?: ((redirectUri: string) => void) | undefined);
    /**
     * Refreshes the credentials, ensuring only one such operation is in progress at a time
     * Users should call get() before attempting to forcibly refresh credentials.
     * @note Subclasses should override this class to reset the {token} on the credentials object.
     * @see get
     */
    refresh(): Promise<void>;
    /**
     * Returns whether the token invalid
     */
    invalidToken(): boolean;
    /**
     * Returns the authentication URI where the user should be redirected when authenticating.
     */
    getOAuthRedirect(): string;
    /**
     * Exchanges the authorization code with the identity server for the auth grants.
     * Sets the auth grants into to service credentials.
     */
    exchangeCode(code: string): Promise<void>;
    /**
     * Perform refreshing the credentials
     */
    private refreshToken;
}
