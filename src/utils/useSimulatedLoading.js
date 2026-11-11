import { useEffect, useState } from 'react';

/**
 * Returns true for a short moment after mount so skeletons can be shown while the UI
 * works on dummy data. Remove it (or replace with the real request state) once the
 * pages load data from the backend.
 */
export default function useSimulatedLoading(ms = 600) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(timer);
  }, [ms]);

  return loading;
}
