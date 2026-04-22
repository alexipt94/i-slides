import { App } from '@app/presenter/App';
import { Button } from '@shared/ui/button';
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = document.getElementById('root');

if (!root) {
	throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<App />
		<Button label="Первая кнопка" />
		<Button label="Вторая кнопка выключена" disabled={true} />
	</React.StrictMode>
);
