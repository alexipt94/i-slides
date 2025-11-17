import { useCallback, useState } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  onSubmit?: (values: T) => void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Обработчик изменения полей
  const handleChange = useCallback((
    name: keyof T,
    value: any
  ) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Валидация формы
  const validateForm = useCallback((): boolean => {
    if (!validate) return true;

    const newErrors = validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validate]);

  // Обработчик отправки формы
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  // Сброс формы
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Установка значений (полезно для редактирования)
  const setFormValues = useCallback((newValues: T) => {
    setValues(newValues);
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFormValues,
    setErrors
  };
};