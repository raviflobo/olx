import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

window.addEventListener('unhandledrejection', (event) => {
  const err = event.reason;
  if (err && err.code === 'permission-denied') {
    console.warn('Firestore permission-denied (suppressed):', err.message);
    event.preventDefault();
  }
});

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
