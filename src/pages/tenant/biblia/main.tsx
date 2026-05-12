import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import BibliaApp from './BibliaApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BibliaApp />
  </StrictMode>,
);
