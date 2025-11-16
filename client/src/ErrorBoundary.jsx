import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[App ErrorBoundary] Caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "hsl(222 47% 4%)",
            color: "hsl(213 31% 91%)",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              border: "1px solid hsl(217 33% 20%)",
              background: "hsl(222 47% 8% / 0.7)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <h1 style={{ fontSize: 22, marginBottom: 8 }}>
              Something went wrong • Något gick fel
            </h1>
            <p style={{ opacity: 0.8, fontSize: 14, lineHeight: 1.5 }}>
              Check the browser console for details. If this appeared after adding 3D,
              a loader path or file is likely incorrect.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre
                style={{
                  textAlign: "left",
                  marginTop: 16,
                  whiteSpace: "pre-wrap",
                  fontSize: 12,
                  opacity: 0.8,
                }}
              >
                {String(this.state.error)}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
