// Global type definitions for missing browser APIs

declare global {
  interface Uint8Array {
    toBase64?(options?: Uint8ArrayToBase64Options): string;
  }

  interface Uint8ArrayConstructor {
    fromBase64?(base64: string, options?: Uint8ArrayFromBase64Options): Uint8Array;
  }

  interface Uint8ArrayToBase64Options {
    alphabet?: "base64" | "base64url";
    omitPadding?: boolean;
  }

  interface Uint8ArrayFromBase64Options {
    alphabet?: "base64" | "base64url";
    lastChunkHandling?: "loose" | "strict";
  }

  interface Navigator {
    webkitGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: NavigatorUserMediaSuccessCallback,
      errorCallback: NavigatorUserMediaErrorCallback
    ) => void;
  }

  interface MediaTrackConstraints {
    mandatory?: {
      [key: string]: boolean | number | string;
    };
  }
}

export {};