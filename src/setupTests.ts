import { beforeAll, afterEach, afterAll } from "bun:test";
import { server } from "./mocks/server";
import { GlobalWindow } from "happy-dom";

global.window = new GlobalWindow() as any;

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});
