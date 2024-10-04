/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { Supertab } from "./src";

declare global {
  interface Window {
    Supertab: Supertab;
    SupertabInit: (options: { clientId: string }) => Supertab;
  }
}

if (typeof window !== "undefined") {
  window.SupertabInit = (options) => {
    window.Supertab = new Supertab(options);

    return window.Supertab;
  };
}

console.log('test');

export default Supertab;
