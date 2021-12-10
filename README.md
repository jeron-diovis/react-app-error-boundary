# react-app-error-boundary

Allows you to turn `react-error-overlay` in your react-app from a mandatory-thing-you-never-asked-for into a handy-opt-in-feature.

Based on [this SO question](https://stackoverflow.com/questions/46589819/disable-error-overlay-in-development-mode).

## Why ever need this?

See discussion under [this answer](https://stackoverflow.com/a/47400249/3437433).

In very short:

> When developing error boundary components and styling/testing how they look, this is an extremely annoying feature. It slows down development and adds no value. You should allow developers to decide whether they want this feature turned on or not

## How it works

In general, it's based on [this answer](https://stackoverflow.com/a/54549601/3437433).

It sets up a global error handler – to intercept uncaught errors before react-error-overlay does, and handle them in a special way.

And it provides customized ErrorBoundary component (based on [react-error-boundary](https://github.com/bvaughn/react-error-boundary) package), which marks errors handled by it as caught, so our global handler can decide whether to show overlay.

Unfortunately, using `event.stopImmediatePropagation()` to prevent react-error-overlay from handling errors is not appropriate (see comment under the mentioned answer),
because it breaks all error-boundaries too. So instead, to "disable" overlay we'll just hide it via `display: none`.
