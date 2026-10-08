import { MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'

import './app.css'

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>SolidCX</Title>

          <header class="app-header">
            <nav class="app-nav">
              <a href="/" class="app-nav__link">
                Index
              </a>

              <a href="/about" class="app-nav__link">
                About
              </a>

              <a href="/test" class="app-nav__link">
                Test
              </a>
              <button
                type="button"
                onClick={() => {
                  const html = document.documentElement
                  const isDark = html.dataset.theme === 'dark'

                  if (isDark) {
                    delete html.dataset.theme
                  } else {
                    html.dataset.theme = 'dark'
                  }
                }}
              >
                Toggle theme
              </button>
            </nav>
            
          </header>

          <main class="app-main">
            <Suspense>
              {props.children}
            </Suspense>
          </main>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}