import { Button } from '@shared/ui/button';
import { useState } from 'react';

export const App = () => {
	const [clickCount, setClickCount] = useState(0);

	return (
		<div>
			<p>Нажато раз: {clickCount}</p>
			<Button onClick={() => setClickCount((prev) => prev + 1)}>Нажми меня</Button>
		</div>
	);
};
