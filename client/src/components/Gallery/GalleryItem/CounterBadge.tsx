import { animated, useSpring } from '@react-spring/web';
import { useEffect, useState } from 'react';
import styles from './styles/shared.module.css';

interface CounterBadgeProps {
  count: number;
  animation: 'add' | 'remove' | null;
  type: 'folder' | 'presentation';
}

export const CounterBadge = ({ count, animation, type }: CounterBadgeProps) => {
  const [prevCount, setPrevCount] = useState(count);
  const [pulse, setPulse] = useState(false);

  const springProps = useSpring({
    number: count,
    from: { number: prevCount },
    config: { tension: 300, friction: 25 }
  });

  useEffect(() => {
    if (count !== prevCount) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      setPrevCount(count);
      return () => clearTimeout(timer);
    }
  }, [count, prevCount]);

  return (
    <div
      className={`
        ${styles.counterBadge}
        ${type === 'folder' ? styles.folderCounter : styles.presentationCounter}
        ${pulse ? styles.pulse : ''}
        ${animation === 'add' ? styles.addAnimation : ''}
        ${animation === 'remove' ? styles.removeAnimation : ''}
      `}
      title={`${count} ${type === 'folder' ? 'элементов' : 'слайдов'}`}
    >
      <animated.span className={styles.counterNumber}>
        {springProps.number.to(n => Math.floor(n))}
      </animated.span>
      <span className={styles.counterLabel}>
        {type === 'folder' ? 'элем.' : 'слайд.'}
      </span>
    </div>
  );
};