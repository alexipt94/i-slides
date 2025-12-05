import { useEffect, useRef } from 'react';
import styles from './styles/shared.module.css';

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
}

export const InlineEditor = ({
  value,
  onChange,
  onSave,
  onKeyDown,
  autoFocus = false,
}: InlineEditorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const handleBlur = () => {
    onSave();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      className={styles.inlineEditor}
      placeholder="Введите название..."
    />
  );
};