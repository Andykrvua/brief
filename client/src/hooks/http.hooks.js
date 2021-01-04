import { useCallback, useState } from 'react';

// custom hook for http request
export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback needed for not enter recursion
  const request = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setLoading(true);

      try {
        const response = await fetch(url, { method, body, headers });
        const data = await response.json();

        // if (!response.ok) {
        //   throw new Error(data.message || 'Ошибка ответа сервера');
        // }

        setLoading(false);

        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    []
  );

  const clearError = () => setError(null);

  return { loading, request, error, clearError };
};
