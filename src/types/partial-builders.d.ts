/**
 * Make all properties in a type optional
 */
export type PartialAllOf<T> = {
    [P in keyof T]?: PartialAllOf<T[P]>;
};

/**
 * Make given property of a type optional
 */
export type PartialOnly<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
