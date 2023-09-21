import { auth, getApiVersion } from "./src";

const Supertab = {
  auth,
  getApiVersion,
};

if (typeof window !== "undefined") {
  (window as any).Supertab = Supertab;
}

export default Supertab;
