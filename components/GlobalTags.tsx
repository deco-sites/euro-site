import { asset, Head } from "$fresh/runtime.ts";

function GlobalTags() {
  return (
    <Head>
      {/* Enable View Transitions API */}
      <meta name="view-transition" content="same-origin" />

      {/* Tailwind v3 CSS file */}
      <link href={asset("/styles.css")} rel="stylesheet" />

      <link rel="preconnect" href={asset("https://fonts.googleapis.com")} />
      <link
        rel="preconnect"
        href={asset("https://fonts.gstatic.com")}
        crossOrigin="true"
      />

      <link
        rel="preconnect"
        href={asset("https://fonts.gstatic.com")}
        crossOrigin="true"
      />

      <link
        rel="preload"
        as="style"
        href={asset(
          "https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap",
        )}
      />

      <link
        rel="stylesheet"
        media="print"
        href={asset(
          "https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap",
        )}
      />

      <noscript>
        <link
          rel="stylesheet"
          href={asset(
            "https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap",
          )}
        />
      </noscript>

      {/* Web Manifest */}
      <link rel="manifest" href={asset("/site.webmanifest")} />
    </Head>
  );
}

export default GlobalTags;
