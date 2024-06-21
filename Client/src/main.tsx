import { ThemeProvider } from '@emotion/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { persistor, store } from './store/store.ts';
import theme from './styles/theme.ts';
import { PersistGate } from 'redux-persist/integration/react';
import AppWrapper from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <ThemeProvider theme={theme}>
          <AppWrapper />
        </ThemeProvider>
      </StrictMode>
    </PersistGate>
  </Provider>,
);
