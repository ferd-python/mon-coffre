import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#2563eb" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mon Coffre" />
        <link rel="apple-touch-icon" href="/mon-coffre/icon.png" />
        <link rel="manifest" href="/mon-coffre/manifest.json" />

        <ScrollViewStyleReset />

        {/* Enables cross-origin isolation on GitHub Pages, required by expo-sqlite's
            web backend (SharedArrayBuffer). Must load before the app bundle. */}
        <script src="/mon-coffre/coi-serviceworker.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
