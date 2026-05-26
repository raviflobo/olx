import React from 'react';
import { ToastProvider } from './ToastContext';

function AppProviders({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}

export default AppProviders;
