import { useCallback, useRef, useState } from 'react';

interface ApiState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export const useApi = () => {
  const [state, setState] = useState<ApiState>({
    data: null,
    loading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const request = useCallback(async (
    url: string,
    options: UseApiOptions = {}
  ): Promise<any> => {
    // 🛑 ПРЕКРАЩАЕМ ПРЕДЫДУЩИЙ ЗАПРОС - ИСТОЧНИК ОШИБКИ AbortError!
    if (abortControllerRef.current) {
      console.log('🔄 Aborting previous request...');
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    const { timeout = 10000, retries = 1, ...fetchOptions } = options;

    try {
      console.log(`🌐 Making API request to: http://localhost:5000${url}`);

      const response = await fetch(`http://localhost:5000${url}`, {
        signal: abortControllerRef.current?.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        ...fetchOptions
      });

      console.log(`📨 Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Response data:', data);
      
      setState({ data, loading: false, error: null });
      abortControllerRef.current = null;
      return data;

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      console.error('❌ Request error:', err);

      // 🚫 ИГНОРИРУЕМ ABORT ОШИБКИ - ОСНОВНАЯ ПРОБЛЕМА!
      if (err.name === 'AbortError') {
        console.log('⏹️ Request was aborted, returning null');
        setState(prev => ({ ...prev, loading: false }));
        return null;
      }

      const errorMessage = err.message || 'Unknown error';
      console.error('💥 Request failed:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearData = useCallback(() => {
    setState(prev => ({ ...prev, data: null }));
  }, []);

  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    ...state,
    request,
    clearError,
    clearData,
    abortRequest
  };
};