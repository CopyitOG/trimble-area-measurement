/**
 * The information about the user.
 */
export interface UserInfoResponse {
    sub: string;
    iss: string;
    email: string;
}
export interface UserInfoGetOptions {
    /**
     * If specified the service will wait for the asynchronous claims gathering process to complete,
     * otherwise service immediatly return claims gathered so far even if gathering is not complete yet.
     */
    wait?: boolean;
    /**
     * If specified the claims refresh is enforced out of normal refresh cycle before the set of claims returned.
     * Usually claims refresh is happaning periodically (every 15 minutes) in the background.
     */
    refresh?: boolean;
}
export interface PagedItems<T> {
    /** The collection of items. */
    items: T[];
    /** The link to the next page. If not present, this is the last page. */
    next?: string;
}
/**
 * The request parameters operations to get a resource.
 */
export interface GetOptions {
    /**
     * The if defined and true informs server that entities marked as deleted should be returned as well.
     * The default behavior is to retirn HTTP 404 for entitied marked as deleted.
     */
    deleted?: boolean;
}
/**
 * The request parameters operations to get a list of resources.
 */
export interface ListOptions {
    /**
     * The if defined and true informs server that entities marked as deleted should be returned as well.
     * The default behavior is to skip/hide entitied marked as deleted.
     */
    deleted?: boolean;
    /** The skip token used a as cursor to indicate the place where next page of results should fetched from. */
    skiptoken?: string;
    /** The maximum number of items to return. */
    top?: number;
}
/**
 * The request parameters operations to get a resource.
 */
export interface DeleteOptions {
    /**
     * The last seen version of the tree descriptor.
     * If provided service will use this information for the concurency control and will refuse to apply changes if current version is not equal to version provided in the request.
     */
    v?: number;
}
/**
 * The web socket change notification subscription response with url for connecting.
 */
export interface WSSubscriptionResponse {
    /** The url to connect including temporary encrypted token. */
    url: string;
}
/**
 * The change notification subscription response with temporary session credentials and MQTT endpoint details.
 */
export interface SubscriptionResponse {
    /** The topic the client MUST subscribe. */
    topic: string;
    /** The IoT hub endpoint to subscribe. */
    host: string;
    /** The access key. */
    accessKeyId: string;
    /** The secret key. */
    secretKey: string;
    /** The session token. */
    sessionToken: string;
    /** The time when temporary session credentials expire. Client have to ask for new credentials after expiration. */
    expiresAt: string;
}
/**
 * An error descriptor from the batch get nodes API.
 */
export interface ResourceIdentityWithError<T> {
    /** The pset definition/version identifier (from the request). */
    item: T;
    /** The error code. */
    code: string;
    /** A human readable error message. */
    message: string;
}
/**
 * The range of collections/lists requests.
 */
export interface Range {
    /** The start of the range. */
    start: number;
    /** The end of the range. */
    end: number;
    /** The total number of elements. */
    total?: number;
}
