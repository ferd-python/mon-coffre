import { openDatabaseAsync, openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Platform } from "react-native";
import * as schema from "./schema";

export const DATABASE_NAME = "mon-coffre.db";

type AppDatabaseInstance = ReturnType<typeof drizzle<typeof schema>>;

const dbOptions = { enableChangeListener: true } as const;

function openSqlite() {
  return openDatabaseSync(DATABASE_NAME, dbOptions);
}

let realDb: AppDatabaseInstance | null = null;

// Services and repositories across the app (see src/services/index.ts) construct their
// singletons with `db` once, at module-evaluation time — they don't re-read the import
// later. On web, the real database isn't ready until after an async warm-up (see below),
// so `db` is a stable proxy that always forwards to whatever `realDb` currently is,
// rather than a binding that would need to be swapped out from under already-constructed
// consumers.
export const db: AppDatabaseInstance = new Proxy({} as AppDatabaseInstance, {
  get(_target, prop) {
    if (!realDb) {
      throw new Error("Database accessed before ready — callers must wait for `ready` to resolve.");
    }
    const value = (realDb as unknown as Record<PropertyKey, unknown>)[prop];
    return typeof value === "function" ? value.bind(realDb) : value;
  },
});

export type AppDatabase = typeof db;

// expo-sqlite's web backend requires SharedArrayBuffer, which is only available once
// the page is cross-origin isolated (see public/coi-serviceworker.js, registered in
// app/+html.tsx). On the very first visit the isolating service worker is registered
// but can't retroactively isolate the page that's already loading — a single reload is
// required. We trigger that reload here, before openDatabaseSync would otherwise throw.
const needsIsolationReload =
  Platform.OS === "web" &&
  typeof window !== "undefined" &&
  window.crossOriginIsolated === false &&
  !window.sessionStorage.getItem("monCoffreCoiReload");

if (needsIsolationReload) {
  window.sessionStorage.setItem("monCoffreCoiReload", "1");
  window.location.reload();
}

if (Platform.OS !== "web") {
  realDb = drizzle(openSqlite(), { schema });
}

// expo-sqlite's synchronous web API deadlocks if the very first call happens in the same
// task that creates its worker (github.com/expo/expo/issues/47694): the main thread
// busy-waits for a SharedArrayBuffer lock the worker can't flip until the event loop
// yields. Warming up with one async open first lets the worker boot; openDatabaseSync
// then reuses the same underlying connection reliably.
export const ready: Promise<void> =
  Platform.OS !== "web"
    ? Promise.resolve()
    : needsIsolationReload
      ? new Promise(() => {}) // page is reloading itself; this module instance is discarded
      : openDatabaseAsync(DATABASE_NAME, dbOptions).then(() => {
          realDb = drizzle(openSqlite(), { schema });
        });
