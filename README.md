# react-app-error-boundary

Allows you to turn `react-error-overlay` in your react-app from a *mandatory-thing-you-never-asked-for* into a *handy-opt-in-feature*.

Inspired by [this SO question](https://stackoverflow.com/questions/46589819/disable-error-overlay-in-development-mode).

## Why ever need this?

See discussion under [this answer](https://stackoverflow.com/a/47400249/3437433).

In very short:

> When developing error boundary components and styling/testing how they look, this is an extremely annoying feature. It slows down development and adds no value. You should allow developers to decide whether they want this feature turned on or not

## Demo

[Here](https://github.com/jeron-diovis/react-app-error-boundary-demo) is a repo where you can see this package in action.

## Installation

```
npm install --save react-app-error-boundary
# or
yarn add react-app-error-boundary
```

## Usage

1. Set up error handler in entry point:
```jsx
// src/index.jsx
import { setupReactAppOverlayErrorHandler } from 'react-app-error-boundary'

ReactDOM.render(...)

setupReactAppOverlayErrorHandler()
```

2. Wrap desired application part into `<ErrorBoundary>` component:
```jsx
import { ErrorBoundary } from 'react-app-error-boundary'

<ErrorBoundary>
  <DangerousComponent />
</ErrorBoundary>
```

That's it. With this configuration, if `<DangerousComponent />` will throw, you should observe following:
* error message, written in red, in place of broken component
* error log in console, starting with `Following error has been caught by <ErrorBoundary> component...`
* **no `react-error-overlay` displayed!**

## Additional configuration

For general usage of `ErrorBoundary` component, see [documentation in original repo](https://github.com/bvaughn/react-error-boundary#usage). All original props are available here too. 
Other stuff from repo also is re-exported, so you may also use extra features like `useErrorHandler` hook.

#### `setDefaultErrorBoundaryFallback(errorRenderer)`

In difference from original `ErrorBoundary`, here you have a default `FallbackComponent` provided. So you don't need to specify it explicitly every time.

To customize default fallback, use `setDefaultErrorBoundaryFallback` method:
```jsx
// src/index.jsx
import { setDefaultErrorBoundaryFallback } from 'react-app-error-boundary'

setDefaultErrorBoundaryFallback(({ error }) => (
  <MyBeautifulErrorRenderer>{error.message}</MyBeautifulErrorRenderer>
))
```

#### `allowDevErrorOverlay`

If for some reason you want `react-error-overlay` displayed as it does normally, you may allow it for particular `ErrorBoundary`:
```jsx
<ErrorBoundary allowDevErrorOverlay>...</ErrorBoundary>
```

#### `logCaughtErrors`

By default, errors handled by `ErrorBoundary` will still be logged in console (only in development mode).
If you want to absolutely suppress caught errors, you may set it for particular `ErrorBoundary`:

```jsx
<ErrorBoundary logCaughtErrors={false}>...</ErrorBoundary>
```

#### `setDefaultErrorBoundaryOptions(options)`

Default behavior of `ErrorBoundary` can be changed globally:
```js
import { setDefaultErrorBoundaryOptions } from 'react-app-error-boundary'

setDefaultErrorBoundaryOptions({
  logCaughtErrors: false,
  allowDevErrorOverlay: true,
})
```

#### `craOverlaySelector`

This is an emergency option, just in case if styles of `react-error-overlay` will change – so this package will fail to hide it – and patch won't be released for some reason.

With this, you'll be able to patch this issue yourself:

```js
import { setupReactAppOverlayErrorHandler } from 'react-app-error-boundary'

setupReactAppOverlayErrorHandler({
  craOverlaySelector: 'any-css-selector-here'
})
```

## How it works

In general, it's based on [this answer](https://stackoverflow.com/a/54549601/3437433).

It sets up a global error handler – to intercept uncaught errors before react-error-overlay does, and handle them in a special way.

And it provides customized `ErrorBoundary` component (based on [react-error-boundary](https://github.com/bvaughn/react-error-boundary)), which marks errors handled by it as caught, so our global handler can decide whether to show overlay.

Unfortunately, using `event.stopImmediatePropagation()` to prevent react-error-overlay from handling errors is not appropriate (see comment under the mentioned answer),
because it breaks all error-boundaries too. So instead, to "disable" overlay we'll just hide it via `display: none`.

## Credits

Big thanks to [react-error-boundary](https://github.com/bvaughn/react-error-boundary) for a super convenient error-boundaries api.

## LICENSE

MIT
