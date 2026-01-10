/**
 * The access control policy.
 */
export interface Policy {
    /** The optional policy identifier */
    id?: string;
    /** Version of the policy defines a supported schema and capabilities of the policy */
    version?: '2020-04-06';
    /**
     * The list of statements
     * The compatibility between different statement structures based on policy versions is not guaranteed.
     */
    statements: any[];
}
