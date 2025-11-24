import { useCallback, useMemo, useRef, useState } from 'react';

interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export const useApi = <T = any>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  // 🎯 СТАБИЛЬНЫЙ REF ДЛЯ ABORT_CONTROLLER
  const abortControllerRef = useRef<AbortController | null>(null);

  // 🎯 ФУНКЦИЯ ОЧИСТКИ ЗАПРОСА
  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('🛑 Aborting request...');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // 🎯 ОСНОВНАЯ ФУНКЦИЯ ЗАПРОСА
  const request = useCallback(async (
    url: string,
    options: UseApiOptions = {}
  ): Promise<T | null> => {
    // 🛑 ОЧИЩАЕМ ПРЕДЫДУЩИЙ ЗАПРОС
    abortRequest();

    // 🎯 СОЗДАЕМ НОВЫЙ CONTROLLER
    abortControllerRef.current = new AbortController();
    const abortController = abortControllerRef.current;

    setState(prev => ({ ...prev, loading: true, error: null }));

    const { timeout = 10000, retries = 1, ...fetchOptions } = options;

    try {
      console.log(`🌐 Making API request to: http://localhost:5000${url}`);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      const fetchPromise = fetch(`http://localhost:5000${url}`, {
        signal: abortController.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        ...fetchOptions
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: T = await response.json();
      
      // 🎯 ПРОВЕРЯЕМ, НЕ БЫЛ ЛИ ЗАПРОС ОТМЕНЕН
      if (!abortController.signal.aborted) {
        setState({ data, loading: false, error: null });
        return data;
      }

      return null;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      
      // 🎯 ИГНОРИРУЕМ ABORT_ERROR - ЭТО НОРМАЛЬНОЕ ПОВЕДЕНИЕ
      if (err.name === 'AbortError') {
        console.log('⏹️ Request was intentionally aborted');
        return null;
      }

      // 🎯 ОБРАБАТЫВАЕМ РЕАЛЬНЫЕ ОШИБКИ
      if (!abortController.signal.aborted) {
        const errorMessage = err.message || 'Unknown error';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      }

      return null;
    }
  }, [abortRequest]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearData = useCallback(() => {
    setState(prev => ({ ...prev, data: null }));
  }, []);

  // 🎯 ВОЗВРАЩАЕМ МЕМОИЗИРОВАННЫЙ ОБЪЕКТ
  return useMemo(() => ({
    ...state,
    request,
    clearError,
    clearData,
    abortRequest
  }), [state, request, clearError, clearData, abortRequest]);
};