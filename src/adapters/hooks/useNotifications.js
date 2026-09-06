import { useCallback, useState } from 'react';
import { httpClient } from '../../infrastructure/http/httpClient.js';
import { Result } from '../../shared/utils/result.js';

export function useNotifications() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await httpClient.get('/notifications');
      if (result.isSuccess) {
        setNotifications(result.value.items || []);
        setCount(result.value.total || 0);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCount = useCallback(async () => {
    try {
      const result = await httpClient.get('/notifications/count');
      if (result.isSuccess) {
        setCount(result.value.count || 0);
      }
      return result;
    } catch {
      return Result.fail(new Error('Failed to fetch notifications count'));
    }
  }, []);

  return { loading, notifications, count, fetch, fetchCount };
}