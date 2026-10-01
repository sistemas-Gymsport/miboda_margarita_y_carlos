import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { warmUpApi } from './services/api';
import './styles/global.css';

// Empieza a despertar el backend (Render Free) desde el primer instante.
warmUpApi();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
