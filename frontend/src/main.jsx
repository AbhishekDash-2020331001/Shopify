import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import { persistor } from "./app/store";
import { App } from "./App.jsx";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";

// Add error boundary
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

// Add React error logging
const root = createRoot(document.getElementById("root"));

try {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
} catch (error) {
  console.error('Render error:', error);
  // Render a basic error message
  root.render(
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      backgroundColor: '#fee2e2', 
      border: '1px solid #ef4444',
      borderRadius: '8px',
      color: '#7f1d1d'
    }}>
      <h1 style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
        Application Error
      </h1>
      <p>Sorry, something went wrong while loading the application.</p>
      <pre style={{ 
        marginTop: '10px', 
        padding: '10px', 
        backgroundColor: '#fecaca',
        borderRadius: '4px',
        fontSize: '14px',
        whiteSpace: 'pre-wrap'
      }}>
        {error.message}
      </pre>
    </div>
  );
}
