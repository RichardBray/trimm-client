import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends Component<{ children: JSX.Element | JSX.Element[] }, { error: boolean }> {
  state = { error: false };

  componentDidCatch(error: any, errorInfo: any): void {
    this.setState({ error });
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render(): JSX.Element | ReactNode {
    if (this.state.error) {
      //render fallback UI
      return <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>;
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
