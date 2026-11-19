import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { FirebaseProvider } from './context/FirebaseContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ThemeProvider>
      <LanguageProvider>
        <FirebaseProvider>
          <App />
        </FirebaseProvider>
      </LanguageProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
