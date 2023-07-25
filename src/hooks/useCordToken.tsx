import { useState, useEffect } from 'react';

export function useCordToken(): [string | null, string | null] {
  const [token, setToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    void fetch('https://localhost:3002/userToken')
      .then((resp) => resp.json())
      .then((data) => {
        setToken(data.token);
        setUserID(data.userID);
      });
  }, []);
  return [token, userID];
}
