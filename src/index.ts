import { Configuration, InternalApi } from "@laterpay/tapper-sdk";

export function auth() {
  console.log("Doing authentication");
}

export async function getApiVersion() {
  const config = new Configuration({
    basePath: "https://tapi.sbx.laterpay.net",
  });

  const healthCheck = await new InternalApi(config).health();

  return healthCheck.version;
}
