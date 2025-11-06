import { useEffect, useState } from "react";
import { get } from "../api/client";

export default function useApi(url, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    get(url, params)
      .then((d) => {
        if (alive) {
          setData(d);
          setError(null);
        }
      })
      .catch((e) => {
        if (alive) {
          setError(e);
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [url, params]);

  return { data, loading, error, reload: () => get(url, params).then(setData) };
}
