/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { auth, getApiVersion } from "./src";

declare global {
  interface Window {
    Supertab: typeof Supertab;
  }
}

const Supertab = {
  auth,
  getApiVersion,
};

if (typeof window !== "undefined") {
  (window as any).Supertab = Supertab;
}

export default Supertab;
