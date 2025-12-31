import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-gray-600 mb-6">
                            We're sorry, but the application encountered an unexpected error.
                        </p>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Clear Cache & Reload
                        </button>
                        <details className="mt-8 text-left text-xs text-gray-400 overflow-auto bg-gray-50 p-2 rounded">
                            <summary>Error Details</summary>
                            <pre className="mt-2 whitespace-pre-wrap">{this.state.error?.toString()}</pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
