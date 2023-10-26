import { AuthStatus } from "./auth";

export interface Authenticable {
  authStatus: AuthStatus;
}

export enum AccessStatus {
  GRANTED = "Granted",
  DENIED = "Denied",
}

export interface CheckAccessResponse {
  status: AccessStatus;
  details?: {
    contentKey: string;
    validTo: number;
  };
}
