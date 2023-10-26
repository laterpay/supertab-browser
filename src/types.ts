import { AuthStatus } from "./auth";

export interface Authenticable {
  authStatus: AuthStatus;
}

export enum AccessStatus {
  GRANTED = "Granted",
  DENIED = "Denied",
}
