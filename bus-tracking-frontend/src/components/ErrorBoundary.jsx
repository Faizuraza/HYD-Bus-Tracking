import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <span className="text-5xl mb-4 block">🚨</span>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Something went wrong</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              The application encountered an unexpected error. Please refresh the page or try again.
            </p>
            {this.state.error && (
              <pre className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-left text-xs overflow-x-auto border border-red-100 font-mono">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition duration-300"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
