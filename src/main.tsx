import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Disable console in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

// Add security headers
const meta = document.createElement('meta');
meta.httpEquiv = 'Content-Security-Policy';
meta.content = "default-src 'self' https://yxkprewjvhaywguvcwhq.supabase.co https://images.unsplash.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'";
document.head.appendChild(meta);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);