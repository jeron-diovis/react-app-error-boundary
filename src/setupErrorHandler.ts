const INTERCEPT_ENABLED = process.env.NODE_ENV === 'development'

const DEFAULT_CRA_OVERLAY_SELECTOR =
  'iframe[style*="position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647;"]'

const STYLES_ID = 'suppress-cra-overlay-styles'

// ---

function getStyles() {
  return document.getElementById(STYLES_ID)
}

function createStyles(craOverlaySelector: string) {
  if (getStyles() !== null) return

  // Use styles instead of accessing overlay element directly, because overlay is created dynamically,
  // and won't exist at moment when our handler catches error
  const s = document.createElement('style')
  s.id = STYLES_ID
  s.innerHTML = `${craOverlaySelector} { display: none; !important }`
  document.head.appendChild(s)
}

function allowCRAOverlay(allow: boolean) {
  // `style` elements DO support `disabled` prop. TS doesn't seem to know about it.
  const styles = getStyles() as (HTMLElement & { disabled: boolean }) | null
  if (!styles) return
  styles.disabled = allow
}

// ---

const CAPTURED_ERROR_FLAG_NAME = '@@/CRA_CAPTURED'
const SUPPRESSED_ERROR_FLAG_NAME = '@@/CRA_OVERLAY_IGNORE'

// ---

interface ErrorHandlerOptions {
  craOverlaySelector?: string
}

export function setupReactAppOverlayErrorHandler(options: ErrorHandlerOptions = {}) {
  if (!INTERCEPT_ENABLED) return

  const { craOverlaySelector = DEFAULT_CRA_OVERLAY_SELECTOR } = options
  createStyles(craOverlaySelector)

  window.addEventListener('error', e => {
    const { error } = e
    if (!error[CAPTURED_ERROR_FLAG_NAME]) {
      error[CAPTURED_ERROR_FLAG_NAME] = true

      allowCRAOverlay(false)
      // Suppress logging error to console by browser
      e.preventDefault()
      // Revisit this error after the error boundary element processed it
      setTimeout(() => {
        // can be set by the error boundary error handler
        if (!error[SUPPRESSED_ERROR_FLAG_NAME]) {
          // but if it wasn't caught by a boundary, release it back to the wild
          allowCRAOverlay(true)
          throw error
        }
      })
    }
  })
}

export function suppressCaughtOverlayError(error: Error) {
  if (!INTERCEPT_ENABLED) return
  Object.assign(error, { [SUPPRESSED_ERROR_FLAG_NAME]: true })
}
