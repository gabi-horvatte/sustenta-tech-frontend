import { useState, useContext, useMemo, useCallback } from 'react'
import axios, { AxiosError, type AxiosResponse } from 'axios'
import { IAMContext } from '../modules/IAM/context/context'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

const getAxiosMethod = (method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') => {
  switch (method) {
    case 'GET':
      return client.get
    case 'POST':
      return client.post
    case 'PUT':
      return client.put
    case 'DELETE':
      return client.delete
    case 'PATCH':
      return client.patch
  }
}

type FetchMethod = {
  name: 'GET'
} | {
  name: 'POST' | 'PUT' | 'PATCH';
  body: unknown;
} | {
  name: 'DELETE';
  id: string;
}

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(false);
  const { authToken, logout } = useContext(IAMContext);

  const headers = useMemo(() => {
    return {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    }
  }, [authToken]);


  const fetch = useCallback(async (method: FetchMethod) => {
    setError(null);
    setLoading(true);

    console.log('fetching', method);
    const axiosMethod = getAxiosMethod(method.name)
    console.log('axiosMethod', axiosMethod);
    let promise: Promise<AxiosResponse<T>>;
    if ('body' in method)
      promise = (axiosMethod as typeof client.post | typeof client.put | typeof client.patch)(url, method.body, { headers })
    else if ('id' in method)
      promise = (axiosMethod as typeof client.delete)(`${url}/${method.id}`, { headers })
    else
      promise = axiosMethod(url, { headers })

    await promise.then(res => setData(res.data)).catch(err => {
      setError(err);
      console.log('err', err);
      if (err.response?.data?.message === 'Invalid token' || err.response?.data?.message === 'Authentication required') {
        logout();
      }
      throw err;
    })
      .finally(() => setLoading(false))
  }, [url, headers, logout]);

  return {
    data, error, loading, fetch
  }
}