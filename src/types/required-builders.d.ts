/**
 * Make given property of a type required
 */
export type RequiredOnly<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
