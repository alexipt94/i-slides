import { Button } from '@shared/ui/button';
import { useState, useEffect } from 'react'
//import { createSlide } from '@entities/slide';

export const App = () => {
	const [clickCount, setClickCount] = useState(0);

    //console.log(createSlide())
   useEffect ( ()=>{
    document.title = `${clickCount}`
    return ()=>{ document.title = 'i-slides'}
   },[clickCount])
	return (
		<div>
			<p>Нажато раз: {clickCount}</p>
			<Button onClick={() => setClickCount((prev) => prev + 1)}>Нажми меня</Button>
		</div>
	);
};
