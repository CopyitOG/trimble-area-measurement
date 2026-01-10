export interface IdentityToken extends JsonWebToken {
    azp: string;
    at_hash: string;
    auth_time: number;
    'http://wso2.org/claims/accountname': string;
    'http://wso2.org/claims/firstname': string;
    'http://wso2.org/claims/passwordPolicy': string;
    'http://wso2.org/claims/userCreateTimeStamp': string;
    'http://wso2.org/claims/lastname': string;
    'http://wso2.org/claims/uuid': string;
    'http://wso2.org/claims/givenname': string;
    'http://wso2.org/claims/emailVerified': string;
    'http://wso2.org/claims/identity/failedLoginAttempts': string;
    'http://wso2.org/claims/identity/accountLocked': string;
    'http://wso2.org/claims/lastLoginTimeStamp': string;
    'http://wso2.org/claims/status': string;
    'http://wso2.org/claims/lastPwdSetTimeStamp': string;
    'http://wso2.org/claims/emailaddress': string;
    'http://wso2.org/claims/accountusername': string;
}
/** JSON web token claims */
export interface JsonWebToken {
    /** Issuer */
    iss?: string;
    /** Subject */
    sub?: string;
    /** Audience */
    aud?: string[];
    /** Expiration time (UTC timestamp) */
    exp?: number;
    /** Not before (UTC timestamp) */
    nbf?: number;
    /** Issued at (UTC timestamp) */
    iat?: number;
    /** Token identifier */
    jti?: string;
}
/**
 * Returns the claims from a JSON Web Token without verification.
 * @param token The token to parse.
 */
export declare function parseJwt<T extends JsonWebToken = JsonWebToken>(token: string): T;
