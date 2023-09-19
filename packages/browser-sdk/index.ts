import { Configuration, InternalApi } from "@laterpay/tapper-sdk";

export function sayHello() {
  console.log("Hello World!");
}

export async function sayTapperVersion() {
  const config = new Configuration({
    basePath: "https://tapi.sbx.laterpay.net",
  });

  const healthCheck = await new InternalApi(config).health();

  console.log(`Tapper version: ${healthCheck.version}`);
}
