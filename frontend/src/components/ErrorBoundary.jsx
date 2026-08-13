import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // Also log to console for developer
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: "#111", background: "#fff" }}>
          <h2>Something went wrong rendering the app</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 12, borderRadius: 6 }}>{String(this.state.error)}</pre>
          <details style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
            {this.state.info?.componentStack}
          </details>
          <button onClick={() => window.location.reload()} style={{ marginTop: 12, padding: "8px 12px" }}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
