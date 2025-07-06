/**
 * Type definitions for the 'another-json' module
 *
 * This file is necessary because:
 * - The 'another-json' package used by matrix-js-sdk doesn't have built-in TypeScript types
 * - There are no @types/another-json definitions available on npm
 * - Without these types, TypeScript throws TS7016 errors about implicit 'any' types
 * - This provides basic type safety for the JSON parsing functionality used by the SDK
 */

declare module 'another-json' {
  const anotherjson: {
    parse(jsonString: string): unknown;
    stringify(value: unknown): string;
  };
  export default anotherjson;
}
