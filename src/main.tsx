import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/elevation.css';
import './styles/surfaces.css';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { FirebaseProvider } from './context/FirebaseContext';
import { BannerVideoProvider } from './context/BannerVideoContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ThemeProvider>
      <LanguageProvider>
        <FirebaseProvider>
          <BannerVideoProvider>
            <App />
          </BannerVideoProvider>
        </FirebaseProvider>
      </LanguageProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
