import { useCallback, useState } from 'react';
import { httpClient } from '../../infrastructure/http/httpClient.js';
import { Result } from '../../shared/utils/result.js';

export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const search = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return Result.ok({ results: [] });
    }
    setLoading(true);
    try {
      const result = await httpClient.get('/search', { q: query });
      if (result.isSuccess) {
        setResults(result.value.results || []);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, results, search };
}