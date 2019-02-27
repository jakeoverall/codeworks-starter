/**
 * Type for what object is instances of
 */
export interface Type<T> {
  new(...args: any[]): T;
}
