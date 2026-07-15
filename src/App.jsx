import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const config = {
      containerId: 'product-embed-n1M6Ypkdgx',
      productId: 'n1M6Ypkdgx',
      formId: 'n1M6Ypkdgx',
      baseUrl: 'https://contohjaya.imsmultidev.com',
      scriptUrl: 'https://imsmultidev.com/js/embed-loader.js',
      logEndpoint: 'https://imsmultidev.com/api/embed/log',
      maxRetries: 3,
    }

    let retryCount = 0
    let retryTimer = null
    let currentScript = null
    let isUnmounted = false

    const logError = (error) => {
      const payloadData = {
        url: window.location.href,
        stack: error?.stack ?? null,
        message: error?.message ?? 'Unknown error',
        productId: config.productId,
        userAgent: navigator.userAgent,
      }

      const xhr = new XMLHttpRequest()

      xhr.open('POST', config.logEndpoint, true)
      xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )

      const params = [
        `payload=${encodeURIComponent(JSON.stringify(payloadData))}`,
        `message=${encodeURIComponent(error?.name || 'Error')}`,
        'type=embed',
        'level=error',
      ].join('&')

      xhr.send(params)
    }

    window.imsLogError = logError

    const getContainer = () => {
      return document.getElementById(config.containerId)
    }

    const initIMSEmbed = () => {
      if (isUnmounted) {
        return
      }

      try {
        if (!window.IMSMultiEmbed) {
          throw new Error(
            'Library load failed (IMSMultiEmbed undefined)'
          )
        }

        window.IMSMultiEmbed.init({
          containerId: config.containerId,
          productId: config.productId,
          formId: config.formId,
          baseUrl: config.baseUrl,
          triggerPixel: false,
          triggerGtm: false,
        })

        const container = getContainer()
        const statusWrapper = container?.querySelector(
          '[data-ims-status-wrapper]'
        )

        if (statusWrapper) {
          statusWrapper.style.display = 'none'
        }
      } catch (error) {
        logError(error)
      }
    }

    const showLoadError = () => {
      const container = getContainer()
      const retryButton = container?.querySelector(
        '[data-ims-retry-button]'
      )
      const message = container?.querySelector('[data-ims-message]')

      if (message) {
        message.textContent =
          'Gagal memuat formulir. Periksa koneksi internet Anda.'
      }

      if (retryButton) {
        retryButton.style.display = 'inline-block'

        retryButton.onclick = () => {
          retryCount = 0
          retryButton.style.display = 'none'

          if (message) {
            message.textContent = 'Mencoba memuat kembali...'
          }

          loadScript()
        }
      }
    }

    const loadScript = () => {
      if (isUnmounted) {
        return
      }

      if (window.IMSMultiEmbed) {
        initIMSEmbed()
        return
      }

      const script = document.createElement('script')

      script.src = `${config.scriptUrl}?v=${Date.now()}`
      script.async = true
      script.dataset.imsEmbedLoader = config.productId

      script.onload = () => {
        initIMSEmbed()
      }

      script.onerror = () => {
        script.remove()

        if (retryCount < config.maxRetries) {
          retryCount += 1
          retryTimer = window.setTimeout(loadScript, 2000)
          return
        }

        const networkError = new Error(
          'Network Error: Failed to fetch embed-loader.js after retries'
        )

        networkError.name = 'NetworkError'
        logError(networkError)
        showLoadError()
      }

      currentScript = script
      document.head.appendChild(script)
    }

    loadScript()

    return () => {
      isUnmounted = true

      if (retryTimer) {
        window.clearTimeout(retryTimer)
      }

      if (currentScript) {
        currentScript.onload = null
        currentScript.onerror = null
        currentScript.remove()
      }

      const container = getContainer()
      const retryButton = container?.querySelector(
        '[data-ims-retry-button]'
      )

      if (retryButton) {
        retryButton.onclick = null
      }

      delete window.imsLogError
    }
  }, [])

  return (
    <>
      <section id="center">
        <div className="hero">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt=""
          />

          <img
            src={reactLogo}
            className="framework"
            alt="React logo"
          />

          <img
            src={viteLogo}
            className="vite"
            alt="Vite logo"
          />
        </div>

        <div>
          <h1>Get started</h1>

          <p>
            Edit <code>src/App.jsx</code> and save to test{' '}
            <code>HMR</code>
          </p>
        </div>

        <button
          className="counter"
          onClick={() => setCount((currentCount) => currentCount + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <div
          id="product-embed-n1M6Ypkdgx"
          className="ims-embed-container"
        >
          <div data-ims-status-wrapper>
            <div className="ims-loader" />

            <p data-ims-message>
              Menyiapkan formulir pemesanan...
            </p>

            <button
              type="button"
              data-ims-retry-button
              style={{ display: 'none' }}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg
            className="icon"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#documentation-icon"></use>
          </svg>

          <h2>Documentation</h2>
          <p>Your questions, answered</p>

          <ul>
            <li>
              <a
                href="https://vite.dev/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="logo"
                  src={viteLogo}
                  alt=""
                />

                Explore Vite
              </a>
            </li>

            <li>
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="button-icon"
                  src={reactLogo}
                  alt=""
                />

                Learn more
              </a>
            </li>
          </ul>
        </div>

        <div id="social">
          <svg
            className="icon"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#social-icon"></use>
          </svg>

          <h2>Connect with us</h2>
          <p>Join the Vite community</p>

          <ul>
            <li>
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>

                GitHub
              </a>
            </li>

            <li>
              <a
                href="https://chat.vite.dev/"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>

                Discord
              </a>
            </li>

            <li>
              <a
                href="https://x.com/vite_js"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>

                X.com
              </a>
            </li>

            <li>
              <a
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>

                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="spacer"></section>
    </>
  )
}

export default App