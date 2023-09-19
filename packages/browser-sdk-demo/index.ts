import { sayHello, sayTapperVersion } from "@supertab/browser-sdk";
import { z } from "zod";

sayHello();
await sayTapperVersion();

const User = z.object({
  username: z.string(),
});

console.log(User.parse({ username: "Ludwig" }));
