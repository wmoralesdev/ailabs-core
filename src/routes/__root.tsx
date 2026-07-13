import { ClerkProvider } from "@clerk/tanstack-react-start"
import { shadcn } from "@clerk/ui/themes"
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import {
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  SITE_NAME,
  localeFromPathname,
} from "@/lib/seo"
import appCss from "../styles.css?url"

if (import.meta.env.DEV && !import.meta.env.SSR) {
  void import("react-grab")
}

const SITE_TITLE = "Ai Labs — Adapt, develop, and learn with AI"
const SITE_DESCRIPTION =
  "Ai Labs is an AI company in El Salvador that helps companies adapt, develop, and learn with AI through Academy, Agentic, and Aperture."

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "theme-color", content: "#303030" },
      { name: "application-name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE_URL },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  notFoundComponent: RootNotFound,
  shellComponent: RootDocument,
})

const rootNotFoundLinkClassName =
  "bg-primary text-primary-foreground focus-visible:ring-ring/50 inline-flex h-11 items-center rounded-md px-5 text-sm font-medium transition-colors hover:brightness-95 focus-visible:ring-2 focus-visible:outline-none"

function RootNotFound() {
  return (
    <main
      id="main"
      className="page-gutter max-w-content section-y mx-auto min-h-dvh"
    >
      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        404
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <h1
          lang="en"
          className="font-display text-foreground text-4xl font-semibold tracking-tight md:text-5xl"
        >
          Page not found
        </h1>
        <p lang="es" className="font-display text-foreground text-2xl font-semibold tracking-tight">
          Página no encontrada
        </p>
      </div>
      <p lang="en" className="text-muted-foreground mt-6 max-w-prose text-lg">
        That page doesn&rsquo;t exist. Head to the English or Spanish home page.
      </p>
      <p lang="es" className="text-muted-foreground mt-2 max-w-prose text-lg">
        Esa página no existe. Ve a la página de inicio en inglés o español.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/$locale"
          params={{ locale: "en" }}
          lang="en"
          className={rootNotFoundLinkClassName}
        >
          English home
        </Link>
        <Link
          to="/$locale"
          params={{ locale: "es" }}
          lang="es"
          className={rootNotFoundLinkClassName}
        >
          Inicio en español
        </Link>
      </div>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const lang = useRouterState({
    select: (state) => localeFromPathname(state.location.pathname) ?? "en",
  })

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider appearance={{ theme: shadcn }}>
          <ThemeProvider defaultTheme="system" storageKey="ailabs-theme">
            {children}
            <Toaster />
            {import.meta.env.DEV ? (
              <TanStackDevtools
                config={{
                  position: "bottom-right",
                }}
                plugins={[
                  {
                    name: "Tanstack Router",
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                ]}
              />
            ) : null}
          </ThemeProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}
