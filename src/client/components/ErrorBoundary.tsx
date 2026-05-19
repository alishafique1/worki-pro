import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
          <AlertTriangle className="mb-4 size-12 text-[#2563EB]" />
          <h2 className="mb-2 text-xl font-bold text-[#0F172A]">Something went wrong</h2>
          <p className="mb-6 max-w-md text-sm text-[#475569]">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
