import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /* eslint-disable */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }
  /* eslint-enable */

  render() {
    // @ts-expect-error TS2339: Property 'hasError' does not exist on type 'Readonly<{}>'
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <a href="/" className="underline">
            Go Home
          </a>
        </div>
      );
    }

    // @ts-expect-error TS2339: Property 'children' does not exist on type 'Readonly<{}>'
    // eslint-disable-next-line
    return this.props.children;
  }
}

export default ErrorBoundary;
