import { useState, useEffect } from "react";
import { useAuth } from "./auth/useAuth";

export default function useUser() {
  const { auth, isReady } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady) {
      if (auth?.user) {
        setData(auth.user);
      } else {
        setData(null);
      }
      setLoading(false);
    }
  }, [auth, isReady]);

  const refetch = async () => {
    // In mobile, user data comes from auth context
    if (auth?.user) {
      setData(auth.user);
    }
  };

  return { data, loading, refetch };
}
