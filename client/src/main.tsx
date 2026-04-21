import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@app/presenter/App';
import { Button } from '@shared/ui/button';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Button />
  </React.StrictMode>,
);