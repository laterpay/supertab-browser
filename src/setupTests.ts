import { beforeAll, beforeEach, afterEach, afterAll } from "bun:test";
import { server } from "./mocks/server";
import { GlobalWindow } from "happy-dom";

declare global {
  var timeout: (ms?: number) => Promise<void>;
  var nextTick: () => Promise<void>;
}

global.window = new GlobalWindow() as any;
global.timeout = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));
global.nextTick = () => timeout(1);

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

beforeEach(() => {
  const map = new Map();
  const localStorage = {
    getItem: map.get.bind(map),
    setItem: map.set.bind(map),
    removeItem: map.delete.bind(map),
  };
  global.localStorage = localStorage as unknown as Storage;
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});
