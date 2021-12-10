const INTERCEPT_ENABLED = process.env.NODE_ENV === 'development'

const DEFAULT_CRA_OVERLAY_SELECTOR =
  'iframe[style*="position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; border: none; z-index: 2147483647;"]'

const STYLES_ID = 'suppress-cra-overlay-styles'

function getStyles() {
  return document.getElementById(STYLES_ID)
}

function createStyles(cra_overlay_selector: string) {
  if (getStyles() !== null) return

  // Use styles instead of accessing overlay element directly, because overlay is created dynamically,
  // and won't exist at moment when our handler catches error
  const s = document.createElement('style')
  s.id = STYLES_ID
  s.innerHTML = `${cra_overlay_selector} { display: none }`
  document.head.appendChild(s)
}

function allowCRAOverlay(allow: boolean) {
  // `style` elements DO support `disabled` prop. TS doesn't seem to know about it.
  const styles = getStyles() as (HTMLElement & { disabled: boolean }) | null
  if (!styles) return
  styles.disabled = allow
}

const CAPTURED_ERROR_FLAG_NAME = '@@/CRA_CAPTURED'
const SUPPRESSED_ERROR_FLAG_NAME = '@@/CRA_OVERLAY_IGNORE'

export function setupReactAppOverlayErrorHandler(
  cra_overlay_selector: string = DEFAULT_CRA_OVERLAY_SELECTOR
) {
  if (!INTERCEPT_ENABLED) return

  createStyles(cra_overlay_selector)

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
