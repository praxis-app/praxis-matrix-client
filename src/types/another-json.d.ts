declare module 'another-json' {
  const anotherjson: {
    parse(jsonString: string): unknown;
    stringify(value: unknown): string;
  };
  export default anotherjson;
}