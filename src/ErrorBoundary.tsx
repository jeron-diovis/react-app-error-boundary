import React, { useCallback } from 'react'
import {
  ErrorBoundary as BaseErrorBoundary,
  ErrorBoundaryPropsWithComponent,
  ErrorBoundaryPropsWithFallback,
  ErrorBoundaryPropsWithRender,
  FallbackProps,
} from 'react-error-boundary'

import { suppressCaughtOverlayError } from './setupErrorHandler'

let DefaultFallback = (props: FallbackProps) => {
  const { error } = props
  return <div style={{ color: 'red' }}>{error.message}</div>
}

/**
 * @see https://www.npmjs.com/package/react-error-boundary
 */

type MakePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type ErrorBoundaryProps =
  | ErrorBoundaryPropsWithFallback
  | ErrorBoundaryPropsWithRender
  | MakePartial<ErrorBoundaryPropsWithComponent, 'FallbackComponent'>

type CustomErrorBoundaryOptions = {
  logCaughtErrors?: boolean
  allowDevErrorOverlay?: boolean
}

let OPTIONS_DEFAULTS: Required<CustomErrorBoundaryOptions> = {
  logCaughtErrors: true,
  allowDevErrorOverlay: false,
}

const logCaughtError = (error: Error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      'Following error has been caught by <ErrorBoundary> component\n\n',
      error
    )
  }
}

export function ErrorBoundary(props: ErrorBoundaryProps & CustomErrorBoundaryOptions & { children: React.ReactNode }) {
    const {
      children,
      FallbackComponent = DefaultFallback,
      fallbackRender,
      fallback,
      onError,
      allowDevErrorOverlay = OPTIONS_DEFAULTS.allowDevErrorOverlay,
      logCaughtErrors = OPTIONS_DEFAULTS.logCaughtErrors,
      ...rest
    } = props

    const handleError = useCallback<NonNullable<typeof onError>>(
      (...args) => {
        const [error] = args
        if (!allowDevErrorOverlay) {
          suppressCaughtOverlayError(error)
          if (logCaughtErrors) logCaughtError(error)
        }
        onError?.(...args)
      },
      [onError, allowDevErrorOverlay, logCaughtErrors]
    )

    if (fallback) {
      return (
        <BaseErrorBoundary fallback={fallback} onError={handleError} {...rest}>
          {children}
        </BaseErrorBoundary>
      )
    }

    if (fallbackRender) {
      return (
        <BaseErrorBoundary
          fallbackRender={fallbackRender}
          onError={handleError}
          {...rest}
        >
          {children}
        </BaseErrorBoundary>
      )
    }

    if (FallbackComponent) {
      return (
        <BaseErrorBoundary
          FallbackComponent={FallbackComponent}
          onError={handleError}
          {...rest}
        >
          {children}
        </BaseErrorBoundary>
      )
    }

    return null
  }

export function setDefaultErrorBoundaryFallback(component: typeof DefaultFallback) {
  DefaultFallback = component
}

export function setDefaultErrorBoundaryOptions(defaults: CustomErrorBoundaryOptions) {
  Object.assign(OPTIONS_DEFAULTS, defaults)
}
