import { useCallback, useRef, useState } from 'react';

interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

// Создаем перегруженную сигнатуру для better TypeScript support
export function useApi<T = any>(): {
  data: T | null;
  loading: boolean;
  error: string | null;
  request: <R = T>(url: string, options?: UseApiOptions) => Promise<R | null>;
  clearError: () => void;
  clearData: () => void;
  abortRequest: () => void;
} {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const request = useCallback(async <R = T>(
    url: string, 
    options: UseApiOptions = {}
  ): Promise<R | null> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    const { timeout = 10000, retries = 3, ...fetchOptions } = options;

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        const fetchPromise = fetch(`http://localhost:5000${url}`, {
          signal: abortControllerRef.current?.signal,
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

        const data: R = await response.json();
        
        setState({ data: data as any, loading: false, error: null });
        abortControllerRef.current = null;
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        lastError = err;
        
        if (err.name !== 'AbortError' && attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        
        if (err.name === 'AbortError') {
          return null;
        }
      }
    }

    const errorMessage = lastError?.message || 'Unknown error';
    setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    return null;
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
    data: state.data,
    loading: state.loading,
    error: state.error,
    request,
    clearError,
    clearData,
    abortRequest
  };
}