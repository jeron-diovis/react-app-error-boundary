export * from 'react-error-boundary' // re-export for convenience

export { setupReactAppOverlayErrorHandler } from './setupErrorHandler'
export {
  ErrorBoundary, setDefaultErrorBoundaryFallback, setDefaultErrorBoundaryOptions,
  ErrorBoundaryProps, CustomErrorBoundaryOptions, BaseErrorBoundaryProps
} from './ErrorBoundary'
