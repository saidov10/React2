import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-[#0A0A0B]">
          <h1 className="text-4xl font-bold text-red-500">Something went wrong</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">An unexpected error occurred in this section.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-[#DB4444] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#C33B3B] transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
