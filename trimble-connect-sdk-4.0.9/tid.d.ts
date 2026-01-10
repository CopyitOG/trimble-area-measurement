import { Configuration } from './config';
import { ServiceResponse } from './response';
import { Service } from './service';
/** The production TID service url. */
export declare const DefaultTIDServiceUri = "https://id.trimble.com/";
/**
 * The TID service configuration options.
 */
export interface TIDConfig extends Configuration {
    /** The clientId received on app registration. */
    clientId: string;
    /** The clientSecret received on app registration. (Not needed if doRefresh is passed)*/
    clientSecret?: string;
    /** The optional app redirect url configured on app registration. Needed only if code grand type flow is used to acquire tokens from TID. */
    redirectUri?: string;
    /** The optional app name. Needed only for the sign-on from the TID web session. */
    appName?: string;
    /** If passed, it will override the internal token refresh call */
    doTokenRefresh?: () => Promise<AuthResponse>;
}
/**
 * The TID service response with tokens.
 */
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    id_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
}
/**
 * The TPaaS TID Service client.
 */
export declare class TID extends Service {
    /**
     * Creates a TID object with a given set of credential information as positional arguments.
     * @param {string} config - The service configuration.
     */
    constructor(config: TIDConfig);
    /**
     * Refreshes a token set.
     * @param {string} refreshToken The refresh token.
     * @returns {Promise<ServiceResponse<AuthResponse>>} The service response.
     */
    refresh(refreshToken: string): Promise<ServiceResponse<AuthResponse>>;
    /**
     * Returns the authorization redirect URI which can be used to redirect to the login page.
     * @returns {string} The service response.
     */
    getOAuthRedirect(): string;
    /**
     * Exchanges the authorization code for auth grants.
     * @param {string} code The code.
     * @returns {Promise<ServiceResponse<AuthResponse>>} The service response.
     */
    exchangeCode(code: string): Promise<ServiceResponse<AuthResponse>>;
}
