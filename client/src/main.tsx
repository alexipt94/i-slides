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
		<Button onClick={()=> console.log('primary')}>Primary (по умолчанию)</Button>
		<Button onClick={()=> console.log('secondary')}variant="secondary">Secondary</Button>
		<Button onClick={()=> console.log('ghost')} variant="ghost">Ghost</Button>
		<Button disabled>Disabled</Button>
		<Button onClick={()=> console.log('small')} size='small'>Small</Button>
		<Button onClick={()=> console.log('medium')}size='medium'>Medium</Button>
		<Button onClick={()=> console.log('large')}size='large'>Large</Button>
	</React.StrictMode>
);
