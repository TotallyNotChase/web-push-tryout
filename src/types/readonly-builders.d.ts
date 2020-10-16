/**
 * Make all properties in a type readonly
 */
export type ReadonlyAllOf<T> = {
    readonly [P in keyof T]: T[P];
};
